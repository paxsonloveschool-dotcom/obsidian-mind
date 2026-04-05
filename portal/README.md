# Claude Code Portal

Centralized dashboard for tracking Claude Code extensions, token usage, and sessions across multiple devices.

## Architecture

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Machine 1  │  │  Machine 2  │  │  Machine 7  │
│ Claude Code │  │ Claude Code │  │ Claude Code │
│   + Hooks   │  │   + Hooks   │  │   + Hooks   │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────┬───────┴────────┬───────┘
                │  HTTP POST     │
         ┌──────┴──────┐
         │   Central    │
         │   Server     │
         │  (Hono+SQLite)│
         └──────┬───────┘
                │ WebSocket
         ┌──────┴──────┐
         │  Dashboard   │
         │  (React)     │
         └─────────────┘
```

## Features

- **Device Registry** — See all machines, their status (online/offline), and installed extensions
- **Live Session Tracking** — What each Claude Code instance is working on right now
- **Token Dashboard** — Per-device and aggregate token usage with hourly charts
- **Extension Inventory** — MCP servers, hooks, and plugins installed on each machine
- **Real-time Updates** — WebSocket pushes events to the dashboard as they happen

## Quick Start

### 1. Start the central server

```bash
cd portal
npm install
npm run dev
```

Server runs on `:4981`, dashboard on `:4980`.

### 2. Configure each device

Set environment variables:

```bash
export PORTAL_SERVER_URL="http://your-server-ip:4981"
export PORTAL_DEVICE_ID="my-macbook"
export PORTAL_DEVICE_NAME="My MacBook"
```

Add hooks to `~/.claude/settings.json` (merge with existing hooks):

```json
{
  "hooks": {
    "SessionStart": [{ "type": "command", "command": "/path/to/portal/src/hooks/hook.sh SessionStart" }],
    "PreToolUse": [{ "type": "command", "command": "/path/to/portal/src/hooks/hook.sh PreToolUse" }],
    "PostToolUse": [{ "type": "command", "command": "/path/to/portal/src/hooks/hook.sh PostToolUse" }],
    "Stop": [{ "type": "command", "command": "/path/to/portal/src/hooks/hook.sh Stop" }]
  }
}
```

See `src/hooks/settings-snippet.json` for the full hook configuration.

### 3. Add heartbeat (optional)

For device status tracking even when no Claude Code sessions are active:

```bash
# Add to crontab: crontab -e
*/2 * * * * PORTAL_SERVER_URL="http://your-server:4981" PORTAL_DEVICE_ID="my-macbook" /path/to/portal/src/hooks/heartbeat.sh
```

### Docker

```bash
docker compose up -d
```

## Tech Stack

- **Server**: Hono (HTTP) + ws (WebSocket) + better-sqlite3
- **Dashboard**: React 19 + Tailwind CSS + Recharts
- **Build**: Vite + TypeScript
- **Data**: SQLite (WAL mode, zero-config)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/events` | Ingest hook events from devices |
| POST | `/api/heartbeat` | Device keep-alive + extension scan |
| GET | `/api/devices` | List all registered devices |
| GET | `/api/sessions` | List sessions (filterable by status, device) |
| GET | `/api/sessions/:id/events` | Events for a specific session |
| GET | `/api/stats` | Aggregate statistics and token charts |
| GET | `/api/health` | Health check |
| WS | `/ws` | Real-time event stream |

## Inspired By

- [agents-observe](https://github.com/simple10/agents-observe) — Multi-instance hook streaming architecture
- [claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) — Hook-based monitoring patterns
- [ccusage](https://github.com/ryoppippi/ccusage) — Token usage parsing from JSONL
- [Marc Nuri AI Coding Agent Dashboard](https://blog.marcnuri.com/ai-coding-agent-dashboard) — Cross-device orchestration
