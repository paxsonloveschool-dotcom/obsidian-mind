---
date: 2026-04-13
description: Playbook for structuring a 1:1 meeting capture with takeaways, action items, person backlinks, and quote preservation
tags: [brain, playbook]
type: brain
---

# Playbook: Capture 1:1

## Trigger

User says any of: "1:1", "1-on-1", "catch up with X", "sync with X", or runs `/capture-1on1`. Also fires when `classify-message.py` injects a 1:1 signal.

## Inputs

- The other person's name (full name preferred)
- Date of the meeting
- Notes/transcript/summary
- Any explicit action items or follow-ups

## Steps

1. **Resolve the person.** Check `org/people/<Name>.md`. If missing, create a stub note FIRST using the [[Onboard Person]] playbook.
2. **Create the 1:1 note** at `work/1-1/<Person> YYYY-MM-DD.md`. Filename is rigid — Bases queries depend on it.
3. **Frontmatter**:
   - `date:` meeting date (NOT today if backfilling)
   - `description:` "1:1 with <Person> — <topic>"
   - `quarter: Q<n>-YYYY`
   - `person: "<Full Name>"` (REQUIRED for People Directory base)
   - `tags: [1-1]`
4. **Sections** (based on Capture 1:1 template):
   - **Key Takeaways** — 2-5 bullets, the durable insights
   - **Action Items** — checkboxes, with owner if not me
   - **Quotes** — verbatim if memorable; quotes preserve voice in a way summaries don't
   - **What to Watch** — early signals, things to revisit
   - **Related** — wikilinks
5. **Linking** — REQUIRED:
   - Link to `[[org/people/<Person>]]`
   - Link to any project work notes discussed
   - Link to any teams discussed
   - Link to any people mentioned (transitively — name dropping creates backlink opportunities)
6. **Update the person note**: add a new row to their "Key Moments" or "Recent 1:1s" section pointing at this file.
7. **Don't mix contexts.** Project evidence → relevant work note. Review/career talk → review/perf folders. People dynamics → person note. Personal stuff → skip unless review-relevant.

## Outputs

- `work/1-1/<Person> YYYY-MM-DD.md`
- Updated `org/people/<Person>.md` (recent 1:1s section)
- Possibly updated work notes if project topics came up
- Possibly updated brag doc if wins were discussed

## Linking checklist

- [ ] Person note exists and is linked
- [ ] Person note has been updated to reference this 1:1
- [ ] Any project topics linked to their work notes
- [ ] Quarter is set in frontmatter

## Done when

- File exists with valid frontmatter (especially `person:` and `quarter:`)
- Person note backreferences this 1:1
- Action items are checkboxes (not paragraphs) so tasks tooling can find them
- No personal/private content captured unless review-relevant

## Anti-patterns

- Capturing the whole transcript verbatim — summarize. Quotes are for memorable lines only.
- Forgetting `person:` frontmatter — the People Directory base will miss it
- Mixing 1:1 content with project evidence — split into multiple notes
- Filename without date — breaks 1-1 History base sorting

## Related

- [[Onboard Person]]
- [[Create Work Note]]
- [[../Patterns]]
