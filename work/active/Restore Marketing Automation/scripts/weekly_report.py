#!/usr/bin/env python3
"""
Restore Marketing Co — Weekly Client Report Generator

Composes a weekly performance report markdown for a given client engagement.
The reporting-agent wraps this with data pulls from analytics/CRM/PM adapters.

This script handles the NARRATIVE and STRUCTURE; the adapters provide the data.

Usage:
    python3 weekly_report.py --engagement engagements/acme-corp.md --week 2026-W16
    python3 weekly_report.py --input report-data.json

Report data JSON schema:
{
    "engagement": "engagements/acme-corp.md",
    "client_company": "Acme Corp",
    "week_of": "2026-04-13",
    "iso_week": "2026-W16",
    "metrics": {
        "sessions": {"value": 12543, "delta_pct": 8.2, "trend": "up"},
        "users": {"value": 9120, "delta_pct": 5.1, "trend": "up"},
        "conversions": {"value": 142, "delta_pct": -3.4, "trend": "down"},
        "leads": {"value": 38, "delta_pct": 12.0, "trend": "up"},
        "revenue": {"value": 47500, "delta_pct": 6.5, "trend": "up"}
    },
    "deliverables_shipped": [
        "2 blog posts published",
        "Landing page A/B test launched",
        "Email sequence 3 drafted and approved"
    ],
    "deliverables_queued": [
        "Q2 SEO roadmap review",
        "Homepage redesign wireframes"
    ],
    "highlights": [
        "Leads up 12% WoW — strongest week since onboarding",
        "New landing page variant ran +18% over control after 3 days"
    ],
    "watchouts": [
        "Conversions down 3.4% — investigating; likely related to payment provider outage on Thursday"
    ]
}
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


CONFIG_PATH = Path(__file__).parent.parent / "config.yaml"


def load_config():
    with CONFIG_PATH.open() as f:
        return yaml.safe_load(f)


def slugify(text: str) -> str:
    return "".join(c if c.isalnum() else "-" for c in (text or "").lower()).strip("-")


def trend_arrow(trend: str) -> str:
    return {"up": "↑", "down": "↓", "flat": "→"}.get(trend, "—")


def format_delta(delta_pct: float) -> str:
    sign = "+" if delta_pct >= 0 else ""
    return f"{sign}{delta_pct:.1f}%"


def compose_report(data: dict, config: dict) -> tuple[str, str]:
    company = config.get("company", {})
    brand = config.get("brand", {})
    owner = company.get("owner", "The Team")

    client = data.get("client_company", "Unknown Client")
    week_of = data.get("week_of", datetime.now().strftime("%Y-%m-%d"))
    iso_week = data.get("iso_week", "")
    metrics = data.get("metrics", {})

    slug = slugify(client)
    report_id = f"{slug}-{iso_week or week_of}"

    frontmatter = [
        "---",
        f"date: {week_of}",
        f'description: "{client} weekly report for {iso_week or week_of}"',
        "tags: [report, weekly, restore-marketing-co]",
        "type: work-note",
        "status: active",
        "quarter: Q2-2026",
        "project: restore-marketing-automation",
        f'client: "{client}"',
        f"week_of: {week_of}",
        "report_type: weekly",
        "---",
        "",
    ]

    lines = [
        f"# {client} — Weekly Report",
        "",
        f"> Week of {week_of}",
        "",
        "## Week at a Glance",
        "",
    ]

    # 3-bullet summary
    highlights = data.get("highlights", [])
    if highlights:
        for h in highlights[:3]:
            lines.append(f"- {h}")
    else:
        lines.append("- _No highlights captured — check data sources_")
    lines.append("")

    # Key metrics table
    if metrics:
        lines.append("## Key Metrics")
        lines.append("")
        lines.append("| Metric | This Week | vs Last Week |")
        lines.append("|---|---:|---:|")
        for name, m in metrics.items():
            value = m.get("value", 0)
            delta = format_delta(m.get("delta_pct", 0))
            arrow = trend_arrow(m.get("trend", "flat"))
            if isinstance(value, (int, float)) and value > 100:
                value_str = f"{value:,}"
            else:
                value_str = str(value)
            lines.append(f"| {name.replace('_', ' ').title()} | {value_str} | {arrow} {delta} |")
        lines.append("")

    # What we did
    shipped = data.get("deliverables_shipped", [])
    if shipped:
        lines.append("## What We Shipped This Week")
        lines.append("")
        for d in shipped:
            lines.append(f"- {d}")
        lines.append("")

    # What's next
    queued = data.get("deliverables_queued", [])
    if queued:
        lines.append("## What's Next")
        lines.append("")
        for d in queued:
            lines.append(f"- {d}")
        lines.append("")

    # Watchouts
    watchouts = data.get("watchouts", [])
    if watchouts:
        lines.append("## On the Radar")
        lines.append("")
        for w in watchouts:
            lines.append(f"- {w}")
        lines.append("")

    # Footer
    lines.extend(
        [
            "---",
            "",
            f"Questions or feedback? Reply to this email or ping me directly.",
            "",
            f"— {owner}",
            f"{company.get('name', 'Restore Marketing Co')}",
            "",
        ]
    )

    markdown = "\n".join(frontmatter + lines)
    return report_id, markdown


def main():
    parser = argparse.ArgumentParser(description="Generate a weekly client report.")
    parser.add_argument("--input", help="Report data JSON")
    parser.add_argument("--engagement", help="Engagement note path (stub mode)")
    parser.add_argument("--week", help="ISO week (e.g. 2026-W16)")
    parser.add_argument("--output", help="Output path")
    args = parser.parse_args()

    if args.input:
        with open(args.input) as f:
            data = json.load(f)
    elif args.engagement and args.week:
        data = {
            "engagement": args.engagement,
            "client_company": "TODO: read from engagement note",
            "week_of": datetime.now().strftime("%Y-%m-%d"),
            "iso_week": args.week,
            "metrics": {},
            "deliverables_shipped": ["TODO: fetch from PM adapter"],
            "deliverables_queued": ["TODO: fetch from PM adapter"],
            "highlights": ["TODO: compose from metrics + scientist agent"],
            "watchouts": [],
        }
        print(
            "NOTE: stub mode. Real reports need --input with data pulled from adapters.",
            file=sys.stderr,
        )
    else:
        parser.error("provide --input or (--engagement AND --week)")

    config = load_config()
    report_id, markdown = compose_report(data, config)

    if args.output:
        out_path = Path(args.output)
    else:
        out_path = (
            Path(__file__).parent.parent
            / "reports"
            / slugify(data.get("client_company", "unknown"))
            / f"{report_id}.md"
        )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(markdown)

    result = {
        "report_id": report_id,
        "file": str(out_path),
        "client": data.get("client_company"),
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
