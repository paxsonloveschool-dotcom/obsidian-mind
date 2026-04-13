---
date: 2026-04-13
description: Quick lookup table for all 17 slash commands — purpose, usage, subagents invoked, when to use, related playbooks
tags: [reference, commands, moc]
type: index
---

# Command Reference

Quick-scan table for all slash commands in `.claude/commands/`. For full command bodies, read the file directly.

## Daily Workflow Commands

### `/standup`

| | |
|---|---|
| **Purpose** | Morning kickoff — load context, review yesterday, surface tasks, identify priorities |
| **Usage** | `/standup` |
| **Subagents** | None |
| **When to use** | Start of any substantive session |
| **Outputs** | A structured summary (Yesterday, Active Work, Open Tasks, Alignment, Suggested Focus) |
| **Related** | [[../brain/Workflows#Morning Kickoff]] |

### `/dump`

| | |
|---|---|
| **Purpose** | Freeform capture — auto-classify content and route to right notes |
| **Usage** | `/dump <freeform text>` |
| **Subagents** | None directly (drives playbooks) |
| **When to use** | When you have unstructured info to capture (Slack snippets, conversations, thoughts) |
| **Outputs** | Multiple notes created/updated across vault, summary of what went where |
| **Related** | [[../brain/playbooks/README]] (drives multiple playbooks) |

### `/wrap-up`

| | |
|---|---|
| **Purpose** | Full session review — verify notes, indexes, links, suggest improvements |
| **Usage** | `/wrap-up` (or just say "wrap up") |
| **Subagents** | `brag-spotter` |
| **When to use** | End of every substantive session |
| **Outputs** | Done/Fixed/Flagged/Suggested summary |
| **Related** | [[../brain/Workflows#End of Day Wrap]] |

## Capture Commands

### `/capture-1on1`

| | |
|---|---|
| **Purpose** | Structure 1:1 transcript or notes into a vault note |
| **Usage** | `/capture-1on1 <participant>` then paste content |
| **Subagents** | None |
| **When to use** | After a 1:1 meeting |
| **Outputs** | `work/1-1/<Person> YYYY-MM-DD.md`, updated person note |
| **Related** | [[../brain/playbooks/Capture 1-1]] |

### `/incident-capture`

| | |
|---|---|
| **Purpose** | Capture incident from Slack into structured notes (main + RCA + deep dive) |
| **Usage** | `/incident-capture <slack-urls>` |
| **Subagents** | `slack-archaeologist`, `people-profiler` (parallel) |
| **When to use** | An incident needs to be documented |
| **Outputs** | 1-3 incident notes, person notes for participants, brag doc entry |
| **Related** | [[../brain/playbooks/Capture Incident]] |

### `/slack-scan`

| | |
|---|---|
| **Purpose** | Deep scan Slack channels/DMs for evidence about a person or project |
| **Usage** | `/slack-scan <target> [channels...] [date-range]` |
| **Subagents** | None (manual Slack reads) |
| **When to use** | Gathering evidence for review prep, project documentation, or fact-checking |
| **Outputs** | Organized timeline by date, separated by context type |
| **Related** | [[../brain/Workflows#Build a Review Brief]] |

## Performance Commands

### `/peer-scan`

| | |
|---|---|
| **Purpose** | Deep scan a peer's GitHub PRs for review preparation |
| **Usage** | `/peer-scan <name> <github-username> <repo> [period]` |
| **Subagents** | None (uses `gh` CLI) |
| **When to use** | Before writing a peer review, or when prepping evidence |
| **Outputs** | `perf/evidence/<Name> PRs - <Period>.md` with structured analysis |
| **Related** | [[../brain/Workflows#Peer Review for Someone Else]] |

### `/review-brief`

| | |
|---|---|
| **Purpose** | Generate review brief — manager or peer version |
| **Usage** | `/review-brief <audience> [period]` |
| **Subagents** | `review-prep` |
| **When to use** | At review cycle, when assembling context for manager or peers |
| **Outputs** | Markdown + HTML + PDF in `perf/<cycle>/` |
| **Related** | [[../brain/Workflows#Build a Review Brief]] |

### `/self-review`

| | |
|---|---|
| **Purpose** | Write self-assessment for company review tool |
| **Usage** | `/self-review [cycle]` |
| **Subagents** | None directly; calls `review-fact-checker` after drafting |
| **When to use** | At review cycle, when drafting your own assessment |
| **Outputs** | `thinking/review-drafts.md` then promoted to `perf/<cycle>/Self-Review.md` |
| **Related** | [[../brain/Workflows#Write Self-Review]] |

### `/review-peer`

| | |
|---|---|
| **Purpose** | Write a peer review for a colleague |
| **Usage** | `/review-peer <Name>` |
| **Subagents** | None directly; calls `review-fact-checker` after drafting |
| **When to use** | When writing peer reviews at cycle |
| **Outputs** | `thinking/<name>-peer-review.md` then promoted to `perf/<cycle>/Peer Review - <Name>.md` |
| **Related** | [[../brain/Workflows#Peer Review for Someone Else]] |

### `/humanize`

| | |
|---|---|
| **Purpose** | Voice-calibrate AI-drafted text to match your own writing |
| **Usage** | `/humanize <file path or note name>` |
| **Subagents** | None |
| **When to use** | After drafting reviews, briefs, or anything where voice matters |
| **Outputs** | Edited file in place, summary of changes |
| **Related** | [[../brain/Patterns]] (voice as a constraint) |

## Vault Maintenance Commands

### `/vault-audit`

| | |
|---|---|
| **Purpose** | Deep structural audit — orphans, broken links, frontmatter, indexes, Bases |
| **Usage** | `/vault-audit` |
| **Subagents** | `vault-librarian`, `cross-linker` (sequential) |
| **When to use** | After heavy capture, after reorganization, periodically |
| **Outputs** | Audit report in `thinking/`, fixes applied across vault |
| **Related** | [[../brain/playbooks/Run Vault Audit]] |

### `/vault-upgrade`

| | |
|---|---|
| **Purpose** | Import content from another vault into this instance |
| **Usage** | `/vault-upgrade <path>` or `/vault-upgrade <path> --dry-run` |
| **Subagents** | `vault-migrator` (classify mode then execute mode) |
| **When to use** | Migrating from older obsidian-mind versions or arbitrary vaults |
| **Outputs** | Migrated content + post-migration audit |
| **Related** | [[../brain/Workflows#Vault Upgrade]] |

### `/project-archive`

| | |
|---|---|
| **Purpose** | Move completed project from `work/active/` to `work/archive/YYYY/` |
| **Usage** | `/project-archive <project name>` |
| **Subagents** | None |
| **When to use** | When a project is done |
| **Outputs** | File moved, frontmatter flipped, indexes updated |
| **Related** | [[../brain/playbooks/Archive Project]] |

### `/weekly`

| | |
|---|---|
| **Purpose** | Cross-session synthesis — patterns, alignment, uncaptured wins |
| **Usage** | `/weekly` |
| **Subagents** | `brag-spotter` |
| **When to use** | Weekly review (typically Friday or Monday) |
| **Outputs** | Synthesis presented in chat (file optional) |
| **Related** | [[../brain/Workflows#Weekly Review]] |

## Knowledge Promotion Commands

### `/promote`

| | |
|---|---|
| **Purpose** | Promote a thinking note's findings into durable atomic notes |
| **Usage** | `/promote <thinking-note-name>` |
| **Subagents** | None |
| **When to use** | When a thinking note has reached useful conclusions |
| **Outputs** | Atomic notes in proper folders, updated indexes, deleted thinking note |
| **Related** | [[../brain/playbooks/Promote Thinking]] |

### `/connect`

| | |
|---|---|
| **Purpose** | Find missing wikilinks in active context |
| **Usage** | `/connect [note-name or "recent" or "all"]` |
| **Subagents** | `cross-linker` |
| **When to use** | After creating notes, before wrap-up, or when a note feels orphaned |
| **Outputs** | List of suggested links, optional auto-apply |
| **Related** | [[../brain/playbooks/Find Missing Links]] |

## Cross-Reference Tables

### Commands by phase

| Phase | Commands |
|-------|----------|
| Daily | `/standup`, `/dump`, `/wrap-up` |
| Capture | `/capture-1on1`, `/incident-capture`, `/slack-scan`, `/dump` |
| Performance | `/peer-scan`, `/review-brief`, `/self-review`, `/review-peer`, `/humanize` |
| Maintenance | `/vault-audit`, `/vault-upgrade`, `/project-archive`, `/weekly` |
| Promotion | `/promote`, `/connect` |

### Commands by subagent invoked

| Subagent | Commands |
|----------|----------|
| `slack-archaeologist` | `/incident-capture` |
| `people-profiler` | `/incident-capture` |
| `vault-librarian` | `/vault-audit` |
| `cross-linker` | `/vault-audit`, `/connect` |
| `review-prep` | `/review-brief` |
| `brag-spotter` | `/wrap-up`, `/weekly` |
| `vault-migrator` | `/vault-upgrade` |
| `review-fact-checker` | `/self-review`, `/review-peer` (called internally) |

## Related

- [[agent-reference]]
- [[vault-architecture]]
- [[../brain/Workflows]]
- [[../brain/Capabilities]]
- [[../brain/playbooks/README]]
