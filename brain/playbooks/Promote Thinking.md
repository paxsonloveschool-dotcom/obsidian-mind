---
date: 2026-04-13
description: Playbook for promoting thinking notes into durable atomic notes — the discipline that prevents thinking/ from becoming a graveyard
tags: [brain, playbook]
type: brain
---

# Playbook: Promote Thinking

## Trigger

A thinking note in `thinking/` has reached a conclusion, OR it's been sitting unmodified for more than a few days, OR `/wrap-up` flagged it.

## The principle

**Thinking notes are scratchpads, not storage.** They exist to help reasoning happen. Once reasoning produces durable knowledge, the knowledge moves to its proper home and the scratchpad is deleted. A thinking/ folder full of stale drafts is a smell — it means the reasoning never completed or the output was never extracted.

## Inputs

- A thinking note that has reasoning worth extracting

## Steps

1. **Read the thinking note end to end.** Identify what's durable:
   - Decisions made → Decision Records
   - Patterns observed → `brain/Patterns.md`
   - Gotchas discovered → `brain/Gotchas.md`
   - Architecture insights → `reference/`
   - Project-specific learnings → the relevant work note
   - Memories worth keeping → the relevant `brain/` topic note
2. **Atomicity check**. A single thinking note often produces multiple atomic notes. Do NOT promote the whole thing to one monolith. Ask: "What are the distinct concepts here, and which folder is each one's home?"
3. **For each distinct concept**:
   - Find or create the destination note
   - Extract the relevant section
   - Polish the prose (thinking notes are rough; durable notes are tight)
   - Add wikilinks to context (including, if useful, a backlink to where this came from)
4. **Cross-link the promoted notes** to each other where they touch.
5. **Update indexes** for any new atomic notes:
   - `work/Index.md` for new work notes
   - `brain/Memories.md` if a new topic note was created
   - `org/People & Context.md` if person notes changed
6. **Delete the thinking note** with `git rm`. If the reasoning trail itself is unusually valuable (e.g., a multi-day investigation worth preserving), KEEP it but link it from the promoted notes — this should be rare.

## Outputs

- One or more polished atomic notes in their proper folders
- Updated indexes
- Deleted thinking note (or rare: kept and linked)

## Linking checklist

- [ ] Each promoted note has at least one wikilink (orphan = bug)
- [ ] Where a promoted note relates to others from the same thinking note, they cross-link
- [ ] Indexes reflect new content
- [ ] The thinking note is deleted or explicitly preserved with justification

## Done when

- All durable knowledge has a permanent home
- Folders are clean (no orphan thinking notes)
- The promoted notes pass validation hooks

## Anti-patterns

- **Promoting verbatim** — thinking is messy on purpose. Polish before promoting.
- **One thinking note → one giant new note** — usually wrong; split into atomic notes.
- **Keeping thinking notes "just in case"** — they accumulate and rot. If it's worth keeping, promote it. If not, delete it.
- **Skipping the index update** — orphans the promoted note from navigation.
- **Forgetting backlinks** — the promoted note should connect to what produced it where useful.

## Related

- [[Find Missing Links]]
- [[../Patterns]] (atomicity, graph-first)
- [[../../templates/Thinking Note]]
