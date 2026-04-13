---
date: 2026-04-13
description: Playbook for creating a new work note — frontmatter, placement, linking, and index updates required for a non-orphan node
tags: [brain, playbook]
type: brain
---

# Playbook: Create Work Note

## Trigger

User says any of: "start a project", "create a work note for X", "I'm working on Y", "let's track X". Or `/dump` classified content as project work.

## Inputs

- A project/topic title
- At least one sentence of context
- Optional: people involved, team(s), quarter

## Steps

1. **Pick the location.** Active project → `work/active/<Title>.md`. If it's a one-off note about completed work, go straight to `work/archive/YYYY/`.
2. **Read the template** — `templates/Work Note.md`. Never write a work note from scratch; the template's frontmatter is the schema contract.
3. **Fill frontmatter precisely**:
   - `date: YYYY-MM-DD` (use today)
   - `description:` ~150 chars, one sentence summarizing the note
   - `project:` short slug (e.g. `auth-refactor`)
   - `status: active`
   - `quarter: Q<n>-YYYY` (REQUIRED by Work Dashboard base — work notes without this are invisible)
   - `tags: [work-note, ...optional team/project tags]`
4. **Write the body** using the template sections: Context, Notes, Action Items, Related.
5. **Add wikilinks** before saving. At minimum link to:
   - `[[work/Index]]`
   - Any `[[org/people/<person>]]` involved
   - Any `[[org/teams/<team>]]` involved
   - Any `[[perf/competencies/<competency>]]` demonstrated (in `## Related`)
   - Any related decisions or prior work notes
6. **Update `work/Index.md`** — add a row to Active Projects or Recent Notes.
7. **Run validate-write check** — the PostToolUse hook will warn if frontmatter or links are missing. Fix any warnings before moving on.

## Outputs

- `work/active/<Title>.md` (or archive equivalent)
- Updated `work/Index.md`

## Linking checklist

- [ ] At least one wikilink in body (orphan = bug)
- [ ] Listed in `work/Index.md`
- [ ] Each linked person/team note exists (create stub if not)
- [ ] If decision-bearing, linked from `[[brain/Key Decisions]]`

## Done when

- File exists with valid frontmatter
- `work/Index.md` reflects it
- Hook validation passes silently
- Any people/teams referenced have notes (or stubs)

## Common mistakes

- Forgetting `quarter:` — note is invisible in Work Dashboard
- Leaving description blank — fails validation
- Writing in `work/` root instead of `work/active/`
- Not linking to people involved
- Creating a monolith — if 3+ unrelated sections, split into atomic notes

## Related

- [[Capture Decision]]
- [[Archive Project]]
- [[../Patterns]] (atomicity, evidence vs concept nodes)
- [[../../templates/Work Note]]
