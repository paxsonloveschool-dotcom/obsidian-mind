---
date: 2026-04-15
description: Quick lookup table for all 28 subagents (11 vault-native + 17 omc-adapted) — purpose, inputs, outputs, when to invoke directly vs via command
tags: [reference, agents, moc]
type: index
---

# Agent Reference

Quick-scan table for all subagents in `.claude/agents/`. These run in isolated context windows — their prompt must be self-contained.

**Two tiers:**
- **Vault-native agents (11)** — built for this vault, know the conventions (frontmatter, linking, folders). Unprefixed names.
- **omc-adapted agents (17)** — ported from [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode). Prefixed `omc-`. Use for code/plan/analysis work; they don't know vault conventions unless briefed in the prompt. See [[ohmyclaude-catalog]] for import history.

## Vault Maintenance Agents

### `vault-librarian`

| | |
|---|---|
| **Purpose** | Detect orphans, broken wikilinks, frontmatter gaps, stale active notes, index inconsistency |
| **Tools** | Read, Grep, Glob, Bash |
| **Skills** | obsidian-cli, obsidian-markdown, qmd |
| **Invoked by** | `/vault-audit` |
| **Direct use** | When user asks for vault cleanup |
| **Inputs** | None — runs full vault scan |
| **Outputs** | Maintenance report at `thinking/vault-audit-YYYY-MM-DD.md`, top 5 findings to parent |
| **Behavior** | Does NOT auto-fix; reports for user approval |
| **Related** | [[../brain/playbooks/Run Vault Audit]] |

### `cross-linker`

| | |
|---|---|
| **Purpose** | Find missing wikilinks for people, projects, teams, competencies, incidents |
| **Tools** | Read, Edit, Grep, Glob, Bash |
| **Skills** | obsidian-markdown, qmd |
| **Invoked by** | `/vault-audit`, `/connect` |
| **Direct use** | After creating multiple notes, when scanning recent activity |
| **Inputs** | "Scan recent" (48h), "Scan all", or specific paths |
| **Outputs** | Findings at `thinking/cross-link-audit-YYYY-MM-DD.md`, top 5 to parent |
| **Behavior** | Does NOT auto-fix; presents missing links and missing backlinks |
| **Related** | [[../brain/playbooks/Find Missing Links]] |

## Capture Agents

### `slack-archaeologist`

| | |
|---|---|
| **Purpose** | Full reconstruction of Slack conversations — every message, thread, profile |
| **Tools** | Read, Write, Bash, Grep, Glob |
| **Skills** | qmd |
| **Invoked by** | `/incident-capture` |
| **Direct use** | Any deep Slack reconstruction (incidents, evidence gathering, fact-finding) |
| **Inputs** | One or more Slack URLs (channel/DM/thread) |
| **Outputs** | `thinking/slack-archaeology-YYYY-MM-DD.md` with sources, people table, unified timeline, key moments |
| **Behavior** | Reads every message — no summarization. Pages through channels. Reads sub-threads. |
| **Token cost** | High — designed to absorb the read cost in isolated context |
| **Related** | [[../brain/playbooks/Capture Incident]] |

### `people-profiler`

| | |
|---|---|
| **Purpose** | Bulk create/update person notes from Slack profiles |
| **Tools** | Read, Write, Edit, Bash, Grep, Glob |
| **Skills** | obsidian-markdown, qmd |
| **Invoked by** | `/incident-capture` |
| **Direct use** | When you need many person notes at once (after a meeting, channel scan, project kickoff) |
| **Inputs** | List of Slack user IDs, names, or both |
| **Outputs** | New person notes in `org/people/`, updated stale notes, updated `org/People & Context.md` |
| **Behavior** | Fetches profiles, checks vault, creates/updates, updates index |
| **Related** | [[../brain/playbooks/Onboard Person]] |

## Context Agents

### `context-loader`

| | |
|---|---|
| **Purpose** | Load all vault context for a single topic and produce a briefing |
| **Tools** | Read, Grep, Glob, Bash |
| **Skills** | obsidian-markdown, qmd |
| **Invoked by** | Direct |
| **Direct use** | When starting work on a specific person, project, incident, team, or concept |
| **Inputs** | The topic name |
| **Outputs** | Briefing presented directly to parent (NOT a file): primary note, status, timeline, connected notes, people, quotes, open items, competencies |
| **Behavior** | Synthesizes — does not dump |
| **Related** | [[../brain/Capabilities]] |

## Performance Agents

### `review-prep`

| | |
|---|---|
| **Purpose** | Aggregate all performance evidence for a review period |
| **Tools** | Read, Grep, Glob, Write, Bash |
| **Skills** | obsidian-cli, qmd |
| **Invoked by** | `/review-brief` |
| **Direct use** | Independently when starting review prep |
| **Inputs** | Review period (e.g. "H2 2024", "Q4 2024") |
| **Outputs** | `perf/<cycle>/Review Prep - <cycle>.md` with arc, top 5 impact, competency map, decisions, incidents, feedback, growth areas, doc trail |
| **Related** | [[../brain/Workflows#Build a Review Brief]] |

### `brag-spotter`

| | |
|---|---|
| **Purpose** | Find achievements not yet captured in brag doc |
| **Tools** | Read, Grep, Glob, Bash |
| **Skills** | obsidian-markdown, qmd |
| **Invoked by** | `/wrap-up`, `/weekly` |
| **Direct use** | Periodically during the quarter |
| **Inputs** | Period scope (current quarter by default; weekly scope when called from `/weekly`) |
| **Outputs** | Uncaptured wins list with impact, competency links, evidence; competency gaps; draft brag entries |
| **Behavior** | Does NOT modify brag doc — presents findings |
| **Related** | [[../brain/Workflows#Weekly Review]] |

### `review-fact-checker`

| | |
|---|---|
| **Purpose** | Verify every factual claim in a review draft against vault sources |
| **Tools** | Read, Grep, Glob, Bash |
| **Skills** | obsidian-markdown, qmd |
| **Invoked by** | `/self-review`, `/review-peer` (internally after drafting) |
| **Direct use** | Before sending any review-related document |
| **Inputs** | Path to a review draft file |
| **Outputs** | Structured report — verified / unverified / flagged claims, with fix suggestions |
| **Behavior** | Catches numbers, timelines, attributions, comparisons, characterizations, day-of-week claims |
| **Related** | [[../brain/Workflows#Build a Review Brief]] |

## Brain & Playbook Agents

### `memory-curator`

| | |
|---|---|
| **Purpose** | Curate `brain/` — detect stale claims, duplication, overgrowth, promotion candidates, link health, voice drift |
| **Tools** | Read, Grep, Glob, Bash |
| **Skills** | obsidian-markdown, qmd |
| **Invoked by** | Direct, or via `/remember` when brain curation is needed |
| **Direct use** | Periodically (weekly/monthly) or when `brain/` feels bloated |
| **Inputs** | None (full scan), specific file, or topic name |
| **Outputs** | Report at `thinking/memory-curation-YYYY-MM-DD.md`, top 5 findings to parent |
| **Behavior** | Does NOT modify files directly — reports only, parent applies fixes after user confirmation |
| **Related** | [[../brain/Memories]], [[../brain/playbooks/Promote Thinking]] |

### `playbook-generator`

| | |
|---|---|
| **Purpose** | Turn an observed pattern into a durable playbook in `brain/playbooks/` |
| **Tools** | Read, Write, Grep, Glob, Bash |
| **Skills** | obsidian-markdown |
| **Invoked by** | Direct — when user says "let's make this repeatable" or a task has been done 3+ times |
| **Direct use** | When a recurring workflow emerges during sessions |
| **Inputs** | Pattern description, thinking note, or recent work notes showing the pattern |
| **Outputs** | New `brain/playbooks/<name>.md`, updated `playbooks/README.md`, updated `brain/Capabilities.md` and `brain/Memories.md` |
| **Behavior** | Writes files directly (low-risk additive operation); follows strict playbook shape |
| **Related** | [[../brain/playbooks/README]] |

## Migration Agents

### `vault-migrator`

| | |
|---|---|
| **Purpose** | Classify, transform, and migrate content from a source vault into this vault |
| **Tools** | Read, Write, Edit, Grep, Glob, Bash |
| **Skills** | obsidian-markdown, qmd |
| **Invoked by** | `/vault-upgrade` |
| **Direct use** | Rare — usually via the command |
| **Inputs** | Mode A (classification): source vault path + unclassified files. Mode B (execution): source path + approved migration plan. |
| **Outputs** | Mode A: classification map. Mode B: migrated files in target. |
| **Behavior** | NEVER modifies source. Tiered classification with vault-shape detection (PARA, Zettelkasten, daily notes, flat). |
| **Related** | [[../brain/Workflows#Vault Upgrade]] |

## omc-Adapted Agents (17)

Imported from [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) on 2026-04-15. All prefixed `omc-`. Adaptations: renamed cross-refs, stripped `level:` frontmatter, redirected `.omc/` paths to `thinking/omc-*`, added provenance comment. See [[ohmyclaude-catalog]] for the full import history and decision rationale.

These agents are for **code/plan/analysis work**, not vault work. They do NOT know vault conventions — if you invoke them for vault tasks, brief them in the prompt about frontmatter, linking, and folder rules.

### `omc-analyst`

| | |
|---|---|
| **Purpose** | Pre-planning requirements gap analysis — missing questions, undefined guardrails, scope risks, unvalidated assumptions, missing acceptance criteria, edge cases |
| **Model** | Opus |
| **Tools** | Read-only (Write/Edit blocked) |
| **Best for** | Before planning a feature; before a review brief; any time "what are we even building?" is unclear |
| **Output** | Structured report (Missing Questions, Undefined Guardrails, Scope Risks, Unvalidated Assumptions, Missing Acceptance Criteria, Edge Cases, Open Questions) |

### `omc-architect`

| | |
|---|---|
| **Purpose** | Architecture review — principles, trade-offs, steelman counters, synthesis |
| **Model** | Opus |
| **Tools** | Read-only |
| **Best for** | Reviewing design decisions; pressure-testing an approach; identifying principle violations |

### `omc-code-reviewer`

| | |
|---|---|
| **Purpose** | Thorough multi-perspective code review (security, new-hire, ops angles) with gap analysis |
| **Model** | Opus |
| **Tools** | Read-only |
| **Best for** | Reviewing PRs or code changes beyond what a single pass catches |

### `omc-critic`

| | |
|---|---|
| **Purpose** | Final quality gate — plan/code/analysis review with pre-commitment, multi-perspective investigation, gap analysis, self-audit, realist check, and ADVERSARIAL escalation |
| **Model** | Opus |
| **Tools** | Read-only |
| **Best for** | Protecting against rubber-stamping; reviewing plans before execution; reviewing review drafts before sending |
| **Output** | VERDICT (REJECT / REVISE / ACCEPT-WITH-RESERVATIONS / ACCEPT) with evidence and fixes |

### `omc-debugger`

| | |
|---|---|
| **Purpose** | Structured debugging — reproduce, isolate, hypothesize, verify |
| **Best for** | Root-cause analysis when `omc-tracer` is too investigative |

### `omc-designer`

| | |
|---|---|
| **Purpose** | UX/UI design review and guidance |
| **Best for** | Visual/interaction design work (niche — use when designing UI) |

### `omc-document-specialist`

| | |
|---|---|
| **Purpose** | Documentation writing and external doc lookup |
| **Best for** | Writing technical docs; pulling info from external documentation sources |

### `omc-executor`

| | |
|---|---|
| **Purpose** | Implement a plan step-by-step with verification |
| **Best for** | Executing a detailed plan when you want an agent to do the work with safety rails |

### `omc-git-master`

| | |
|---|---|
| **Purpose** | Atomic git operations — commits, merges, tags, PRs, branch management |
| **Best for** | Complex git operations where you want careful history management |

### `omc-planner`

| | |
|---|---|
| **Purpose** | Work plan creation with testable acceptance criteria |
| **Best for** | Breaking down work into concrete steps with verifiable outcomes |
| **Note** | Complements Claude Code's built-in `Plan` agent — use whichever suits the task |

### `omc-qa-tester`

| | |
|---|---|
| **Purpose** | End-to-end QA testing with structured verdicts |
| **Best for** | Validating that a change meets acceptance criteria from the outside |

### `omc-scientist`

| | |
|---|---|
| **Purpose** | Hypothesis-driven analysis with measurable outcomes |
| **Best for** | "Why is this happening?" questions that need experimental framing |

### `omc-security-reviewer`

| | |
|---|---|
| **Purpose** | Security audit with threat modeling and evidence (OWASP Top 10, secrets, unsafe patterns) |
| **Best for** | Security review of code changes; pre-deploy security check |

### `omc-test-engineer`

| | |
|---|---|
| **Purpose** | Test design — unit, integration, e2e coverage planning; flaky test hardening; TDD workflows |
| **Best for** | Designing test strategy before writing tests |

### `omc-tracer`

| | |
|---|---|
| **Purpose** | Causal investigation — evidence-driven tracing with competing hypotheses, evidence for/against, uncertainty tracking |
| **Best for** | "What caused this?" when the answer isn't obvious and needs hypothesis-driven investigation |

### `omc-verifier`

| | |
|---|---|
| **Purpose** | Verify a claim or change actually worked — evidence-based completion checks, test adequacy |
| **Invoked by** | `/verify` (wraps this for general verification) |
| **Best for** | Closing the "done?" question with evidence |

### `omc-writer`

| | |
|---|---|
| **Purpose** | Writing assistance — prose, docs, technical content, comments |
| **Best for** | Drafting technical content when the vault-native `humanize` skill isn't enough |

## Cross-Reference Tables

### When to invoke directly vs via command

| Agent | Prefer command | Direct use case |
|-------|----------------|-----------------|
| `vault-librarian` | `/vault-audit` | "Just audit the people notes" |
| `cross-linker` | `/vault-audit`, `/connect` | "Find missing links in this one note" |
| `memory-curator` | Direct, or `/remember` | Weekly/monthly brain/ health check |
| `playbook-generator` | Direct | When a repeatable pattern emerges |
| `slack-archaeologist` | `/incident-capture` | Any non-incident Slack reconstruction |
| `people-profiler` | `/incident-capture` | Bulk person profiling outside an incident |
| `context-loader` | (always direct) | Topic briefing |
| `review-prep` | `/review-brief` | Mid-cycle evidence gathering |
| `brag-spotter` | `/wrap-up`, `/weekly` | Spot-check before a 1:1 |
| `review-fact-checker` | `/self-review`, `/review-peer`, `/verify` | Verify any draft, even non-review |
| `vault-migrator` | `/vault-upgrade` | (rare) |
| `omc-critic` | Direct | Adversarial review of any plan or draft |
| `omc-analyst` | Direct | Pre-planning gap analysis on new work |
| `omc-verifier` | `/verify` | General (non-review) claim verification |
| `omc-security-reviewer` | Direct | Security review of code changes |
| `omc-code-reviewer` | Direct | PR review beyond single-pass |
| `omc-tracer` | Direct | Causal investigation with competing hypotheses |
| other omc agents | Direct | Specialized code/plan/analysis tasks |

### Token budget per invocation

| Agent | Cost | Why |
|-------|------|-----|
| `slack-archaeologist` | High | Reads every Slack message |
| `vault-migrator` | High | Reads source vault end-to-end |
| `review-prep` | High | Reads broad swath of perf/ |
| `omc-critic` | High | Multi-phase investigation, reads every file reference |
| `omc-analyst` | High | Thorough gap analysis |
| `memory-curator` | Medium | Globs brain/ + targeted reads |
| `vault-librarian` | Medium | Globs + targeted reads |
| `people-profiler` | Medium | One Slack call per person |
| `cross-linker` | Medium | Globs + vault grep |
| `context-loader` | Medium | Targeted reads |
| `brag-spotter` | Medium | Period-scoped scans |
| `review-fact-checker` | Medium | Per-claim verification |
| `playbook-generator` | Low-Medium | Focused pattern extraction |
| other omc agents | Varies | Task-dependent |

## Vault-Native vs omc Decision Heuristic

| Task shape | Use |
|-----------|-----|
| Vault hygiene, linking, indexes | Vault-native (vault-librarian, cross-linker, memory-curator) |
| Capture from Slack/meetings | Vault-native (slack-archaeologist, people-profiler, context-loader) |
| Performance reviews | Vault-native (brag-spotter, review-prep, review-fact-checker) |
| Creating playbooks | Vault-native (playbook-generator) |
| Vault migration | Vault-native (vault-migrator) |
| Code review | omc-code-reviewer or omc-critic |
| Plan review / quality gate | omc-critic |
| Requirements analysis | omc-analyst |
| Architecture decisions | omc-architect |
| Debugging code | omc-debugger or omc-tracer |
| Security audit | omc-security-reviewer |
| Test design | omc-test-engineer or omc-qa-tester |
| Hypothesis-driven analysis | omc-scientist |
| Technical writing | omc-writer or omc-document-specialist |
| Git operations | omc-git-master |
| UX/UI design | omc-designer |
| Plan execution | omc-executor |

## Composition Notes

- **Agents have separate context windows.** They do NOT see the conversation. Their prompt must be self-contained.
- **Most agents write to disk**, not to chat. Read the file from main context after the agent finishes.
- **Sequential vs parallel**: When agents have independent inputs, launch in parallel. When one depends on another, sequence them.
- **Don't duplicate agent work.** If you delegated a search, don't also do it yourself in main context.
- **omc agents need briefing on vault conventions** if used for vault tasks (frontmatter, wikilinks, folder placement).

## Related

- [[command-reference]]
- [[vault-architecture]]
- [[ohmyclaude-catalog]] — import history for omc agents
- [[../brain/Capabilities]]
- [[../brain/Workflows]]
