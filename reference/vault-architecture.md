---
date: 2026-04-13
description: Meta documentation of the obsidian-mind vault — folder roles, frontmatter contracts, dataflow between commands and agents and bases
tags: [reference, architecture, moc]
type: index
---

# Vault Architecture

The structural map of the obsidian-mind vault. Read this when you need to understand how the pieces fit, not how to do a specific task (which is what [[../brain/Workflows]] and [[../brain/playbooks/README|playbooks]] are for).

## High-Level Layout

```
obsidian-mind/
├── Home.md                  # Vault entry point with embedded base views
├── CLAUDE.md                # Project instructions for Claude (auto-loaded)
├── vault-manifest.json      # Template/version metadata for /vault-upgrade
├── CHANGELOG.md             # Template release history
├── README.md                # Public README
├── bases/                   # Centralized .base files (dynamic views)
├── brain/                   # Claude's operational memory + playbooks
│   └── playbooks/           # Step-by-step procedures
├── work/                    # Project work
│   ├── active/              # Currently working on (1-3 things)
│   ├── archive/YYYY/        # Completed work by year
│   ├── incidents/           # Outage / postmortem notes
│   └── 1-1/                 # 1:1 meeting notes
├── perf/                    # Performance framework
│   ├── brag/                # Quarterly brag notes
│   ├── competencies/        # Atomic competency notes
│   ├── evidence/            # PR scans, data extracts
│   └── h?-YYYY/             # Review cycles (h1-2026, h2-2026, etc.)
├── org/                     # Org knowledge
│   ├── people/              # Atomic person notes
│   └── teams/               # Team notes
├── reference/               # Codebase + meta reference (this folder)
├── thinking/                # Scratchpad — promote then delete
├── templates/               # Note templates
└── .claude/                 # Claude Code configuration
    ├── commands/            # 15 slash commands
    ├── agents/              # 9 subagents
    ├── scripts/             # Hook scripts
    ├── settings.json        # Hook configuration
    └── skills/              # Skills (obsidian, qmd, defuddle, etc.)
```

## Folder Roles

| Folder | Role | Owner |
|--------|------|-------|
| `Home.md` | Navigation entrypoint | User |
| `bases/` | Dynamic views over the vault | Infrastructure |
| `brain/` | Claude's operational memory | Claude + User |
| `brain/playbooks/` | Repeatable procedures | Claude |
| `work/active/` | Things in flight | User + Claude |
| `work/archive/YYYY/` | Completed projects | User + Claude |
| `work/incidents/` | Incident records | Claude (often via /incident-capture) |
| `work/1-1/` | 1:1 meeting notes | Claude (often via /capture-1on1) |
| `perf/brag/` | Quarterly wins | User + Claude |
| `perf/competencies/` | Competency definitions | Infrastructure (clean concept nodes) |
| `perf/evidence/` | Evidence files (PRs, data) | Claude (often via /peer-scan) |
| `perf/h?-YYYY/` | Review cycle artifacts | Claude (often via /review-brief) |
| `org/people/` | Person notes | Claude (via people-profiler or playbook) |
| `org/teams/` | Team notes | Claude + User |
| `reference/` | Codebase + meta knowledge | Claude (often by reading code) |
| `thinking/` | Scratchpad | Claude (must promote and delete) |
| `templates/` | Note schemas | Infrastructure |
| `.claude/` | Tool configuration | Infrastructure |

## Frontmatter Contracts

Required fields by note type. Missing fields cause Bases queries to silently drop the note.

### Global (all notes)

```yaml
date: YYYY-MM-DD
description: <~150 chars>
tags: [<type>, ...]
```

### work-note

```yaml
date: YYYY-MM-DD
description: ...
project: <slug>
status: active | paused | completed
quarter: Q<n>-YYYY    # REQUIRED for Work Dashboard base
tags: [work-note]
```

### incident

```yaml
date: YYYY-MM-DD       # detection date
description: ...
quarter: Q<n>-YYYY
ticket: <TICKET-123>   # REQUIRED for Incidents base
severity: low | medium | high | critical
role: incident-lead | IC | observer | on-call
status: resolved | active | postmortem-pending
tags: [incident]
```

### 1-1

```yaml
date: YYYY-MM-DD       # meeting date, not today
description: ...
quarter: Q<n>-YYYY
person: "Full Name"    # REQUIRED for 1-1 History base
tags: [1-1]
```

### person

```yaml
date: YYYY-MM-DD
description: ...
title: <role or "unknown">
team: <team or empty>
tags: [person]
```

### decision

```yaml
date: YYYY-MM-DD
description: ...
status: proposed | accepted | deprecated
tags: [decision]
```

### competency

```yaml
date: YYYY-MM-DD
description: ...
tags: [competency]
```

## Dataflow: How the Pieces Talk

### Capture → Note → Index → Base → Dashboard

```
User input (Slack, conversation, transcript)
        ↓
[/dump or /capture-1on1 or /incident-capture]
        ↓
Subagent (slack-archaeologist, people-profiler) writes intermediate file
        ↓
Playbook structures the durable note
        ↓
Note file written with frontmatter contract
        ↓
PostToolUse hook validates frontmatter and wikilinks
        ↓
Index file updated (work/Index.md, People & Context, Brag Doc)
        ↓
Base query picks up the note via frontmatter
        ↓
Dashboard view in Home.md or relevant base file shows it
```

### Performance: Evidence → Review Brief → Self-Review

```
Daily work → work notes (with competency links)
        ↓
Wins → Brag Doc entries
        ↓
PR scans → perf/evidence/<Person> PRs - <Period>.md
        ↓
[/review-brief]
        ↓
review-prep agent aggregates everything
        ↓
perf/<cycle>/<Cycle> Review Brief.md
        ↓
[/self-review or /review-peer]
        ↓
Draft + review-fact-checker + /humanize
        ↓
Final review document
```

### Maintenance: Audit → Fix → Memory

```
[/vault-audit]
        ↓
vault-librarian writes report to thinking/
        ↓
Read report
        ↓
Triage (auto-fix, ask-then-fix, defer)
        ↓
Apply fixes (cross-linker for missing links, etc.)
        ↓
Update brain/Gotchas if recurring issue surfaced
        ↓
Delete thinking note
```

## Hooks Pipeline

| Hook | Script | Effect |
|------|--------|--------|
| SessionStart | `.claude/scripts/session-start.sh` | Inject North Star + active work + recent changes + tasks + file listing |
| UserPromptSubmit | `.claude/scripts/classify-message.py` | Match user input against signal patterns, inject routing hints |
| PostToolUse (Write/Edit/MultiEdit) | `.claude/scripts/validate-write.py` | Check frontmatter has date/description/tags, check for wikilinks |
| PreCompact | `.claude/scripts/pre-compact.sh` | Backup session transcript to thinking/session-logs/ |
| Stop | inline echo | Print session-end checklist |

## Bases (the dynamic layer)

7 `.base` files in `bases/`. Each renders as a queryable view.

| Base | Filter source | Surface |
|------|---------------|---------|
| `Work Dashboard` | `work/**` filtered by `quarter`, `status` | Active/recent work by quarter |
| `Incidents` | `work/incidents/**` filtered by `severity`, `role`, `quarter` | Incident catalog |
| `People Directory` | `org/people/**` | All people with title/team |
| `1-1 History` | `work/1-1/**` filtered by `person`, `date` | Meeting timeline by person |
| `Review Evidence` | `perf/**` filtered by `cycle`, `person` | Review materials |
| `Competency Map` | `perf/competencies/**` with backlink count | Competencies and their evidence |
| `Templates` | `templates/**` | All templates |

Bases are filterable, sortable, and embeddable in markdown notes via `![[<base>]]`.

## What's Auto-Loaded vs On-Demand

| Auto-loaded at session start | On-demand |
|------------------------------|-----------|
| `CLAUDE.md` | Everything else |
| `brain/North Star.md` (via hook) | `brain/` topic notes |
| `work/Index.md` (via hook) | Individual work notes |
| `brain/Memories.md` (via hook) | `org/` people and teams |
| Recent git changes (via hook) | `perf/` content |
| Open tasks (via hook) | `reference/` |
| File listing (via hook) | `thinking/` |

This is the token budget. Anything not in the auto-loaded column costs context to read.

## Version Compatibility

The vault is at template version 3.3.0 per `vault-manifest.json`. Version fingerprints in the manifest let `/vault-upgrade` identify which version a source vault is on and migrate accordingly.

| Version | Marker | Adds |
|---------|--------|------|
| v1 | `claude/Memories.md` | Original memory file |
| v2 | `brain/`, `bases/`, `Home.md` | Brain folder + bases |
| v3.0 | `.claude/agents/`, `.claude/scripts/` | Subagents + hooks |
| v3.1 | `review-fact-checker.md` | Fact-checking agent |
| v3.2 | `humanize.md`, `weekly.md` | Voice + synthesis commands |
| v3.3 | `vault-manifest.json` | Manifest for migration |

## Related

- [[command-reference]]
- [[agent-reference]]
- [[../brain/Capabilities]]
- [[../brain/Workflows]]
- [[../brain/Patterns]]
- [[../CLAUDE]]
