---
date: 2026-04-05
description: Centralized portal to track Claude Code extensions, token usage, and device locations across 7 machines
project: claude-code-portal
status: active
quarter: Q2-2026
tags:
  - work-note
  - project/claude-code-portal
---

# Claude Code Central Portal

## Context

Running Claude Code across **7 devices** with no centralized visibility into:
- **What** each extension/session is working on
- **How much** token usage is happening per device and aggregate
- **Where** sessions are running (which of the 7 machines)

Claude Code terminals on each device have no awareness of the others, leading to conflicts when multiple sessions access the same resources.

## Problem Statement

- No single pane of glass across all 7 devices
- Token burn is invisible until you hit limits
- Extensions don't know which device they're on
- No way to see "what is everything working on right now?"

## Research: Existing Projects

### Tier 1 — Best Starting Points

| Project | Stars | Why It Matters |
|---------|-------|----------------|
| [agents-observe](https://github.com/simple10/agents-observe) | 297 | Multiple Claude Code instances stream to central server via hooks. Closest to our needs. |
| [claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) | 1,337 | Most popular observability project. Hook-based monitoring of tool calls, subagents, sessions. |
| [Marc Nuri AI Coding Agent Dashboard](https://blog.marcnuri.com/ai-coding-agent-dashboard) | -- | Built a dashboard managing 5-10 Claude Code sessions across multiple machines. Remote session start, project selection. |
| [ccusage](https://github.com/ryoppippi/ccusage) | 12,393 | De facto standard for token tracking. Parses local JSONL files. Foundation for usage analytics. |
| [claude-code-tracker](https://github.com/m-shirt/claude-code-tracker) | 16 | Self-hosted multi-user analytics dashboard. Tracks sessions, conversations, tokens across team. |
| [claude-code-otel](https://github.com/ColeMurray/claude-code-otel) | 332 | OTLP Collector + Prometheus + Grafana. Deploy once, point all machines at it. |

### Tier 2 — Useful Components

| Project | Stars | Why It Matters |
|---------|-------|----------------|
| [claude-control](https://github.com/sverrirsig/claude-control) | 85 | macOS dashboard for monitoring AND managing multiple sessions |
| [ccusage-web](https://github.com/jx453331958/ccusage-web) | 10 | Web dashboard (Next.js + ECharts + SQLite) on ccusage data |
| [claude-code-organizer](https://github.com/mcpware/claude-code-organizer) | 226 | Manages configs, MCP servers, memories. Extension inventory. |
| [tokscale](https://github.com/junhoyeo/tokscale) | 1,597 | Multi-tool tracker (Claude + Cursor + Codex + Gemini). Leaderboard. |
| [claudeview](https://github.com/Curt-Park/claudeview) | 14 | k9s-style TUI showing live tool calls, subagents, session state |
| [tosage](https://github.com/ca-srg/tosage) | 13 | Exports token metrics to Prometheus for Grafana aggregation |

### Key Insight: Native OTLP Support

Claude Code has built-in OpenTelemetry export. Per machine:

```bash
CLAUDE_CODE_ENABLE_TELEMETRY=1
OTEL_EXPORTER_OTLP_ENDPOINT=http://central-server:4318
OTEL_RESOURCE_ATTRIBUTES="host.name=machine-1"
```

All token usage, session events, and tool calls stream to a central collector automatically.

## Architecture Design

Building on **agents-observe** pattern + **Marc Nuri dashboard** approach:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Machine 1  │  │  Machine 2  │  │  Machine 7  │
│ Claude Code │  │ Claude Code │  │ Claude Code │
│   + Hooks   │  │   + Hooks   │  │   + Hooks   │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────┬───────┴────────┬───────┘
                │  HTTP/WebSocket │
         ┌──────┴──────┐
         │   Central    │
         │   Server     │
         │  (Node.js)   │
         ├──────────────┤
         │   SQLite /   │
         │  Prometheus  │
         └──────┬───────┘
                │
         ┌──────┴──────┐
         │  Dashboard   │
         │  (Next.js)   │
         │              │
         │ • Device Map │
         │ • Token Usage│
         │ • Sessions   │
         │ • Live State │
         └─────────────┘
```

### Portal Features

1. **Device Registry** — All 7 machines registered with names, status (online/offline), last seen
2. **Live Session View** — What each Claude Code instance is working on right now (project, current tool call, agent activity)
3. **Token Dashboard** — Per-device and aggregate token usage, burn rates, daily/weekly/monthly trends
4. **Extension Inventory** — Which MCP servers, hooks, and configs are installed on each machine
5. **Session History** — Past sessions with duration, token cost, project, and outcome
6. **Alerts** — Approaching token limits, device offline, session errors

## Deep Dive Findings

### agents-observe (v0.7.4)

**Architecture**: `Claude Code Hooks → hook.sh → observe_cli.mjs → HTTP POST → Hono Server → SQLite + WebSocket → React Dashboard`

Key patterns adopted:
- **Backgrounded hook script** — reads stdin, backgrounds the POST, exits in <5ms to avoid blocking Claude Code
- **Server-initiated callbacks** — POST response includes `requests` array for data the server needs from the client (e.g., session slug from local transcript)
- **25 hook events** instrumented — every lifecycle event Claude Code exposes
- **Deduped Pre/PostToolUse** — paired client-side into single rows

Limitations we addressed:
- No device identity → our envelope includes `device_id`, `device_name`, `hostname`
- No token tracking → our schema has `token_snapshots` table
- No aggregate dashboard → our StatsOverview + DeviceGrid
- Localhost-only → our server binds to all interfaces

### Marc Nuri AI Coding Agent Dashboard (not open-sourced)

**Architecture**: Push-based heartbeat model with enricher chain.

Key patterns to adopt:
- **Enricher chain** — raw hook data passes through enrichers that each extract specific info (model name, tokens, context %, PR URLs). Makes the system agent-agnostic.
- **Context usage %** — the most actionable metric. High context predicts need for intervention.
- **Embedded terminal** — clicking a session opens a live browser terminal via WebSocket relay to remote tmux session.
- **Device registration + project picker** — select device, select repo, spin up a new Claude Code session remotely.

### claude-code-hooks-multi-agent-observability (1,337 stars)

**Architecture**: `Claude Code → Python hooks → HTTP POST → Bun/TypeScript server → SQLite → WebSocket → Vue 3 Dashboard`

Key patterns to adopt:
- **Dual-hook pattern** — each event chains two scripts: (1) domain-specific (e.g., security validation in PreToolUse) and (2) universal `send_event.py` for telemetry. Separates concerns.
- **`--server-url` already parameterized** — hooks accept remote server URL as CLI arg, making multi-device trivial.
- **AI-generated summaries** — `--summarize` flag calls Anthropic API to summarize event payload before sending.
- **Human-in-the-loop** — dashboard supports inline responses to agent questions (approve/deny/text input).
- **Swim lane view** — side-by-side comparison of multiple agent behaviors.

## Tech Stack (Implemented)

- **Server**: Hono + WebSocket + better-sqlite3 (WAL mode)
- **Database**: SQLite with 4 tables: devices, sessions, events, token_snapshots
- **Dashboard**: React 19 + Tailwind CSS + custom charts
- **Data Collection**: Hook script (bash) + heartbeat cron on each machine
- **Deployment**: Docker Compose

## Action Items

- [x] Research existing projects and prior art
- [x] Deep dive into agents-observe, Marc Nuri dashboard, claude-code-hooks architectures
- [x] Scaffold project with server + dashboard
- [x] Build device registry and heartbeat system
- [x] Build token aggregation pipeline
- [x] Build web dashboard UI (StatsOverview, DeviceGrid, SessionList, TokenChart)
- [ ] Add enricher chain pattern (context %, PR detection, model extraction)
- [ ] Add session detail view with event timeline
- [ ] Add embedded terminal (WebSocket relay to tmux)
- [ ] Add authentication for remote access
- [ ] Deploy and configure hooks on all 7 machines

## Related

- [[brain/Key Decisions]] — Token optimization strategy
- [[brain/Patterns]] — Context window as public good
- [[brain/Skills]] — Claude Code setup and workflows
