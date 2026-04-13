---
date: 2026-04-13
description: Playbook for capturing an incident with timeline, root cause, impact, and the dual-note structure (main + RCA + deep dive)
tags: [brain, playbook]
type: brain
---

# Playbook: Capture Incident

## Trigger

User says any of: "incident", "outage", "down", "P0/P1/P2", "sev1/sev2", "postmortem", "RCA", or runs `/incident-capture`. Also fires when `classify-message.py` injects an INCIDENT signal.

## Inputs

- Ticket number (Jira, Linear, etc.)
- Severity (sev1, sev2, etc.)
- Date detected, date resolved
- The user's role (incident-lead, IC, observer, on-call)
- Source material (Slack channel/DM URLs, alert pages, dashboards)

## Steps

1. **Decide on the structure.** A serious incident gets THREE notes:
   - **Main note** — `work/incidents/<TICKET>.md` — high-level summary, links to everything
   - **RCA note** — `work/incidents/<TICKET> RCA.md` — root cause analysis, technical depth
   - **Deep dive** — `work/incidents/<TICKET> deep dive.md` — full timeline, message-by-message reconstruction
   - For minor incidents, just the main note is fine.
2. **If Slack reconstruction needed**, invoke `slack-archaeologist` agent FIRST. It writes its output to a file, which the main note then references. Do NOT inline transcripts into incident notes.
3. **Main note frontmatter** — strict requirements:
   - `date:` detection date
   - `description:` "Incident <TICKET>: <one-line>"
   - `quarter: Q<n>-YYYY`
   - `ticket: <TICKET>` (REQUIRED for Incidents base)
   - `severity:` low | medium | high | critical
   - `role:` your role in the incident
   - `status: resolved | active | postmortem-pending`
   - `tags: [incident]`
4. **Main note sections**:
   - **Context** — what was the user impact? what surface broke?
   - **Timeline** — concise: detected → triaged → mitigated → resolved with timestamps
   - **Root Cause** — one paragraph; link to the RCA note for depth
   - **Impact** — quantified if possible (users affected, duration, $$)
   - **What I Did** — your specific actions (this is review evidence)
   - **Related** — links to RCA, deep dive, people, teams, work notes
5. **People backlinks** — every person who showed up in the incident gets a link. Use [[Onboard Person]] for stubs if needed.
6. **Add to indexes**:
   - `work/Index.md` — Recent Notes
   - `org/people/<Person>` — for each person, add to "Key Moments"
   - `perf/Brag Doc.md` — if your role was substantial, log under Impact

## Outputs

- 1-3 incident notes in `work/incidents/`
- Updated `work/Index.md`
- Updated person notes for participants
- Possibly Brag Doc entry
- Possibly competency evidence (incident lead → leadership/operations competencies)

## Linking checklist

- [ ] Main note links to RCA and deep dive (if they exist)
- [ ] RCA links back to main note
- [ ] All participants have person-note backlinks
- [ ] If you led, linked to the relevant `[[perf/competencies/...]]`
- [ ] `ticket:` frontmatter is set (Incidents base depends on it)

## Done when

- Main note exists with timeline and root cause
- Quantified impact (or "unknown" with reason)
- Your specific actions documented (review evidence)
- All participants linked
- Indexes updated

## Anti-patterns

- One giant note instead of main + RCA — kills navigability
- Missing ticket in frontmatter — invisible to Incidents base
- Inlined Slack transcripts — bloat the note; use slack-archaeologist's output file instead
- Skipping "What I Did" — this is your review evidence, do not skip it
- Forgetting to link people — they should each see this in their backlinks panel

## Related

- [[Capture 1-1]]
- [[Onboard Person]]
- [[../Patterns]]
- [[../../.claude/agents/slack-archaeologist]] (agent reference)
- [[../../.claude/commands/incident-capture]] (command reference)
