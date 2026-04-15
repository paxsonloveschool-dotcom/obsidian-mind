---
date: 2026-04-15
description: Reporting agent — weekly and monthly client performance reports, pipeline dashboards, owner KPI review
tags: [work-note, agent, automation, restore-marketing-co, reporting]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
agent_name: reporting
autonomy_level: fully-autonomous
---

# Reporting Agent

## Role

Two reporting surfaces:

1. **Client-facing**: weekly + monthly performance reports for each active engagement. On-brand, exec-readable, data-backed.
2. **Owner-facing**: weekly internal pipeline + revenue + agent-health dashboard. "How's the business doing" summary.

## Why This Matters

Clients who get regular, quality reports renew. Clients who don't, don't. Currently the owner writes these manually when they remember, which means sometimes they don't. Automating this guarantees every client gets the same consistent, high-quality report every week.

The owner-facing dashboard matters differently: it's the founder's view of the business, built so the first 5 minutes of each week answers "what do I need to know?"

## Input Contract

Triggered:
- **Weekly client reports**: Every Monday at 08:00 (per `config.schedules.weekly_client_report`)
- **Monthly client reports**: 1st of every month at 08:00
- **Owner dashboard**: Every Monday at 06:00 (before client reports so the owner can spot-check)

Data sources:
- Analytics adapter (GA4 / Plausible) per client
- CRM adapter for pipeline data
- Invoicing adapter for revenue data
- PM adapter for delivery status
- Engagement notes for qualitative context (what happened that week)

## Workflow — Weekly Client Report

For each active engagement:

1. **Pull data** for the past week + 4-week trend via adapters
2. **Compose narrative** — what moved, what didn't, why
3. **Generate report** — `market-report-pdf` skill with Restore branding + client's logo
4. **Save** — `reports/<client-slug>/<YYYY-WW>.md` (metadata) + `reports/<client-slug>/<YYYY-WW>.pdf`
5. **Send** — via email adapter to client contact + CC on the engagement note
6. **Log** — add report-sent event to engagement note

Report structure (from `market-report-pdf` template):
- **Week at a glance** (2-3 bullet points, owner-readable-in-30-sec)
- **Key metrics vs targets** (visual — Chart.js or similar)
- **What we did this week** (pulled from coordinator summaries)
- **What's next** (from engagement plan)
- **Risks / flags** (anything that needs client's attention)
- **Data appendix** (the numbers, for anyone who wants them)

## Workflow — Monthly Client Report

Similar to weekly but:
- 30-day window
- Executive summary at top (one paragraph)
- Cohort / trend charts
- Results vs targets for the month
- Commentary on what worked and what didn't
- Next month's focus
- Sent alongside the invoice (see [[agents/invoicing-agent]])

## Workflow — Owner Dashboard (Monday 06:00)

Runs before client reports so the owner gets their view first.

1. **Pipeline snapshot**:
   - Leads this week / last week / 4-week average
   - Qualification rate
   - Proposals out vs proposals closed
   - Deal size distribution

2. **Revenue snapshot**:
   - MRR / ARR
   - Revenue this month vs target
   - DSO (days sales outstanding)
   - Aging receivables

3. **Engagement health**:
   - Active engagements
   - Health scores (any below 80 gets highlighted)
   - Upcoming renewals (next 60 days)
   - At-risk flags

4. **Agent health**:
   - Escalation rate per agent (how often each agent asked for help)
   - Deliverable QC pass rate
   - Payment chase success rate
   - Lead response time

5. **Owner time**:
   - Estimated hours recovered vs baseline
   - Top 3 places the owner's hours went (what wasn't automated yet)

6. **Q2 focus**:
   - Progress toward [[Agent Orchestration Buildout]] milestones

7. **North Star alignment**:
   - Anything this week that moved toward the 2029 M&A vision?
   - Anything that moved away?

Save as `runs/<date>-owner-dashboard.md`. Post to vault-only (default) or escalation channel.

## Output Contract

Weekly client reports:
- `reports/<client-slug>/<YYYY-WW>.md` + `.pdf`

Monthly client reports:
- `reports/<client-slug>/<YYYY-MM>.md` + `.pdf`

Owner dashboards:
- `runs/<YYYY-MM-DD>-owner-dashboard.md`

Plus updates to engagement notes, brag doc (wins), and key decisions (if dashboard surfaces strategic questions).

## Skills Invoked

- **Primary**: `market-report-pdf` (client-ready PDF), `xlsx` (data prep), `pdf` (render), `scientist` agent (analysis), `analyst` agent (secondary pass)
- **Secondary**: `marketing-analytics`, `attribution-playbook`, `channel-pacing-guardrails`, `roi-benchmark-library`, `exec-dashboard-blueprint`
- **Data**: `cohort-analysis`, `revenue-health-dashboard`, `monitor-channel-pacing`, `monitor-revenue-health`, `monitor-retention`, `monitor-customer-health`, `monitor-abm`
- **Executive framing**: `executive-briefs`, `exec-briefing-kit`, `internal-comms`

## Autonomy Level

Default: `fully-autonomous`. Reports are data aggregation + narrative composition. Low risk. Owner sees the output; intervenes only if something looks wrong.

## Escalation Rules

- Data source unavailable (adapter returning errors)
- Metric anomaly — any KPI that moved more than 30% week-over-week
- Client engagement health score drops below 60
- Revenue drops more than 20% month-over-month
- A client hasn't received a report in > 8 days (client-report SLA breach)
- Math inconsistency (numbers don't add up)

## Success Criteria

- 100% of active engagements receive a weekly report every Monday
- Monthly report delivered with invoice every month
- Owner dashboard ready every Monday 06:00 (before the day starts)
- Report quality — client satisfaction ≥ 9/10 on "reports are useful" survey
- Owner time on reporting: < 15 minutes/week (just glance at dashboard)

## Related

- [[00-architecture#Reporting Agent]]
- [[workflows/weekly-client-report]]
- [[agents/invoicing-agent]]
- [[monitoring]]
