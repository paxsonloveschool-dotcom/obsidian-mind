---
date: 2026-04-05
description: Registry of vault workflows and slash commands
tags: [brain, skills]
type: brain
---

# Skills

## Obsidian Mind Commands
See CLAUDE.md for full command table (16 commands, 9 agents).

### `/email` — Gmail assistant
Triages the inbox, drafts replies to inbound mail, and composes outbound/templated
sends over the Gmail MCP server. **Approve-then-send**: Claude always proposes the
full message and waits for explicit approval before sending. Reusable outbound
templates live in `templates/email/`. First use triggers a one-time Gmail OAuth
authorization. See [[email]] command and `templates/email/README.md`.

## Claude Code Setup
- Autopilot mode: all permissions pre-approved
- Token efficiency: 4-file context structure
- Two-part execution: Research & Plan -> Execute & Verify
- MASTER_SOP: ~/claude-code-config/MASTER_SOP.md
