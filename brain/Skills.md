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

## Installed Skills (`.claude/skills/`)
Auto-discovered by Claude Code via SKILL.md frontmatter. No registration needed.

### Vault-native
- `qmd`, `obsidian-cli`, `obsidian-markdown`, `obsidian-bases`, `json-canvas`, `defuddle`

### GitHub (from `adityahimaone/hermes-agent-rtk-caveman`, 2026-05-11)
- `github-auth` — pick gh vs git+curl; token + SSH setup
- `github-pr-workflow` — branch → commit → PR → CI watch → auto-fix → merge
- `github-code-review` — diff analysis, inline PR comments, pre-push review
- `github-issues` — create/triage/close issues; bug/feature templates
- `github-repo-management` — clone, fork, remotes, secrets, releases, workflows
- `github-ssh-token-workflow` — when to use SSH vs token, dedicated key setup
- `codebase-inspection` — pygount LOC + language breakdown
- **Note**: These skills assume `gh` CLI OR direct curl to api.github.com. In environments where neither is available (e.g. Claude Code on the web with only GitHub MCP), prefer `mcp__github__*` tools instead — these skills are pointer references, not the primary path.

### Context Hygiene
- `context-hygiene` — token budget discipline; codifies Nate Herk's playbook (edit-don't-follow-up, opusplan, sub-agent isolation, manual /compact, Fast Path tools)

## Updating Skills
- Obsidian skills: `.claude/update-skills.sh` (pulls from `kepano/obsidian-skills`)
- RTK skills: `.claude/update-rtk-skills.sh` (pulls from `adityahimaone/hermes-agent-rtk-caveman`)
- Daily discovery: `.github/workflows/skill-scout.yml` runs 09:17 UTC, opens a draft PR if new skills are worth adopting. On-demand: `/skill-scout [lookback_days]`.

## Self-Improvement Loop
- **Agent**: `.claude/agents/skill-scout.md` — searches GitHub for newly-released Claude Code skills, evaluates, proposes adoptions
- **Playbook**: `.github/scripts/skill-scout-prompt.md` — source of truth for evaluation criteria + report format
- **Trigger**: daily cron (09:17 UTC) OR `workflow_dispatch` OR `/skill-scout` in-session
- **Output**: `thinking/skill-scout-YYYY-MM-DD.md` + optional skill additions in `.claude/skills/`
- **Setup**: requires `ANTHROPIC_API_KEY` in repo Actions secrets
