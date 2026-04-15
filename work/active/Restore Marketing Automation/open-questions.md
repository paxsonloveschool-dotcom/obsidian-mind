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

### Q1. What does Restore Marketing Co actually sell? — **✅ ANSWERED 2026-04-15**

Full-service local marketing agency. Services populated in `config.yaml`:
1. **Website Design & Build** — one-off fixed-fee project work
2. **Full-Service Marketing Retainer** — primary offer, combines everything below
3. **Paid Ads Management** — Google Ads, Meta Ads (standalone retainer)
4. **SEO Build-out & Optimization** — technical + on-page + content + local (standalone retainer)
5. **Google Business Profile Management** — standalone or bolt-on to SEO/retainer

Deliverables, timelines, and ideal clients all filled in. **Only pricing amounts remain as TODOs** — rolled into Q4 below.

**Sub-questions still open on services**:
- CMS default for website builds (WordPress / Webflow / Shopify / other)?
- Which ad platforms beyond Google Ads and Meta Ads (LinkedIn? TikTok? YouTube?)?
- Do you offer one-off audits (website, marketing, SEO) as a paid discovery/qualifier, or only as free prospecting?

### Q2. What tech stack are you currently using? — **✅ LARGELY ANSWERED 2026-04-15**

Owner confirmed: **GoHighLevel (GHL) is used heavily**. GHL covers ~8 of 9 integration categories natively:

| Category | Covered by GHL? |
|---|---|
| CRM (contacts, pipelines, opportunities) | ✅ primary |
| Email (outbound, transactional) | ✅ primary |
| SMS | ✅ primary |
| Scheduling (calendars, booking) | ✅ primary |
| Invoicing + payments | ✅ primary (Stripe-connected) |
| Workflows / automations | ✅ primary |
| Reputation (GBP reviews) | ✅ primary |
| Websites / funnels / blogs | ✅ primary |
| Phone / call tracking | ✅ primary |
| Memberships / courses | ✅ primary |
| Analytics (deep) | ⚠️ basic — GA4/Plausible fallback optional |
| File storage (large) | ⚠️ limited — Drive/Dropbox fallback optional |

**Architecture updated**: `scripts/adapters/ghl.py` implemented, `integrations.md` rewritten to GHL-first. End-to-end new-lead workflow tested successfully in mock mode (HVAC lead → qualify → create GHL contact → opportunity → tag + stage move + workflow trigger).

**Still needs owner input (GHL-specific, blocks live mode)**:

1. **Credentials**: Create `.env` at repo root with `GHL_ACCESS_TOKEN` and `GHL_LOCATION_ID`. See `.env.example` template.
2. **Pipeline + stage IDs**: Run `python3 scripts/adapters/ghl.py --action pipelines` against live GHL and paste IDs into `config.yaml` `ghl:` section. Needed: sales pipeline ID + stage IDs for new_lead / qualified / gray_zone / discovery_booked / discovery_done / proposal_sent / contract_sent / won / lost.
3. **Native workflow IDs**: Create these workflows in GHL's workflow builder, then paste IDs into config:
   - `workflow_id_discovery_call_booking` — fires when a lead is auto-qualified, sends them a booking link
   - `workflow_id_polite_decline` — fires when a lead is auto-disqualified
   - `workflow_id_new_client_onboarding` — fires when a contract is signed
   - `workflow_id_payment_chase_1` / `workflow_id_payment_chase_2` — invoice reminders at 3 and 10 days overdue
   - `workflow_id_renewal_warm_up` — 30 days before renewal
   - `workflow_id_churn_winback` — post-churn
4. **Calendar IDs**: discovery calls, kickoff calls, renewal calls.
5. **Custom field IDs**: for structured lead data (score, routing, industry, budget, etc.). Optional but recommended.

**Also still open (non-GHL)**:
- File storage for large deliverables? (Drive / Dropbox / none)
- Deeper analytics for client reports? (GA4 / Plausible / GHL-only-is-fine)
- Messaging for alerts beyond vault? (Slack / email / vault-only)

### Q3. What's your ICP — ideal client profile? — **✅ PARTIALLY ANSWERED (inferred from services)**

From the service mix (GBP, local SEO, paid ads, websites for local service businesses), Claude inferred and populated `config.icp` with:
- Company type: local service businesses, owner-operated, "near-me" search driven
- Size: 2-150 employees, $500K-$15M revenue
- Industries good fit: home services, medical/dental, legal, restaurants, fitness, salons, auto, real estate, pet services, local retail
- Industries avoid: pure e-commerce, national B2B SaaS, MLM, adult/gambling, crypto
- Decision makers: Owner, Founder, CEO, VP/Director Marketing
- Disqualifiers: no budget, equity-only, performance-only, competing clients, unethical asks

**Still needs owner input**:
- Geographic focus — local to your base, state-wide, regional, national?
- Confirm the good-fit and avoid lists match your actual wins and passes
- Any niche specialization or counterintuitive fits not on the list?

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
