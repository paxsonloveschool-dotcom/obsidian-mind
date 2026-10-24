---
date: 2026-04-05
description: Registry of vault workflows and slash commands
tags: [brain, skills]
type: brain
---

# Skills

## Obsidian Mind Commands
See CLAUDE.md for full command table (15 commands, 9 agents).

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

## Related
- [[Patterns#Workflow]] — two-part execution pattern this registry references
- [[Key Decisions#2026-04-05 — Token Optimization Strategy]] — origin of the 4-file context
- [[North Star]] — Plugin Auto-Discovery enacts the "Automate the repetitive" principle
- [[Memories]] — index of brain topics
