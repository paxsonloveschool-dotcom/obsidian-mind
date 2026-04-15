---
date: 2026-04-15
description: Proposal → contract workflow — draft proposal, owner approves, send, follow-up, e-sign, payment, onboarding handoff
tags: [work-note, workflow, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
workflow_name: proposal-to-contract
---

# Workflow: Proposal → Contract → Kick-Off

> From "discovery call went well" to "signed contract, paid deposit, ready to onboard."

## Trigger

[[workflows/discovery-call]] marks a lead as go → proposal.

## Steps

### Step 1 — Draft
**Agent**: [[agents/proposal-agent]]

- Agent drafts the full proposal per its spec
- Saves to `proposals/<YYYY-MM-DD>-<client-slug>.md` + rendered `docx`/`pdf`
- Escalates to owner for approval

### Step 2 — Owner Review
- Owner reviews the draft
- Edits if needed
- Marks status: `approved` / `revised` / `killed`
- On `revised`: agent regenerates with notes, loops back to Step 1
- On `killed`: archive the lead, capture reason
- On `approved`: continue

### Step 3 — Send
- Via email adapter: send proposal with cover email (template below)
- Track delivery + open status
- Store `sent_date` + `follow_up_due` (default: sent_date + 3 business days)

### Step 4 — Follow-Up Cadence
If no response within:
- **Day 3**: Friendly check-in ("any questions?")
- **Day 7**: Value-add follow-up ("here's something that might help")
- **Day 14**: Final nudge ("are we aligned or should I close this out?")
- **Day 21**: Archive as `went_cold`, owner notified

Cadence templates live in `scripts/templates/follow-up-*.md`. Agent uses `build-sequence` skill for personalization.

### Step 5 — Response Handling
When the client replies:
- Classify the reply — `accepted` / `rejected` / `questions` / `negotiating`
- For accepted: continue to Step 6
- For rejected: archive, capture pass reason, feed back into ICP tuning
- For questions: escalate to owner with draft answers
- For negotiating: escalate to owner with negotiation framing (`closing-deals` skill)

### Step 6 — Contract Generation
- From the accepted proposal + `config.company` legal data
- Generate MSA + SOW documents via `docx` skill
- Use `config.pricing_rules.payment_terms_default` for payment schedule
- Save to `proposals/<slug>/msa.docx` + `proposals/<slug>/sow.docx`
- Escalate to owner for legal review

### Step 7 — E-Sign
- Owner approves contracts
- Via e-sign adapter (DocuSign / PandaDoc / DocSeal): create signing envelope
- Client signs
- Webhook back: contract marked `signed`
- Save signed PDF to `proposals/<slug>/signed.pdf`

### Step 8 — Deposit / First Payment
- Trigger [[agents/invoicing-agent]] for the deposit invoice (per `config.pricing_rules.payment_terms_default`)
- Wait for payment confirmation from invoicing adapter webhook
- On payment received: continue to Step 9

### Step 9 — Handoff to Onboarding
- Mark proposal status = `closed-won`
- Update deal value in pipeline
- Trigger [[workflows/client-onboarding]]
- [[agents/onboarding-agent]] takes over

## State Transitions

```
drafting → awaiting_approval → revised (loop) | killed | sent
sent → (cadence) → cold | accepted | rejected | questions | negotiating
accepted → contracting → signed → deposit_pending → deposit_paid → handed_off
```

## Guardrails

- **Draft SLA**: ≤ 5 minutes from trigger to draft ready
- **Approval SLA**: ≤ 24 hours from escalation to owner decision (soft)
- **Send SLA**: ≤ 1 hour from approval to sent
- **Response SLA**: 21-day hard stop on cadence before archiving
- **Contract SLA**: ≤ 4 hours from acceptance to contract sent
- **Deposit SLA**: ≤ 14 days from signed contract to deposit paid (if no payment by day 14, escalate)

## Observability

`runs/<date>-prop2contract-<client>.md`:
- Time in each state
- Owner time to approve
- Cadence touches before response
- Proposal size vs accepted size (did we get negotiated down?)

Rollup metrics for owner dashboard:
- Proposal volume / week
- Close rate (accepted / sent)
- Average cycle time (sent → signed)
- Revenue booked

## Proposal Cover Template

```
Subject: Proposal from Restore Marketing Co — <client_company>

Hi <first_name>,

Attached is the proposal we discussed on <call_date>. Quick summary:

- Scope: <one-line summary of services>
- Investment: $<amount> (<payment_terms>)
- Timeline: <timeline>

I built this around the specifics we talked about — especially <one standout point from discovery>. If any of it doesn't match what you were expecting, just tell me and I'll adjust.

Happy to hop on a quick call if it's easier to walk through. Otherwise, review at your own pace and let me know.

<owner_name>
Restore Marketing Co
```

## Related

- [[agents/proposal-agent]]
- [[agents/onboarding-agent]]
- [[agents/invoicing-agent]]
- [[workflows/client-onboarding]]
- [[workflows/discovery-call]]
