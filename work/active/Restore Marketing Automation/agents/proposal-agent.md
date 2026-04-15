---
date: 2026-04-15
description: Proposal agent — drafts custom proposals from discovery call data and service catalog, produces client-ready docx/pdf, routes to owner for approval
tags: [work-note, agent, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
agent_name: proposal
autonomy_level: review-required
---

# Proposal Agent

## Role

Turn a completed discovery call into a fully drafted, on-brand, client-ready proposal. Compose scope, pricing, timeline, terms. Produce both `docx` and `pdf` versions. Route to owner for approval before sending.

## Why This Matters

Proposal writing is the biggest owner-hour sink for most marketing agencies — it's repetitive, templatable, but every one needs customization. Automating the draft while keeping the owner in the approval loop reclaims ~80% of proposal time while preserving the judgment call about scope and pricing.

## Input Contract

Triggered by the discovery-call workflow marking a call as "ready for proposal." Inputs:

| Field | Source | Required |
|---|---|---|
| `lead_note` | Path to the qualified lead note | yes |
| `discovery_notes` | Call transcript / notes (captured during discovery) | yes |
| `services_requested` | List of service IDs from `config.services` | yes |
| `budget_signal` | What client indicated re budget | yes |
| `timeline_signal` | What client indicated re urgency | yes |
| `custom_scope_items` | Anything outside standard catalog | optional |
| `competitors_mentioned` | Who else client is evaluating | optional |

## Workflow

1. **Pull context** — read:
   - `config.yaml` (company, services, pricing rules, brand voice)
   - The lead note (enrichment, audit findings, ICP score breakdown)
   - The discovery notes
   - Past proposals to similar clients (from `proposals/` directory) for style consistency

2. **Compose scope** — call `market-proposal` skill with:
   - Services from `services_requested`
   - Deliverables pulled from `config.services[].deliverables`
   - Custom items from `custom_scope_items`
   - Timeline adjusted for `timeline_signal`

3. **Price** — compute total based on `config.services[].pricing`:
   - Fixed: sum of selected services' `amount`
   - Retainer: compute per-month total + multiplied by `config.pricing_rules.retainer_commitment_months`
   - Hourly: estimate hours × hourly rate
   - Apply up to `config.pricing_rules.discount_ceiling_pct` if discovery notes suggest price sensitivity
   - **If total is below `config.pricing_rules.minimum_deal_size` OR above `config.pricing_rules.maximum_auto_approved` → ESCALATE**, do not draft

4. **Apply positioning hooks** — use the audit findings from the lead note to frame the proposal around specific pain points. Call `marketing-psychology` for framing primitives if needed.

5. **Draft narrative** — using `brand.voice_attributes` from config, draft:
   - Cover / intro
   - Understanding of the problem (from discovery + audit)
   - Proposed approach (per service)
   - Deliverables timeline
   - Pricing + payment terms (from `config.pricing_rules.payment_terms_default`)
   - Why Restore (brand story, social proof, guarantees)
   - Next steps

6. **Render** — compose into `docx` via the `docx` skill using a template from `scripts/templates/proposal-template.docx` (owner provides once; agent reuses). Also render to `pdf` via the `pdf` skill for the client-ready version.

7. **Save** — write the draft to `work/active/Restore Marketing Automation/proposals/<YYYY-MM-DD>-<client-slug>.md` (metadata + narrative) + render files to `proposals/<slug>/proposal.docx` and `proposals/<slug>/proposal.pdf`.

8. **Escalate to owner** — post summary to escalation channel:
   - Client + lead score
   - Services proposed + pricing
   - Scope highlights
   - Risk flags (discount applied, unusual terms, pricing floor edge case)
   - Links to vault note + rendered files
   - Decision needed: **approve / revise / kill**

9. **On owner approval** — mark proposal status `approved`, hand off to workflow's "send proposal" step (email + tracking + auto-follow-up after 3/7/14 days if unopened).

## Output Contract

A proposal note at `proposals/<YYYY-MM-DD>-<client-slug>.md`:

```yaml
---
date: <YYYY-MM-DD>
description: <client + deal size>
tags: [proposal, restore-marketing-co]
proposal_status: drafted | approved | sent | accepted | lost
lead: [[leads/<lead-slug>]]
client_company: <company>
client_contact: <name>
deal_value_usd: <number>
services: [<service ids>]
discount_pct: <number>
sent_date: <date-or-null>
response_by: <date-or-null>
---
```

Body: full narrative + link to rendered `docx` + `pdf`.

## Skills Invoked

- **Primary**: `market-proposal` (core generator), `docx` (Word output), `pdf` (PDF output), `market-landing` (if proposal includes landing page work)
- **Secondary**: `marketing-psychology` (framing), `building-brand` (positioning), `customer-research` (competitive angle), `pricing-strategy` (price anchoring)
- **Design**: `ui-ux-pro-max`, `brand`, `design-system`, `design` (for visual consistency with Restore's brand)
- **Review**: `code-reviewer` or `critic` agent to check the draft before escalation

## Autonomy Level

Default: `review-required`. Proposals always get owner eyes before sending. This is non-negotiable in v0.1 — proposals set the tone of the relationship and the pricing anchor.

Promotion path: after 10 approved-without-edits runs, consider promoting to `review-optional` for small deals (below some threshold), keeping `review-required` for large ones.

## Escalation Rules

Agent stops and asks before drafting when:
- Deal total is below `pricing_rules.minimum_deal_size`
- Deal total is above `pricing_rules.maximum_auto_approved`
- Client requests services not in `config.services`
- Client requests payment terms different from default
- Client asks for equity / performance / barter / non-standard structures
- Discovery notes mention confidentiality or acquisition
- Timeline requested is shorter than `config.services[].typical_timeline_days × 0.5`

## Success Criteria

- Draft quality: 80%+ of drafts approved without edits after 2 months of tuning
- Time-to-draft: < 5 minutes from discovery-call-done trigger
- Owner time-to-approve: < 10 minutes (the draft should be 95% ready)
- Close rate on sent proposals: baseline measured at `config.kpi_targets.proposal_to_close_rate_pct` (default 25%), tune upward
- Zero proposals sent that fall outside pricing rules

## Related

- [[00-architecture#Proposal Agent]]
- [[config#SERVICES]]
- [[config#PRICING FLOOR & APPROVAL RULES]]
- [[workflows/proposal-to-contract]]
- [[agents/intake-qualification-agent]]
- [[agents/onboarding-agent]]
