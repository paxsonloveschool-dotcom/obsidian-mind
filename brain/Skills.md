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

## Plugin Auto-Discovery
- Policy: `.claude/plugins/allowlist.yml` (trusted authors, stars >= 1000, pushed <90d)
- Manifest: `.claude/plugins/discovered.yml` (auto-managed)
- Daily workflow: `.github/workflows/discover-plugins.yml` (07:00 UTC)
- Local installer: `.claude/scripts/auto-install-plugins.sh` (SessionStart, 6h cooldown)
- Audit log: `thinking/session-logs/plugin-install-YYYY-MM-DD.log`
- Edit allowlist to broaden/narrow the funnel; add repos to `denylist` to block.
