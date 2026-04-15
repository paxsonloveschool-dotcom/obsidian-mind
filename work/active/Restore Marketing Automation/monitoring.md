---
date: 2026-04-15
description: Monitoring spec — KPIs, alerting thresholds, weekly review cadence for the automation system
tags: [work-note, monitoring, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
---

# Monitoring

> What we measure, what we alert on, how often we review. The automation system watches itself AND watches the business.

## Layer 1 — Business KPIs

These are the numbers that matter for the actual company. The automation exists to move these.

| Metric | Definition | Target | Alert threshold |
|---|---|---|---|
| **Leads/week** | Inbound leads through all sources | `config.kpi_targets.leads_per_week` | 50% of target |
| **Qualification rate** | Qualified / total leads | `config.kpi_targets.qualified_rate_pct` | < 30% |
| **Proposal close rate** | Closed-won / total proposals sent | `config.kpi_targets.proposal_to_close_rate_pct` | < 15% |
| **Average deal size** | USD per closed deal | `config.kpi_targets.average_deal_size_usd` | < 70% of target |
| **MRR** | Sum of active retainer amounts | `config.kpi_targets.monthly_recurring_revenue_target` | < target |
| **Monthly churn** | Lost MRR / total MRR | < 5% | > 5% |
| **DSO** | Days Sales Outstanding | < 15 days | > 25 days |
| **Gross retention** | % of clients who renew | ≥ 95% | < 90% |
| **Net retention** | Expansion - churn on existing base | ≥ 110% | < 100% |

## Layer 2 — Agent Health

The automation watching itself. These tell you whether the agents are doing their job.

| Metric | Definition | Healthy | Alert |
|---|---|---|---|
| **Intake latency** | Time from lead arrival to lead note created | < 5 min | > 15 min |
| **Qualification latency** | Time from intake to qualified/disqualified | < 10 min | > 30 min |
| **Gray-zone rate** | % of leads landing in gray zone | < 20% | > 40% (means ICP needs tuning) |
| **Proposal draft time** | Time from discovery-done to draft ready | < 5 min | > 15 min |
| **Onboarding time** | Time from deposit to kickoff booked | < 48 hrs | > 72 hrs |
| **Coordinator slip rate** | % of deliverables with deadline slip | < 5% | > 15% |
| **QC pass rate (first pass)** | % of deliverables passing QC on first try | > 80% | < 60% |
| **Invoice send success** | % of invoices generated and sent | 100% | < 100% |
| **Payment chase effectiveness** | % of overdue invoices paid after first reminder | > 50% | < 30% |
| **Report send success** | % of weekly reports delivered | 100% | < 100% |
| **Escalation volume** | Total escalations / week | Stable | 2× prior week |
| **Owner response SLA** | % of escalations responded to within SLA | ≥ 80% | < 60% |

## Layer 3 — Owner Hours Recovered

The point of this whole project. If this number isn't going up, something is broken.

| Metric | Definition | Target trajectory |
|---|---|---|
| **Owner hours / week (total)** | Self-reported or time-tracked | Down 50% by end of Q2 |
| **Owner hours on intake** | Time spent on leads | < 30 min/week |
| **Owner hours on proposals** | Time spent on proposal writing | < 1 hr/week (just approvals) |
| **Owner hours on coordination** | Time spent on PM + status checks | < 2 hrs/week |
| **Owner hours on invoicing** | Time spent on invoicing tasks | < 30 min/month |
| **Owner hours on reporting** | Time spent on client reports | < 15 min/week |
| **Owner hours on QC** | Time spent reviewing deliverables | < 30 min/week |
| **Owner hours available for M&A** | Time spent on M&A / strategy / growth | ≥ 40% of weekly hours |

The last row is the north-star for this project. If owner hours freed aren't being reinvested in M&A work, we're losing.

## Layer 4 — Q2 Progress

Against the [[Agent Orchestration Buildout]] plan:

| Milestone | Week | Status |
|---|---|---|
| Invoicing agent v0.1 live | W2 | Pending config |
| Intake & Qualification agent v0.1 live | W3 | Pending config |
| Proposal agent v0.1 live | W5 | Pending config |
| Onboarding agent v0.1 live | W5 | Pending config |
| Reporting agent v0.1 live | W7 | Pending config |
| Project Coordinator agent v0.1 live | W8 | Pending config |
| Deliverable QC agent v0.1 live | W9 | Pending config |
| Retention agent v0.1 live | W12 | Pending config |
| **80% of recurring operator work automated** | EOQ2 | Measured via Layer 3 |

## Alert Routing

Per [[escalation-rules#Priority Levels]]:
- **P0** → all channels
- **P1** → primary + vault
- **P2** → primary
- **P3** → vault only

## Weekly Monitoring Review

Every Monday morning (owner task, ~15 min):
1. Read the owner dashboard
2. Scan all L1 KPIs — any red?
3. Scan all L2 agent metrics — any unhealthy?
4. Scan L3 owner hours — are we trending down?
5. Scan L4 Q2 progress — on track?
6. Identify the ONE thing to fix this week

Log the review in `runs/<date>-monitoring-review.md`.

## Monthly Monitoring Review

First Monday of each month (~45 min):
1. Pattern-match across 4 weeks of data
2. Identify any agents that need tuning
3. Identify any workflows that need rework
4. Update KPI targets for the next month based on reality
5. Update [[North Star]] if anything strategic shifted
6. Log the review as a work note + update [[Key Decisions]] if actions result

## What Not to Measure

Resist the temptation to add metrics that look useful but don't change behavior:
- "Sessions per month" (vanity)
- "Skill invocations" (not actionable)
- "Agent uptime" (it's not a service, it runs on demand)
- "Word count of generated content" (quantity != quality)

Stick to metrics where an unhealthy value tells you what to do.

## Related

- [[runbook#Weekly Rhythm]]
- [[escalation-rules]]
- [[config#METRICS & KPIs]]
- [[Agent Orchestration Buildout]]
