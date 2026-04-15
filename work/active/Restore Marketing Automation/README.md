---
date: 2026-04-15
description: Restore Marketing Co full automation system — orchestration scaffolding, agent roster, workflow blueprints, config interface, runbook
tags: [work-note, project, q2-2026, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
---

# Restore Marketing Co Automation

> **Status**: Scaffolding complete, awaiting config + credentials.
> **Goal**: Replace 80% of recurring operator work at Restore Marketing Co with agent orchestration so the founder ([[Restore Marketing Co]]) can shift to M&A and strategic work ([[M&A Playbook]]).
> **Parent project**: [[Agent Orchestration Buildout]]

## Quick Links

- **Architecture**: [[00-architecture]] — system diagram, data flow, execution model
- **Config**: [[config]] — fill this in to make the system go live
- **Integrations**: [[integrations]] — external system adapters (CRM, email, invoicing, scheduling)
- **Runbook**: [[runbook]] — how to operate the system day-to-day
- **Open questions**: [[open-questions]] — what we still need from the owner
- **Monitoring**: [[monitoring]] — KPIs, alerting, weekly review cadence
- **Escalation rules**: [[escalation-rules]] — when agents stop and ask a human

## Agent Roster (8)

Each agent is a specialist with clear role, I/O, skills used, and escalation rules.

| Agent | Role | File |
|---|---|---|
| Intake & Qualification | Triage new leads, score ICP fit, route | [[agents/intake-qualification-agent]] |
| Proposal | Draft proposals from intake data + service catalog | [[agents/proposal-agent]] |
| Onboarding | Kick off signed clients — brand audit, access, welcome | [[agents/onboarding-agent]] |
| Project Coordinator | Run active engagements — briefs, deadlines, handoffs | [[agents/project-coordinator-agent]] |
| Deliverable QC | Review every deliverable before client sees it | [[agents/deliverable-qc-agent]] |
| Invoicing | Generate, send, chase, reconcile invoices | [[agents/invoicing-agent]] |
| Reporting | Weekly/monthly client performance reports | [[agents/reporting-agent]] |
| Retention | Renewal, churn prevention, upsell/cross-sell | [[agents/retention-agent]] |

## Workflow Blueprints (7)

Each workflow is an end-to-end executable playbook that composes agents + skills.

| Workflow | Trigger | Owner agent(s) | File |
|---|---|---|---|
| New lead | Form submission / inbound / referral | Intake & Qualification | [[workflows/new-lead]] |
| Discovery call prep & debrief | Call booked | Intake + Proposal | [[workflows/discovery-call]] |
| Proposal → contract → kick-off | Discovery call done | Proposal + Onboarding | [[workflows/proposal-to-contract]] |
| Client onboarding | Contract signed | Onboarding | [[workflows/client-onboarding]] |
| Weekly client report | Every Monday 08:00 | Reporting | [[workflows/weekly-client-report]] |
| Monthly invoicing cycle | 1st of month | Invoicing | [[workflows/monthly-invoicing]] |
| Renewal conversation | 30 days before contract end | Retention | [[workflows/renewal]] |

## Scripts (executable)

- [[scripts/generate-proposal]] — takes intake JSON, produces a proposal draft via `market-proposal` + `docx`
- [[scripts/weekly-report]] — composes weekly client performance report from data sources
- [[scripts/invoice-template]] — generates invoice PDF from engagement data + `pdf` skill
- [[scripts/qualify-lead]] — scores a new lead against the ICP defined in `config.yaml`

## Skills Composition (which skills power which agents)

See [[00-architecture#Skill Composition Map]] for the full mapping. High-signal skills:

- **Intake**: `icp-builder`, `lead-qualification`, `market-audit`
- **Proposal**: `market-proposal`, `market-landing`, `ui-ux-pro-max`, `docx`, `pptx`
- **Onboarding**: `doc-coauthoring`, `internal-comms`, `brand`
- **Project coord**: `plan`, `orchestrate-journey`, `configure-workflow`
- **QC**: `visual-verdict`, `ai-slop-cleaner`, `market-copy` review
- **Invoicing**: `xlsx`, `pdf`, `cold-email` (for chase cadence)
- **Reporting**: `market-report-pdf`, `xlsx`, `scientist` + `analyst` agents
- **Retention**: `churn-prevention`, `risk-scoring-framework`, `save-play-library`, `market-report`

## What's Done vs What's Blocked

### Done on scaffolding (this commit)
- Architecture diagram + data flow
- Agent roster — 8 agents with role, I/O, skills, escalation
- Workflow blueprints — 7 end-to-end playbooks
- `config.yaml` template with every field documented
- `integrations.md` adapter spec for 9 external systems
- Runbook + escalation rules + monitoring spec
- 4 executable scripts (local, no external APIs needed for internals)
- Full cross-linking into [[Agent Orchestration Buildout]], [[Automation]], [[Restore Marketing Co]]

### Blocked on owner input (cannot proceed without)
1. **Fill in `config.yaml`** — company info, services, pricing tiers, escalation rules, team, time zone, ICP definition
2. **Tech stack decisions** — which CRM, email, invoicing, scheduling, e-sign, PM tool are you actually using? (see [[integrations]] for the options)
3. **API credentials** — once tech stack is chosen, drop credentials into the adapter config (never committed to git)
4. **First real client data** — to test the pipeline end-to-end we need at least one real lead and one real engagement
5. **Escalation rules** — how autonomous do you want each agent to be? (see [[escalation-rules]] for the spectrum)
6. **Answer the 5 open questions in [[Agent Orchestration Buildout]]**

### Deferred until above answered
- Live integration testing
- First automation ship to production
- Owner-hour recovery measurement
- HP Landscaping equivalent (different schema — seasonal, route-based, crew-dispatched)

## Next Actions

- [ ] Fill in [[config]] (owner task, ~30 min)
- [ ] Answer [[open-questions]] (owner task, ~15 min)
- [ ] Pick tech stack per [[integrations]] (owner decision)
- [ ] Provide credentials for chosen stack (owner task)
- [ ] Run `scripts/qualify-lead.py` against a real test lead (validates intake path)
- [ ] Run `scripts/generate-proposal.py` against a real test engagement (validates proposal path)
- [ ] Ship v0.1 of invoicing agent (highest ROI automation, see [[Automation#Build Order (Priority)]])

## Related

- [[Agent Orchestration Buildout]] — parent project
- [[Restore Marketing Co]] — the company this automates
- [[Automation]] — Q2 strategy playbook
- [[M&A Playbook]] — why we're building this (exit-readiness)
- [[North Star]] — the vision this serves
- [[HP Landscaping]] — sibling business, gets its own orchestration later
- [[Skills]] — the 203 skills this composes
