---
date: 2026-04-15
description: New lead workflow — end-to-end from inbound trigger through qualified/disqualified routing
tags: [work-note, workflow, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
workflow_name: new-lead
---

# Workflow: New Lead

> From inbound form submission to qualified-or-disqualified outcome, fully automated with escalation on gray zone.

## Trigger

Any of:
- Form submission webhook (`/api/lead` → captured to inbox, agent watches inbox)
- Inbound email to the configured lead address (parsed from subject / body)
- Manual trigger via `/new-lead` command with data
- CRM adapter creates a new lead record (imported from existing pipeline)

## Steps

### Step 1 — Capture
**Agent**: [[agents/intake-qualification-agent]]

- Normalize the raw lead into the intake schema
- Write `leads/<YYYY-MM-DD>-<slug>.md` with frontmatter
- Record source + timestamp

**Output**: Lead note created, status = `triaging`

### Step 2 — Enrich
**Agent**: [[agents/intake-qualification-agent]]

- Call `market-audit` skill on the lead's website
- Capture top 3 findings into the lead note
- Enrichment timeout: 60 seconds (if audit fails, mark lead note as enrichment-failed and proceed to scoring)

**Output**: Lead note has `enrichment` section with audit findings

### Step 3 — Score
**Agent**: [[agents/intake-qualification-agent]]

- Call `lead-qualification` skill with the lead + ICP config
- Compute score (0-100) with factor breakdown
- Write score to lead note frontmatter

**Output**: Lead note has `lead_score: <n>` + scoring breakdown

### Step 4 — Route
**Decision gate** based on `config.icp.scoring.thresholds`:

#### Path A: Auto-Qualify (score ≥ 70)
- Update lead status = `qualified`
- Trigger [[workflows/discovery-call]]
- Notify owner via escalation channel
- Skip to END

#### Path B: Gray Zone (50-69)
- Update lead status = `needs-review`
- Compose owner briefing with:
  - Lead summary
  - Audit top 3
  - ICP score breakdown
  - Agent's recommendation (qualify / disqualify / clarify)
- Post to escalation channel with **required decision**
- **BLOCK** — wait for owner decision (timeout: 24 hours → reminder, 48 hours → escalate again)
- On owner decision:
  - `qualify` → path A (trigger discovery-call workflow)
  - `disqualify` → path C
  - `clarify` → agent sends follow-up question to lead, loops back to Step 3 with new data

#### Path C: Auto-Disqualify (score < 50)
- Update lead status = `disqualified`
- Record disqualification reason (factor that failed)
- If `config.features.auto_disqualify_leads = true`:
  - Call [[agents/intake-qualification-agent#Polite Decline Template]]
  - Send via email adapter
  - Mark `declined_date`
- Else: queue for owner review
- Archive lead note to `leads/archive/<year>/`
- Skip to END

## State Transitions

```
triaging → qualified → [workflows/discovery-call]
triaging → needs-review → (owner decides) → qualified | disqualified
triaging → disqualified → archived
```

## Guardrails

- **Timeout**: Full workflow should complete within 10 minutes for auto paths. Gray-zone is bounded by owner response (no SLA on owner).
- **Retries**: Enrichment retries 3× on transient failures. Scoring does not retry (it's deterministic).
- **Idempotency**: If a lead arrives twice (same email + same company within 30 days), de-dupe to the existing lead note and append "re-contact" event.
- **Escalation bypass**: If lead message contains any keyword in `config.escalation.severity_override.critical`, fast-path to owner regardless of score.

## Observability

Log every state transition to `runs/<YYYY-MM-DD>-new-lead-<lead-id>.md`:
- Timestamps per step
- Skill invocation results
- Decision reason
- Escalation triggered (yes/no, why)
- Total duration

Weekly metrics (fed to [[agents/reporting-agent]] owner dashboard):
- Leads processed
- Auto-qualify rate
- Gray-zone rate (should decrease as ICP tunes)
- Auto-disqualify rate
- Average time to qualification
- Owner interventions required

## Completion Criteria

Workflow is done when lead status ∈ `{qualified, disqualified, needs-review}` AND owner has been notified (if required).

## Related

- [[agents/intake-qualification-agent]]
- [[workflows/discovery-call]]
- [[config#ICP — Ideal Client Profile]]
