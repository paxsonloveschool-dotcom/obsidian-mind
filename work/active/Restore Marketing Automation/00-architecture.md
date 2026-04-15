---
date: 2026-04-15
description: Restore Marketing Co automation system architecture — agent roster, workflow pipelines, data flow, skill composition, execution model
tags: [work-note, architecture, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
---

# Architecture

> The full system design for the Restore Marketing Co automation orchestration. Everything downstream ([[agents]], [[workflows]], [[scripts]], [[integrations]]) maps to the pieces defined here.

## Design Principles

1. **Adapter-agnostic core.** Workflows describe what needs to happen in domain terms (e.g., "send onboarding email"). Integration adapters translate that into whichever concrete system the user has (Gmail / Outlook / Resend / SendGrid). Swapping stacks means swapping the adapter, not rewriting the workflow.
2. **Human-in-the-loop by default, autonomous on demand.** Every agent has an `autonomy_level` config knob: `review-required`, `review-optional`, `fully-autonomous`. Start all agents at `review-required` in the first month, promote them to autonomous as trust builds.
3. **Persistent state lives in the vault.** Every lead, engagement, invoice, report is captured as a vault note. This is the second-brain mandate in action — the vault *is* the database. External systems are sources of truth for operational data, the vault is the source of truth for decisions + narrative + memory.
4. **Fail loud, escalate fast.** Every agent has explicit escalation rules (see [[escalation-rules]]). If an agent isn't confident, it stops and posts a human-readable question to the vault instead of fabricating.
5. **Ship v0.1 fast, iterate.** Version 0.1 of every automation has the minimum to remove owner hours. Gold-plating happens after the hours are recovered.
6. **Composition over custom code.** Where an existing skill does the job (`market-proposal`, `market-audit`, `icp-builder`), the agent calls it. Custom Python only fills gaps.

## The Pipeline

```
[ LEAD ]
   │
   ▼
[ Intake & Qualification Agent ] ──── disqualified? ──► notify owner, archive with reason
   │
   │ qualified
   ▼
[ Discovery Call Workflow ]      ── book + prep brief + post-call debrief
   │
   ▼
[ Proposal Agent ] ──── no-go? ──► capture pass reason, nurture list
   │
   │ send proposal
   ▼
[ Contract + E-sign ] ──── ghosted? ──► follow-up cadence, churn reason if lost
   │
   │ signed
   ▼
[ Onboarding Agent ] ──── kickoff call, access, welcome packet, brand audit
   │
   ▼
[ Project Coordinator Agent ] ──────┐
   │                                │
   ▼                                │ ongoing
[ Deliverable Creation ]            │ engagement
   │                                │
   ▼                                │
[ Deliverable QC Agent ]            │
   │                                │
   │ pass                           │
   ▼                                │
[ Client Review ] ───── revisions? ─┘
   │
   │ approved
   ▼
[ Invoicing Agent ] ──── cycle monthly
   │
   ▼
[ Reporting Agent ] ──── weekly + monthly
   │
   ▼
[ Retention Agent ] ──── 30 days before renewal
   │
   ├─── renewed ──► back to Project Coordinator
   └─── churned ──► win-back cadence + churn reason capture
```

## Agent Roster

See `agents/` directory for full definitions. Summary:

| # | Agent | Autonomy | Invokes | Escalates when |
|---|---|---|---|---|
| 1 | Intake & Qualification | `review-optional` | `icp-builder`, `lead-qualification`, `market-audit` | ICP score in gray zone (40-60%), or unusual request |
| 2 | Proposal | `review-required` | `market-proposal`, `market-landing`, `ui-ux-pro-max`, `docx` | Pricing outside configured tiers, custom scope |
| 3 | Onboarding | `review-optional` | `doc-coauthoring`, `internal-comms`, `brand` | Client asks for anything off-standard-welcome-packet |
| 4 | Project Coordinator | `fully-autonomous` | `plan`, `orchestrate-journey`, `configure-workflow` | Deadline slip > 48h, blocker without unblock path |
| 5 | Deliverable QC | `review-required` | `visual-verdict`, `ai-slop-cleaner`, `market-copy` review | Any QC fail, any ambiguous brand alignment |
| 6 | Invoicing | `fully-autonomous` (after v0.1 validation) | `xlsx`, `pdf`, `cold-email` (chase cadence) | Invoice > 30 days late, disputed amount |
| 7 | Reporting | `fully-autonomous` | `market-report-pdf`, `xlsx`, `scientist` + `analyst` agents | Metric anomaly, missing data source |
| 8 | Retention | `review-required` | `churn-prevention`, `risk-scoring-framework`, `save-play-library` | Any renewal conversation, any expansion pitch |

## Skill Composition Map

Which installed skills each agent reaches for:

### Intake & Qualification Agent
- **Primary**: `icp-builder` (ICP definition), `lead-qualification` (scoring), `market-audit` (for enriching inbound leads with a free website audit)
- **Secondary**: `customer-research` (if lead comes with VoC clues), `cold-outreach` (if we need to re-engage a cold lead)
- **Escalates via**: `omc-reference` agent catalog, `ask` process-first advisor

### Proposal Agent
- **Primary**: `market-proposal` (the core generator), `market-landing` (if the engagement includes a landing page), `ui-ux-pro-max` (on-brand deliverable), `docx` / `pptx` (output format)
- **Secondary**: `pricing-strategy`, `marketing-psychology` (for framing), `customer-research` (for positioning against competitors)
- **Composes with**: `brand`, `design-system`, `design` (for visual consistency with Restore's brand)

### Onboarding Agent
- **Primary**: `doc-coauthoring` (structured welcome packet), `internal-comms` (announcement templates), `brand` (on-voice communication)
- **Secondary**: `market-audit` (kick-off client audit of their current state), `market-brand` (their brand analysis)

### Project Coordinator Agent
- **Primary**: `plan`, `orchestrate-journey`, `configure-workflow`, `configure-branches`
- **Secondary**: `project-session-manager`, `ultrawork` (parallel delivery streams)
- **Escalates via**: `deep-dive` for blocked situations

### Deliverable QC Agent
- **Primary**: `visual-verdict` (screenshot vs brand reference), `ai-slop-cleaner` (catch generic AI-looking output), `market-copy` (copy review)
- **Secondary**: `brand`, `ui-ux-pro-max` (accessibility + design compliance checklist), `code-reviewer` agent

### Invoicing Agent
- **Primary**: `xlsx` (invoice generation), `pdf` (final output), `cold-email` (payment chase cadence, reformatted for AR not sales)
- **Secondary**: `modeling-finances` (month-end reconciliation), `internal-comms` (payment confirmation comms)

### Reporting Agent
- **Primary**: `market-report-pdf` (client-ready), `xlsx` (data prep), `scientist` agent (analysis), `analyst` agent (secondary pass)
- **Secondary**: `marketing-analytics`, `attribution-playbook`, `channel-pacing-guardrails`

### Retention Agent
- **Primary**: `churn-prevention`, `risk-scoring-framework`, `save-play-library`, `market-report` (for "value delivered" story)
- **Secondary**: `closing-deals` (renewal is closing), `expansion-playbook` (upsell), `customer-feedback-taxonomy`

## Execution Model

### How an agent runs

Each agent is defined as a file in `agents/<name>.md` with:
- Frontmatter declaring `name`, `description`, allowed tools, model preference, autonomy level
- Role / mission statement
- Input contract — what it receives
- Output contract — what it produces and where (vault note? external system? both?)
- Skills it may invoke (from the 203-skill library)
- Escalation rules — when to stop and ask the human
- Success criteria — how we know it worked

At runtime, Claude (or a subagent spawned via the Agent tool) reads the agent definition, executes the workflow, writes outputs to the vault or to the integration adapter, and fires escalation if rules trigger.

### How a workflow runs

Each workflow is defined as a file in `workflows/<name>.md` with:
- Trigger — what fires it (inbound form, cron, manual command, event)
- Steps — ordered list of agent invocations + decision points
- State management — where intermediate data lives (vault note path, usually)
- Guardrails — timeouts, retries, escalation
- Completion criteria — how we know the workflow is done

Workflows compose agents. Agents compose skills. Skills do the actual work.

### Where state lives

| State type | Location |
|---|---|
| Leads (qualified + disqualified) | `work/active/Restore Marketing Automation/leads/<lead-id>.md` |
| Active engagements | `work/active/Restore Marketing Automation/engagements/<client-slug>.md` |
| Proposals in flight | `work/active/Restore Marketing Automation/proposals/<proposal-id>.md` |
| Invoices | `work/active/Restore Marketing Automation/invoices/<invoice-id>.md` |
| Reports | `work/active/Restore Marketing Automation/reports/<client>-<period>.md` |
| Clients (long-term) | `org/people/<client-name>.md` or `org/teams/<client-company>.md` |
| Decisions log | `brain/Key Decisions.md` + project note |
| Agent run logs | `work/active/Restore Marketing Automation/runs/<date>-<agent>-<run-id>.md` |
| External system data | NOT in the vault — lives in CRM / invoicing tool / email / scheduler. Vault holds references only. |

### Integration layer

The `integrations.md` file defines an adapter pattern. Every external system call goes through an adapter function. Swap the adapter implementation, keep the workflow identical. See [[integrations]] for details.

## Sequencing — Build Order

From [[Automation#Build Order (Priority)]]:

1. **Invoicing** (Week 1-2) — agent + workflow + script, ships first, recovers cash + hours immediately
2. **Intake & Qualification** (Week 2-3) — stops funnel leaks
3. **Proposal** (Week 3-5) — biggest hour sink
4. **Onboarding** (Week 4-5, parallel with Proposal) — handles the post-close flow
5. **Reporting** (Week 6-7) — weekly + monthly reports
6. **Project Coordinator** (Week 7-8) — once there's real project volume
7. **Deliverable QC** (Week 8-9) — quality safety net
8. **Retention** (Week 10-12) — when first clients approach renewal

## Observability

See [[monitoring]] for the KPI definition. Summary:
- **Leading indicators** — leads/week, qualified/week, proposals/week, invoices/week
- **Lagging indicators** — revenue/month, retention rate, average deal size, owner hours recovered
- **Health indicators** — agent escalation rate, deliverable QC fail rate, invoice aging, workflow SLA compliance

## Open Architecture Questions

Captured in [[open-questions]]. Must be answered before the build goes live.

## Related

- [[README]] — project overview
- [[config]] — user config interface
- [[integrations]] — adapter spec
- [[runbook]] — daily operation
- [[escalation-rules]]
- [[monitoring]]
- [[Agent Orchestration Buildout]]
- [[Automation]]
