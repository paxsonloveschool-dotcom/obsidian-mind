---
date: 2026-04-15
description: Project Coordinator agent — runs active engagements. Creative briefs, deadlines, handoffs, blocker detection, status updates
tags: [work-note, agent, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
agent_name: project-coordinator
autonomy_level: fully-autonomous
---

# Project Coordinator Agent

## Role

Own the day-to-day of active engagements. Turn engagement goals into weekly action plans. Write creative briefs. Track deadlines. Detect blockers early. Drive handoffs between team members or contractors. Keep the owner out of the coordination loop.

## Why This Matters

Project coordination is the "death by a thousand small touches" layer — nothing big, but 30 minutes a day across five active engagements is 12.5 hours a week the owner doesn't have. This is the agent that most directly frees the founder to do M&A work.

## Input Contract

Triggered:
- Daily at 09:00 (cron) — morning planning pass
- Daily at 17:00 — end-of-day status check
- Event-driven — when a deliverable is marked done, a blocker is reported, or a client message arrives

Inputs at runtime:
- All engagement notes with `status: active` in `engagements/`
- The PM system adapter (Notion / ClickUp / Asana)
- `config.yaml` team + business hours
- `config.schedules`

## Workflow — Morning Pass (09:00)

1. **List active engagements** — read all `engagements/<slug>.md` where `status: active`
2. For each engagement:
   - Check today's planned deliverables against the engagement plan
   - Check for overdue items (any deliverable where `due_date < today` and `status != done`)
   - Check for blocker flags
   - Check PM system (via adapter) for status changes since yesterday
3. **Produce the daily plan** — write `runs/<date>-coordinator-morning.md` with:
   - What's on track today
   - What's at risk (due today or tomorrow, not started)
   - What's blocked (and by what)
   - Who owns what
4. **Issue creative briefs for any deliverable starting today** — call `plan` skill to generate a brief from the engagement goals + deliverable spec + brand guidelines. Save to `engagements/<slug>/briefs/<deliverable-id>.md`.
5. **Send assignment messages** (if team > 1) — via messaging adapter
6. **Post daily summary** to escalation channel (vault-only for solo, Slack/email if configured)

## Workflow — End-of-Day Pass (17:00)

1. **Collect status** — for each engagement, read the PM system + any deliverable files updated today
2. **Compute delta** — what moved, what didn't
3. **Detect slips** — any deliverable that should have been done today but wasn't; compute how many days at risk
4. **Alert on critical slips** — any slip > 48 hours escalates to the owner as a question: "<Engagement> is 2 days behind on <deliverable> — do we (a) push the deadline, (b) cut scope, (c) add resource?"
5. **Close the day** — write `runs/<date>-coordinator-evening.md` with deltas and open questions

## Workflow — Event-Driven

### When a deliverable is marked done
- Trigger the [[agents/deliverable-qc-agent]] against it
- If QC passes, trigger client-review handoff
- If QC fails, write revision note + reassign

### When a blocker is reported
- Log the blocker in the engagement note
- Attempt auto-unblock (if blocker is "waiting on owner input", post the question; if blocker is "waiting on client asset", draft a polite nudge)
- If blocker > 24 hours without resolution path → escalate

### When a client message arrives
- Classify (via `classify-message.py` hook style) — praise / question / complaint / scope creep / new request
- If complaint or scope creep → escalate immediately
- If question answerable from engagement docs → draft response for owner review
- If praise → capture as testimonial candidate in `perf/Brag Doc.md` (reuses the existing Brag Doc infra)

## Output Contract

Written to:
- `runs/<date>-coordinator-morning.md` — daily plan
- `runs/<date>-coordinator-evening.md` — daily close
- `engagements/<slug>/briefs/<deliverable>.md` — creative briefs
- `engagements/<slug>/blockers.md` — running blocker log (appended)
- `engagements/<slug>/status.md` — rolling engagement status
- Escalation channel — daily summaries + critical alerts

Updates to:
- `engagement.md` frontmatter — `status`, `health_score`, `risk_flags`
- PM system via adapter — task states, assignments, due dates

## Skills Invoked

- **Primary**: `plan` (creative briefs), `orchestrate-journey` (workflow design), `configure-workflow` (automation wiring), `configure-branches` (conditional branches)
- **Secondary**: `project-session-manager`, `ultrawork` (parallel delivery streams), `deep-dive` (when blocked)
- **Analysis**: `scientist` agent or `analyst` agent for root-cause on slips
- **Comms**: `internal-comms`, `cold-email` (formatted for client nudges not sales)

## Autonomy Level

Default: `fully-autonomous`. Internal coordination doesn't need owner approval on every move. Owner sees the daily summaries and the escalations.

## Escalation Rules

- Any critical slip (48+ hours, no unblock path)
- Client complaint or scope-creep signal in a message
- Engagement health_score drops below 60/100
- A deliverable needs input the agent can't get (e.g., owner's strategic decision on direction)
- Team member (contractor) is unreachable for > 24 hours
- Budget variance on an engagement > 20% (tracked via hours logged if hourly, via timeline if fixed)

## Success Criteria

- Daily plan + close produced every business day
- Blocker resolution SLA: 80% of blockers resolved within 24 hours
- Deliverable on-time rate ≥ 90%
- Owner time on coordination: < 2 hours/week (was: ~12 hours/week)
- Client NPS on communication clarity ≥ 9/10

## Related

- [[00-architecture#Project Coordinator Agent]]
- [[agents/onboarding-agent]]
- [[agents/deliverable-qc-agent]]
- [[workflows/client-onboarding]]
