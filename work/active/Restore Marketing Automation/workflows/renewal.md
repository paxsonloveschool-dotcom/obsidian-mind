---
date: 2026-04-15
description: Renewal workflow — 30 days before contract end, prepare renewal brief, identify expansion, hand to owner for the conversation
tags: [work-note, workflow, automation, restore-marketing-co, retention]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
workflow_name: renewal
---

# Workflow: Renewal

> Every renewal conversation gets a data-backed brief in the owner's hands 30 days before the conversation.

## Trigger

Weekly Friday check (per `config.schedules.renewal_check`) — any engagement where `renewal_date` is within the next 30 days and no renewal brief exists yet.

## Steps

### Step 1 — Identify
**Agent**: [[agents/retention-agent]]
- Scan all `engagements/*.md`
- Filter: `renewal_date` within `days_before_renewal_to_alert` (default 30) AND `renewal_brief_status != ready`

### Step 2 — Value Delivered Story (per engagement)
Using `market-report` skill:
- Compile everything shipped in the current engagement period
- Compute measurable outcomes (traffic, leads, revenue, rank, whatever the engagement's KPIs were)
- Compare to the baseline captured during onboarding (`engagements/<slug>/baseline-audit.md`)
- Write the "here's what we delivered" narrative

### Step 3 — Risk Score
Call `risk-scoring-framework` skill with:
- Engagement health history
- QC revision rate (climbing? stable? falling?)
- Client communication frequency (tempo and tone)
- Payment history (on time? late?)
- NPS scores if captured
- Deliverable acceptance rate

Output: risk score 0-100 + top 3 risk factors.

### Step 4 — Expansion Opportunities
Call `expansion-playbook` skill:
- Review services currently purchased vs `config.services` catalog
- Identify services this client doesn't have that would fit
- For each: why it would serve them (specific, not generic), pricing, pitch angle
- Prioritize by expected lift + acceptance likelihood

### Step 5 — Compose Renewal Brief
Save to `engagements/<slug>/renewal-<YYYY-MM>.md`:

Sections:
1. **Engagement recap** — one paragraph
2. **Value delivered** — bullets, with numbers
3. **Risk score** + top 3 risks (and what to do about each)
4. **Renewal recommendation** — flat renewal / raise / extend / adjust scope
5. **Expansion opportunities** — 2-3 options ranked by fit
6. **Talking points** — what to lead with, what to hear, what to avoid
7. **Downside plan** — if client signals no, what's the win-back path

### Step 6 — Schedule the Conversation
- Via scheduling adapter: book a 30-minute check-in with the primary contact, ideally 2-3 weeks before `renewal_date`
- Frame it as "planning the next phase" NOT "renewal conversation" (anchoring)
- Calendar invite includes a pre-read link to the value-delivered summary (not the internal brief)

### Step 7 — Escalate
Post to escalation channel:
- Client + engagement
- Value delivered headline
- Risk score + top concerns
- Renewal recommendation
- Expansion ranked options
- Conversation date
- Link to full brief
- Decision needed from owner: any tweaks before the call?

### Step 8 — Post-Conversation
After owner marks the renewal conversation complete:
- If **renewed**: update engagement with new terms, trigger new invoice cycle, capture lessons learned
- If **churned**: trigger churn post-mortem workflow, capture reason, add to win-back nurture list
- If **negotiating**: owner drives; agent stays out until resolved

## Guardrails

- **Always review-required** — this workflow never runs fully autonomously. The relationship stage of a client's life is always a human call.
- **30-day lead time** — briefs must be ready ≥ 14 days before the conversation, ideally 30
- **Never surprise the owner** — if the renewal date is < 14 days out and no brief exists, fire an urgent alert
- **Privacy** — renewal briefs never leave the vault; they're owner-only

## Observability

- Gross retention rate (% of clients who renew)
- Net retention rate (expansion - churn on existing base)
- Expansion attach rate (% of renewals with expansion)
- Average deal size at renewal (flat? higher? lower?)
- Time-from-brief-to-conversation
- Brief accuracy (owner marks briefs as "useful" / "needs work")

## Completion Criteria

Workflow complete for an engagement when:
- Renewal brief exists and is marked `ready`
- Conversation is booked on the calendar
- Owner has been briefed and confirmed the plan

## Related

- [[agents/retention-agent]]
- [[agents/reporting-agent]]
- [[Brag Doc]] (wins and testimonials pulled from renewal outcomes)
