#!/usr/bin/env python3
"""
Video generation adapter — Restore Marketing Co Automation

Unified adapter for AI video generation with pluggable providers:
  - seedance  : ByteDance Seedance 2.0 (cinematic, audio, landscape)
  - ltx       : Lightricks LTX-2.3 (open source, portrait-native, 4K)

Both providers are accessed via fal.ai by default (single auth, consistent
async queue pattern). Direct BytePlus / Replicate / local deployment can
be added later as alternative backends.

Use cases mapped to providers:
  - Portrait social video (9:16, Reels/TikTok/Shorts) → LTX-2.3 (native portrait)
  - Landscape cinematic (YouTube, ads, long-form)    → Seedance 2.0
  - Fast iteration, low cost                          → LTX-2.3 fast/distilled
  - 4K hero visuals                                   → LTX-2.3 pro
  - Synchronized audio natively                       → either (both support it)
  - Image-to-video (product shot → animated)          → Seedance 2.0

The VideoRouter picks automatically based on use_case + aspect + duration,
or you can override with provider="seedance" / provider="ltx".

Auth:
  - fal.ai backend: set FAL_KEY in .env (shared by both providers)
  - Optional direct BytePlus: set BYTEPLUS_SEEDANCE_API_KEY (not yet wired)
  - Local LTX: set LTX_LOCAL_ENDPOINT (not yet wired)

Mock mode:
  Same pattern as the GHL adapter — if FAL_KEY is absent (or VIDEO_MOCK=1),
  every method returns plausible fake data so workflows can be tested end
  to end without credentials or burning budget on real generations.

Usage:
    from adapters.video import VideoRouter

    router = VideoRouter()

    # Auto-route based on use case
    job = router.generate(
        prompt="A friendly HVAC technician fixing an AC unit in a sunny backyard",
        use_case="instagram_reel",
    )
    url = router.wait_for_url(job, timeout_sec=600)

    # Explicit provider override
    job = router.generate(
        prompt="Cinematic overhead shot of a landscape design transforming",
        provider="seedance",
        duration_sec=10,
        aspect="16:9",
    )

References:
  - Seedance 2.0: https://seed.bytedance.com/en/seedance2_0
  - LTX-2.3:      https://fal.ai/ltx-2.3
  - fal.ai queue: https://fal.ai/docs/rest-api/
"""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Literal, Optional


# --------------------------------------------------------------------------
# Config + Logging
# --------------------------------------------------------------------------

DEFAULT_FAL_BASE = "https://queue.fal.run"
DEFAULT_LOG_PATH = (
    Path(__file__).parent.parent.parent / "runs" / "video-adapter.log"
)

# Model endpoint paths on fal.ai. These are the config-driven paths —
# when fal.ai changes its routing, update here instead of digging through code.
# Verify exact slugs at https://fal.ai/models before going live.
FAL_SEEDANCE_MODEL = os.getenv(
    "FAL_SEEDANCE_MODEL", "fal-ai/bytedance/seedance-2.0"
)
FAL_LTX_MODEL = os.getenv("FAL_LTX_MODEL", "fal-ai/ltx-video-2.3")

# LTX checkpoint variants (distilled = cheapest, pro = best, dev = default)
LTX_CHECKPOINT_DEV = os.getenv("FAL_LTX_DEV_MODEL", "fal-ai/ltx-video-2.3")
LTX_CHECKPOINT_FAST = os.getenv("FAL_LTX_FAST_MODEL", "fal-ai/ltx-video-2.3/fast")
LTX_CHECKPOINT_PRO = os.getenv("FAL_LTX_PRO_MODEL", "fal-ai/ltx-video-2.3/pro")
LTX_CHECKPOINT_DISTILLED = os.getenv(
    "FAL_LTX_DISTILLED_MODEL", "fal-ai/ltx-video-2.3/distilled"
)


def _log(message: str, log_path: Optional[Path] = None) -> None:
    path = log_path or DEFAULT_LOG_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a") as f:
        f.write(f"{datetime.now().isoformat()} {message}\n")


# --------------------------------------------------------------------------
# Data types
# --------------------------------------------------------------------------

UseCase = Literal[
    "instagram_reel",
    "tiktok",
    "youtube_shorts",
    "youtube_long",
    "instagram_feed",
    "facebook_post",
    "linkedin_post",
    "google_ad",
    "website_hero",
    "product_showcase",
    "testimonial",
    "educational_explainer",
    "general",
]

Aspect = Literal["9:16", "16:9", "1:1", "4:5"]
Provider = Literal["seedance", "ltx", "auto"]


@dataclass
class VideoJob:
    """Represents a queued/running/done video generation job."""

    job_id: str
    provider: str
    model_path: str
    prompt: str
    status: str = "queued"
    video_url: Optional[str] = None
    thumb_url: Optional[str] = None
    duration_sec: Optional[float] = None
    aspect: Optional[str] = None
    mock: bool = False
    error: Optional[str] = None
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    raw_response: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "job_id": self.job_id,
            "provider": self.provider,
            "model_path": self.model_path,
            "prompt": self.prompt[:140] + ("..." if len(self.prompt) > 140 else ""),
            "status": self.status,
            "video_url": self.video_url,
            "thumb_url": self.thumb_url,
            "duration_sec": self.duration_sec,
            "aspect": self.aspect,
            "mock": self.mock,
            "error": self.error,
            "created_at": self.created_at,
        }


class VideoAdapterError(Exception):
    """Raised when a video API call fails after retries."""


# --------------------------------------------------------------------------
# Low-level fal.ai queue client (shared by both providers)
# --------------------------------------------------------------------------


@dataclass
class FalConfig:
    api_key: str = ""
    base_url: str = DEFAULT_FAL_BASE
    mock: bool = False

    @classmethod
    def from_env(cls) -> "FalConfig":
        return cls(
            api_key=os.getenv("FAL_KEY", ""),
            base_url=os.getenv("FAL_BASE_URL", DEFAULT_FAL_BASE),
            mock=(os.getenv("VIDEO_MOCK") == "1" or os.getenv("FAL_MOCK") == "1"),
        )

    @property
    def is_live(self) -> bool:
        return bool(self.api_key) and not self.mock


class FalClient:
    """Thin client around fal.ai's async queue protocol."""

    def __init__(self, config: Optional[FalConfig] = None):
        self.config = config or FalConfig.from_env()
        mode = "LIVE" if self.config.is_live else "MOCK"
        _log(f"FalClient initialized in {mode} mode")

    def submit(self, model_path: str, body: dict) -> str:
        """Submit a job to the queue. Returns request_id."""
        if not self.config.is_live:
            return self._mock_submit(model_path, body)

        url = f"{self.config.base_url}/{model_path}"
        headers = {
            "Authorization": f"Key {self.config.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        data = json.dumps(body).encode("utf-8")

        for attempt in range(3):
            try:
                req = urllib.request.Request(url, data=data, headers=headers, method="POST")
                with urllib.request.urlopen(req, timeout=60) as resp:
                    raw = resp.read().decode("utf-8")
                    parsed = json.loads(raw) if raw else {}
                    request_id = parsed.get("request_id", "")
                    _log(f"POST {model_path} -> {resp.status} request_id={request_id}")
                    return request_id
            except urllib.error.HTTPError as e:
                body_text = e.read().decode("utf-8", errors="replace")
                _log(f"POST {model_path} -> HTTPError {e.code}: {body_text[:200]}")
                if e.code in (429, 500, 502, 503, 504) and attempt < 2:
                    time.sleep(2 ** attempt)
                    continue
                raise VideoAdapterError(f"fal.ai submit failed: {e.code} {body_text}") from e
            except urllib.error.URLError as e:
                if attempt < 2:
                    time.sleep(2 ** attempt)
                    continue
                raise VideoAdapterError(f"fal.ai submit failed: {e}") from e
        raise VideoAdapterError("fal.ai submit exhausted retries")

    def get_status(self, model_path: str, request_id: str) -> dict:
        if not self.config.is_live:
            return self._mock_status(request_id)

        url = f"{self.config.base_url}/{model_path}/requests/{request_id}/status"
        headers = {"Authorization": f"Key {self.config.api_key}"}
        req = urllib.request.Request(url, headers=headers, method="GET")
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                parsed = json.loads(resp.read().decode("utf-8"))
                _log(f"GET status {request_id} -> {parsed.get('status', '?')}")
                return parsed
        except urllib.error.HTTPError as e:
            raise VideoAdapterError(f"fal.ai status failed: {e.code}") from e

    def get_result(self, model_path: str, request_id: str) -> dict:
        if not self.config.is_live:
            return self._mock_result(request_id)

        url = f"{self.config.base_url}/{model_path}/requests/{request_id}"
        headers = {"Authorization": f"Key {self.config.api_key}"}
        req = urllib.request.Request(url, headers=headers, method="GET")
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                parsed = json.loads(resp.read().decode("utf-8"))
                _log(f"GET result {request_id} -> {list(parsed.keys())}")
                return parsed
        except urllib.error.HTTPError as e:
            raise VideoAdapterError(f"fal.ai result failed: {e.code}") from e

    # ----- mock helpers -----

    def _mock_submit(self, model_path: str, body: dict) -> str:
        request_id = f"mock-{int(time.time() * 1000)}"
        _log(f"MOCK submit {model_path} -> {request_id}")
        return request_id

    def _mock_status(self, request_id: str) -> dict:
        return {"status": "COMPLETED", "request_id": request_id, "mock": True}

    def _mock_result(self, request_id: str) -> dict:
        return {
            "video": {
                "url": f"https://mock.fal.run/video/{request_id}.mp4",
                "content_type": "video/mp4",
                "file_name": f"{request_id}.mp4",
                "file_size": 4_250_000,
            },
            "seed": 42,
            "timings": {"inference": 12.4},
            "mock": True,
        }


# --------------------------------------------------------------------------
# Provider — Seedance 2.0
# --------------------------------------------------------------------------


class SeedanceProvider:
    """Seedance 2.0 (ByteDance) via fal.ai.

    Strengths: cinematic output, native audio, strong image-to-video,
    multi-reference support (up to 12 reference files), camera-direction
    control, landscape framing.
    """

    PROVIDER_NAME = "seedance"

    def __init__(self, fal: Optional[FalClient] = None):
        self.fal = fal or FalClient()

    def text_to_video(
        self,
        prompt: str,
        *,
        aspect: Aspect = "16:9",
        duration_sec: int = 5,
        seed: Optional[int] = None,
        negative_prompt: str = "",
        reference_images: Optional[list[str]] = None,
    ) -> VideoJob:
        body: dict = {
            "prompt": prompt,
            "aspect_ratio": aspect,
            "duration": duration_sec,
        }
        if seed is not None:
            body["seed"] = seed
        if negative_prompt:
            body["negative_prompt"] = negative_prompt
        if reference_images:
            body["reference_images"] = reference_images

        request_id = self.fal.submit(FAL_SEEDANCE_MODEL, body)
        return VideoJob(
            job_id=request_id,
            provider=self.PROVIDER_NAME,
            model_path=FAL_SEEDANCE_MODEL,
            prompt=prompt,
            status="queued",
            aspect=aspect,
            duration_sec=duration_sec,
            mock=not self.fal.config.is_live,
        )

    def image_to_video(
        self,
        image_url: str,
        prompt: str,
        *,
        aspect: Aspect = "16:9",
        duration_sec: int = 5,
    ) -> VideoJob:
        body = {
            "image_url": image_url,
            "prompt": prompt,
            "aspect_ratio": aspect,
            "duration": duration_sec,
        }
        request_id = self.fal.submit(FAL_SEEDANCE_MODEL, body)
        return VideoJob(
            job_id=request_id,
            provider=self.PROVIDER_NAME,
            model_path=FAL_SEEDANCE_MODEL,
            prompt=prompt,
            status="queued",
            aspect=aspect,
            duration_sec=duration_sec,
            mock=not self.fal.config.is_live,
        )


# --------------------------------------------------------------------------
# Provider — LTX-2.3
# --------------------------------------------------------------------------


class LTXProvider:
    """Lightricks LTX-2.3 via fal.ai.

    Strengths: open source, native portrait mode (1080x1920), fast
    distilled checkpoint (8 denoising steps), 4K pro checkpoint, synced
    audio in a single pass. Best for social verticals and fast iteration.
    """

    PROVIDER_NAME = "ltx"

    def __init__(self, fal: Optional[FalClient] = None):
        self.fal = fal or FalClient()

    def _resolve_checkpoint(self, variant: str) -> str:
        return {
            "dev": LTX_CHECKPOINT_DEV,
            "fast": LTX_CHECKPOINT_FAST,
            "pro": LTX_CHECKPOINT_PRO,
            "distilled": LTX_CHECKPOINT_DISTILLED,
        }.get(variant, LTX_CHECKPOINT_DEV)

    def text_to_video(
        self,
        prompt: str,
        *,
        aspect: Aspect = "9:16",
        duration_sec: int = 5,
        resolution: str = "1080p",
        variant: str = "fast",
        seed: Optional[int] = None,
        negative_prompt: str = "",
        audio_enabled: bool = True,
    ) -> VideoJob:
        model_path = self._resolve_checkpoint(variant)
        body: dict = {
            "prompt": prompt,
            "aspect_ratio": aspect,
            "duration": duration_sec,
            "resolution": resolution,
            "audio": audio_enabled,
        }
        if seed is not None:
            body["seed"] = seed
        if negative_prompt:
            body["negative_prompt"] = negative_prompt

        request_id = self.fal.submit(model_path, body)
        return VideoJob(
            job_id=request_id,
            provider=self.PROVIDER_NAME,
            model_path=model_path,
            prompt=prompt,
            status="queued",
            aspect=aspect,
            duration_sec=duration_sec,
            mock=not self.fal.config.is_live,
        )

    def image_to_video(
        self,
        image_url: str,
        prompt: str,
        *,
        aspect: Aspect = "9:16",
        duration_sec: int = 5,
        variant: str = "fast",
    ) -> VideoJob:
        model_path = self._resolve_checkpoint(variant)
        body = {
            "image_url": image_url,
            "prompt": prompt,
            "aspect_ratio": aspect,
            "duration": duration_sec,
        }
        request_id = self.fal.submit(model_path, body)
        return VideoJob(
            job_id=request_id,
            provider=self.PROVIDER_NAME,
            model_path=model_path,
            prompt=prompt,
            status="queued",
            aspect=aspect,
            duration_sec=duration_sec,
            mock=not self.fal.config.is_live,
        )


# --------------------------------------------------------------------------
# Router
# --------------------------------------------------------------------------


@dataclass
class RoutingRule:
    use_cases: tuple[str, ...]
    provider: str
    reason: str
    defaults: dict


# Use-case → provider routing table. Order matters; first match wins.
ROUTING_TABLE: list[RoutingRule] = [
    RoutingRule(
        use_cases=("instagram_reel", "tiktok", "youtube_shorts"),
        provider="ltx",
        reason="Portrait-native (9:16) and fast; LTX-2.3 distilled/fast checkpoint is the best fit for high-volume vertical short-form",
        defaults={"aspect": "9:16", "duration_sec": 6, "variant": "fast"},
    ),
    RoutingRule(
        use_cases=("instagram_feed",),
        provider="ltx",
        reason="Square 1:1 works well on LTX, and fast checkpoint keeps costs down for feed volume",
        defaults={"aspect": "1:1", "duration_sec": 6, "variant": "fast"},
    ),
    RoutingRule(
        use_cases=("website_hero", "youtube_long"),
        provider="ltx",
        reason="4K pro checkpoint for hero/long-form visual quality",
        defaults={"aspect": "16:9", "duration_sec": 8, "variant": "pro", "resolution": "4k"},
    ),
    RoutingRule(
        use_cases=("google_ad", "facebook_post", "linkedin_post"),
        provider="seedance",
        reason="Cinematic landscape with native audio is Seedance's core strength; ad polish matters here",
        defaults={"aspect": "16:9", "duration_sec": 8},
    ),
    RoutingRule(
        use_cases=("product_showcase", "testimonial"),
        provider="seedance",
        reason="Seedance's image-to-video and reference-image support is best-in-class for product animation",
        defaults={"aspect": "16:9", "duration_sec": 10},
    ),
    RoutingRule(
        use_cases=("educational_explainer",),
        provider="ltx",
        reason="Open-source, audio-synced, cost-effective for longer educational content",
        defaults={"aspect": "16:9", "duration_sec": 10, "variant": "dev"},
    ),
    RoutingRule(
        use_cases=("general",),
        provider="ltx",
        reason="Default to LTX fast — cheapest, good quality, portrait-capable",
        defaults={"aspect": "9:16", "duration_sec": 6, "variant": "fast"},
    ),
]


class VideoRouter:
    """Main entry point for video generation. Routes to Seedance or LTX."""

    def __init__(self, fal: Optional[FalClient] = None):
        self.fal = fal or FalClient()
        self.seedance = SeedanceProvider(self.fal)
        self.ltx = LTXProvider(self.fal)

    def _route(self, use_case: str) -> RoutingRule:
        for rule in ROUTING_TABLE:
            if use_case in rule.use_cases:
                return rule
        return ROUTING_TABLE[-1]  # fallback to general

    def generate(
        self,
        prompt: str,
        *,
        use_case: UseCase = "general",
        provider: Provider = "auto",
        aspect: Optional[Aspect] = None,
        duration_sec: Optional[int] = None,
        variant: Optional[str] = None,
        image_url: Optional[str] = None,
        seed: Optional[int] = None,
        negative_prompt: str = "",
    ) -> VideoJob:
        """Generate a video. Auto-routes based on use_case unless provider overridden."""

        if provider == "auto":
            rule = self._route(use_case)
            chosen_provider = rule.provider
            defaults = rule.defaults
        else:
            chosen_provider = provider
            defaults = {}

        effective_aspect = aspect or defaults.get("aspect", "9:16")
        effective_duration = duration_sec or defaults.get("duration_sec", 6)
        effective_variant = variant or defaults.get("variant", "fast")

        _log(
            f"generate use_case={use_case} provider={chosen_provider} "
            f"aspect={effective_aspect} duration={effective_duration}s"
        )

        if chosen_provider == "seedance":
            if image_url:
                return self.seedance.image_to_video(
                    image_url=image_url,
                    prompt=prompt,
                    aspect=effective_aspect,
                    duration_sec=effective_duration,
                )
            return self.seedance.text_to_video(
                prompt=prompt,
                aspect=effective_aspect,
                duration_sec=effective_duration,
                seed=seed,
                negative_prompt=negative_prompt,
            )
        else:  # ltx
            if image_url:
                return self.ltx.image_to_video(
                    image_url=image_url,
                    prompt=prompt,
                    aspect=effective_aspect,
                    duration_sec=effective_duration,
                    variant=effective_variant,
                )
            return self.ltx.text_to_video(
                prompt=prompt,
                aspect=effective_aspect,
                duration_sec=effective_duration,
                resolution=defaults.get("resolution", "1080p"),
                variant=effective_variant,
                seed=seed,
                negative_prompt=negative_prompt,
            )

    def poll(self, job: VideoJob) -> VideoJob:
        """Poll a job once and update its status in place."""
        status = self.fal.get_status(job.model_path, job.job_id)
        job.status = status.get("status", "UNKNOWN")
        if job.status == "COMPLETED":
            result = self.fal.get_result(job.model_path, job.job_id)
            job.raw_response = result
            video = result.get("video") or {}
            job.video_url = video.get("url")
            job.thumb_url = result.get("thumbnail", {}).get("url") if isinstance(result.get("thumbnail"), dict) else None
        elif job.status in ("FAILED", "CANCELLED"):
            job.error = status.get("error", "unknown error")
        return job

    def wait_for_url(
        self,
        job: VideoJob,
        *,
        timeout_sec: int = 600,
        poll_interval_sec: int = 5,
    ) -> str:
        """Block until the job completes (or fails). Returns the video URL."""
        if job.mock:
            # In mock mode, short-circuit — the job is already "done" conceptually
            self.poll(job)
            if job.video_url:
                return job.video_url
            return "https://mock.fal.run/video/mock-unknown.mp4"

        start = time.time()
        while time.time() - start < timeout_sec:
            self.poll(job)
            if job.status == "COMPLETED" and job.video_url:
                return job.video_url
            if job.status in ("FAILED", "CANCELLED"):
                raise VideoAdapterError(f"Video job {job.job_id} {job.status}: {job.error}")
            time.sleep(poll_interval_sec)
        raise VideoAdapterError(f"Video job {job.job_id} timed out after {timeout_sec}s")


# --------------------------------------------------------------------------
# CLI — smoke test + simple generation harness
# --------------------------------------------------------------------------


def _cli():
    import argparse

    parser = argparse.ArgumentParser(description="Video adapter smoke test and harness")
    parser.add_argument("--prompt", required=False, default="A friendly local HVAC technician smiling at camera while fixing an outdoor AC unit, golden hour, warm natural light, cinematic")
    parser.add_argument(
        "--use-case",
        default="instagram_reel",
        choices=[
            "instagram_reel",
            "tiktok",
            "youtube_shorts",
            "youtube_long",
            "instagram_feed",
            "facebook_post",
            "linkedin_post",
            "google_ad",
            "website_hero",
            "product_showcase",
            "testimonial",
            "educational_explainer",
            "general",
        ],
    )
    parser.add_argument("--provider", default="auto", choices=["auto", "seedance", "ltx"])
    parser.add_argument("--aspect", default=None)
    parser.add_argument("--duration", type=int, default=None)
    parser.add_argument("--variant", default=None)
    parser.add_argument("--no-wait", action="store_true", help="Don't poll for completion; just submit")
    args = parser.parse_args()

    router = VideoRouter()
    mode = "LIVE" if router.fal.config.is_live else "MOCK"
    print(f"Mode: {mode}")
    print(f"Use case: {args.use_case}")
    print(f"Provider requested: {args.provider}")
    print()

    job = router.generate(
        prompt=args.prompt,
        use_case=args.use_case,
        provider=args.provider,
        aspect=args.aspect,
        duration_sec=args.duration,
        variant=args.variant,
    )

    print("=== Job submitted ===")
    print(json.dumps(job.to_dict(), indent=2))

    if args.no_wait:
        return

    print()
    print("=== Polling for completion ===")
    url = router.wait_for_url(job, timeout_sec=600 if mode == "LIVE" else 10)
    print()
    print("=== Done ===")
    print(json.dumps(job.to_dict(), indent=2))
    print(f"\nVideo URL: {url}")


if __name__ == "__main__":
    _cli()
