---
date: 2026-04-15
description: Catalog of oh-my-claudecode's 36 skills and 19 agents with import status — adapted, cataloged-only, or skipped (with rationale)
tags: [reference, ohmyclaude, import-catalog]
type: index
---

# oh-my-claudecode Catalog

Inventory and import status for [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) (a multi-agent orchestration plugin for Claude Code). Imported on 2026-04-15 during [[../brain/Build Log#2026-04-15 — Session 2: Subagents, Bases, Hooks, /think|session 2]].

## Import Philosophy

oh-my-claudecode (omc) is tightly integrated with its own orchestration engine (`.omc/` state folders, ralplan/autopilot loops, tmux team runners, MCP state management). Most skills are not portable without rewriting the underlying infrastructure. Agents are more self-contained and port cleanly.

Import decisions:
- **Adapted**: Ported to vault conventions with light edits (renamed refs, stripped omc state, fixed paths). Ready to use.
- **Cataloged**: Listed here for reference but not imported. The original file is not in this vault.
- **Skipped**: Not applicable to this vault's scope.

## Agents (19 total, 17 adapted)

All adapted agents are prefixed with `omc-` in `.claude/agents/` to make origin clear and prevent collisions. Adaptations: strip `level:` frontmatter, rename `oh-my-claudecode:X` cross-refs to `omc-X`, redirect `.omc/` paths to `thinking/omc-*`, redirect `oh-my-claudecode:explore` to the built-in `Explore` agent type, redirect `oh-my-claudecode:code-simplifier` to the `simplify` skill.

| Agent | Status | Description | Vault file |
|-------|--------|-------------|------------|
| `analyst` | **adapted** | Pre-planning requirements gap analysis (Opus) | `.claude/agents/omc-analyst.md` |
| `architect` | **adapted** | Architecture review — principles, trade-offs, steelman counters (Opus) | `.claude/agents/omc-architect.md` |
| `code-reviewer` | **adapted** | Thorough code review with multi-perspective gap analysis | `.claude/agents/omc-code-reviewer.md` |
| `code-simplifier` | **skipped** | Duplicates the built-in `simplify` skill | — |
| `critic` | **adapted** | Final quality gate — plan/code/analysis review with ADVERSARIAL escalation | `.claude/agents/omc-critic.md` |
| `debugger` | **adapted** | Structured debugging — reproduce, isolate, hypothesize, verify | `.claude/agents/omc-debugger.md` |
| `designer` | **adapted** | UX/UI design review and guidance | `.claude/agents/omc-designer.md` |
| `document-specialist` | **adapted** | Documentation writing and external doc lookup | `.claude/agents/omc-document-specialist.md` |
| `executor` | **adapted** | Implement a plan step-by-step with verification | `.claude/agents/omc-executor.md` |
| `explore` | **skipped** | Conflicts with Claude Code's built-in `Explore` agent type | — |
| `git-master` | **adapted** | Atomic git operations — commits, merges, tags, PRs | `.claude/agents/omc-git-master.md` |
| `planner` | **adapted** | Work plan creation with testable acceptance criteria | `.claude/agents/omc-planner.md` |
| `qa-tester` | **adapted** | End-to-end QA testing with structured verdicts | `.claude/agents/omc-qa-tester.md` |
| `scientist` | **adapted** | Hypothesis-driven analysis with measurable outcomes | `.claude/agents/omc-scientist.md` |
| `security-reviewer` | **adapted** | Security audit with threat modeling and evidence | `.claude/agents/omc-security-reviewer.md` |
| `test-engineer` | **adapted** | Test design — unit, integration, e2e coverage planning | `.claude/agents/omc-test-engineer.md` |
| `tracer` | **adapted** | Causal investigation — evidence-driven tracing | `.claude/agents/omc-tracer.md` |
| `verifier` | **adapted** | Verify a claim or change actually worked | `.claude/agents/omc-verifier.md` |
| `writer` | **adapted** | Writing assistance — prose, docs, technical content | `.claude/agents/omc-writer.md` |

### When to use omc agents vs vault agents

**Vault-native agents** (unprefixed, built for this vault):
- `vault-librarian`, `cross-linker`, `memory-curator`, `playbook-generator` — vault maintenance
- `brag-spotter`, `review-prep`, `review-fact-checker` — performance
- `slack-archaeologist`, `people-profiler`, `context-loader` — capture
- `vault-migrator` — migration

**omc agents** (prefixed `omc-`, adapted from oh-my-claudecode):
- Use for **code-side work** — planning, reviewing, debugging, testing, security
- Use for **analytical tasks** — requirements analysis, critical review, scientific investigation
- Use for **writing** — prose, technical docs, design rationale

Vault agents know the vault conventions (frontmatter, linking, folders). omc agents know general software engineering practice. Pick the right layer for the task.

## Skills (36 total)

omc "skills" correspond roughly to vault slash commands. Most are tightly coupled to omc's pipeline engine (state management, cross-skill handoffs via `state_write`, hook-gated loops). Direct import would drag in infrastructure this vault doesn't have.

### Adapted

| Skill | Description | Vault equivalent |
|-------|-------------|------------------|
| `remember` | Classify session findings and route to memory surfaces | `/remember` (adapted; see `.claude/commands/remember.md`) |
| `verify` | Verify a change really works before claiming completion | `/verify` (adapted; see `.claude/commands/verify.md`) |

### Partially Covered by Existing Vault Surfaces

| Skill | Why partially covered | Relevant vault surface |
|-------|----------------------|------------------------|
| `plan` | Built-in `Plan` agent provides most of this | `Agent(subagent_type="Plan")` |
| `deep-interview` | Socratic interviewing — maps to `/think` for structured reasoning | `/think` |
| `deep-dive` | 2-stage investigation — maps to `/think` + promotion flow | `/think` + `/promote` |
| `learner` | Extract learned skill — maps to playbook-generator agent | `playbook-generator` agent |
| `skillify` | Turn workflow into skill — duplicate of `learner` | `playbook-generator` agent |
| `wiki` | Persistent markdown knowledge base — the vault IS this | `brain/`, `reference/` |
| `writer-memory` | Track characters/scenes — not applicable to work vault | — |
| `ai-slop-cleaner` | Regression-safe code cleanup — related to `/humanize` for prose | `/humanize` |
| `trace` | Causal investigation — use the adapted `omc-tracer` agent | `Agent(subagent_type="omc-tracer")` |

### Skipped — Tightly Coupled to omc Infrastructure

| Skill | Why skipped |
|-------|-------------|
| `autopilot` | Full autonomous execution loop — needs omc state machine |
| `ralph` | Self-referential loop — needs omc state machine |
| `ralplan` | Consensus planning entry — needs architect/critic pipeline with state |
| `ultrawork` | Parallel execution engine — needs omc worker pool |
| `ultraqa` | QA cycling workflow — needs omc state machine |
| `team` | N coordinated agents via Claude Code teams — needs team runtime |
| `self-improve` | Evolutionary code improvement — needs `.omc/self-improve/` state |
| `sciomc` | Parallel scientist orchestration — needs omc pipeline |
| `ccg` | Claude-Codex-Gemini tri-model — needs external CLIs |
| `ask` | Process-first advisor routing — needs `omc ask` CLI |
| `external-context` | Parallel document-specialist web search — can be done directly |
| `project-session-manager` | Worktree-first dev environment — needs tmux runtime |
| `release` | Release assistant — needs `.omc/RELEASE_RULE.md` cache |
| `debug` | Diagnose omc session — needs omc logs/state |
| `cancel` | Cancel active omc mode — nothing to cancel here |
| `hud` | Configure HUD display — omc UI |
| `configure-notifications` | Telegram/Discord/Slack notifications | — |
| `mcp-setup` | Configure MCP servers — out of scope for vault |
| `setup` | Install/update routing | — |
| `omc-doctor` | omc installation diagnosis | — |
| `omc-reference` | omc agent catalog | — |
| `omc-setup` | omc installation | — |
| `omc-teams` | omc CLI-team runtime | — |
| `deepinit` | Deep codebase initialization with AGENTS.md | Can be adapted if needed for reference/ |
| `visual-verdict` | Screenshot-to-reference comparison | — |
| `skill` | Local skill manager | — |

## Source

Cloned from `https://github.com/Yeachan-Heo/oh-my-claudecode` on 2026-04-15 via shallow clone to `/tmp/ohmyclaude-import/` (not committed to this repo).

## Usage Notes

- **omc agents run in isolated context windows** like any subagent. Their prompt must be self-contained — they don't see this vault's CLAUDE.md or conversation history.
- **omc agents don't know vault conventions.** If you invoke `omc-writer` to write a vault note, remind it in the prompt about frontmatter, folder placement, and wikilinks — the vault conventions are not built in.
- **For pure vault work, prefer vault-native agents.** Use omc agents when the task is code/plan/analysis-shaped, not vault-shaped.
- **The adapted files have a provenance comment** at the top: `<!-- Adapted from oh-my-claudecode ... -->`. Don't strip it.

## Related

- [[agent-reference]] — complete agent catalog (vault-native + omc)
- [[command-reference]] — complete command catalog
- [[../brain/Capabilities]] — everything available to Claude in this vault
- [[../brain/Build Log]] — the session history
