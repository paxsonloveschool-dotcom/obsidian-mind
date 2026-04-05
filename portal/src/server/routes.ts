import { Hono } from "hono";
import { getDb } from "./db.js";
import { broadcast } from "./websocket.js";
import type {
  HookEnvelope,
  Device,
  Session,
  AggregateStats,
  DeviceStats,
  TokenSnapshot,
} from "../shared/types.js";

const app = new Hono();

// ─── Health ──────────────────────────────────────────────
app.get("/api/health", (c) => c.json({ ok: true, time: new Date().toISOString() }));

// ─── Ingest: hook events from devices ────────────────────
app.post("/api/events", async (c) => {
  const envelope: HookEnvelope = await c.req.json();
  const db = getDb();
  const now = new Date().toISOString();

  // 1. Upsert device
  db.prepare(`
    INSERT INTO devices (id, name, hostname, platform, last_seen, status, extensions_json)
    VALUES (?, ?, ?, ?, ?, 'online', ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      hostname = excluded.hostname,
      platform = excluded.platform,
      last_seen = excluded.last_seen,
      status = 'online',
      extensions_json = CASE WHEN excluded.extensions_json != '[]' THEN excluded.extensions_json ELSE devices.extensions_json END
  `).run(
    envelope.device_id,
    envelope.device_name,
    envelope.hostname,
    envelope.platform,
    now,
    JSON.stringify(envelope.extensions ?? [])
  );

  // 2. Upsert session
  const project = (envelope.payload?.cwd as string) ?? "";
  const branch = (envelope.payload?.gitBranch as string) ?? "";
  const cwd = (envelope.payload?.cwd as string) ?? "";
  const model = envelope.tokens?.model ?? "";

  const isStop = envelope.hook_event === "Stop" || envelope.hook_event === "SessionEnd";

  db.prepare(`
    INSERT INTO sessions (id, device_id, project, branch, cwd, status, started_at, model)
    VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      status = CASE WHEN ? THEN 'stopped' ELSE sessions.status END,
      ended_at = CASE WHEN ? THEN ? ELSE sessions.ended_at END,
      project = CASE WHEN excluded.project != '' THEN excluded.project ELSE sessions.project END,
      branch = CASE WHEN excluded.branch != '' THEN excluded.branch ELSE sessions.branch END,
      cwd = CASE WHEN excluded.cwd != '' THEN excluded.cwd ELSE sessions.cwd END,
      model = CASE WHEN excluded.model != '' THEN excluded.model ELSE sessions.model END,
      events_count = sessions.events_count + 1,
      current_activity = ?
  `).run(
    envelope.session_id,
    envelope.device_id,
    project,
    branch,
    cwd,
    now,
    model,
    isStop,
    isStop,
    now,
    describeActivity(envelope)
  );

  // 3. Insert event
  const toolName = (envelope.payload?.tool_name as string) ?? (envelope.payload?.toolName as string) ?? null;
  const agentId = (envelope.payload?.agent_id as string) ?? (envelope.payload?.agentId as string) ?? null;
  const parentAgentId = (envelope.payload?.parent_agent_id as string) ?? (envelope.payload?.parentAgentId as string) ?? null;

  db.prepare(`
    INSERT INTO events (device_id, session_id, event_type, tool_name, agent_id, parent_agent_id, payload_json, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    envelope.device_id,
    envelope.session_id,
    envelope.hook_event,
    toolName,
    agentId,
    parentAgentId,
    JSON.stringify(envelope.payload),
    now
  );

  // 4. Track tokens if present
  if (envelope.tokens) {
    db.prepare(`
      INSERT INTO token_snapshots (device_id, session_id, input_tokens, output_tokens, cache_read, cache_write, cost_usd, model, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      envelope.device_id,
      envelope.session_id,
      envelope.tokens.input,
      envelope.tokens.output,
      envelope.tokens.cache_read,
      envelope.tokens.cache_write,
      envelope.tokens.cost_usd,
      envelope.tokens.model,
      now
    );

    // Update session totals
    db.prepare(`
      UPDATE sessions SET
        token_input = token_input + ?,
        token_output = token_output + ?,
        token_cache_read = token_cache_read + ?,
        token_cache_write = token_cache_write + ?,
        cost_usd = cost_usd + ?,
        tool_calls = tool_calls + CASE WHEN ? IN ('PostToolUse', 'PreToolUse') THEN 1 ELSE 0 END
      WHERE id = ?
    `).run(
      envelope.tokens.input,
      envelope.tokens.output,
      envelope.tokens.cache_read,
      envelope.tokens.cache_write,
      envelope.tokens.cost_usd,
      envelope.hook_event,
      envelope.session_id
    );
  } else if (envelope.hook_event === "PostToolUse" || envelope.hook_event === "PreToolUse") {
    db.prepare(`UPDATE sessions SET tool_calls = tool_calls + 1 WHERE id = ?`).run(envelope.session_id);
  }

  // 5. Broadcast to dashboard clients
  broadcast({ type: "event", event: { device_id: envelope.device_id, session_id: envelope.session_id, event_type: envelope.hook_event, tool_name: toolName, agent_id: agentId, parent_agent_id: parentAgentId, payload: envelope.payload, timestamp: now } });

  if (envelope.tokens) {
    broadcast({ type: "token_update", snapshot: { timestamp: now, device_id: envelope.device_id, device_name: envelope.device_name, input: envelope.tokens.input, output: envelope.tokens.output, cache_read: envelope.tokens.cache_read, cache_write: envelope.tokens.cache_write, cost_usd: envelope.tokens.cost_usd } });
  }

  return c.json({ ok: true });
});

// ─── Devices ─────────────────────────────────────────────
app.get("/api/devices", (c) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT d.*,
      (SELECT COUNT(*) FROM sessions s WHERE s.device_id = d.id AND s.status = 'active') as active_sessions
    FROM devices d
    ORDER BY d.last_seen DESC
  `).all() as (Record<string, unknown> & { extensions_json: string; active_sessions: number })[];

  const devices: Device[] = rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    hostname: r.hostname as string,
    platform: r.platform as string,
    last_seen: r.last_seen as string,
    status: isOnline(r.last_seen as string) ? "online" : "offline",
    active_sessions: r.active_sessions,
    extensions: JSON.parse(r.extensions_json),
  }));

  return c.json(devices);
});

// ─── Sessions ────────────────────────────────────────────
app.get("/api/sessions", (c) => {
  const db = getDb();
  const status = c.req.query("status");
  const deviceId = c.req.query("device_id");
  const limit = parseInt(c.req.query("limit") ?? "50", 10);

  let query = `
    SELECT s.*, d.name as device_name
    FROM sessions s
    JOIN devices d ON s.device_id = d.id
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (status) {
    query += " AND s.status = ?";
    params.push(status);
  }
  if (deviceId) {
    query += " AND s.device_id = ?";
    params.push(deviceId);
  }

  query += " ORDER BY s.started_at DESC LIMIT ?";
  params.push(limit);

  const rows = db.prepare(query).all(...params) as (Session & { device_name: string })[];
  return c.json(rows);
});

// ─── Aggregate Stats ─────────────────────────────────────
app.get("/api/stats", (c) => {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);

  const deviceStats = db.prepare(`
    SELECT
      d.id as device_id,
      d.name as device_name,
      COUNT(DISTINCT s.id) as total_sessions,
      SUM(CASE WHEN s.status = 'active' THEN 1 ELSE 0 END) as active_sessions,
      COALESCE(SUM(s.token_input), 0) as total_input_tokens,
      COALESCE(SUM(s.token_output), 0) as total_output_tokens,
      COALESCE(SUM(s.cost_usd), 0) as total_cost_usd,
      MAX(s.started_at) as last_active
    FROM devices d
    LEFT JOIN sessions s ON s.device_id = d.id
    GROUP BY d.id
    ORDER BY last_active DESC
  `).all() as DeviceStats[];

  const totals = db.prepare(`
    SELECT
      COUNT(DISTINCT d.id) as total_devices,
      SUM(CASE WHEN ? THEN 1 ELSE 0 END) as online_devices,
      COALESCE(SUM(CASE WHEN s.started_at >= ? THEN 1 ELSE 0 END), 0) as total_sessions_today,
      COALESCE(SUM(CASE WHEN s.status = 'active' THEN 1 ELSE 0 END), 0) as active_sessions,
      COALESCE(SUM(s.token_input), 0) as total_input_tokens,
      COALESCE(SUM(s.token_output), 0) as total_output_tokens,
      COALESCE(SUM(s.cost_usd), 0) as total_cost_usd
    FROM devices d
    LEFT JOIN sessions s ON s.device_id = d.id
  `).get(true, today) as Record<string, number>;

  // Token usage by hour (last 24h)
  const tokensByHour = db.prepare(`
    SELECT
      strftime('%Y-%m-%dT%H:00:00Z', timestamp) as timestamp,
      device_id,
      SUM(input_tokens) as input,
      SUM(output_tokens) as output,
      SUM(cache_read) as cache_read,
      SUM(cache_write) as cache_write,
      SUM(cost_usd) as cost_usd
    FROM token_snapshots
    WHERE timestamp >= datetime('now', '-24 hours')
    GROUP BY strftime('%H', timestamp), device_id
    ORDER BY timestamp
  `).all() as TokenSnapshot[];

  const stats: AggregateStats = {
    total_devices: totals.total_devices,
    online_devices: totals.online_devices,
    total_sessions_today: totals.total_sessions_today,
    active_sessions: totals.active_sessions,
    total_input_tokens: totals.total_input_tokens,
    total_output_tokens: totals.total_output_tokens,
    total_cost_usd: totals.total_cost_usd,
    tokens_by_hour: tokensByHour,
    devices: deviceStats,
  };

  return c.json(stats);
});

// ─── Events for a session ────────────────────────────────
app.get("/api/sessions/:id/events", (c) => {
  const db = getDb();
  const sessionId = c.req.param("id");
  const limit = parseInt(c.req.query("limit") ?? "200", 10);
  const offset = parseInt(c.req.query("offset") ?? "0", 10);

  const events = db.prepare(`
    SELECT * FROM events
    WHERE session_id = ?
    ORDER BY timestamp DESC
    LIMIT ? OFFSET ?
  `).all(sessionId, limit, offset);

  return c.json(events);
});

// ─── Device heartbeat (for lightweight keep-alive) ───────
app.post("/api/heartbeat", async (c) => {
  const body = await c.req.json() as { device_id: string; device_name: string; hostname: string; platform: string; extensions?: unknown[] };
  const db = getDb();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO devices (id, name, hostname, platform, last_seen, status, extensions_json)
    VALUES (?, ?, ?, ?, ?, 'online', ?)
    ON CONFLICT(id) DO UPDATE SET
      last_seen = excluded.last_seen,
      status = 'online',
      extensions_json = CASE WHEN excluded.extensions_json != '[]' THEN excluded.extensions_json ELSE devices.extensions_json END
  `).run(
    body.device_id,
    body.device_name,
    body.hostname,
    body.platform,
    now,
    JSON.stringify(body.extensions ?? [])
  );

  return c.json({ ok: true });
});

// ─── Helpers ─────────────────────────────────────────────
function isOnline(lastSeen: string): boolean {
  const diff = Date.now() - new Date(lastSeen).getTime();
  return diff < 5 * 60 * 1000; // 5 minutes
}

function describeActivity(envelope: HookEnvelope): string {
  const evt = envelope.hook_event;
  const tool = (envelope.payload?.tool_name as string) ?? (envelope.payload?.toolName as string) ?? "";

  if (evt === "SessionStart") return "Starting session";
  if (evt === "Stop" || evt === "SessionEnd") return "Session ended";
  if (evt === "PreToolUse" || evt === "PostToolUse") return `Using ${tool}`;
  if (evt === "SubagentStart") return "Launching subagent";
  if (evt === "SubagentStop") return "Subagent completed";
  if (evt === "UserPromptSubmit") return "Processing user prompt";
  if (evt === "PreCompact") return "Compacting context";
  return evt;
}

export default app;
