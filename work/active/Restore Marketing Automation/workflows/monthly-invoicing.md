---
date: 2026-04-15
description: Monthly invoicing cycle workflow — generate, review, send, track, chase, reconcile
tags: [work-note, workflow, automation, restore-marketing-co, invoicing]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
workflow_name: monthly-invoicing
---

# Workflow: Monthly Invoicing Cycle

> Recurring workflow. Runs on the 1st of every month. This is the highest-ROI automation — ships first.

## Trigger

Cron: 1st of month at 09:00 (per `config.schedules.monthly_invoicing`).
Plus event-driven for milestone-based or final invoices.

## Steps

### Step 1 — Generate
**Agent**: [[agents/invoicing-agent]]
- List all retainer engagements with `status = active` or `completed-awaiting-final`
- For each:
  - Compute amount
  - Pull past-month summary from coordinator weekly reports
  - Render invoice PDF (line items, total, due date, payment link)
  - Write `invoices/<YYYY-MM>-<client-slug>.md` + `invoices/<slug>/invoice.pdf`
  - Create invoice in invoicing adapter (Stripe / QB / etc.) — gets invoice ID + payable URL

### Step 2 — Owner Review (v0.1)
- Escalate batch to owner: "Ready to send N invoices totaling $X"
- Owner reviews list, approves all / approves-with-edits / rejects specific ones
- Edits loop back to Step 1 for the specific invoice
- Approval releases to Step 3

**After v0.1 validation (20 invoices without edit)**: Step 2 becomes `review-optional`.

### Step 3 — Send
- Via email adapter: send each invoice with cover email
- Template personalizes "what we did this month" from coordinator summaries
- Track delivery + opens
- Mark status = `sent`

### Step 4 — Track
Daily check (part of the invoicing agent's daily run):
- Query invoicing adapter for payment state
- Updates on state changes: `sent` → `viewed` → `paid`
- Flag `disputed` or `refunded` for owner attention

### Step 5 — Chase (if overdue)
For each invoice where `due_date < today` and `status = sent`:

| Days overdue | Action |
|---|---|
| 1-2 | Silent (grace period) |
| 3 | First reminder (friendly) |
| 10 | Second reminder (firmer) |
| 21 | **STOP** — escalate to owner, agent does not chase further |

Templates in [[agents/invoicing-agent#Payment Chase Templates]].

### Step 6 — Reconcile
After payment received (webhook from invoicing adapter):
- Update invoice status = `paid`
- Record `paid_date`
- Send receipt / thank-you email
- Update revenue tracking in the monthly dashboard
- Feed into [[agents/reporting-agent]] month-end rollup

### Step 7 — Month Close
On the last day of the month (19:00):
- List all invoices from this month
- Compute: total invoiced, total received, outstanding, aging buckets
- Generate month-close report: `runs/<YYYY-MM>-month-close.md`
- Post summary to owner
- Flag any aged receivables (> 21 days)
- Feed MRR + ARR into owner dashboard

## Guardrails

- **No duplicate invoices**: de-dup on `(client_id, period)` — if an invoice already exists for the period, skip
- **No invoices for paused clients**: respect engagement pause flag
- **No invoices for disputed clients**: never auto-invoice a client with an active dispute; escalate instead
- **Pricing integrity**: every amount must match `config.services` or current engagement's contract — never auto-calculate a custom amount
- **Currency**: always USD unless engagement specifies otherwise; mixed currency must escalate
- **Floor check**: invoice amount must be > $0.01 and match the engagement's agreed amount ± 5% (for proration); anything outside escalates

## Observability

Rollup metrics:
- Invoices generated per month
- Total invoiced $ per month
- Days Sales Outstanding (average time to payment)
- Aging: 0-15 / 16-30 / 31-60 / 60+ day buckets
- Chase effectiveness (what % of overdue get paid after reminder 1 vs reminder 2)
- Disputes per month
- Owner time on invoicing (target: <30 min/month)

## Completion Criteria

Monthly workflow is complete when:
- Every eligible engagement has an invoice sent
- Every invoice has a confirmed state (paid, overdue, disputed, or in-window)
- Month-close report is posted
- Aged receivables list is on the owner's desk

## Related

- [[agents/invoicing-agent]]
- [[Automation#Build Order (Priority)]] — this is #1, ships first
- [[integrations#Invoicing + payments]]
- [[scripts/invoice-template]]
