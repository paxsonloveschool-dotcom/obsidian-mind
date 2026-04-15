---
date: 2026-04-15
description: Invoicing agent — generates, sends, tracks, and chases invoices. Highest ROI automation, first to ship
tags: [work-note, agent, automation, restore-marketing-co, invoicing]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
agent_name: invoicing
autonomy_level: review-required
priority: 1
---

# Invoicing Agent

## Role

Generate invoices on schedule. Send them. Track payment. Chase overdue amounts with a professional cadence. Reconcile payments. Escalate disputed amounts or aged receivables to the owner.

## Why This Matters

**This is the first automation to ship.** It's the highest-ROI item in the [[Automation#Build Order (Priority)]]:
- Zero emotional overhead (unlike proposals, which need owner judgment)
- Directly recovers cash (unlike coordination, which recovers owner hours)
- Easy to template (invoicing is formula-driven)
- Every marketing agency does it wrong at some point — forgotten invoices, late chases, awkward payment conversations

Automating invoicing recovers both **cash** (by shortening days-sales-outstanding) and **time** (owner stops writing reminders). It pays for the entire automation project within weeks.

## Input Contract

Triggered:
- **Monthly cycle**: 1st of every month at 09:00 (per `config.schedules.monthly_invoicing`)
- **Event-driven**: when a milestone is marked complete on a fixed-fee engagement
- **Event-driven**: when a project is marked complete (final invoice)

Inputs:
- All engagements with `status: active` or `status: completed-awaiting-final-invoice`
- `config.company` (business info for invoice header)
- `config.pricing_rules.payment_terms_default`
- Invoicing adapter (Stripe / QuickBooks / etc.) for invoice state

## Workflow — Monthly Cycle (1st of month)

1. **List retainer engagements** — every engagement where `pricing.model = "retainer"` and `status = "active"`
2. **For each**:
   - Compute invoice amount from `engagement.monthly_amount`
   - Compute billing period (previous month)
   - Pull summary of work delivered (from coordinator's weekly summaries)
   - Generate invoice number (sequential per `config.tax_id`)
   - Render invoice PDF using `scripts/templates/invoice-template.docx` + `config.company` + engagement data
   - Via invoicing adapter: create invoice record, get payable URL if supported (Stripe)
   - Save: `invoices/<YYYY-MM>-<client-slug>.md` with metadata + link to rendered PDF + payable URL
3. **Escalate for owner review** if `config.agent_autonomy.invoicing = "review-required"` (default v0.1)
4. **Send** — once approved (or immediately if fully-autonomous):
   - Via email adapter: send invoice with professional cover message (template below)
   - Track delivery + open (if email provider supports)
   - Mark invoice status = `sent`, record `sent_date`

## Workflow — Event-Driven (milestone / final)

1. Triggered by coordinator when a milestone deliverable passes QC + client approval
2. Compute amount from `config.services[<service>].pricing` + any scope adjustments
3. Same rendering + escalation + send flow as monthly

## Workflow — Payment Chase Cadence

Runs daily at 09:00.

1. List invoices where `status = sent` and `due_date` has passed
2. For each:
   - **1-2 days overdue**: silent (no action — sometimes clients are paying that day)
   - **3 days overdue** (`config.schedules.payment_chase.first_reminder_days_overdue`): send friendly reminder (template below). Polite, assumes best intent.
   - **10 days overdue** (second reminder): firmer nudge with explicit next step. Flags the invoice `aging_warning = true`.
   - **21 days overdue** (escalation): STOP automated chasing, ESCALATE TO OWNER with full context. Owner decides: call the client, pause work, offer payment plan, write off.

## Workflow — Reconciliation

Daily at 17:00 (after payment provider webhooks are likely processed).

1. Query invoicing adapter for state changes since yesterday
2. For every invoice now marked paid:
   - Update `invoices/<invoice-id>.md` status = `paid`
   - Record payment date
   - Send receipt / thank-you email
   - Update revenue tracking in `config.kpi_targets.monthly_recurring_revenue_target` context
3. Flag disputed or refunded invoices for owner attention

## Output Contract

Per invoice:
- `invoices/<YYYY-MM>-<client-slug>.md`:

```yaml
---
date: <sent-date>
description: <client> <period> invoice $<amount>
tags: [invoice, restore-marketing-co, q2-2026]
invoice_number: <sequential>
client: [[engagements/<slug>]]
amount_usd: <number>
period: <YYYY-MM>
due_date: <YYYY-MM-DD>
status: draft | sent | paid | overdue | disputed | written-off
sent_date: <date-or-null>
paid_date: <date-or-null>
chase_count: <0-3>
---
```

Plus rendered file: `invoices/<id>/invoice.pdf`

Plus records in invoicing adapter (Stripe / QB / etc.) — source of truth for payment state.

## Invoice Cover Template

```
Subject: Invoice #<N> from Restore Marketing Co — <period>

Hi <first_name>,

Attached is your invoice for <period>. Total: $<amount>, due <due_date>.

<if retainer>Summary of what was delivered this period:
<bulleted list pulled from coordinator weekly summaries></if>

Payment options:
<pay link from invoicing adapter>
<ACH / check details from config.company>

Questions on anything — just reply to this email.

Thanks,
<owner_name>
Restore Marketing Co
```

## Payment Chase Templates

**First reminder (3 days overdue):**
```
Subject: Just a friendly nudge — Invoice #<N>

Hi <first_name>,

Quick check-in — invoice #<N> was due on <due_date> and I want to make sure it didn't get lost in the shuffle. Total is $<amount>, pay link is <URL>.

If it's already in flight, just ignore this. If there's any issue on your end, let me know and we'll sort it.

Thanks,
<owner_name>
```

**Second reminder (10 days overdue):**
```
Subject: Invoice #<N> — following up

Hi <first_name>,

Following up on invoice #<N> ($<amount>, due <due_date>). I haven't seen it come through yet — can you confirm when we can expect payment?

If something's come up on your end, I'd rather know so we can figure out next steps together. Pay link: <URL>.

Thanks,
<owner_name>
```

**21-day escalation — HUMAN ONLY, agent STOPS**:
Does NOT send a third reminder automatically. Posts full context to escalation channel for owner to handle directly — phone call, pause on work, payment plan, or write-off decision.

## Skills Invoked

- **Primary**: `xlsx` (invoice line items, reconciliation), `pdf` (final output), `cold-email` (reformatted for AR, not sales), `internal-comms` (payment confirmations)
- **Secondary**: `modeling-finances` (month-end reconciliation + revenue reporting)
- **Financial**: `revenue-analytics`, `cohort-analysis` (for client profitability over time)

## Autonomy Level

v0.1: `review-required` — owner approves every invoice before send. Validates the pipeline.

v0.2 (after first month, ~20 invoices sent without edit): `review-optional` — owner gets a summary, invoices go out automatically, owner intercepts within 1-hour window.

v0.3 (after first renewal cycle, ~60 invoices): `fully-autonomous` for recurring retainers. Milestone/final invoices stay `review-required` forever.

## Escalation Rules

- Any invoice > $5000 — owner review regardless of autonomy level
- Any invoice to a new client — owner review on first invoice regardless
- Any dispute flag from the invoicing adapter
- Any invoice ≥ 21 days overdue (hard STOP on chasing, owner takes over)
- Any client that was flagged `at-risk` by [[agents/retention-agent]]
- Any payment failure reason other than "insufficient funds" or "expired card" (fraud, chargeback, etc.)
- Any unusual payment amount (partial payment, overpayment, wrong currency)

## Success Criteria — v0.1 (first month)

- 100% of invoices generated on time (no forgotten invoices)
- Owner time on invoicing: < 30 minutes/month (was: several hours)
- Days-Sales-Outstanding: baseline measured, reduce over time
- Zero duplicate invoices
- Zero invoices sent to wrong client
- Zero "whoops I forgot to bill you" moments

## Related

- [[00-architecture#Invoicing Agent]]
- [[workflows/monthly-invoicing]]
- [[Automation#Build Order (Priority)]]
- [[config#PRICING FLOOR & APPROVAL RULES]]
- [[integrations#Invoicing + payments]]
