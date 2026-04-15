---
name: social-video-generation
description: Generate AI videos for social media campaigns using Seedance 2.0 and LTX-2.3, auto-routed by use case. Use when the task involves creating social media video content, Instagram Reels, TikToks, YouTube Shorts, Facebook/LinkedIn/Google video ads, product showcases, testimonials, website hero videos, or any video generation for Restore Marketing Co clients. Composes with the installed market-social, market-copy, brand, and building-brand skills to produce on-brand content. Backed by a VideoRouter that picks the right provider (Seedance vs LTX) per use case — portrait short-form → LTX-2.3 fast/distilled, cinematic ads with audio → Seedance 2.0, 4K hero → LTX-2.3 pro, image-to-video product shots → Seedance 2.0. All in mock mode by default until FAL_KEY is added to .env.
license: MIT
---

# Social Video Generation

Generate AI video for social media campaigns using **Seedance 2.0** (ByteDance, cinematic + audio + landscape strength) and **LTX-2.3** (Lightricks, open-source, portrait-native 1080×1920, 4K, synced audio). Both providers are wrapped in one unified adapter at `work/active/Restore Marketing Automation/scripts/adapters/video.py` with a router that picks the right provider automatically per use case.

## When to Use This Skill

Invoke on any of these triggers:

- User mentions: "social video", "Instagram Reel", "TikTok", "YouTube Shorts", "YouTube short", "video ad", "product showcase video", "testimonial video", "hero video", "explainer video"
- User mentions a specific social platform + "video" (Facebook video, LinkedIn video, Google ads video)
- Any task that generates media for [[Restore Marketing Automation]] social content workflow
- Content pipeline tasks involving motion / video output (not static images — those go to design skills)
- Client-facing video deliverables for Restore Marketing Co engagements
- Campaign planning that will eventually need video output

## When NOT to Use This Skill

- Static image generation → use `design`, `banner-design`, `ui-ux-pro-max`
- Long-form video editing of existing footage → out of scope for Q2, use external editors
- Copy-only tasks (captions, hashtags) → use `market-copy`, `market-social` standalone
- Live-action filming / directing real humans → human job, not automation
- Video editing of client-supplied footage → out of scope

## Provider Selection — Auto Router

The adapter's built-in routing table picks a provider per use case. You usually want `provider="auto"`:

| Use case | Auto-routes to | Aspect | Duration | Reason |
|---|---|---|---|---|
| `instagram_reel`, `tiktok`, `youtube_shorts` | **LTX-2.3 fast** | 9:16 | 6s | Portrait-native, cheap, high volume |
| `instagram_feed` | LTX-2.3 fast | 1:1 | 6s | Feed square |
| `website_hero`, `youtube_long` | **LTX-2.3 pro** | 16:9 | 8s | 4K hero quality |
| `google_ad`, `facebook_post`, `linkedin_post` | **Seedance 2.0** | 16:9 | 8s | Cinematic ad polish + native audio |
| `product_showcase`, `testimonial` | Seedance 2.0 | 16:9 | 10s | Best image-to-video + reference support |
| `educational_explainer` | LTX-2.3 dev | 16:9 | 10s | Open source + synced audio, longer form |
| `general` (fallback) | LTX-2.3 fast | 9:16 | 6s | Cheapest default |

Override manually when you need:
- `provider="seedance"` — force Seedance (cinematic, audio, reference images, image-to-video)
- `provider="ltx"` — force LTX (portrait native, 4K pro, open source, fast iteration)
- `variant="distilled" | "fast" | "dev" | "pro"` — LTX checkpoint selection
- `aspect="9:16" | "16:9" | "1:1" | "4:5"` — explicit framing
- `duration_sec=4..15` — explicit duration

## The Canonical Flow

For any real video generation task, the flow is:

1. **Compose the brief** — pull client context from the engagement note + `market-social` skill + `brand` voice attributes
2. **Draft N concepts** — typical batch is 3, each with a distinct angle (pain-first, transformation, social-proof)
3. **Route + generate** — call `VideoRouter.generate()` with `provider="auto"` unless you have a specific reason
4. **Wait for completion** — `router.wait_for_url(job, timeout_sec=600)` (short-circuits in mock mode)
5. **Write batch note** — structured markdown with prompts, URLs, statuses — to `social-video-batches/<client-slug>/`
6. **Escalate for approval** — owner picks 1+ concepts before publish (v0.1 requirement)
7. **Schedule via GHL** — approved concepts become scheduled posts via the GHL adapter's social planner

All six steps are wired in `work/active/Restore Marketing Automation/scripts/social_video_e2e.py`. Use that as the canonical entry point for any real batch.

## Invocation Pattern

For a single video:

```bash
cd "work/active/Restore Marketing Automation"
python3 scripts/adapters/video.py \
    --prompt "A friendly HVAC technician fixing an outdoor AC unit, golden hour, natural light" \
    --use-case instagram_reel
```

For a full campaign batch with 3 concepts:

```bash
cat > /tmp/brief.json <<'EOF'
{
    "client_company": "Cool Towne HVAC",
    "client_industry": "home services HVAC",
    "brand_voice": ["direct", "warm", "not-corporate"],
    "use_case": "instagram_reel",
    "campaign_theme": "Spring AC tune-up",
    "pain_point": "AC failure on the hottest day of the year",
    "call_to_action": "Book a tune-up this week",
    "variant_count": 3
}
EOF
python3 scripts/social_video_e2e.py --input /tmp/brief.json
```

From inside Claude, prefer composing via the Python scripts rather than calling the APIs raw — the adapter handles auth, retries, mock mode, routing, and logging for you.

## Prompt Engineering — Keep These in Mind

Video models are less forgiving than image models. Good prompts:

- **Subject first**: "A friendly HVAC technician..." not "In this scene, we see..."
- **Lighting matters**: "golden hour", "soft morning light", "studio-lit" — be explicit
- **Motion intent**: describe what moves and how — "slowly walks toward camera", "turns and smiles", "camera dollies in"
- **Negative prompts**: use `negative_prompt` to block common failure modes — "stock-footage look, generic, text overlays, watermarks" (the adapter adds these by default via `config.video.negative_prompt`)
- **Aspect-aware framing**: for 9:16 portrait, keep subjects centered vertically; for 16:9, use rule-of-thirds
- **Duration matters**: shorter is cheaper and easier to prompt well. 6 seconds is the sweet spot for social; only go longer if the story needs it
- **Don't over-prompt**: more tokens doesn't mean better video. 1-3 sentences > 10 sentences

## Composition with Other Skills

This skill is **never** invoked alone. Compose with:

- **`market-social`** — to draft the campaign angle and the content calendar slot
- **`market-copy`** — to write the caption + hashtags for each video
- **`brand`** / **`building-brand`** — to enforce voice consistency in the prompt
- **`marketing-psychology`** — to pick the right persuasion primitive (social proof, scarcity, loss aversion)
- **`visual-verdict`** — as a post-generation QC check (is the output actually on-brand?)
- **`content-calendar`** — to schedule the batch into the broader client calendar
- **`ui-ux-pro-max`** — if a video's end frame is a landing page preview, check it against UX rules
- **`ai-slop-cleaner`** — to review generated captions + scripts, not the video itself

## Cost Awareness — Hard Guardrails

Video generation is not free. The adapter enforces:

- `config.video.monthly_generation_budget_usd` — hard cap (default 200 USD, confirm with owner)
- `config.video.per_batch_max_concepts` — max concepts per batch (default 5)
- `config.video.per_day_max_batches` — max batches per day (default 10)

Rough costs (subject to fal.ai pricing changes):
- **LTX-2.3 fast 1080p**: ~$0.04/sec → $0.24 per 6-second Reel
- **LTX-2.3 pro 4K**: ~$0.24/sec → $1.92 per 8-second hero
- **Seedance 2.0 720p**: ~$0.01/sec → $0.10 per 10-second ad (via fal.ai / third-party)

A typical weekly batch of 3 Reels costs <$1. A weekly batch of 3 cinematic ads costs <$3. Budget math is straightforward.

## Credentials

Single env var: `FAL_KEY` in `.env` covers both providers via fal.ai. The adapter runs in **mock mode** (fake URLs, no API calls) whenever `FAL_KEY` is missing or `VIDEO_MOCK=1` is set — use mock for all testing, dry-runs, and development.

Get a key: https://fal.ai/dashboard/keys

## Smoke Test

Before running a real batch:

```bash
cd "work/active/Restore Marketing Automation"
python3 scripts/adapters/video.py --use-case instagram_reel --no-wait
python3 scripts/adapters/video.py --use-case google_ad --no-wait
```

Mock mode returns fake URLs; live mode submits real jobs. Verify the router picks correct providers before committing any batch.

## Related Files

- `work/active/Restore Marketing Automation/scripts/adapters/video.py` — the adapter
- `work/active/Restore Marketing Automation/scripts/social_video_e2e.py` — end-to-end runner
- `work/active/Restore Marketing Automation/workflows/social-content.md` — workflow doc
- `work/active/Restore Marketing Automation/config.yaml` `video:` section — config
- `work/active/Restore Marketing Automation/integrations.md#Video generation` — integration detail
- `.env.example` at repo root — `FAL_KEY` credential template
