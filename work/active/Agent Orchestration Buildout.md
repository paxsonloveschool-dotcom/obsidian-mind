---
date: 2026-04-15
description: Q2 2026 primary project — build agent orchestrations that replace 80% of recurring operator work across Restore Marketing Co and HP Landscaping
tags: [work-note, project, q2-2026, automation]
type: work-note
status: active
quarter: Q2-2026
project: agent-orchestration-buildout
---

# Agent Orchestration Buildout

> **Q2 2026 primary project.** Every other active work note this quarter should either contribute to this buildout or be explicitly non-related. Ties directly to [[North Star]] Q2 focus and [[Automation]] strategy.

## Context

Both [[Restore Marketing Co]] and [[HP Landscaping]] are owner-dependent — the founder does the work. This is the bottleneck that blocks the 2029 M&A vision ([[M&A Playbook]]). Q2 is the build quarter: replace recurring operator work with agents so the owner can shift to strategic / M&A / exit work.

**Success criteria for the end of Q2**: 80% of recurring operator tasks (intake, estimates, invoicing, scheduling, QC, reporting) run without the owner in the loop on a typical day. The owner only touches an agent when it escalates.

## What / Why

| What | Why |
|---|---|
| Build and deploy 7 priority agents (see build order below) | Replaces the highest-leverage owner hours first |
| Route everything through the vault | Persistent memory across sessions — Claude compounds knowledge instead of starting fresh every time |
| Use the `oh-my-claudecode` orchestration bundle | We just installed it. It's purpose-built for this kind of multi-agent coordination. |
| Use UI/UX Pro Max for client-facing deliverables | Proposals, landing pages, email templates — on-brand, accessible, professional |

## Build Order (Priority)

See [[Automation#Build Order (Priority)]] for the full rationale. Summary:

1. [ ] **Invoicing + payment chasing** (Week 1-2, highest ROI)
2. [ ] **Client intake + qualification** (Week 2-3, stops funnel leaks)
3. [ ] **Proposal / estimate generation** (Week 3-5, biggest hour sink)
4. [ ] **Scheduling + dispatch** (Week 5-7, HP Landscaping critical)
5. [ ] **Weekly reporting** (Week 7-8, pipeline + revenue)
6. [ ] **Content / social / email drafting** (Week 8-10, volume play)
7. [ ] **Deliverable QC agent** (Week 10-12, quality safety net)

## Per-Business Sub-Projects

- [[Restore Marketing Automation/README|Restore Marketing Co Automation]] — **scaffolding complete, awaiting owner config + credentials.** 8 agents, 7 workflows, 4 executable scripts, full architecture, runbook, escalation rules, monitoring. See [[Restore Marketing Automation/open-questions|open questions]] for what's blocking go-live.
- [ ] **HP Landscaping Automation** — not yet built. Different schema (seasonal, route-based, crew-dispatched, local). Will be forked from the Restore structure after Restore v0.1 ships.

## Composition

Skills available for this work (all vendored into `.claude/skills/`):

- **Planning**: `plan`, `ralplan`, `deep-dive`, `deep-interview`
- **Execution**: `autopilot`, `ralph` (self-referential loop), `ultrawork` (parallel throughput)
- **Verification**: `verify`, `visual-verdict`, `ai-slop-cleaner`
- **Memory**: `wiki`, `remember`, `writer-memory`, `learner`
- **Design** (for client-facing deliverables): `ui-ux-pro-max`, `brand`, `design-system`, `ui-styling`, `banner-design`, `slides`
- **Agents**: `architect`, `planner`, `executor`, `designer`, `verifier`, `writer`, `debugger`, `test-engineer`, `scientist`, `analyst`

## Open Questions (blocking before full buildout)

- [ ] What's the current tech stack per company? (CRM, invoicing, scheduling tools)
- [ ] Budget tolerance for 3rd-party services? (Zapier / Make / n8n / custom / Claude-hosted agents)
- [ ] Automations parallel across both companies, or HP first / Restore first?
- [ ] Who else touches the agents? (just you? employees? contractors?)
- [ ] Escalation rules — when must an agent stop and ask a human?

## Action Items
- [ ] Answer the 5 open questions above (owner input required)
- [ ] Build invoicing + payment chasing agent (v0.1)
- [ ] Build client intake + qualification agent (v0.1)
- [ ] Pick CRM / source of truth for client data
- [ ] Decide on agent hosting (run locally? Claude-hosted? agents-as-a-service?)

## Related
- [[North Star]]
- [[Automation]]
- [[M&A Playbook]]
- [[Restore Marketing Co]]
- [[HP Landscaping]]
- [[Skills]]
