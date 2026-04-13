---
date: 2026-04-13
description: Playbook for archiving a completed project — git mv, status flip, brag doc capture, competency evidence linking
tags: [brain, playbook]
type: brain
---

# Playbook: Archive Project

## Trigger

A project in `work/active/` is complete. User says "archive X", "we shipped X", "X is done", or runs `/project-archive`.

## The principle

`work/active/` should hold 1-3 things at any time. Anything finished moves to `work/archive/YYYY/`. Archiving is not just file movement — it's a knowledge transfer ritual that captures what the project demonstrated.

## Inputs

- The project to archive (work note path)
- Confirmation it's actually done (vs paused)

## Steps

1. **Verify completion.** Read the work note. If it's paused, not done, leave it in `active/` and update status to `paused` instead.
2. **Move with `git mv`** — never `mv` and re-add. Git history matters.
   ```bash
   git mv "work/active/<Project>.md" "work/archive/2026/<Project>.md"
   ```
3. **Flip frontmatter**:
   - `status: completed` (was `active`)
   - Add `completed_date: YYYY-MM-DD`
   - Keep `quarter:` as the quarter the project STARTED, not when it ended
4. **Update `work/Index.md`**:
   - Remove from Active Projects table
   - Add to Recent Notes (with new path)
5. **Capture wins to brag doc** — this is the most-skipped step:
   - Open `perf/Brag Doc.md`
   - Add a row under the right category (Impact, Technical Growth, Collaboration, Feedback)
   - Each entry has: date, one-line achievement, link to `[[work/archive/2026/<Project>]]`
6. **Tag competencies** — if the project demonstrated specific competencies:
   - In the work note's `## Related`, link to `[[perf/competencies/<Competency>]]`
   - The competency note will receive these as backlinks (don't edit it directly)
7. **Update people backlinks** — if collaborators have notes, add a row to their "Key Moments" or "Worked With" pointing to the archived project.
8. **Decision records** — any decisions inside the project travel with it. If they were standalone files, `git mv` them too.
9. **Optional: add to memory** — if the project produced reusable patterns or gotchas, append to the relevant `brain/` topic note BEFORE archiving (the work note is no longer the surface for new lessons).

## Outputs

- File moved to `work/archive/YYYY/`
- Updated frontmatter (`status`, `completed_date`)
- Updated `work/Index.md`
- Updated `perf/Brag Doc.md`
- Updated person notes for collaborators
- Possibly updated `brain/Patterns.md` or `brain/Gotchas.md`

## Linking checklist

- [ ] Old links to `work/active/<Project>` still work (Obsidian wikilinks resolve by name, so they should)
- [ ] If anything used full path links, update them
- [ ] Brag doc entry exists and links to the archived note
- [ ] Competency backlinks exist
- [ ] Person notes reflect the collaboration

## Done when

- File is in `work/archive/YYYY/`
- Status is `completed`
- Brag doc reflects it
- Index is clean
- All linked entities updated

## Anti-patterns

- Using `mv` instead of `git mv` — loses history
- Forgetting to update brag doc — archiving a real project without claiming the win is malpractice
- Forgetting to flip status — Bases queries depend on it
- Archiving an "almost done" project — finish or pause, don't archive
- Leaving stale `[[work/active/<Project>]]` paths in other notes — wikilinks resolve by name so usually fine, but explicit paths break

## Related

- [[Create Work Note]]
- [[../Patterns]] (the archive ritual)
- [[../../.claude/commands/project-archive]]
