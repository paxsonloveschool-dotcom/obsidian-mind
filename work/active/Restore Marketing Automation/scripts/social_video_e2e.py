#!/usr/bin/env python3
"""
End-to-end social video generation workflow.

Composes the social brief → video adapter → publish queue pipeline.

Takes a client + service context, drafts 3 video concepts, routes each
to the best provider (Seedance or LTX-2.3 via video.py), submits the
jobs, and writes a results note into the vault.

In mock mode (no FAL_KEY), it short-circuits the polling and returns
mock URLs so the full pipeline can be tested end to end without burning
generation credits.

Usage:
    python3 social_video_e2e.py --input brief.json
    python3 social_video_e2e.py --client cool-towne-hvac --use-case instagram_reel --count 3

Brief JSON schema:
{
    "engagement": "engagements/cool-towne-hvac.md",
    "client_company": "Cool Towne HVAC",
    "client_industry": "home services HVAC",
    "brand_voice": ["direct", "warm", "not-corporate"],
    "use_case": "instagram_reel",
    "campaign_theme": "Spring AC tune-up — book before summer rush",
    "pain_point": "AC failure on the hottest day of the year",
    "call_to_action": "Book a tune-up this week — 15% off",
    "variant_count": 3
}
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from adapters.video import VideoRouter, VideoJob  # noqa: E402


def slugify(text: str) -> str:
    return "".join(c if c.isalnum() else "-" for c in (text or "").lower()).strip("-")


def draft_video_concepts(brief: dict) -> list[dict]:
    """Draft N video concepts from a campaign brief.

    In a real run, this would call the `market-social` + `market-copy` skills
    via the Skill tool to get on-brand, tested copy. For this local script,
    we compose a structured prompt that packages the brief into something
    the video model can interpret.
    """
    company = brief.get("client_company", "Unknown Client")
    industry = brief.get("client_industry", "local service business")
    theme = brief.get("campaign_theme", "")
    pain = brief.get("pain_point", "")
    cta = brief.get("call_to_action", "")
    voice = ", ".join(brief.get("brand_voice", []))
    variant_count = brief.get("variant_count", 3)

    # Three angle templates — Pain-First, Transformation, Social Proof
    angles = [
        {
            "angle": "pain-first",
            "concept_title": f"{company} — pain-first hook",
            "prompt": (
                f"Opening hook: visual of the pain point for a {industry} customer. "
                f"{pain}. Then cut to the calm, confident solution. "
                f"Cinematic, real, high quality. Natural light. "
                f"Brand voice: {voice}. Text overlay concept: '{cta}'. "
                f"Theme: {theme}."
            ),
        },
        {
            "angle": "transformation",
            "concept_title": f"{company} — before/after transformation",
            "prompt": (
                f"Before/after split: the issue on one side, the fixed, happy state on the other. "
                f"Warm, relatable, not-salesy. {industry} context. "
                f"Brand voice: {voice}. Theme: {theme}. "
                f"End on product/service moment with subtle CTA framing."
            ),
        },
        {
            "angle": "social-proof",
            "concept_title": f"{company} — neighbor recommends",
            "prompt": (
                f"A real-seeming satisfied customer looking at camera, talking about "
                f"how {company} solved their problem. Natural, warm, authentic, not overproduced. "
                f"{industry} context. Brand voice: {voice}. End frame on company logo + CTA concept."
            ),
        },
    ]
    return angles[:variant_count]


def run_social_video_workflow(brief: dict) -> dict:
    router = VideoRouter()
    mode = "LIVE" if router.fal.config.is_live else "MOCK"

    use_case = brief.get("use_case", "instagram_reel")
    concepts = draft_video_concepts(brief)

    trace: dict = {
        "brief": brief,
        "mode": mode,
        "use_case": use_case,
        "concepts_drafted": len(concepts),
        "jobs": [],
    }

    for concept in concepts:
        job = router.generate(
            prompt=concept["prompt"],
            use_case=use_case,
            provider="auto",
        )
        router.poll(job)  # in mock mode this finalizes immediately
        trace["jobs"].append(
            {
                "angle": concept["angle"],
                "concept_title": concept["concept_title"],
                "provider": job.provider,
                "model_path": job.model_path,
                "status": job.status,
                "video_url": job.video_url,
                "aspect": job.aspect,
                "duration_sec": job.duration_sec,
                "prompt_preview": concept["prompt"][:180] + "...",
            }
        )

    return trace


def write_vault_note(trace: dict, out_dir: Path) -> Path:
    brief = trace["brief"]
    client = brief.get("client_company", "unknown")
    client_slug = slugify(client)
    date = datetime.now().strftime("%Y-%m-%d")
    out_path = out_dir / client_slug / f"social-video-batch-{date}.md"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    lines = [
        "---",
        f"date: {date}",
        f'description: "Social video batch for {client} — {trace["use_case"]} — '
        f'{len(trace["jobs"])} concepts generated in {trace["mode"]} mode"',
        "tags: [social-video, automation, restore-marketing-co, " + client_slug + "]",
        "type: work-note",
        "status: active",
        "quarter: Q2-2026",
        "project: restore-marketing-automation",
        f'client: "{client}"',
        f"use_case: {trace['use_case']}",
        f"mode: {trace['mode']}",
        f"job_count: {len(trace['jobs'])}",
        "---",
        "",
        f"# Social Video Batch — {client}",
        "",
        f"> Generated {date} in **{trace['mode']}** mode. Use case: `{trace['use_case']}`. {len(trace['jobs'])} concepts.",
        "",
        "## Brief",
        "",
        f"- **Client**: {client}",
        f"- **Industry**: {brief.get('client_industry', '—')}",
        f"- **Campaign theme**: {brief.get('campaign_theme', '—')}",
        f"- **Pain point**: {brief.get('pain_point', '—')}",
        f"- **Call to action**: {brief.get('call_to_action', '—')}",
        f"- **Brand voice**: {', '.join(brief.get('brand_voice', [])) or '—'}",
        "",
        "## Generated Concepts",
        "",
    ]

    for i, job in enumerate(trace["jobs"], 1):
        lines.extend(
            [
                f"### Concept {i} — {job['angle']}",
                "",
                f"- **Title**: {job['concept_title']}",
                f"- **Provider**: `{job['provider']}`",
                f"- **Model**: `{job['model_path']}`",
                f"- **Aspect**: {job['aspect']}  |  **Duration**: {job['duration_sec']}s",
                f"- **Status**: {job['status']}",
                f"- **Video URL**: {job['video_url']}",
                "",
                "**Prompt**:",
                "",
                f"> {job['prompt_preview']}",
                "",
            ]
        )

    lines.extend(
        [
            "## Next Steps",
            "",
            "1. Review each concept — owner picks the strongest angle (or picks multiple)",
            "2. Approve for posting → triggers the publishing workflow",
            "3. Failures (if any) get regenerated with adjusted prompts",
            "4. Approved videos flow to client calendar + GHL social scheduler",
            "",
            "## Related",
            "",
            "- [[Restore Marketing Automation/README|project]]",
            "- [[workflows/new-lead]]",
            "- [[Skills]]",
            "",
        ]
    )

    out_path.write_text("\n".join(lines))
    return out_path


def main():
    parser = argparse.ArgumentParser(description="End-to-end social video generation workflow")
    parser.add_argument("--input", help="Brief JSON file")
    parser.add_argument("--client", help="Client company (stub mode)")
    parser.add_argument("--use-case", default="instagram_reel")
    parser.add_argument("--count", type=int, default=3, help="Concept variants")
    parser.add_argument(
        "--out-dir",
        default=str(Path(__file__).parent.parent / "social-video-batches"),
    )
    args = parser.parse_args()

    if args.input:
        with open(args.input) as f:
            brief = json.load(f)
    elif args.client:
        brief = {
            "client_company": args.client,
            "client_industry": "local service business",
            "brand_voice": ["direct", "warm", "not-corporate"],
            "use_case": args.use_case,
            "campaign_theme": "Generic Q2 campaign",
            "pain_point": "Common customer pain",
            "call_to_action": "Book today",
            "variant_count": args.count,
        }
        print(
            "NOTE: stub mode. Real runs should pass --input with a full brief.",
            file=sys.stderr,
        )
    else:
        parser.error("provide --input or --client")

    trace = run_social_video_workflow(brief)
    vault_note = write_vault_note(trace, Path(args.out_dir))

    summary = {
        "mode": trace["mode"],
        "use_case": trace["use_case"],
        "jobs_submitted": len(trace["jobs"]),
        "providers_used": sorted({j["provider"] for j in trace["jobs"]}),
        "vault_note": str(vault_note),
        "video_urls": [j["video_url"] for j in trace["jobs"]],
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
