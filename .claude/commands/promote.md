---
description: "Promote a thinking note's findings into durable atomic notes — extract durable knowledge, place it in proper folders, link it, then delete the scratchpad."
---

# Promote Thinking Note

Take a thinking note that has reached useful conclusions and promote its durable knowledge into the right folders as atomic notes. Then delete the thinking note.

## Usage

```
/promote <thinking-note-name>
/promote                          # if omitted, list candidate thinking notes
```

Examples:
- `/promote 2026-04-13-auth-investigation`
- `/promote weekly-2026-04-12`

## The principle

Thinking notes are scratchpads, not storage. They exist to help reasoning happen. Once reasoning produces durable knowledge, the knowledge moves to its proper home and the scratchpad is deleted. A `thinking/` folder full of stale drafts is a smell — it means reasoning never completed or output was never extracted.

## Workflow

### 1. Resolve the Target

If `$ARGUMENTS` is provided, treat it as a thinking note name:
- Try `thinking/<name>.md`
- Try `thinking/<name>` as a partial match (glob `thinking/*<name>*.md`)
- If multiple match, ask user which

If `$ARGUMENTS` is empty, list all files in `thinking/` (excluding `session-logs/` and `README.md`) and ask user which to promote.

### 2. Read the Thinking Note End-to-End

Read the full file. Identify what's durable:

| Durable content | Destination |
|-----------------|-------------|
| Decisions made | `work/<context>/decisions/` or alongside parent work note as a Decision Record |
| Patterns observed | append to `brain/Patterns.md` |
| Gotchas discovered | append to `brain/Gotchas.md` |
| Architecture insights | new note in `reference/` |
| Project-specific learnings | append to or create the relevant work note |
| New procedures | new playbook in `brain/playbooks/` |
| Memories worth keeping | the relevant `brain/` topic note |
| Person dynamics / context | the relevant `org/people/<Name>.md` |
| Wins / achievements | row in `perf/Brag Doc.md` |

### 3. Atomicity Check

A single thinking note often produces MULTIPLE atomic notes. Do NOT promote to one monolith. Ask: "What are the distinct concepts here, and which folder is each one's home?"

If the thinking note contains 3+ unrelated topics, plan to produce 3+ promoted notes.

### 4. Polish Before Promoting

Thinking notes are rough on purpose. Promoted notes are tight. Before writing each destination:
- Strip exploratory language ("maybe", "I wonder if")
- Cut detours that didn't lead anywhere
- Tighten prose — durable notes are denser than scratch
- Add proper section headings

### 5. Write the Promoted Notes

For each destination:
- Use the right template if the target type has one
- Fill frontmatter per the type's contract (see [[reference/vault-architecture#Frontmatter Contracts]])
- Add wikilinks to context — at minimum link back to anything that produced the insight
- Pass the validate hook silently

### 6. Cross-Link the Promoted Notes

If multiple promoted notes came from the same thinking note and they touch each other, add wikilinks between them.

### 7. Update Indexes

For each new note created:
- New work note → `work/Index.md`
- New playbook → `brain/playbooks/README.md`
- New brain topic note → `brain/Memories.md`
- New person note → `org/People & Context.md`
- New decision → `work/Index.md` Decisions Log + possibly `brain/Key Decisions.md`
- New brag entry → already in `perf/Brag Doc.md` from step 2

### 8. Delete the Thinking Note

```bash
git rm "thinking/<name>.md"
```

EXCEPTION: If the reasoning trail itself is unusually valuable (e.g., a multi-day investigation that future-you will want to re-read), KEEP the thinking note BUT add wikilinks from the promoted notes back to it. This should be rare — most thinking notes have done their job once knowledge is extracted.

### 9. Report

Summarize:
- **Promoted to**: list of new/updated notes with paths
- **Indexes updated**: which indexes changed
- **Thinking note**: deleted, OR kept and linked from N notes
- **Cross-links added**: between promoted notes

## Important

- **Atomic notes beat monoliths.** One thinking note → multiple promoted notes is normal.
- **Polish is mandatory.** Promoting verbatim wastes the work you did.
- **Wikilinks are not optional.** Every promoted note must link to context.
- **Do NOT delete without promoting.** If nothing was worth promoting, ask the user first.
- **Validate after each write** — let the PostToolUse hook catch frontmatter and link issues.

## Related

- [[../../brain/playbooks/Promote Thinking]]
- [[../../brain/Patterns]] (atomicity, graph-first)
- [[../../templates/Thinking Note]]

Content to promote:
$ARGUMENTS
