---
date: 2026-04-15
description: Social content workflow — brief → draft concepts → generate videos (Seedance/LTX) → owner approval → schedule via GHL
tags: [work-note, workflow, automation, restore-marketing-co, social]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
workflow_name: social-content
---

# Workflow: Social Content Generation

> End-to-end social media content generation using real AI video models (Seedance 2.0 + LTX-2.3) composed with the installed `market-social` / `market-copy` / `brand` skills and scheduled via GHL's native social planner.

## Trigger

Any of:
- **Cron**: Weekly per client engagement, per `config.schedules.social_content_cadence` (default: Monday 07:00)
- **Event**: When [[agents/project-coordinator-agent]] identifies a content gap in the weekly plan
- **Manual**: Owner or owner-approved team member kicks off a batch via `scripts/social_video_e2e.py --input brief.json`
- **Campaign**: When a new campaign is added to an engagement, fire a kickoff batch

## Steps

### Step 1 — Build the Brief
Compose a campaign brief using the engagement note + `market-social` skill. The brief captures:

- `client_company` / `client_industry`
- `brand_voice` — pulled from `config.brand.voice_attributes` and any engagement overrides
- `use_case` — which platform/format (instagram_reel, tiktok, google_ad, etc.)
- `campaign_theme` — the angle for this batch
- `pain_point` — the specific customer problem this content addresses
- `call_to_action` — what the viewer should do
- `reference_assets` — optional image URLs for Seedance image-to-video
- `variant_count` — default 3 (pain-first, transformation, social-proof)

Save to `engagements/<client-slug>/social-briefs/<date>-<theme-slug>.md`.

### Step 2 — Draft Concepts
For the brief, draft N video concepts — each with a distinct angle:

1. **Pain-first hook** — open on the customer's problem, cut to the solution
2. **Transformation** — before/after split or reveal
3. **Social proof** — testimonial or neighbor-recommends framing

Additional angles available in the `market-social` skill for client-specific variations.

### Step 3 — Route + Generate
For each concept, call `VideoRouter.generate()` with:
- `prompt` — the full concept prompt + `config.video.prompt_suffix`
- `use_case` — from the brief
- `provider="auto"` — let the router pick Seedance vs LTX
- Optional `image_url` for image-to-video (Seedance-optimized)

Router picks provider based on the routing table (see [[integrations#Video generation — Seedance 2.0 + LTX-2.3]]).

Submit happens via `scripts/adapters/video.py`. Jobs are queued async — agent polls for completion (or in mock mode, short-circuits with fake URLs).

### Step 4 — Collect + Write Batch Note
After all jobs complete, write `social-video-batches/<client-slug>/social-video-batch-<date>.md` with:
- Brief summary
- Each concept: provider used, model, aspect/duration, video URL, prompt preview
- Status per job (COMPLETED / FAILED)
- Total cost estimate for the batch

This file is git-ignored (regenerated on every run). The source of truth for approved content lives in GHL after Step 6.

### Step 5 — Owner Approval Gate
Per `config.video.require_owner_approval_before_publish` (default true in v0.1):

- Post a summary to the escalation channel with:
  - Links to each of the 3 mock/real video URLs
  - Prompts used
  - Suggested caption for each (from `market-copy` skill)
  - Suggested hashtags (from `market-social` skill)
  - Suggested posting time (from `config.schedules` + platform best practices)
- Owner picks 1+ concepts to approve
- Owner can edit captions/hashtags inline
- Owner can regenerate a failed or weak concept (loops back to Step 3 with adjusted prompt)

**Promotion path**: After ~20 batches with zero owner edits, promote this step to `review-optional` — agent posts, owner gets a passive summary, can intercept within a 2-hour window.

### Step 6 — Schedule via GHL
For each approved concept:
- Upload video to GHL via the GHL adapter (or use a direct URL if video is hosted externally)
- Create a social post in GHL's social planner
  - Set platform(s) per `config.video.target_platforms`
  - Set scheduled time
  - Attach caption + hashtags
  - Set media URL or uploaded file
- Mark the batch note's concept as `scheduled` with the GHL post ID

### Step 7 — Publish Tracking
GHL handles the actual publish. When the post fires:
- GHL webhook (or daily reconciliation) updates the batch note → `status: published`
- Post URL + published time captured
- Platform-specific performance fetched after 24 hours and after 7 days
- Feeds into [[agents/reporting-agent]] weekly client report

### Step 8 — Post-Performance Review
After 7 days, the reporting agent includes social performance in the weekly client report:
- Views / reach / impressions
- Engagement rate
- Click-through (if applicable)
- Which angle performed best (pain-first vs transformation vs social-proof)

**Feedback loop**: Winning angle types feed back into the brief-drafting step for future batches, tuning the content strategy per client.

## State Transitions

```
briefed → drafting_concepts → generating_videos → awaiting_approval →
approved → scheduling_ghl → scheduled → published → measured
```

Failure paths:
- `briefing_failed` — missing brief fields, escalate to owner
- `generation_failed` — video API error, retry once, then escalate
- `approval_rejected` — owner killed the batch, log reason, feed back to brief step
- `ghl_schedule_failed` — GHL API error, retry with backoff, escalate after 3 tries

## Guardrails

- **Monthly budget**: `config.video.monthly_generation_budget_usd` is a hard cap. Any batch that would exceed budget escalates before generating.
- **Per-batch cap**: `config.video.per_batch_max_concepts` — prevents runaway concept counts
- **Per-day cap**: `config.video.per_day_max_batches` — prevents runaway batch counts
- **Approval required**: Nothing publishes in v0.1 without owner seeing it
- **Failed jobs**: Retry once with same prompt; second fail → escalate with error details
- **Content compliance**: Before publish, run through `brand` skill review; anything off-brand → regenerate
- **Mock mode for testing**: `VIDEO_MOCK=1` in env forces mock mode even with credentials — lets owner dry-run without burning budget

## Observability

Per-run log at `runs/<date>-social-content-<client>.md`:
- Brief inputs
- Concepts drafted
- Jobs submitted with provider + aspect + duration
- Job completion times
- Owner approval decisions
- Scheduled post IDs in GHL

Rollup metrics in owner dashboard:
- Batches generated per week / month
- Batches approved / rejected
- Average owner approval time
- Videos published per client
- Budget burned vs cap
- Top-performing angles (pain-first vs transformation vs social-proof)
- Top-performing platforms per client

## Completion Criteria

A batch is complete when:
- All concepts have a job status of COMPLETED or FAILED (fail path handled)
- At least one concept is approved
- Approved concepts are scheduled in GHL with post IDs recorded
- Batch note is updated with final state

## Related

- [[agents/project-coordinator-agent]] — triggers batches per weekly plan
- [[agents/deliverable-qc-agent]] — reviews videos before publish (brand alignment, not visual defects; the video models are trusted for quality)
- [[agents/reporting-agent]] — ingests performance for weekly reports
- [[integrations#Video generation — Seedance 2.0 + LTX-2.3]] — adapter details
- [[scripts/adapters/video|video adapter]]
- [[scripts/social_video_e2e|end-to-end runner]]
- [[Skills]] — `market-social`, `market-copy`, `brand`, `building-brand`
- [[config#Video generation]] — budget + guardrails
