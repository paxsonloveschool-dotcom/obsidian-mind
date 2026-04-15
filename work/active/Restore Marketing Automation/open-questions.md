---
date: 2026-04-15
description: Open questions that block the automation from going live — answers needed from the owner
tags: [work-note, blocked, automation, restore-marketing-co]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
---

# Open Questions — Owner Input Required

> Every question here blocks at least one part of the automation from going live. Answer in order of importance or whatever feels easiest — whichever gets unstuck fastest.

## Critical (blocks first automation ship)

### Q1. What does Restore Marketing Co actually sell?
Services list + deliverables per service + pricing model (fixed / retainer / hourly / project). This directly populates `config.services` and drives the proposal agent.

**Minimum answer**: 2-3 services with a one-line description, a rough price range, and "who buys this."

**Best answer**: Full service catalog with deliverables, typical timeline, ideal client, fixed vs retainer, starting price.

### Q2. What tech stack are you currently using?
One pick per category, or "nothing yet, pick for me." Per [[integrations]]:
- CRM: ?
- Email (outbound): ?
- Invoicing: ?
- Scheduling: ?
- E-sign: ?
- Project management: ?
- Analytics: ?
- Messaging: ?
- File storage: ?

If you don't have answers for all 9, that's fine — the "Quick Start — Minimum Viable Stack" in [[integrations]] is the zero-budget default. Pick which of your current tools you already own, leave the rest at the defaults.

### Q3. What's your ICP — ideal client profile?
Populates `config.icp`. The lead qualification agent cannot run without this.

**Minimum answer**: "Local service businesses doing $500K-$5M, owner-operated, marketing budget of at least $2k/month."

**Best answer**: Full ICP with industry, size (employees + revenue), geography, budget minimum, decision maker, and disqualifiers (who you don't work with and why).

### Q4. What's your pricing floor and auto-approved ceiling?
- Minimum deal size you'll take (below this → escalate instead of draft)
- Maximum deal size you'll let the agent draft without review (above this → escalate before drafting)
- Discount ceiling (max % off the agent may offer before asking)
- Default payment terms (Net 7 / 15 / 30)
- Retainer commitment minimum (1 month / 3 months / 6 months)

### Q5. Escalation channel
Where do you want to receive agent questions?
- `email` — send to your primary address
- `slack` — post to a Slack channel
- `sms` — text message for urgent
- `vault-only` — notes in the vault, you check when you want (best for solo founders, lowest interruption)

Pick the primary. You can add secondary channels for P0 criticals later.

## High (blocks v0.2 and beyond)

### Q6. Who's on the team besides you?
Contractors? Employees? Part-time designer / writer / developer? Each needs:
- Name + email + role
- Whether they can approve proposals / contracts
- What services they deliver

If it's just you right now, that's fine — the automation assumes solo by default.

### Q7. What does your current month look like?
- Roughly how many leads / week?
- Roughly how many active clients right now?
- Roughly what's your MRR?
- What's the longest-running automation you wish existed today?

These aren't required to ship but they dramatically improve the starting KPI targets and priority order. "Guess ranges" are fine — we'll tune from reality once the agents are running.

### Q8. Your brand voice
Populates `config.brand`. Drives every client-facing piece of writing the automation produces.

- Voice attributes (direct? warm? technical? confident?)
- Things you always say (catchphrases, unique framings)
- Things you never say (corporate jargon, industry clichés, fluff words)
- Visual identity — primary color, secondary, fonts (if you have a brand kit)

If you don't have a formal brand, pick 3 adjectives that describe how you want clients to feel about your communication. That's enough to start.

## Medium (blocks later agents)

### Q9. What do you want reported weekly?
The reporting agent can pull and compose almost anything. What matters to your clients?
- Traffic / conversion / leads / revenue?
- Rankings / brand mentions / content performance?
- Different things per service type?

Default is "traffic + conversion + leads + what-we-did-this-week" which covers 80% of marketing agencies.

### Q10. When is a client "at risk"?
Populates the retention agent's signals. What are YOUR leading indicators of a client who's about to churn?
- Reduced email replies?
- Complaints?
- Payment delays?
- Reduced deliverable usage?
- Key contact leaving?

The default signals are fine — this tunes the agent to YOUR specific patterns.

### Q11. What's your current biggest pain point?
Ask yourself: if I could snap my fingers and automate ONE thing about my business, what would it be? If the answer isn't on the [[Automation#Build Order (Priority)]] list, we should add it.

## Lower priority (can ship without, tune later)

### Q12. Client privacy / data handling preferences
Any clients who require specific data handling (no US-based servers, no AI-generated content, GDPR strict mode, etc.)? If so, they need flags on their engagement note so agents respect the restrictions.

### Q13. Competing-client flag
Do you care about not taking on direct competitors of existing clients? If yes, we wire a competing-client check into intake. If no (you'll work with anyone), skip.

### Q14. Sales call philosophy
Some founders prefer to do every discovery call personally. Some delegate to a junior. Some prefer async intake (no calls). Pick your philosophy and we tune the discovery-call workflow to match.

---

## How to Answer

Easiest: just reply to me in a session with bullet-point answers. I'll update `config.yaml` and commit. You don't need to edit files yourself.

Faster: open `config.yaml` and replace TODOs directly. I'll notice in the next session and cross-reference against this doc.

## Once All Blockers Are Answered

The build order from [[Automation#Build Order (Priority)]] kicks off:
1. **Week 1-2**: Ship [[agents/invoicing-agent]] v0.1
2. **Week 2-3**: Ship [[agents/intake-qualification-agent]] v0.1
3. **Week 3-5**: Ship [[agents/proposal-agent]] v0.1
4. Continue through the 8 agents and 7 workflows

Each v0.1 runs in `review-required` mode, graduates to `review-optional` after 5 clean runs, and goes `fully-autonomous` only for the low-risk agents that earn it.

## Related

- [[README]]
- [[config]]
- [[integrations]]
- [[runbook#Pre-Flight: Before You Go Live]]
- [[Agent Orchestration Buildout]]
