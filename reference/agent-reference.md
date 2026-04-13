---
date: 2026-04-13
description: Quick lookup table for all 9 vault subagents — purpose, inputs, outputs, when to invoke directly vs via command
tags: [reference, agents, moc]
type: index
---

# Agent Reference

Quick-scan table for all subagents in `.claude/agents/`. These run in isolated context windows — their prompt must be self-contained.

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

## Cross-Reference Tables

### When to invoke directly vs via command

| Agent | Prefer command | Direct use case |
|-------|----------------|-----------------|
| `vault-librarian` | `/vault-audit` | "Just audit the people notes" |
| `cross-linker` | `/vault-audit`, `/connect` | "Find missing links in this one note" |
| `slack-archaeologist` | `/incident-capture` | Any non-incident Slack reconstruction |
| `people-profiler` | `/incident-capture` | Bulk person profiling outside an incident |
| `context-loader` | (always direct) | Topic briefing |
| `review-prep` | `/review-brief` | Mid-cycle evidence gathering |
| `brag-spotter` | `/wrap-up`, `/weekly` | Spot-check before a 1:1 |
| `review-fact-checker` | `/self-review`, `/review-peer` | Verify any draft, even non-review |
| `vault-migrator` | `/vault-upgrade` | (rare) |

### Token budget per invocation

| Agent | Cost | Why |
|-------|------|-----|
| `slack-archaeologist` | High | Reads every Slack message |
| `vault-migrator` | High | Reads source vault end-to-end |
| `review-prep` | High | Reads broad swath of perf/ |
| `vault-librarian` | Medium | Globs + targeted reads |
| `people-profiler` | Medium | One Slack call per person |
| `cross-linker` | Medium | Globs + vault grep |
| `context-loader` | Medium | Targeted reads |
| `brag-spotter` | Medium | Period-scoped scans |
| `review-fact-checker` | Medium | Per-claim verification |

## Composition Notes

- **Agents have separate context windows.** They do NOT see the conversation. Their prompt must be self-contained.
- **Most agents write to disk**, not to chat. Read the file from main context after the agent finishes.
- **Sequential vs parallel**: When agents have independent inputs, launch in parallel. When one depends on another, sequence them.
- **Don't duplicate agent work.** If you delegated a search, don't also do it yourself in main context.

## Related

- [[command-reference]]
- [[vault-architecture]]
- [[../brain/Capabilities]]
- [[../brain/Workflows]]
