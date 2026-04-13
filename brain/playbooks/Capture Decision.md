---
date: 2026-04-13
description: Playbook for capturing a decision into a Decision Record with proper context, alternatives, and bidirectional linking
tags: [brain, playbook]
type: brain
---

# Playbook: Capture Decision

## Trigger

User says any of: "we decided", "we're going with", "the call is", "let's go with", "decided to". Also fires when `classify-message.py` injects a DECISION signal.

## Inputs

- The decision itself (one sentence)
- The context that forced a choice
- At least one alternative considered (even if briefly)
- Stakeholders involved

## Steps

1. **Decide where it lives.** Active decisions live in `work/active/decisions/` or alongside the work note that produced them. Archived decisions move with their parent project.
2. **Use `templates/Decision Record.md`** — never freehand. Template encodes the schema.
3. **Frontmatter**:
   - `date:` today
   - `description:` "Decision: <one-sentence summary>"
   - `status: proposed` initially; flip to `accepted` once committed
   - `tags: [decision]`
4. **Fill the four sections**:
   - **Context** — what situation forced a choice
   - **Options Considered** — at least 2; for each, one-line trade-off
   - **Decision** — what was chosen + why (the rationale matters more than the choice)
   - **Consequences** — what now follows
5. **Bidirectional linking**:
   - Link FROM the decision TO the work note(s) that produced it
   - Link FROM those work notes TO this decision (in `## Related`)
   - If significant, add a row to `[[brain/Key Decisions]]`
6. **Update `work/Index.md` Decisions Log table** with: date | one-line decision | link.

## Outputs

- A Decision Record file
- Updated `work/Index.md` Decisions Log
- Possibly updated `brain/Key Decisions.md`
- Backlink added to parent work note

## Linking checklist

- [ ] Decision links to its parent work note(s)
- [ ] Parent work note(s) link back to this decision
- [ ] Listed in `work/Index.md` Decisions Log
- [ ] If architectural or strategic, listed in `brain/Key Decisions`

## Done when

- File exists with all four sections filled (no empty headings)
- Status is set (`proposed` or `accepted`)
- Bidirectional links exist
- Index table updated

## Anti-patterns

- Decisions without alternatives — the rationale is meaningless if you didn't consider anything else
- Decisions without consequences — what does this make true tomorrow?
- One-way links — a decision floating above its work note is hard to discover
- Decisions buried inside work notes — promote them to first-class records

## Related

- [[Create Work Note]]
- [[../Key Decisions]]
- [[../Patterns]] (decisions are concept nodes — they receive backlinks)
- [[../../templates/Decision Record]]
