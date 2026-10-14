---
date: 2026-04-16
description: ByteDance's multimodal video generation model — specs, API access, pricing, pipeline runbook. Reference for video-gen workflows via Higgsfield.
tags:
  - brain
  - reference
  - ai
  - video-generation
type: brain
aliases:
  - Seedance
  - Seedance 2
---

# Seedance 2.0

ByteDance's multimodal video generation model. Successor to Seedance 1.0. Announced **2026-02-12**, rolled out internationally through Q1 2026.

> [!info] Why this note exists
> Captured when exploring video generation workflows. Use as reference before drafting any skill or command that calls a video-gen API.

## What it is

Unified audio+video model — single generation produces cinematic video with native audio, multi-shot cuts, and realistic physics. Accepts **text, image, audio, and video** inputs (up to 12 reference files per request).

Independent benchmarks placed it **#1 for image-to-video with audio** on Artificial Analysis at release.

## Capabilities

| Spec | Value |
|------|-------|
| Max resolution | 2K (2048×1080) @ 24fps |
| Max duration | 15 seconds per request |
| Min duration | 4 seconds |
| Aspect ratios | 16:9, 9:16, 4:3, 3:4, 21:9, 1:1 |
| Generation modes | `text_to_video`, `first_last_frames` (start/end frame pair), `omni_reference` (up to 12 mixed refs) |
| Generation time | 30–120s (resolution-dependent) |

## API access

- **Official**: BytePlus (international) or Volcengine (China)
- **Third-party**: fal.ai (live since 2026-04-09), PiAPI, Segmind, Kie, and OpenAI-compatible wrappers
- **Workflow**: submit → poll → download (async job pattern)

### Pricing (per-second, fal)

| Variant | $/sec |
|---------|-------|
| `seedance-2` | $0.13 |
| `seedance-2-fast` | $0.10 |
| `seedance-2-preview` | $0.17 |
| `seedance-2-fast-preview` | $0.11 |

Video-to-video is ~39% cheaper than text/image input (more visual context = less compute).

## Consumer surface

Rolled into **CapCut** (ByteDance's editor) starting 2026-03-26 — phased launch in Brazil, Indonesia, Malaysia, Mexico, the Philippines, Thailand, Vietnam first. Also available via **Dreamina** and **Higgsfield**.

## Caveats

> [!warning] IP / legal exposure
> On **2026-02-13** Disney sent ByteDance a cease-and-desist; the MPA denounced the model for copyright infringement. Global rollout was paused while ByteDance addressed IP concerns. Before integrating, check current legal status and platform ToS — outputs may reproduce protected characters/styles.

- Async workflow (30–120s) is too slow for interactive UX — design around polling or webhooks.
- 15s cap per request means longer videos require stitching.
- Audio is generated natively — don't pipe through a separate TTS stage.
- **No realistic human faces** in uploads — Higgsfield platform blocks them.

## When to reach for it

- Short-form social video from a prompt + reference image
- Storyboard-style generation with defined first/last frames
- Multi-reference composition (character + style + scene)

Skip it for: >15s narratives, fine-grained character consistency across generations, or anything where IP provenance matters.

## Pipeline integration (status)

### Installed components

- [x] **Seedance prompt skills** — `~/.claude/skills/seedance-prompt-en/` and `seedance-prompt-zh/` (from [dexhunter/seedance2-skill](https://github.com/dexhunter/seedance2-skill), MIT). Covers `@` reference syntax, camera language, time-segmented prompts, templates for ads/drama/MVs/educational/e-commerce.
- [x] **Playwright MCP** — connected via `claude mcp add playwright -- npx @playwright/mcp@latest`. Enables browser automation of [higgsfield.ai](https://higgsfield.ai).

### Not yet built

- [ ] Pipeline repo (separate from this vault) with UI-automation skills for Higgsfield
- [ ] `CLAUDE.md` skeleton with workflow rules (clear prompt bar via JS, ask before Generate, `SESSION-RESUME.md` crash recovery)
- [ ] Output management (video download, naming, storage)

### Pipeline architecture (when built)

```
User prompt
  → /seedance-prompt-en (craft Seedance 2.0 prompt)
  → Playwright MCP (navigate higgsfield.ai, enter prompt, upload refs)
  → Confirm before Generate (costs credits)
  → Poll for completion → download to outputs/
  → Update SESSION-RESUME.md
```

Reference implementation: [AKCodez UGC Pipeline gist](https://gist.github.com/AKCodez/0d3f9874d0e147bd75a097ca0cc1dcc3).

### Prompt-bar clearing JS (for pipeline skills)

```javascript
// Image page (/image/*)
const input = document.querySelector('[id="hf:tour-image-prompt"]');
input.value = '';
input.dispatchEvent(new Event('input', { bubbles: true }));

// Video page (/create/video)
const editor = document.querySelector('[data-lexical-editor]');
editor.focus();
document.execCommand('selectAll');
document.execCommand('delete');
```

### Constraints for pipeline design

- Async generation: 30–120s per video. Skills must poll/wait, not block.
- File limit: ≤12 total assets (images + videos + audio) per generation.
- Credentials: Higgsfield login state must be persisted in Playwright storage state. Store under `~/.cache/playwright-state/higgsfield.json`, never in a repo.
- Cost ceiling: set a per-session budget. Always ask before clicking Generate.

## Related

- [[Memories]] — index
- [[Skills]] — register a slash command here if a `/seedance` workflow ever lands

## Sources

- [Seedance 2.0 on fal.ai](https://fal.ai/seedance-2.0)
- [ByteDance Seed — Seedance 2.0](https://seed.bytedance.com/en/seedance2_0)
- [Higgsfield — Seedance 2.0](https://higgsfield.ai/seedance/2.0)
- [TechCrunch — Seedance 2.0 comes to CapCut](https://techcrunch.com/2026/03/26/bytedances-new-ai-video-generation-model-dreamina-seedance-2-0-comes-to-capcut/)
- [Seedance 2.0 — Wikipedia](https://en.wikipedia.org/wiki/Seedance_2.0)
- [dexhunter/seedance2-skill](https://github.com/dexhunter/seedance2-skill) — prompt-writing skill (MIT)
- [AKCodez UGC Pipeline gist](https://gist.github.com/AKCodez/0d3f9874d0e147bd75a097ca0cc1dcc3) — reference implementation
