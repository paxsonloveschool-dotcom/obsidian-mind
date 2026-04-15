---
date: 2026-04-15
description: Weekly client report workflow — Monday 08:00, pull data, compose narrative, render PDF, send to every active client
tags: [work-note, workflow, automation, restore-marketing-co, reporting]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
workflow_name: weekly-client-report
---

# Workflow: Weekly Client Report

> Every Monday 08:00, every active engagement gets an on-brand performance report in the client's inbox. Not a single manual step.

## Trigger

Cron: Monday 08:00 (per `config.schedules.weekly_client_report`).

## Steps

### Step 1 — List
**Agent**: [[agents/reporting-agent]]
- Query engagements where `status = active` and `send_weekly_reports = true`
- For each, initiate the report workflow in parallel (via `ultrawork`)

### Step 2 — Pull Data (per client)
Via analytics adapter (GA4 / Plausible / etc.):
- Traffic: sessions, users, avg duration, bounce
- Acquisition: channels breakdown
- Conversion: goals, form submits, sales
- Content: top pages, top content
- Trend: WoW / 4-week / 8-week comparison

Via CRM adapter (if integrated):
- Leads generated attributable to the engagement's work
- Pipeline movement

Via PM adapter:
- What deliverables shipped this week
- What's in flight
- What's queued for next week

### Step 3 — Narrative
Compose the story using `scientist` agent for primary analysis + `analyst` agent for secondary pass:
- **Week at a glance** — 3 bullets the client reads in 15 seconds
- **What moved** — highlights with context
- **What didn't** — honest about things that didn't work, with hypothesis for why
- **What's next** — the plan for this week

Voice: `brand.voice_attributes` from config. Reading level: exec-readable, not jargon.

### Step 4 — Render
Call `market-report-pdf` skill with:
- Data + narrative from Steps 2-3
- Restore's brand visual system
- Client's logo (from `engagements/<slug>/assets/logo.png`)
- Client-specific color (optional override in engagement.md)

Output: `reports/<client-slug>/<YYYY-WW>.pdf` + markdown sidecar `reports/<client-slug>/<YYYY-WW>.md`

### Step 5 — QC
Quick pass through [[agents/deliverable-qc-agent]]:
- Numbers all have sources
- No broken charts
- Narrative sanity check
- Brand fidelity check

### Step 6 — Send
Via email adapter:
- To: primary contact on engagement
- CC: secondary contacts if configured
- Subject: `<Client> — Week of <date> Performance Report`
- Body: 3-bullet summary + "full report attached"
- Attach: PDF

Track delivery + open.

### Step 7 — Log
Update engagement note:
- Append `report_sent: <date>` event
- Update `last_report_date`
- Increment `reports_sent_count`

### Step 8 — Spot-check Owner Dashboard
After all client reports are out (~08:30), feed aggregate data into owner Monday dashboard (runs at 06:00 so it's actually before this, but the post-client-report data gets folded in at the end of the day).

## Guardrails

- **Parallel**: all client reports run in parallel (via `ultrawork`), not serial
- **Data freshness**: if a data source is stale (>25 hours old), flag in the report "data through <timestamp>"
- **Missing data handling**: if a required metric can't be fetched, render the report anyway with "(data unavailable — investigating)" placeholder + escalate
- **Client skip flag**: respect `engagement.skip_weekly_report` (some clients want monthly only)
- **Pause flag**: if engagement is paused, no report

## Observability

Metrics per run:
- Clients receiving reports
- Average render time per report
- QC pass rate
- Send success rate
- Client open rate (when email provider supports)
- Feedback / replies rate

## Completion Criteria

Workflow complete when every eligible engagement has a report in the client's inbox before 09:00 Monday.

## Failure Modes & Recovery

| Failure | Response |
|---|---|
| Analytics API down | Retry 3× over 15 min; if still down, render with note + escalate |
| Email adapter down | Queue for retry every 10 min until 12:00; then escalate |
| Client's logo asset missing | Render without; escalate to fix for next week |
| QC fail on a report | Re-render once; if still fails, hold + escalate (do not send) |

## Related

- [[agents/reporting-agent]]
- [[agents/deliverable-qc-agent]]
- [[integrations#Analytics — client performance data]]
- [[monitoring]]
