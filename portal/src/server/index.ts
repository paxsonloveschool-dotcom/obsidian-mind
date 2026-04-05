import { serve } from "@hono/node-server";
import { createServer } from "http";
import app from "./routes.js";
import { setupWebSocket } from "./websocket.js";
import { getDb } from "./db.js";

const PORT = parseInt(process.env.PORTAL_PORT ?? "4981", 10);

// Initialize database
getDb();
console.log("[portal] Database initialized");

// Create HTTP server with Hono handler
const server = createServer(app.fetch as unknown as Parameters<typeof createServer>[0]);

// Attach WebSocket
setupWebSocket(server);

// Start device status checker (mark offline after 5 min)
setInterval(() => {
  const db = getDb();
  const cutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  db.prepare(`UPDATE devices SET status = 'offline' WHERE last_seen < ? AND status = 'online'`).run(cutoff);

  // Also mark sessions as stopped if device went offline
  db.prepare(`
    UPDATE sessions SET status = 'stopped', ended_at = ?
    WHERE status = 'active' AND device_id IN (
      SELECT id FROM devices WHERE status = 'offline'
    )
  `).run(new Date().toISOString());
}, 60_000);

server.listen(PORT, () => {
  console.log(`[portal] Central server running on http://localhost:${PORT}`);
  console.log(`[portal] WebSocket available at ws://localhost:${PORT}/ws`);
  console.log(`[portal] Dashboard at http://localhost:4980 (dev mode)`);
});
