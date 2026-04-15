---
date: 2026-04-15
description: Onboarding agent — kicks off signed clients with welcome packet, access provisioning, brand audit, kick-off call brief
tags: [work-note, agent, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
agent_name: onboarding
autonomy_level: review-optional
---

# Onboarding Agent

## Role

Take a signed contract and produce everything the client needs in the first 48 hours: welcome packet, access credentials request, kick-off call brief, first-week expectations document, assigned project tracker. Set the bar high from minute one.

## Why This Matters

First impressions set the ceiling of the relationship. A smooth onboarding says "we're professional and we have a system." A clumsy onboarding says "you're going to have to chase me." This agent guarantees the smooth version every time.

## Input Contract

Triggered when `workflows/proposal-to-contract` marks a contract as `signed`. Inputs:

| Field | Source | Required |
|---|---|---|
| `client_company` | Contract | yes |
| `client_contact` | Contract | yes |
| `services_purchased` | Contract | yes |
| `engagement_start_date` | Contract | yes |
| `contract_value` | Contract | yes |
| `special_terms` | Contract fine print | optional |

## Workflow

1. **Create engagement record** — write `work/active/Restore Marketing Automation/engagements/<client-slug>.md` with frontmatter + status = `onboarding`. This becomes the long-term note for the client relationship.

2. **Create client node** — if this is a new client, create `org/teams/<client-company>.md` and `org/people/<contact-name>.md` following vault conventions. Link bidirectionally to the engagement.

3. **Generate welcome packet** — compose a `docx`/`pdf` with:
   - Warm welcome from owner (pulled from `config.brand.voice_attributes`)
   - What to expect in week 1, week 2, week 4
   - Who does what (owner + any team members from `config.team`)
   - Communication rhythm (weekly check-in time, response SLAs)
   - How to reach the owner for urgent matters
   - Access-needed checklist (GA4, CMS, ad accounts, social, etc. — filtered by `services_purchased`)

4. **Request access** — generate a structured access request email to the client listing exactly what credentials are needed. Template uses `internal-comms` skill for tone.

5. **Run a client brand audit** — call `market-brand` skill against the client's current public-facing brand. Capture findings in the engagement note. This becomes input for the first deliverable.

6. **Kick-off call brief** — compose a brief for the owner using `prepare-call` command:
   - Background on the client
   - Services purchased and expected deliverables
   - Access status (what we have, what we're waiting on)
   - Brand audit top 5 findings
   - Suggested agenda
   - 3 questions to ask

7. **Book the kick-off call** — via scheduling adapter (Cal.com / Calendly), propose 3 slots in the owner's business hours next 5 business days. Client picks one.

8. **Notify owner** — post summary to escalation channel with:
   - Link to engagement note
   - Link to welcome packet files
   - Kick-off call options
   - Access checklist (what to ask for)
   - Any special terms from contract that need attention

## Output Contract

Files produced:
- `work/active/Restore Marketing Automation/engagements/<slug>.md` — long-term engagement note
- `engagements/<slug>/welcome-packet.docx` + `.pdf`
- `engagements/<slug>/access-checklist.md`
- `engagements/<slug>/kickoff-brief.md`
- `engagements/<slug>/brand-audit.md`

Plus new/updated nodes in `org/teams/` and `org/people/`.

Plus an outbound access-request email (draft, sent if `config.features.auto_onboarding_email = true`; otherwise routed to owner inbox for send).

## Skills Invoked

- **Primary**: `doc-coauthoring` (structured docs), `internal-comms` (email templates), `brand` (voice), `market-brand` (client brand audit)
- **Secondary**: `market-audit` (comprehensive audit if services include one), `building-brand` (positioning analysis), `customer-research` (if we need to dig deeper on their market)
- **Support**: `prepare-call`, `pptx` (if kick-off needs slides), `design` (welcome-packet visuals)

## Autonomy Level

Default: `review-optional`. Agent produces everything, routes to owner for passive review, then acts. Owner can intercept within a configurable window (default 2 business hours) before the client-facing emails send.

## Escalation Rules

- Contract contains terms not in standard template (manual legal review required)
- Services purchased don't map cleanly to `config.services`
- Client is in same industry as existing client (competing-clients flag from CRM)
- `special_terms` field in contract is non-empty
- Access request would conflict with the client's data/privacy policy stated in their form

## Success Criteria

- Welcome packet ready within 1 hour of contract signature
- Kick-off call booked within 5 business days of signature
- 100% of clients receive same baseline onboarding (no forgotten steps)
- Owner spends < 15 minutes on onboarding per new client (was: several hours)
- Client-reported onboarding NPS ≥ 9/10 (survey sent after kick-off call)

## Related

- [[00-architecture#Onboarding Agent]]
- [[workflows/client-onboarding]]
- [[agents/proposal-agent]]
- [[agents/project-coordinator-agent]]
