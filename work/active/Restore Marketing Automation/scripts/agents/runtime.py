#!/usr/bin/env python3
"""
Shared agent runtime for Restore Marketing Co automation.

Every agent imports from here to get:
- Config loading (from project config.yaml)
- Structured logging to runs/<date>-<agent>-<run-id>.md
- Escalation posting (per config.escalation.primary_channel)
- State tracking via local state files
- Adapter instances (GHL, Video) initialized with mock-mode-safe defaults
- Autonomy level resolution per agent

This keeps each agent script to ~150-250 lines of its own specific logic
instead of duplicating boilerplate.

Usage:
    from agents.runtime import AgentRuntime

    runtime = AgentRuntime(agent_name="invoicing", run_id="2026-04-15-monthly")
    runtime.log("starting monthly cycle")
    runtime.escalate("Ready to send N invoices totaling $X", priority="P1")
    ghl = runtime.ghl  # fully-initialized GHL adapter
"""

from __future__ import annotations

import json
import os
import sys
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Literal, Optional

# agents/ -> scripts/ -> project root
_SCRIPTS_DIR = Path(__file__).parent.parent
_PROJECT_ROOT = _SCRIPTS_DIR.parent
# Make sibling modules (adapters/, plus top-level scripts like invoice_template.py)
# importable from inside agents/
sys.path.insert(0, str(_SCRIPTS_DIR))

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


Priority = Literal["P0", "P1", "P2", "P3"]
AutonomyLevel = Literal["review-required", "review-optional", "fully-autonomous"]


# --------------------------------------------------------------------------
# Paths
# --------------------------------------------------------------------------

CONFIG_PATH = _PROJECT_ROOT / "config.yaml"
RUNS_DIR = _PROJECT_ROOT / "runs"


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(
            f"config.yaml not found at {CONFIG_PATH}. Fill in config.yaml first."
        )
    with CONFIG_PATH.open() as f:
        return yaml.safe_load(f) or {}


# --------------------------------------------------------------------------
# Escalation
# --------------------------------------------------------------------------


@dataclass
class Escalation:
    agent: str
    priority: Priority
    subject: str
    body: str
    decision_required: bool = False
    decision_options: list[str] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())

    def to_dict(self) -> dict:
        return {
            "agent": self.agent,
            "priority": self.priority,
            "subject": self.subject,
            "body": self.body,
            "decision_required": self.decision_required,
            "decision_options": self.decision_options,
            "created_at": self.created_at,
        }


# --------------------------------------------------------------------------
# Runtime
# --------------------------------------------------------------------------


class AgentRuntime:
    """Shared facilities every agent needs."""

    def __init__(
        self,
        agent_name: str,
        run_id: Optional[str] = None,
        config: Optional[dict] = None,
    ):
        self.agent_name = agent_name
        self.run_id = run_id or f"{datetime.now().strftime('%Y-%m-%d-%H%M%S')}-{uuid.uuid4().hex[:6]}"
        self.config = config or load_config()
        self.log_path = RUNS_DIR / f"{self.run_id}-{agent_name}.log"
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        self._log_lines: list[str] = []
        self._escalations: list[Escalation] = []
        self._ghl = None
        self._video = None
        self._started_at = datetime.now()

        self.log(f"=== {agent_name} run {self.run_id} start ===")
        self.log(f"config loaded from {CONFIG_PATH}")

    # ---- logging --------------------------------------------------------

    def log(self, message: str) -> None:
        ts = datetime.now().isoformat(timespec="seconds")
        line = f"{ts} {message}"
        self._log_lines.append(line)
        # Flush incrementally so partial runs are still debuggable
        with self.log_path.open("a") as f:
            f.write(line + "\n")

    def finish(self, summary: str = "") -> dict:
        duration = (datetime.now() - self._started_at).total_seconds()
        self.log(f"=== {self.agent_name} run {self.run_id} finish in {duration:.1f}s: {summary} ===")
        return {
            "agent": self.agent_name,
            "run_id": self.run_id,
            "duration_sec": round(duration, 2),
            "log_path": str(self.log_path),
            "summary": summary,
            "escalations": [e.to_dict() for e in self._escalations],
        }

    # ---- adapters (lazy) ------------------------------------------------

    @property
    def ghl(self):
        if self._ghl is None:
            from adapters.ghl import GHL  # noqa: WPS433

            self._ghl = GHL()
            mode = "LIVE" if self._ghl.config.is_live else "MOCK"
            self.log(f"GHL adapter initialized in {mode} mode")
        return self._ghl

    @property
    def video(self):
        if self._video is None:
            from adapters.video import VideoRouter  # noqa: WPS433

            self._video = VideoRouter()
            mode = "LIVE" if self._video.fal.config.is_live else "MOCK"
            self.log(f"Video adapter initialized in {mode} mode")
        return self._video

    # ---- autonomy level -------------------------------------------------

    def autonomy(self) -> AutonomyLevel:
        """Resolve the agent's current autonomy level from config."""
        levels = self.config.get("agent_autonomy", {}) or {}
        # Keys in config use snake_case agent names
        key = self.agent_name.replace("-", "_")
        return levels.get(key, "review-required")  # safe default

    def is_review_required(self) -> bool:
        return self.autonomy() == "review-required"

    def is_fully_autonomous(self) -> bool:
        return self.autonomy() == "fully-autonomous"

    def feature_enabled(self, flag: str) -> bool:
        return bool((self.config.get("features", {}) or {}).get(flag, False))

    # ---- escalation -----------------------------------------------------

    def escalate(
        self,
        subject: str,
        body: str,
        *,
        priority: Priority = "P2",
        decision_required: bool = False,
        decision_options: Optional[list[str]] = None,
    ) -> Escalation:
        """Post an escalation to the configured channel.

        In v0.1 the channel is vault-only by default — we write the
        escalation as a markdown note in runs/ that the owner reviews on
        their next session start. Future: route to Slack/email per config.
        """
        esc = Escalation(
            agent=self.agent_name,
            priority=priority,
            subject=subject,
            body=body,
            decision_required=decision_required,
            decision_options=decision_options or [],
        )
        self._escalations.append(esc)
        self.log(f"ESCALATE [{priority}] {subject}")

        # Write a vault-readable escalation note
        esc_note_path = (
            RUNS_DIR
            / "escalations"
            / f"{datetime.now().strftime('%Y-%m-%d')}-{self.agent_name}-{priority}-{uuid.uuid4().hex[:6]}.md"
        )
        esc_note_path.parent.mkdir(parents=True, exist_ok=True)
        lines = [
            "---",
            f"date: {datetime.now().strftime('%Y-%m-%d')}",
            f'description: "[{priority}] {subject[:100]}"',
            "tags: [escalation, restore-marketing-co, " + self.agent_name + "]",
            "type: work-note",
            "status: open",
            "quarter: Q2-2026",
            "project: restore-marketing-automation",
            f"agent: {self.agent_name}",
            f"priority: {priority}",
            f"run_id: {self.run_id}",
            f"decision_required: {str(decision_required).lower()}",
            "---",
            "",
            f"# Escalation: {subject}",
            "",
            f"> **Agent**: `{self.agent_name}`  |  **Priority**: `{priority}`  |  **Run**: `{self.run_id}`",
            "",
            body,
            "",
        ]
        if decision_required and decision_options:
            lines.extend(
                [
                    "## Decision Required",
                    "",
                    "Options:",
                    "",
                ]
            )
            lines.extend(f"- [ ] **{opt}**" for opt in decision_options)
            lines.append("")

        lines.extend(
            [
                "## Related",
                "",
                f"- Log: `{self.log_path.relative_to(_PROJECT_ROOT)}`",
                f"- Agent: [[agents/{self.agent_name}-agent]]",
                "",
            ]
        )
        esc_note_path.write_text("\n".join(lines))
        self.log(f"escalation note written: {esc_note_path.name}")
        return esc

    # ---- convenience ----------------------------------------------------

    def pretty_json(self, obj: Any) -> str:
        return json.dumps(obj, indent=2, default=str)

    def write_artifact(self, relative_path: str, content: str) -> Path:
        """Write an output file under runs/<run_id>/ namespace."""
        path = RUNS_DIR / self.run_id / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
        self.log(f"artifact: {path.relative_to(_PROJECT_ROOT)}")
        return path


# --------------------------------------------------------------------------
# CLI smoke test
# --------------------------------------------------------------------------


def _cli():
    runtime = AgentRuntime(agent_name="runtime-smoke-test")
    runtime.log("runtime self-test")
    print("autonomy:", runtime.autonomy())
    print("feature auto_send_proposals:", runtime.feature_enabled("auto_send_proposals"))
    print("GHL mode:", "LIVE" if runtime.ghl.config.is_live else "MOCK")
    print("Video mode:", "LIVE" if runtime.video.fal.config.is_live else "MOCK")
    runtime.escalate(
        subject="Smoke test escalation",
        body="This is just a runtime validation. Ignore.",
        priority="P3",
    )
    result = runtime.finish("smoke test complete")
    print(runtime.pretty_json(result))


if __name__ == "__main__":
    _cli()
