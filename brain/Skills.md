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

## Design Skills (UI/UX Pro Max bundle)

Vendored on 2026-04-13 from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT). Seven skills installed under `.claude/skills/`:

| Skill | Trigger | Core capability |
|-------|---------|-----------------|
| `ui-ux-pro-max` | Any UI/visual/UX task | 67 styles, 161 palettes, 57 font pairs, 99 UX rules, 25 charts, 15 stacks. Python search engine over CSV databases. Primary design brain. |
| `design` | Brand/logo/CIP/icons/social | 55 logo styles, 50 CIP deliverables, 22 banner styles, 15 icon styles, social photo generation |
| `design-system` | Tokens, component specs | Three-layer tokens (primitive → semantic → component), CSS vars, spacing/typography scales |
| `ui-styling` | shadcn/ui, Tailwind, Radix | Accessible components, canvas visuals, dark mode, responsive layouts |
| `brand` | Voice, style guides, brand compliance | Messaging frameworks, asset management |
| `banner-design` | Social/ads/web/print banners | 13+ styles × all major platforms |
| `slides` | HTML presentations | Chart.js, design tokens, copywriting formulas |

**Query the ui-ux-pro-max search engine**:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <max>]
# domains: product | style | typography | color | landing | chart | ux
# stack search:
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>
# stacks: html-tailwind, react, nextjs, astro, vue, nuxtjs, nuxt-ui, svelte, swiftui,
#         react-native, flutter, shadcn, jetpack-compose
```

**Usage mandate**: Auto-invoke `ui-ux-pro-max` via the Skill tool on any task that changes how a feature looks, feels, moves, or is interacted with. Follow the priority ladder in its SKILL.md: 1) accessibility → 2) touch/interaction → 3) performance → 4) style selection → 5) layout/responsive → 6) typography/color → 7) animation. Never ship: raw hex in components, text < 12px body, focus-ring removal, icon-only buttons without aria labels, hover-only interactions, CLS ≥ 0.1.

## Orchestration Bundle (oh-my-claudecode)

Cherry-pick vendored on 2026-04-13 from [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) (MIT, v4.11.6). Only the standalone pieces that do not require the plugin runtime were installed. The full plugin (with hooks, team mode, `$CLAUDE_PLUGIN_ROOT`-dependent scripts) is available via user-level install:

```
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
```

### Agents (19)

Added to `.claude/agents/` alongside the vault-specific agents. No name collisions.

| Agent | Role |
|-------|------|
| `analyst` | Data and qualitative analysis |
| `architect` | High-level system design and tradeoffs |
| `code-reviewer` | Independent code review pass |
| `code-simplifier` | Delete-first refactoring to cut complexity |
| `critic` | Adversarial critique of plans and output |
| `debugger` | Bug reproduction and root-cause isolation |
| `designer` | UI/UX design decisions (pairs with ui-ux-pro-max) |
| `document-specialist` | External documentation and literature search |
| `executor` | Implementation of approved plans |
| `explore` | Codebase search and relationship discovery |
| `git-master` | Git workflow, history rewriting, conflict resolution |
| `planner` | Step-by-step execution plans |
| `qa-tester` | Test case generation and regression hunting |
| `scientist` | Hypothesis-driven experiments and measurement |
| `security-reviewer` | Security audit pass on diffs |
| `test-engineer` | Test infrastructure and coverage strategy |
| `tracer` | Evidence-based causal tracing |
| `verifier` | Independent verification of completion claims |
| `writer` | Documentation and prose authoring |

### Skills (33)

| Category | Skill | Purpose |
|----------|-------|---------|
| Planning | `plan` | Strategic planning with optional interview workflow |
| Planning | `ralplan` | Consensus planning gate -- auto-activates for vague ralph/autopilot/team requests |
| Planning | `deep-dive` | 2-stage pipeline: `trace` → `deep-interview` for complex investigations |
| Planning | `deep-interview` | Socratic ambiguity gating before autonomous execution |
| Planning | `deepinit` | Hierarchical `AGENTS.md` initialization for unknown codebases |
| Planning | `sciomc` | Parallel scientist-agent orchestration |
| Execution | `autopilot` | Full autonomous idea → working code loop |
| Execution | `ralph` | Self-referential loop until completion with verification |
| Execution | `ultrawork` | Parallel high-throughput task execution |
| Execution | `ultraqa` | Test → verify → fix cycling |
| Execution | `ccg` | Claude + Codex + Gemini tri-model synthesis |
| Debug/Verify | `debug` | Session + repo state diagnosis |
| Debug/Verify | `trace` | Evidence-driven causal tracing with competing hypotheses |
| Debug/Verify | `verify` | Verify change really works before claiming completion |
| Debug/Verify | `visual-verdict` | Screenshot vs reference structured QA |
| Debug/Verify | `ai-slop-cleaner` | Regression-safe deletion-first cleanup of AI-generated code |
| Memory | `remember` | Decide what belongs in project memory vs notepad vs docs |
| Memory | `wiki` | Persistent markdown knowledge base (Karpathy model) |
| Memory | `writer-memory` | Agentic memory for writers (characters, scenes, themes) |
| Memory | `learner` | Extract a learned skill from current conversation |
| Memory | `omc-reference` | OMC agent catalog and routing reference |
| Meta | `skill` | Manage local skills -- list, add, remove, edit |
| Meta | `skillify` | Turn a repeatable workflow into a reusable skill draft |
| Meta | `self-improve` | Evolutionary code improvement with tournament selection |
| Workflow | `project-session-manager` | Worktree-first environment manager for issues/PRs |
| Workflow | `release` | Release assistant with repo rule caching |
| Workflow | `setup` | Install/update routing for OMC flows |
| Workflow | `omc-doctor` | Diagnose OMC installation issues |
| Workflow | `omc-teams` | CLI-team runtime for tmux process parallelism |
| Comms | `ask` | Process-first advisor routing for Claude/Codex/Gemini |
| Comms | `external-context` | Parallel doc-specialist agents for web/doc lookups |
| Comms | `configure-notifications` | Telegram/Discord/Slack notification setup |
| Comms | `mcp-setup` | Popular MCP server configuration |

**Intentionally skipped** (require plugin runtime): `team`, `cancel`, `hud`, `omc-setup`. Also skipped: 58 Node scripts, hook definitions, `src/`, `dist/`, `bridge/`, `shellmark/`, `missions/`, `package.json`, `$CLAUDE_PLUGIN_ROOT`-dependent code.

**Usage guidance**: OMC skills are for **dev/orchestration work**, not note-taking. Vault workflows (notes, people, reviews, incidents) stay on `/standup`, `/dump`, `/wrap-up`, etc. When working inside this repo on actual code/config (`.claude/`, hooks, templates), compose: `plan` → `ralph`/`autopilot` → `verify` → `ai-slop-cleaner` before commit. For ambiguous requests, `ralplan` gates with consensus planning. For bug hunts, use `deep-dive`.

Related: [[Patterns]], [[Gotchas]], [[Key Decisions]]
