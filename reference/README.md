---
date: 2026-04-15
description: Index for reference/ — structural knowledge, codebase docs, architecture maps, and meta-reference about the vault itself
tags: [reference, index, moc]
type: index
---

# Reference

Structural knowledge that doesn't belong in `brain/` (operational memory) or `work/` (evidence). Reference notes are *long-lived* and *definitional* — they describe how something works, not what happened or what was decided.

## What Lives Here

| Kind | Purpose | Examples |
|------|---------|----------|
| **Meta reference** | How the vault itself works | [[vault-architecture]], [[command-reference]], [[agent-reference]] |
| **Codebase docs** | How a project or service works | Architecture diagrams, data flow, module maps, API shape |
| **External reference** | Cached knowledge from outside sources | Company framework docs, org charts, runbooks |

## Meta Reference (this vault)

| Note | Contents |
|------|----------|
| [[vault-architecture]] | Folder roles, frontmatter contracts, dataflow, hooks pipeline |
| [[command-reference]] | Quick-lookup table for all slash commands |
| [[agent-reference]] | Quick-lookup table for all subagents |

## Codebase Reference

*Add project-specific reference notes here when you're actively working on code. Each project gets one or more atomic notes.*

Suggested naming: `<project>-<topic>.md`

Examples of what to write:
- `<project>-architecture.md` — high-level structure, module map
- `<project>-data-flow.md` — how data moves through the system
- `<project>-gotchas.md` — project-specific pitfalls (vs vault-wide in `brain/Gotchas.md`)
- `<project>-decisions.md` — ADR-style decision log (or link to individual Decision Records)
- `<project>-runbook.md` — operational procedures

Use [[codebase-doc-template]] as a starting point.

## External Reference

*Cache external documents here when you repeatedly need them and don't want to re-fetch.*

Examples:
- Company performance framework
- Incident severity definitions
- Release process
- Style guide

## How to Write a Reference Note

1. **Start from the template**: copy [[codebase-doc-template]] or write from scratch using the shape below
2. **Frontmatter**:
   ```yaml
   date: YYYY-MM-DD
   description: <~150 chars>
   project: <slug>       # if codebase-scoped
   tags: [reference, <type>]
   ```
3. **Sections** (codebase doc):
   - **Purpose** — what the thing is and why it exists
   - **Shape** — high-level structure (diagram, module list, entry points)
   - **Key concepts** — vocabulary to understand the rest
   - **Dataflow** — how state moves through the system
   - **Operational notes** — how to run, deploy, debug
   - **Related** — wikilinks to work notes, decisions, people, other references
4. **Link from work notes that use this reference** — the reference is a concept node; evidence links to it.
5. **Keep it current** — unlike a work note (immutable once archived), a reference note is edited as the underlying thing changes.

## Conventions

- **Reference notes are concept nodes.** They receive inbound links; keep them clean.
- **No personal narrative.** Reference notes describe how things are, not how you felt about working on them.
- **Diagrams go in the note.** Use ASCII boxes, mermaid, or embed image files from a `reference/assets/` folder.
- **Atomic over monolithic.** A 5000-word reference note is a smell — split into linked atoms.
- **Update in place**, don't version. If something changes, edit the note. History lives in git.

## Related

- [[vault-architecture]]
- [[../brain/Capabilities]]
- [[../brain/Patterns]]
- [[codebase-doc-template]]
