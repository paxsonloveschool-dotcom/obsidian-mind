---
date: 2026-04-15
description: Discovery call workflow — book call, prep owner, debrief after
tags: [work-note, workflow, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
workflow_name: discovery-call
---

# Workflow: Discovery Call

> From qualified lead to ready-for-proposal. Book call, prep owner, capture call notes, route to proposal.

## Trigger

[[workflows/new-lead]] marks a lead qualified.

## Steps

### Step 1 — Book
- Via scheduling adapter (Cal.com / Calendly): send lead a booking link with 3 slot options in the next 7 business days
- Lead books → scheduling adapter webhooks back to the workflow
- Update lead note: `discovery_call_date`, `discovery_call_slot_url`
- If lead doesn't book within 48 hours: send a reminder (template below)
- If lead doesn't book within 7 days: mark lead `went_cold`, trigger a lightweight nurture sequence

### Step 2 — Prepare Owner
- 24 hours before the call, call `prepare-call` command with:
  - Lead note path
  - ICP score + factor breakdown
  - Audit findings
  - Any other public data on the lead (optional `external-context` agent for web research)
- Compose a brief at `leads/<lead-slug>/call-brief.md`:
  - 3-sentence background
  - Pain point hypothesis (from audit)
  - Their likely objection pattern
  - 5 questions to ask
  - 3 stories / proof points to have ready
  - Suggested agenda
- Post the brief to escalation channel 24 hours before the call

### Step 3 — During Call (human)
Owner runs the call. Agent is not in the call. Owner captures notes in `leads/<lead-slug>/call-notes.md` using the `discovery-calls` skill as a reference for what to cover.

Minimum fields to capture:
- Services they're interested in (map to `config.services` ids)
- Budget signal
- Timeline signal
- Decision-making process (solo? committee? who?)
- Competitors they're evaluating
- Custom scope items
- Red flags / concerns
- Owner's read: go / no-go / maybe

### Step 4 — Debrief (agent)
After owner marks the call notes as "complete":

- Call `analyze-call` command with the notes
- Extract structured fields:
  - `services_requested`
  - `budget_signal`
  - `timeline_signal`
  - `custom_scope_items`
  - `competitors_mentioned`
  - `decision_criteria`
- Update lead note frontmatter
- Post a summary to escalation channel: "Call done — here's what we heard, here's the recommended next step"

### Step 5 — Route
**Decision gate** based on owner's go/no-go + extracted fields:

#### Path A: Go → Proposal
- Trigger [[workflows/proposal-to-contract]]
- [[agents/proposal-agent]] takes over

#### Path B: Maybe → Nurture
- Add lead to nurture list
- Schedule follow-up touchpoint in 14 / 30 / 60 days based on their stated timeline
- Agent sends a thoughtful follow-up (per `build-sequence` skill) at each checkpoint

#### Path C: No-Go → Archive
- Update lead status = `discovery_passed`
- Record reason (not fit, wrong time, priced out, bad chemistry)
- Archive + feed the reason into `training_data` so future ICP scoring learns

## Guardrails

- **Booking timeout**: 7 days to book, then mark cold
- **Call prep SLA**: Brief must be ready 24 hours before the call
- **Debrief SLA**: Within 2 hours of owner marking notes complete
- **Privacy**: Call notes never leave the vault. External adapters (CRM) get the structured summary only, not the raw notes.

## Observability

`runs/<date>-discovery-<lead-id>.md` logs:
- Booking lag (time from qualify to book)
- No-show rate
- Call → proposal conversion rate
- Call → nurture rate
- Call → pass rate
- Owner time per call (should be 30-45 minutes + 5 minutes notes)

## Reminder Templates

**Booking reminder (48h no-book)**:
```
Hi <first_name>,

Following up on your request about <topic>. Here's the calendar if it makes it easier: <link>.

If the timing's off, totally fine — just hit reply and let me know.

<owner>
```

**Post-call thank you** (automated):
```
Hi <first_name>,

Thanks for the conversation today. Here's my understanding of where you're at: <summary from call notes, agent-generated>.

Next step I proposed: <next step per owner's notes>. Let me know if I got anything wrong or missed anything — I'll send over a proposal in the next <config.timeline> based on what we discussed.

<owner>
```

## Related

- [[workflows/new-lead]]
- [[workflows/proposal-to-contract]]
- [[agents/intake-qualification-agent]]
- [[agents/proposal-agent]]
