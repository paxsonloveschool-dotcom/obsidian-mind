---
date: 2026-04-15
description: Escalation rules reference — when each agent stops and asks the human
tags: [work-note, escalation, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
---

# Escalation Rules

> One place to look up "when does an agent stop and ask me?" Useful for tuning autonomy levels and debugging "why did the agent escalate this?"

## The Philosophy

Agents escalate when they hit:
1. **Money** — anything that affects revenue or creates financial exposure
2. **Relationships** — anything that changes tone, scope, or trust with a client
3. **Legal / compliance** — contracts, terms, claims, data
4. **Judgment calls** — ambiguity that only a human should resolve
5. **Broken invariants** — data missing, adapter down, math not adding up

## By Agent

### Intake & Qualification (`review-optional`)
Auto-acts on qualify + disqualify outcomes within the ICP score bands. Escalates when:
- Score in gray zone (50-69)
- Competing client detected (same space as existing client)
- Equity / barter / performance-only terms mentioned
- Services requested not in catalog
- Confidentiality or acquisition flag in the intake message
- Enrichment failed (website unreachable)
- Required fields missing from intake

### Proposal (`review-required` permanently in v0.1)
Every draft escalates for owner approval. Additional triggers:
- Deal < `pricing_rules.minimum_deal_size` — escalate BEFORE drafting
- Deal > `pricing_rules.maximum_auto_approved` — escalate BEFORE drafting
- Client asks for services not in `config.services`
- Client asks for non-standard payment terms
- Client asks for equity / performance / barter
- Discovery mentions confidentiality or acquisition
- Timeline requested shorter than half the service's typical timeline

### Onboarding (`review-optional`)
Passive review on standard flows. Escalates when:
- Contract has terms outside standard template
- Services don't map cleanly to `config.services`
- Client in same industry as existing client (competing flag)
- Contract has non-empty `special_terms`
- Access request would conflict with client's data/privacy policy

### Project Coordinator (`fully-autonomous`)
Rarely escalates. Triggers:
- Critical slip (48+ hours, no unblock path)
- Client complaint or scope-creep signal
- Engagement health < 60
- Deliverable needs owner strategic input
- Team member unreachable > 24 hours
- Budget variance > 20% on an engagement

### Deliverable QC (`review-required` in v0.1)
Passive-review on PASS, always escalates on REVISION or REJECT. Additional triggers:
- Brand fidelity score < 15/25 (hard fail)
- Accessibility blocker (contrast, alt, focus ring, etc.)
- Unverifiable fact / claim
- Legal / compliance concern (unauthorized testimonials, unverified claims)
- Deliverable type not recognized

### Invoicing (`review-required` → `review-optional` → `fully-autonomous` by phase)
Phase-dependent review. Permanent escalation triggers regardless of phase:
- Any invoice > $5000
- First invoice to any new client
- Any dispute flag from adapter
- Any invoice ≥ 21 days overdue (STOP chasing, owner takes over)
- Any client flagged `at-risk` by retention agent
- Payment failure reason other than NSF / expired card
- Unusual payment (partial, overpay, wrong currency)

### Reporting (`fully-autonomous`)
Low-risk; mostly doesn't escalate. Triggers:
- Data source unavailable / adapter error
- Metric anomaly (> 30% WoW change)
- Engagement health drops < 60
- Revenue drops > 20% MoM
- Client hasn't received report in > 8 days (SLA breach)
- Math inconsistency (numbers don't reconcile)

### Retention (`review-required` permanently)
Everything escalates. The agent drafts, the owner decides. Hard alerts:
- Any cancellation message (escalate immediately, agent never responds)
- Any negative feedback (escalate immediately)
- Risk score < 50
- Renewal date < 14 days and no brief exists

## Priority Levels

Escalations are tagged with priority:

- **P0 — Critical** — respond within 2 business hours. Examples: cancellation, dispute, P0 complaint, P0 compliance concern, broken invoice send
- **P1 — High** — respond within 1 business day. Examples: gray-zone lead with high deal potential, proposal approval, renewal conversation prep
- **P2 — Normal** — respond within 2 business days. Examples: risk score drift, QC pass-with-notes, passive proposal review
- **P3 — Low / FYI** — no SLA. Examples: daily summaries, autonomous-agent-completed-task notices

## Escalation Channels

Configured in `config.escalation`. Default priority-channel map:

- **P0** → all channels simultaneously (vault + email + SMS if configured)
- **P1** → primary channel + vault
- **P2** → primary channel
- **P3** → vault only

## Owner Response Expectations

These are YOUR SLAs, and the system measures them as KPIs:

| Priority | Response SLA | What happens if missed |
|---|---|---|
| P0 | 2 hrs (business) | Agent re-escalates every 30 min until acknowledged |
| P1 | 1 business day | Agent re-escalates at 24h and 36h |
| P2 | 2 business days | Agent re-escalates at 48h |
| P3 | N/A | Agent logs and moves on |

Missing P0 or P1 SLAs is itself a health metric — if the owner misses > 20% of P1 SLAs in a month, the owner dashboard flags it.

## Tuning Escalation Rules

You'll want to tune these over time as trust builds:

- **Agent escalating too much** → loosen rules (raise thresholds, promote autonomy level)
- **Agent escalating too little** → tighten rules (more triggers, lower thresholds)
- **Same rule firing repeatedly** → root cause it. Is it a bug in the agent? Missing config value? Pattern that should be automated instead of escalated?

Log tuning decisions in [[Key Decisions]].

## Related

- [[runbook#When an Agent Escalates]]
- [[config#ESCALATION RECIPIENTS]]
- [[config#AGENT AUTONOMY LEVELS]]
- [[monitoring]]
