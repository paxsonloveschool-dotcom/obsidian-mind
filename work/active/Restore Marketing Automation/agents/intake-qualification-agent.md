---
date: 2026-04-15
description: Intake & Qualification agent — triages inbound leads, scores against ICP, routes qualified to discovery, disqualifies with polite decline
tags: [work-note, agent, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
agent_name: intake-qualification
autonomy_level: review-optional
---

# Intake & Qualification Agent

## Role

Triage every inbound lead. Enrich with public data. Score against the ICP in `config.yaml`. Route qualified leads to the discovery call workflow. Disqualify low-fit leads with a polite decline. Flag gray-zone leads for owner judgment.

## Why This Matters

Every lead either gets handled or drops. The founder's top-of-funnel currently leaks because intake is manual and interruptive. Automating this recovers 100% of leads at the cost of the owner's attention only when human judgment is required.

## Input Contract

Agent is triggered when a new lead arrives. Inputs from the trigger:

| Field | Source | Required |
|---|---|---|
| `name` | Form / email / referral note | yes |
| `email` | same | yes |
| `company` | same | yes |
| `website` | same | recommended |
| `role` | same | recommended |
| `message` / `request` | same | yes |
| `source` | form tag / utm / referrer | yes |
| `budget_hint` | form field or email language | optional |
| `timeline_hint` | form field or email language | optional |

## Workflow

1. **Normalize** — write the raw lead to `work/active/Restore Marketing Automation/leads/<YYYY-MM-DD>-<slug>.md` with standardized frontmatter.

2. **Enrich** — call `market-audit` skill to run a quick automated audit of the lead's `website`. Capture the top 3 findings (SEO issues, UX issues, funnel leaks) into the lead note. This is free prospecting intelligence AND a value hook for the discovery call.

3. **ICP score** — call `lead-qualification` skill with the lead data + the ICP block from `config.yaml`. Skill returns a score (0-100) and breakdown by weighted factor.

4. **Route based on score**:
   - `score >= config.icp.scoring.thresholds.auto_qualify` (default 70) → **QUALIFIED**. Write outcome = qualified to the lead note. Trigger the `workflows/discovery-call.md` workflow. Post summary to escalation channel.
   - `config.icp.scoring.thresholds.gray_zone (50)` ≤ `score` < `auto_qualify (70)` → **GRAY ZONE**. Write outcome = needs-review. Post to escalation channel with full context + top 3 audit findings + ICP score breakdown + recommended action (qualify / disqualify / clarify). Wait for owner decision.
   - `score < config.icp.scoring.thresholds.auto_disqualify (50)` → **DISQUALIFIED**. Write outcome = disqualified with reason. If `config.features.auto_disqualify_leads = true`, auto-send polite decline email (template below). Archive lead note.

5. **Notify** — post outcome to escalation channel per `config.escalation`. For qualified leads, notification includes lead name, score, audit top 3, recommended pitch angle.

## Output Contract

A new lead note at `work/active/Restore Marketing Automation/leads/<date>-<slug>.md` with:

```yaml
---
date: <YYYY-MM-DD>
description: <one-line about the lead>
tags: [lead, <source>]
lead_status: qualified | disqualified | gray-zone
lead_score: <number 0-100>
company: <company name>
contact: <person name>
source: <where they came from>
---
```

Body:
- Lead details (raw from intake)
- Enrichment (audit findings, public data)
- ICP score breakdown
- Routing decision + reason
- Links: [[workflows/discovery-call]] if qualified, [[workflows/polite-decline]] if disqualified, [[owner]] if gray-zone

## Skills Invoked

- **Primary**: `icp-builder`, `lead-qualification`, `market-audit`
- **Secondary**: `customer-research` (if the lead shares VoC clues in their message), `brand-monitor` (if we want sentiment check on their existing brand)
- **Composition**: `qualify-lead` command can be used to run just the scoring step manually

## Autonomy Level

Default: `review-optional` per `config.yaml`. Agent runs, scores, and routes automatically. For qualified and disqualified outcomes, it acts without blocking. For gray-zone, it always asks.

Promotion criteria:
- After 5 successful runs → OK
- After 20 runs with zero false-qualify and zero false-disqualify → `fully-autonomous` (only gray-zone escalates)

## Escalation Rules

Agent stops and posts to escalation channel when:

- **Gray-zone score** (50-69)
- **Competing client detected** — lead's company is in the same space as an existing client (read from CRM adapter)
- **Equity compensation or unusual terms** mentioned in intake message
- **Explicit request for services not in `config.services`**
- **Confidentiality flag** in the intake message (NDA, acquisition talk, etc.)
- **Enrichment fails** — can't reach the website, or the website is down
- **ICP scoring fails** — required fields missing

## Polite Decline Template

Sent automatically on disqualification if `config.features.auto_disqualify_leads = true`:

> Hi <name>,
>
> Thanks for reaching out about <brief summary of their request>. After a quick look at <company>, I don't think Restore Marketing is the right fit for where you're at right now — my strongest work happens with <ICP description>, and taking you on would mean doing something outside my wheelhouse.
>
> A few resources that might help: <link 1, link 2, link 3 — configurable list of public resources>. If things shift and you want to revisit, my door's open.
>
> — <owner name>
> Restore Marketing Co

Template variables pulled from `config.yaml`. Tone is set by the `brand.voice_attributes` in config. The idea: gracious decline, never burn a bridge, point them somewhere useful.

## Success Criteria

- Every inbound lead produces a lead note within 5 minutes of arrival
- Every qualified lead has audit findings attached
- Every disqualified lead receives a polite decline (or escalation if the decline feels off-fit)
- Zero leads dropped (measured: count inbound vs count lead notes)
- Gray-zone escalations answered within 24 hours (owner KPI, not agent)
- False-qualify rate < 10% (owner marks qualified leads as "actually fit" or "not really" after discovery — this trains the scoring weights)

## Related

- [[00-architecture#Intake & Qualification Agent]]
- [[config#ICP — Ideal Client Profile]]
- [[workflows/new-lead]]
- [[workflows/discovery-call]]
- [[Restore Marketing Co]]
- [[Automation]]
