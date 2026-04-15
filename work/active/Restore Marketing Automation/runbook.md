---
date: 2026-04-15
description: Restore Marketing automation runbook — how to operate the system day-to-day, week-to-week, month-to-month
tags: [work-note, runbook, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
---

# Runbook

> How the owner operates the automation system day-to-day. If you only read one doc in this project, read this one.

## Pre-Flight: Before You Go Live

These must be done in order before any automation ships:

1. **Fill in [[config]]** completely. Every TODO in `config.yaml` needs a real value. Skipped values = broken agents.
2. **Pick your tech stack** per [[integrations]]. One provider per category.
3. **Create `.env`** at the repo root with credentials for each chosen provider. Verify `.env` is in `.gitignore`.
4. **Answer the [[open-questions]]**. All 5 must be answered before the Invoicing agent ships (it's the first one, it touches money, it needs clarity).
5. **Review this runbook** — understand the daily/weekly/monthly rhythm so you know what to look for.

## Daily Rhythm

### Morning (08:00-09:00)
Claude (or the harness) fires the SessionStart hook. You'll see:
- North Star reminder
- Active work
- Recent git changes
- **Owner dashboard** from [[agents/reporting-agent]] — pipeline, revenue, engagement health, agent health, owner hours recovered
- **New escalations overnight** — anything the agents asked you to decide

**Your job**: 5 minutes to skim, 15 minutes to resolve escalations. Anything that needs a real conversation goes on your calendar.

### Throughout the day
- Agents run workflows autonomously per config
- Escalations come in as they happen — vault-only by default (check your `runs/` folder) or configured channel
- Client messages flow through [[agents/project-coordinator-agent]] — it drafts responses for your review where appropriate

### End of day (17:00)
- [[agents/project-coordinator-agent]] end-of-day pass runs
- Produces `runs/<date>-coordinator-evening.md` — what moved, what didn't, what's at risk tomorrow
- Any 48+ hour slips escalate

### Before you stop (when you say "wrap up")
- Run `/wrap-up` — captures today's context, links new notes, checks for orphans
- Review the day's escalations — any that are still open?
- Push a git commit if there are changes (`git add -A && git commit -m "day close: <yyyy-mm-dd>"`)

## Weekly Rhythm

### Monday 06:00 — Owner Dashboard
Before any client reports, you get the full business view:
- Pipeline / Revenue / Engagement Health / Agent Health / Owner Hours / Q2 progress / North Star alignment
- Location: `runs/<YYYY-MM-DD>-owner-dashboard.md`

### Monday 08:00 — Client Reports
- Every active engagement gets its weekly report sent automatically
- You review delivery status in the dashboard
- Any failures escalate

### Monday morning review (09:00-10:00)
Your weekly strategic review. Not automated — this is where you think.
- Read the dashboard
- Answer any gray-zone leads, proposal approvals, renewal briefs waiting
- Check Q2 progress (are we on track for 80% automation by EOQ2?)
- Answer "what do I not want to do this week that I should automate?"

### Friday 15:00 — Week Wrap
- Run `/weekly` command — cross-session synthesis, pattern-match, uncaptured wins
- Confirm no open escalations rolling into next week
- Any at-risk engagements get direct owner attention over the weekend (call / email / whatever)

## Monthly Rhythm

### 1st of month 09:00 — Invoicing Cycle
[[workflows/monthly-invoicing]] runs automatically:
1. All retainer invoices generated
2. Batch lands in your escalation channel for review
3. You approve / edit / reject
4. Approved batch goes out
5. Chase cadence + reconciliation runs the rest of the month

**Owner task**: Review the batch when it lands (~5-10 minutes). Nothing else.

### Last day of month 19:00 — Month Close
- [[agents/invoicing-agent]] runs reconciliation
- [[agents/reporting-agent]] runs monthly rollup
- You get: total invoiced, received, outstanding, aging, MRR/ARR, DSO, top wins, top losses
- Feeds directly into your Q2 progress tracking

### Last week of month — Renewal Briefs
Any engagements with renewal dates in the next 30-60 days get briefs prepared automatically (see [[workflows/renewal]]). Owner reviews + schedules the renewal conversation.

### First week of month — Pattern Review
Run `/weekly` with monthly lens. Look for:
- Agents that escalated too often → tune their autonomy or logic
- Workflows that slipped → investigate + fix
- Clients that trended down → get ahead of churn
- Owner hours: which tasks still consumed the most?

## When an Agent Escalates

Every agent has escalation rules. When one triggers:

1. **Read the escalation post** — context is included
2. **Decide** — the agent will wait for your call
3. **Respond** — via the configured channel (vault note, Slack message, email reply, whatever `config.escalation.primary_channel` is)
4. **Move on** — the agent picks up the decision and continues

**Response SLA expectations** (these are YOUR SLAs, not the agent's):
- Critical (client churn signal, invoice > $5k) → within 2 hours business day
- Normal (gray-zone lead, proposal approval) → within 24 hours
- Low (FYI, passive review) → no SLA, whenever

## When Something Breaks

### An agent is failing silently
- Check `runs/<date>-<agent>-<run-id>.md` for the last few runs
- Look for error patterns — integration adapter error? Data source issue? Config mismatch?
- Fix root cause (don't just clear the error)
- Log the fix in [[Gotchas]]

### An integration adapter is down
- Check `.env` credentials haven't expired
- Check the provider's status page
- Fallback: agent queues work for retry; if queue exceeds 1 hour, you handle manually
- Restore integration ASAP, agent resumes from queue

### The vault is getting cluttered
- Run `/vault-audit` — invokes `vault-librarian` subagent to check orphans, broken links, stale notes
- Run `/project-archive` on any completed engagements to move them to archive

### You want to change how an agent behaves
- Edit the agent's `.md` file in `agents/`
- Version the change in git
- Agents reload on next run — no restart needed
- If it's a big change, add a [[Key Decisions]] entry

## Growing the System

### Adding a new service to the catalog
1. Add to `config.services`
2. Update any templates that reference services
3. [[agents/proposal-agent]] picks it up on next run

### Adding a new team member / contractor
1. Add to `config.team.members`
2. Set their `can_approve_*` flags
3. [[agents/project-coordinator-agent]] starts including them in assignment logic

### Adding a new client integration requirement
1. If it's a one-off (client has a weird CRM), write a custom adapter in `scripts/adapters/<client>-<tool>.py`
2. Reference it from the engagement note
3. Don't generalize until 3+ clients need it

### Adding a new workflow
1. Write `workflows/<name>.md` following the template structure
2. Define trigger, steps, agents invoked, guardrails, observability
3. Test manually before enabling the trigger
4. Promote to autonomous after 5+ successful runs

### Adding a new agent
1. Write `agents/<name>.md` following the template structure
2. Define role, I/O, skills, autonomy, escalation
3. Start at `review-required`
4. Graduate autonomy based on track record

## Things You Should NEVER Do

- Commit `.env` or any file with credentials
- Let an agent run in `fully-autonomous` mode without first running `review-required` for at least 5 runs
- Ignore an escalation for > 48 hours (the whole system assumes you respond)
- Delete a workflow run log (they're the audit trail)
- Bypass QC on client deliverables to ship faster
- Automate a task you don't understand — build it manually first, then codify

## Related

- [[README]]
- [[00-architecture]]
- [[config]]
- [[integrations]]
- [[escalation-rules]]
- [[monitoring]]
- [[open-questions]]
- [[Agent Orchestration Buildout]]
- [[CLAUDE#Second Brain Mandate]]
