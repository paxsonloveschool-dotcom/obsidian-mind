---
date: 2026-04-15
description: Integration architecture — GHL is the primary platform, secondary adapters fill gaps GHL doesn't cover
tags: [work-note, integrations, automation, ghl]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
---

# Integrations

> **Restore Marketing Co uses GoHighLevel (GHL) heavily**, so the integration architecture is **GHL-first**. GHL covers CRM, email, SMS, scheduling, invoicing, workflows, reputation management, and basic websites — roughly 8 of the 9 integration categories in one platform. Secondary adapters only fill specific gaps (fallback transactional email, external analytics, large-file storage, non-GHL messaging).

## Architecture

```
                     ┌──────────────────────┐
                     │  Claude Orchestration│   ← decisions, narrative, reasoning
                     │  (vault-native)      │
                     └──────────┬───────────┘
                                │
                    ┌───────────┴──────────────┐
                    │                          │
              ┌─────▼──────┐           ┌──────▼──────┐
              │ GHL        │           │ Secondary   │
              │ (primary)  │           │ adapters    │
              └─────┬──────┘           └──────┬──────┘
                    │                          │
   ┌────────────────┼──────────────┐           │
   │                │              │           │
   ▼                ▼              ▼           ▼
 Contacts      Opportunities    Invoices    GA4 / Plausible
 Email/SMS     Pipelines        Payments    Drive / Dropbox
 Calendars     Workflows        Reports     Slack / Discord
 Reputation    Websites         Memberships (fallback only)
```

**Key insight**: Most agents never touch a secondary adapter. GHL is enough.

## Credentials Pattern — NEVER commit secrets

Credentials live in `.env` at the repo root. `.env` is in `.gitignore`. See `.env.example` at the repo root for the template.

**Minimum viable `.env` for GHL-first operation**:
```
GHL_ACCESS_TOKEN=your-bearer-token-here
GHL_LOCATION_ID=your-location-id-here
```

Everything else is optional. The adapters degrade gracefully — missing credentials = mock mode, not broken.

Verify `.env` is ignored:
```bash
git check-ignore -v .env  # should print: .gitignore:XX:.env .env
```

## Primary: GoHighLevel (GHL)

### Why GHL covers most of what we need

| Integration category | GHL has it? | Notes |
|---|---|---|
| **CRM** (contacts, pipelines, opportunities) | ✅ Yes | Full CRM with custom fields, tags, timeline |
| **Email** (outbound, transactional) | ✅ Yes | Native email with templates, sequences, broadcasts |
| **SMS** | ✅ Yes | SMS campaigns, conversational messaging |
| **Scheduling** (calendars, booking) | ✅ Yes | Calendar app with booking pages, round-robin |
| **Invoicing + payments** | ✅ Yes | Stripe-connected invoicing + subscriptions |
| **Workflows / automations** | ✅ Yes | Native trigger-action engine — offload logic here when possible |
| **Reputation** (GBP reviews, responses) | ✅ Yes | Review request + response management |
| **Websites / funnels** | ✅ Yes | Builder with hosting; fine for simple client sites |
| **Phone / call tracking** | ✅ Yes | Twilio-backed; tracking numbers, recording |
| **Memberships / courses** | ✅ Yes | If a client needs it |
| **Social posting** | ✅ Yes | Multi-platform scheduling |
| **Blogging** | ✅ Yes | Native blog |
| **Analytics (depth)** | ⚠️ Basic | For deep client reports, supplement with GA4 / Plausible |
| **File storage (large)** | ⚠️ Limited | For multi-GB deliverables, supplement with Drive / Dropbox |

### The GHL adapter (`scripts/adapters/ghl.py`)

Implemented. Stdlib-only (urllib). Supports:

**Contacts**
- `get_contact(id)` / `search_contacts(query)`
- `create_contact(first_name, email, phone, tags, custom_fields, ...)`
- `update_contact(id, **fields)`
- `add_contact_tag(id, tags)` / `add_contact_note(id, body)`

**Pipelines + Opportunities**
- `list_pipelines()` — returns all pipelines with their stages
- `list_opportunities(pipeline_id, stage_id, limit)`
- `create_opportunity(pipeline_id, stage_id, name, contact_id, monetary_value, ...)`
- `move_opportunity_stage(opp_id, stage_id)`
- `update_opportunity_value(opp_id, monetary_value)`

**Invoices**
- `create_invoice(contact_id, line_items, currency, due_date, notes)`
- `get_invoice(id)`
- `send_invoice(id)`

**Calendars**
- `list_calendars()`
- `get_calendar_slots(calendar_id, start_ms, end_ms)`
- `create_calendar_event(calendar_id, contact_id, start, end, title)`

**Workflows (native GHL automations)**
- `add_contact_to_workflow(contact_id, workflow_id)` — triggers the GHL workflow
- `remove_contact_from_workflow(contact_id, workflow_id)`

### Mock mode

If `GHL_ACCESS_TOKEN` or `GHL_LOCATION_ID` is missing, the adapter runs in **mock mode** — all methods return plausible fake responses so agents can be tested without credentials. Set `GHL_MOCK=1` to force mock mode even with credentials.

### Smoke test

```bash
# Mock mode (no credentials needed)
python3 scripts/adapters/ghl.py --action pipelines
python3 scripts/adapters/ghl.py --action create-contact
python3 scripts/adapters/ghl.py --action create-invoice

# End-to-end new-lead pipeline (qualifier → GHL contact → opportunity → route)
python3 scripts/new_lead_e2e.py test-lead.json
```

Verified working as of 2026-04-15. See [[Brag Doc]] for the results on three test leads.

### What the owner needs to fill in

Per `config.yaml` `ghl:` section — all TODO fields:

1. **Pipeline + stage IDs** — pull via `python3 scripts/adapters/ghl.py --action pipelines` (in live mode) and paste into config. Needed: sales pipeline ID, then stage IDs for new_lead / qualified / gray_zone / discovery_booked / discovery_done / proposal_sent / contract_sent / won / lost.

2. **Tag names** — defaults are `restore:qualified`, `restore:gray-zone`, etc. Keep defaults or change to match your existing tag conventions.

3. **Native workflow IDs** — create these workflows in GHL's workflow builder, then paste their IDs into config. Common ones: discovery-call-booking, polite-decline, new-client-onboarding, payment-chase-1, payment-chase-2, renewal-warm-up, churn-winback.

4. **Calendar IDs** — discovery calls, kickoff calls, renewal calls.

5. **Custom field IDs** — for structured lead data (score, routing, industry, budget, etc.).

Once those are filled in, flip `GHL_MOCK` off and the automation runs against live GHL.

## Secondary: Fallback adapters (only when GHL doesn't cover)

These are OPTIONAL. Add them when GHL's native capabilities aren't enough — not before. Each is a stub in `scripts/adapters/` until needed.

## Optional Secondary Adapters

Skip any of these unless you have a specific reason. Default posture: GHL handles it.

### Video generation — Seedance 2.0 + LTX-2.3 (both via fal.ai)

**This is NOT optional** if Restore Marketing Co is running social media automation — GHL doesn't generate video, so we plug in actual AI video models.

Two providers, one unified adapter, auto-routing by use case.

| Model | Access | Strengths | Best for |
|---|---|---|---|
| **Seedance 2.0** (ByteDance) | fal.ai / BytePlus / Replicate / PiAPI | Cinematic, native audio, strong image-to-video, up to 12 reference files, 4-15s output, director-level camera control | Landscape ads, product showcases, testimonials, facebook/linkedin/google ads |
| **LTX-2.3** (Lightricks, Apache-2.0) | fal.ai / local NVIDIA / ComfyUI / LTX Desktop | Open source, **native portrait 1080×1920** (Reels/TikTok/Shorts), synced audio in one pass, 4 checkpoints (dev/fast/pro/distilled), 4K at 50fps | Short-form vertical social, hero visuals (pro 4K), educational explainers, fast iteration (distilled = 8 denoising steps) |

**Adapter**: `scripts/adapters/video.py` — stdlib-only, mock mode by default, provider-router based on `use_case` parameter.

**Built-in routing table**:

| Use case | Auto-routes to | Aspect | Duration | Rationale |
|---|---|---|---|---|
| `instagram_reel`, `tiktok`, `youtube_shorts` | LTX-2.3 fast | 9:16 | 6s | Portrait-native, fast/cheap |
| `instagram_feed` | LTX-2.3 fast | 1:1 | 6s | Feed square, high volume |
| `website_hero`, `youtube_long` | LTX-2.3 pro | 16:9 | 8s | 4K hero quality |
| `google_ad`, `facebook_post`, `linkedin_post` | Seedance 2.0 | 16:9 | 8s | Cinematic ad polish + native audio |
| `product_showcase`, `testimonial` | Seedance 2.0 | 16:9 | 10s | Best image-to-video + reference support |
| `educational_explainer` | LTX-2.3 dev | 16:9 | 10s | Open source + synced audio, longer form |
| `general` (fallback) | LTX-2.3 fast | 9:16 | 6s | Cheapest default |

**Auth**: single `FAL_KEY` in `.env` covers both providers (fal.ai hosts both). Optional env vars override the model endpoint slugs if fal.ai renames them.

**Mock mode**: if `FAL_KEY` is missing or `VIDEO_MOCK=1`, every call returns fake URLs and plausible job metadata — the full social content pipeline runs end-to-end without burning generation credits.

**Cost guardrails** (in `config.yaml` → `video:`):
- `monthly_generation_budget_usd` — hard cap per month
- `per_batch_max_concepts` — hard cap per batch regardless of request
- `per_day_max_batches` — hard cap per day
- `require_owner_approval_before_publish` — v0.1 default true; nothing posts without owner seeing it first

**End-to-end workflow**: `scripts/social_video_e2e.py` takes a campaign brief, drafts N concepts (pain-first, transformation, social-proof angles), routes each through the VideoRouter, writes a reviewable vault note with all prompts + URLs. Verified working for `instagram_reel` use case (HVAC client brief → 3 concepts → LTX-2.3 fast → mock URLs → vault note).

**Smoke test**:
```bash
python3 scripts/adapters/video.py --use-case instagram_reel --no-wait
python3 scripts/adapters/video.py --use-case google_ad --no-wait
python3 scripts/social_video_e2e.py --input sample-brief.json
```

**To go live**:
1. Create a fal.ai account at https://fal.ai and grab an API key
2. Add `FAL_KEY=fal_xxx` to `.env`
3. Set `video.monthly_generation_budget_usd` in `config.yaml` to your real budget
4. Flip `VIDEO_MOCK` off (remove from `.env` or set to 0)
5. Run `scripts/social_video_e2e.py` against a real client brief for the first live test batch


### Analytics — for deeper client reports

GHL's built-in analytics cover campaign performance + ad spend. For *client-facing* reports that need GA4 or Plausible data on the client's website, add a secondary adapter.

- **Google Analytics 4** — free, industry standard. Needs `GA4_SERVICE_ACCOUNT_JSON_PATH` in `.env`.
- **Plausible** — privacy-first. Needs `PLAUSIBLE_API_KEY` in `.env`.

Stub at `scripts/adapters/analytics_stub.py` (not yet implemented).

### Fallback transactional email

GHL handles transactional email natively. Only add a secondary provider if deliverability becomes a problem (e.g., invoice emails landing in spam).

- **Resend** — developer-friendly, great deliverability. `RESEND_API_KEY`.
- **Postmark** — transactional-focused. `POSTMARK_SERVER_TOKEN`.

### File storage — only for large files outside GHL

GHL handles small attachments fine. Add Google Drive or Dropbox only if deliverables exceed a few MB (large videos, full brand asset packages).

- **Google Drive** — if already on Google Workspace
- **Dropbox** — if preferred

### Messaging / alerts

Default: **vault-only + email**. Escalations land as notes in `runs/` and optionally ping your email. No new tool needed.

Optional: **Slack** — if you want escalations in a channel. `SLACK_WEBHOOK_URL` in `.env`.

## What you need to provide to flip GHL live

Just two things for v0.1:

1. **`.env` file** at repo root with:
   ```
   GHL_ACCESS_TOKEN=your-token-here
   GHL_LOCATION_ID=your-location-id
   ```
2. **Config values** in `config.yaml` `ghl:` section:
   - Pipeline IDs + stage IDs (pull via `--action pipelines`)
   - Workflow IDs (after creating the workflows in GHL)
   - Calendar IDs
   - Custom field IDs

Everything else stays in mock mode until needed.

## Related

- [[README]]
- [[00-architecture]]
- [[config]]
- [[runbook]]
- [[open-questions]]
