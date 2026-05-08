---
date: 2026-04-05
description: Registry of vault workflows, slash commands, and Claude Code plugins
tags: [brain, skills]
type: brain
---

# Skills

## Obsidian Mind Commands
See [[CLAUDE]] for the full command table (15 slash commands, 9 subagents).

## Claude Code Setup
- Autopilot mode: all permissions pre-approved
- Token efficiency: 4-file context structure
- Two-part execution: Research & Plan -> Execute & Verify
- MASTER_SOP: ~/claude-code-config/MASTER_SOP.md
- Claude Code version: 2.1.133 (>= 2.1.86 required for `/ultra-review`)

## Installed Claude Code Plugins (user scope)

Installed via `claude plugin install` -- live in `~/.claude/plugins/`, NOT vault-tracked. This note is the source of truth for what is installed and why.

| Plugin | Version | Marketplace | Purpose |
|--------|---------|-------------|---------|
| `skill-creator` | 76b35e91 | `anthropics/claude-plugins-official` | Interactive Q&A factory for building new skills -- generates SKILL.md, frontmatter, and folder structure without manual edits |
| `superpowers` | 5.1.0 | `anthropics/claude-plugins-official` (origin: `obra/superpowers`) | Senior-developer workflow: TDD red-green-refactor, 4-phase debugging, Socratic brainstorming, subagent-driven dev with built-in review |
| `gsd` | 2.42.1 | `jnuyens/gsd-plugin` (upstream: `gsd-build/get-shit-done`) | Spec-driven dev system. Combats context rot via fresh subagent contexts. Maintains PROJECT/REQUIREMENTS/ROADMAP/STATE/CONTEXT artifacts across sessions |
| `context-mode` | 1.0.111 | `mksglu/context-mode` | Sandboxes tool output and persists session events to per-project SQLite. Claims ~98% context reduction (315KB -> 5KB). Restores snapshots after compaction |
| `claude-mem` | 13.0.0 | `thedotmack/claude-mem` | Persistent cross-session memory. SQLite (FTS5) + Chroma vector DB with local embeddings. Auto-injects relevant context on session start |
| `frontend-design` | 1.0.0 | `anthropics/claude-code` | Official Anthropic UI/UX skill -- bold aesthetic direction, distinctive typography, motion, asymmetric layouts. Avoids "AI-generated" look |

### Built-in review commands
- `/re` -- fast local code review feedback
- `/ultra-review` -- cloud sandbox; multi-agent fleets independently verify bugs, security, performance (requires Claude Code >= 2.1.86)

### Reinstalling on a new machine

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add anthropics/claude-code --sparse plugins .claude-plugin
claude plugin marketplace add jnuyens/gsd-plugin
claude plugin marketplace add mksglu/context-mode
claude plugin marketplace add thedotmack/claude-mem

claude plugin install skill-creator@claude-plugins-official
claude plugin install superpowers@claude-plugins-official
claude plugin install frontend-design@claude-code-plugins
claude plugin install gsd@gsd-plugin
claude plugin install context-mode@context-mode
claude plugin install claude-mem@thedotmack
```

### Maintenance
- `claude plugin list` -- show installed
- `claude plugin update <name>` -- update one (restart required)
- `claude plugin marketplace update` -- refresh marketplace caches
- `claude plugin disable <name>` / `enable <name>` -- toggle without uninstalling
