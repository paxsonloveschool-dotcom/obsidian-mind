// Shared types between server and dashboard

export interface Device {
  id: string;
  name: string;
  hostname: string;
  platform: string;
  last_seen: string;
  status: "online" | "offline";
  active_sessions: number;
  extensions: Extension[];
}

export interface Extension {
  name: string;
  type: "mcp-server" | "hook" | "plugin" | "skill";
  config: Record<string, unknown>;
}

export interface Session {
  id: string;
  device_id: string;
  device_name: string;
  project: string;
  branch: string;
  cwd: string;
  status: "active" | "stopped" | "errored";
  started_at: string;
  ended_at: string | null;
  model: string;
  token_input: number;
  token_output: number;
  token_cache_read: number;
  token_cache_write: number;
  cost_usd: number;
  tool_calls: number;
  current_activity: string;
  events_count: number;
}

export interface TokenSnapshot {
  timestamp: string;
  device_id: string;
  device_name: string;
  input: number;
  output: number;
  cache_read: number;
  cache_write: number;
  cost_usd: number;
}

export interface HookEvent {
  id?: number;
  device_id: string;
  session_id: string;
  event_type: string;
  tool_name: string | null;
  agent_id: string | null;
  parent_agent_id: string | null;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface DeviceStats {
  device_id: string;
  device_name: string;
  total_sessions: number;
  active_sessions: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost_usd: number;
  last_active: string;
}

export interface AggregateStats {
  total_devices: number;
  online_devices: number;
  total_sessions_today: number;
  active_sessions: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost_usd: number;
  tokens_by_hour: TokenSnapshot[];
  devices: DeviceStats[];
}

// Hook payload envelope — what each machine POSTs to the server
export interface HookEnvelope {
  device_id: string;
  device_name: string;
  hostname: string;
  platform: string;
  hook_event: string;
  session_id: string;
  timestamp: string;
  payload: Record<string, unknown>;
  // Token data from ccusage JSONL parsing
  tokens?: {
    input: number;
    output: number;
    cache_read: number;
    cache_write: number;
    cost_usd: number;
    model: string;
  };
  // Extension inventory (sent periodically)
  extensions?: Extension[];
}

// WebSocket message types
export type WSMessage =
  | { type: "device_update"; device: Device }
  | { type: "session_update"; session: Session }
  | { type: "event"; event: HookEvent }
  | { type: "token_update"; snapshot: TokenSnapshot }
  | { type: "connected"; device_count: number };
