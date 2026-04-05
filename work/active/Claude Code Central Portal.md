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

## Tech Stack

- **Server**: Node.js + Express + WebSocket (real-time updates)
- **Database**: SQLite (portable, zero-config) via better-sqlite3
- **Dashboard**: Next.js + Tailwind + Recharts
- **Data Collection**: Claude Code hooks (PostToolUse, Stop, SessionStart) POST to central server
- **Deployment**: Docker Compose for easy self-hosting

## Action Items

- [x] Research existing projects and prior art
- [ ] Deep dive into agents-observe, Marc Nuri dashboard, claude-code-hooks architectures
- [ ] Scaffold project with server + dashboard
- [ ] Build device registry and heartbeat system
- [ ] Build token aggregation pipeline
- [ ] Build live session tracking
- [ ] Build web dashboard UI
- [ ] Deploy and configure hooks on all 7 machines

## Related

- [[brain/Key Decisions]] — Token optimization strategy
- [[brain/Patterns]] — Context window as public good
- [[brain/Skills]] — Claude Code setup and workflows
