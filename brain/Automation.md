---
date: 2026-04-15
description: Q2 automation buildout playbook — strategy for replacing operator work with agents across Restore Marketing Co and HP Landscaping
tags: [brain, automation, agents, q2-2026]
type: brain
---

# Automation

> Q2 2026 focus per [[North Star]]: **build out agent orchestrations and have everything automated.** This note is the strategic playbook. The tactical buildout lives in [[Agent Orchestration Buildout]].

## The Thesis

Every hour the owner spends on recurring operator work is an hour not spent on deals, strategy, or exit. The Q2 buildout replaces the recurring work — not the occasional strategic work — with agents that run without the owner in the loop.

The target by end of Q2: **80% of recurring operator work runs automatically.** The owner only touches it when an agent escalates.

## What Counts as "Recurring Operator Work"

For both [[Restore Marketing Co]] and [[HP Landscaping]]:

| Category | Examples | Owner cost today |
|---|---|---|
| **Client intake** | New lead forms, qualification calls, intake paperwork | High — every new lead |
| **Proposal / estimate generation** | Scoping, pricing, writing proposals, sending estimates | High — every opportunity |
| **Invoicing** | Generate invoice, send, chase payment, mark paid | Medium — weekly |
| **Scheduling** | Match jobs/meetings to calendar, crew dispatch | High — daily for landscaping |
| **Deliverable review** | QC marketing deliverables, review before client sees them | High — per job |
| **Reporting** | Weekly revenue, pipeline, campaign performance | Medium — weekly |
| **Content / comms** | Social posts, email drafts, client check-ins | Medium — daily/weekly |

What does NOT get automated:
- Strategic decisions (pricing floors, who to hire, whether to take a job)
- Client relationships at the human level (big calls, meet-in-person)
- Creative directional work (new offer design, new service lines)
- M&A work (this stays human — see [[M&A Playbook]])

## Build Order (Priority)

The right order isn't "easiest first." It's "highest-leverage first" — what returns the most owner hours per build hour.

1. **Invoicing + payment chasing** (Week 1-2). Highest ROI. Directly recovers cash. Zero emotional load. Easy to template. Agents can literally do this today.
2. **Client intake + qualification** (Week 2-3). Every new lead either gets handled or drops. Automating the intake means the top of the funnel never leaks while the owner is busy.
3. **Proposal / estimate generation** (Week 3-5). Biggest owner-hour sink. Templatable per service line. Use `ui-ux-pro-max` for on-brand deliverables.
4. **Scheduling + dispatch** (Week 5-7). Landscaping-specific but massive for HP. Agent watches the calendar, assigns crews, sends confirmations.
5. **Weekly reporting** (Week 7-8). Pipeline, revenue, campaign performance — generated and delivered every Monday morning. Uses the `scientist` and `analyst` OMC agents.
6. **Content / social / email drafting** (Week 8-10). Lowest-urgency but high-volume. Use `writer` agent + `brand` skill for voice consistency.
7. **Deliverable review (QC agent)** (Week 10-12). Catches mistakes before the client sees them. Uses `code-reviewer` pattern but for creative output.

## Skill Composition Recipes

From the vendored [[Skills#Orchestration Bundle (oh-my-claudecode)|oh-my-claudecode]] + [[Skills#Design Skills (UI/UX Pro Max bundle)|UI/UX Pro Max]] bundles:

**For building any new automation**:
```
plan → ralph (autonomous loop) → verify → ai-slop-cleaner → commit
```

**For ambiguous or vague requests** (common when the user's too busy to spec clearly):
```
ralplan (consensus gate) → deep-interview (ambiguity crystallization) → ralph
```

**For client-facing deliverables** (proposals, campaigns, landing pages):
```
brand → design-system → ui-ux-pro-max (search relevant domain) → ui-styling → visual-verdict (QA)
```

**For recurring analysis** (weekly reports, pipeline health):
```
scientist agent + analyst agent running in parallel → synthesis
```

**For bug hunts on existing automations**:
```
trace → deep-interview → debugger agent → verify
```

## Open Questions (blocking or unknown)

- [ ] What's the current tech stack? (CRM, invoicing, scheduling — we automate around what exists)
- [ ] What's the budget tolerance for 3rd-party services? (Zapier / Make.com / n8n / custom Node / Claude-hosted?)
- [ ] Which company gets automated first, or parallel?
- [ ] Who touches the agents besides the owner? (employees? contractors? just you?)
- [ ] What's the current escalation rule — when should an agent stop and ask a human?

## Related
- [[North Star]]
- [[Agent Orchestration Buildout]] — the active work
- [[M&A Playbook]] — automation is exit-readiness
- [[Restore Marketing Co]]
- [[HP Landscaping]]
- [[Skills]]
