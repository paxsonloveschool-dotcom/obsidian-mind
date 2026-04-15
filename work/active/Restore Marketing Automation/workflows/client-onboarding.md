---
date: 2026-04-15
description: Client onboarding workflow — from signed contract to first deliverable shipped
tags: [work-note, workflow, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
workflow_name: client-onboarding
---

# Workflow: Client Onboarding

> From "contract signed + deposit paid" to "first deliverable in client's hands."

## Trigger

[[workflows/proposal-to-contract]] completes successfully (deposit paid).

## Steps

### Step 1 — Engagement Record Creation
**Agent**: [[agents/onboarding-agent]]
- Create `engagements/<client-slug>.md` with full frontmatter
- Create or update `org/teams/<client-company>.md`
- Create or update `org/people/<contact-name>.md`
- Link bidirectionally (engagement ↔ team ↔ person ↔ original proposal)
- Update CRM via adapter: lead → customer status

### Step 2 — Welcome Packet
- Compose welcome packet via `doc-coauthoring` skill + `brand` voice
- Sections: welcome, week-by-week expectations, communication rhythm, who does what, escalation path, access checklist
- Render `docx` + `pdf` via `docx` and `pdf` skills
- Save to `engagements/<slug>/welcome-packet.*`

### Step 3 — Access Request Email
- Compose access request per the service types purchased
- Access matrix (examples — tune per service):
  - SEO/content: CMS admin, GA4, Search Console, Ahrefs (if they have)
  - Paid ads: ad accounts (Google, Meta, LinkedIn), billing
  - Email/lifecycle: ESP (Klaviyo, Mailchimp, etc.), list access
  - Social: page admin, content calendar tool
  - Web/design: CMS, design system, brand assets folder
- Draft email via `internal-comms` skill, route to owner for review (v0.1) or auto-send (later)

### Step 4 — Client Brand + Baseline Audit
- Run `market-brand` and `market-audit` on the client's current state
- Capture:
  - Current brand voice analysis
  - Current site performance baseline
  - Current content performance baseline
  - Competitive position
  - Quick wins (top 5 things we'd fix in week 1)
- Save to `engagements/<slug>/baseline-audit.md`
- This becomes input for the first deliverable + the baseline for future reports

### Step 5 — Kick-Off Call Brief
**Command**: `prepare-call`
- Compose brief for owner using the engagement + baseline audit
- Include suggested agenda, 3 questions to ask, 3 things to confirm, risks to watch
- Save to `engagements/<slug>/kickoff-brief.md`
- Post to escalation channel

### Step 6 — Book Kick-Off Call
- Via scheduling adapter: send booking link with 3 slots in next 5 business days
- Client books → event recorded
- Owner and client get calendar invite + pre-read packet

### Step 7 — First-Week Plan
- Compose the first 7 days of deliverables based on services purchased
- Use `plan` skill to break down
- Create individual deliverable entries in `engagements/<slug>/deliverables/`
- Assign to team members per `config.team`
- Hand off to [[agents/project-coordinator-agent]]

### Step 8 — Completion
- Mark onboarding status = `complete`
- Update engagement.status = `active`
- Notify owner: "onboarding done, project coordinator has taken over"

## State Transitions

```
signed → creating_records → welcome_packet → access_requested → baseline_audit → kickoff_briefed → kickoff_booked → first_week_planned → active
```

## Guardrails

- **Whole-onboarding SLA**: ≤ 48 hours from deposit paid to onboarding complete
- **Kick-off call SLA**: Booked within 5 business days, held within 10 business days
- **No client touchpoint without owner approval** in v0.1 — every client-facing email gets approved
- **Parallel runs allowed**: Multiple onboardings can run concurrently without interference

## Observability

`runs/<date>-onboarding-<client>.md`:
- Time in each state
- Owner approval latency per client touchpoint
- Access-request completion rate (how many did the client actually provide?)
- First-deliverable ship time

## Completion Criteria

- Engagement note exists and is linked
- Team + person nodes exist and link back
- Welcome packet delivered
- Access requested (and received / pending tracked)
- Baseline audit captured
- Kick-off call held
- First-week plan assigned
- Project coordinator notified and has picked up the engagement

## Related

- [[agents/onboarding-agent]]
- [[agents/project-coordinator-agent]]
- [[workflows/proposal-to-contract]]
