#!/usr/bin/env python3
"""
Restore Marketing Co — Proposal Draft Generator

Takes discovery call data + service selection and drafts a proposal markdown file
ready for the proposal-agent workflow. Pure local, no external APIs.

The agent then takes this draft, renders it to docx/pdf via the `docx` / `pdf`
skills, and routes to the owner for approval.

Usage:
    python3 generate_proposal.py --lead leads/2026-04-15-acme.md --services website-audit,monthly-retainer
    python3 generate_proposal.py --input discovery.json  # full JSON mode

Discovery JSON schema:
{
    "lead_note": "leads/2026-04-15-acme.md",
    "client_company": "Acme Corp",
    "client_contact": "Jane Smith",
    "client_email": "jane@acme.com",
    "discovery_date": "2026-04-15",
    "services_requested": ["website-audit", "monthly-retainer"],
    "budget_signal": "5000-8000/month",
    "timeline_signal": "start next month",
    "custom_scope_items": ["branding refresh"],
    "pain_points": ["low lead volume", "unclear positioning"],
    "competitors_mentioned": ["agency-x", "agency-y"],
    "owner_recommendation": "go"
}
"""

import argparse
import json
import sys
from datetime import datetime, timedelta
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


def compute_pricing(services_requested, catalog, pricing_rules):
    """Return (total, line_items, notes)."""
    total = 0
    line_items = []
    notes = []

    by_id = {s["id"]: s for s in catalog if s.get("id")}
    for svc_id in services_requested:
        svc = by_id.get(svc_id)
        if not svc:
            notes.append(f"WARNING: service '{svc_id}' not in catalog — add to config.yaml")
            continue
        pricing = svc.get("pricing", {})
        amount = pricing.get("amount", 0)
        model = pricing.get("model", "fixed")

        if amount == 0:
            notes.append(f"WARNING: service '{svc_id}' has no price — fill in config.yaml")

        line_items.append(
            {
                "service_id": svc_id,
                "name": svc.get("name", svc_id),
                "description": svc.get("short_description", ""),
                "deliverables": svc.get("deliverables", []),
                "model": model,
                "amount": amount,
                "timeline_days": svc.get("typical_timeline_days", 0),
            }
        )
        total += amount

    # Approval rules
    if total < pricing_rules.get("minimum_deal_size", 0):
        notes.append(
            f"ESCALATE: total ${total} is below minimum deal size "
            f"${pricing_rules.get('minimum_deal_size', 0)}"
        )
    if total > pricing_rules.get("maximum_auto_approved", 0):
        notes.append(
            f"ESCALATE: total ${total} exceeds auto-approved cap "
            f"${pricing_rules.get('maximum_auto_approved', 0)} — owner review required"
        )

    return total, line_items, notes


def draft_proposal_markdown(discovery, config):
    company = config.get("company", {})
    pricing_rules = config.get("pricing_rules", {})
    services_catalog = config.get("services", [])
    brand = config.get("brand", {})

    total, line_items, notes = compute_pricing(
        discovery.get("services_requested", []),
        services_catalog,
        pricing_rules,
    )

    today = datetime.now().strftime("%Y-%m-%d")
    slug = slugify(discovery.get("client_company", "unknown-client"))
    proposal_id = f"{today}-{slug}"

    # Compute timeline
    timelines = [li["timeline_days"] for li in line_items if li["timeline_days"]]
    total_timeline = max(timelines) if timelines else 30

    payment_terms = pricing_rules.get("payment_terms_default", "Net 15")

    # Frontmatter
    frontmatter = {
        "date": today,
        "description": (
            f"{discovery.get('client_company', 'unknown')} proposal "
            f"${total:,} — {', '.join(discovery.get('services_requested', []))}"
        ),
        "tags": ["proposal", "restore-marketing-co", "draft"],
        "type": "work-note",
        "status": "draft",
        "quarter": "Q2-2026",
        "project": "restore-marketing-automation",
        "proposal_id": proposal_id,
        "proposal_status": "drafted",
        "client_company": discovery.get("client_company"),
        "client_contact": discovery.get("client_contact"),
        "deal_value_usd": total,
        "services": discovery.get("services_requested", []),
        "timeline_days": total_timeline,
        "payment_terms": payment_terms,
    }

    # Body
    lines = []
    lines.append("---")
    for k, v in frontmatter.items():
        if isinstance(v, list):
            lines.append(f"{k}: {json.dumps(v)}")
        else:
            lines.append(f"{k}: {v}")
    lines.append("---")
    lines.append("")
    lines.append(f"# Proposal: {discovery.get('client_company', 'Unknown')}")
    lines.append("")
    lines.append(f"> **For**: {discovery.get('client_contact')} @ {discovery.get('client_company')}")
    lines.append(f"> **From**: {company.get('owner', 'TODO')} @ {company.get('name')}")
    lines.append(f"> **Date**: {today}")
    lines.append(f"> **Valid through**: {(datetime.now() + timedelta(days=14)).strftime('%Y-%m-%d')}")
    lines.append("")

    # Escalation notes (internal — will not appear in client-facing render)
    if notes:
        lines.append("> **INTERNAL NOTES** (not in client version):")
        for n in notes:
            lines.append(f"> - {n}")
        lines.append("")

    # Understanding
    lines.append("## Understanding")
    lines.append("")
    lines.append(
        f"Based on our conversation on {discovery.get('discovery_date', today)}, here's what I heard:"
    )
    lines.append("")
    for pain in discovery.get("pain_points", []):
        lines.append(f"- {pain}")
    if discovery.get("competitors_mentioned"):
        lines.append("")
        lines.append(
            f"You mentioned evaluating {', '.join(discovery['competitors_mentioned'])}. "
            "Here's how we'll be different: [OWNER: fill in]"
        )
    lines.append("")

    # Proposed approach
    lines.append("## Proposed Approach")
    lines.append("")
    for li in line_items:
        lines.append(f"### {li['name']}")
        lines.append("")
        lines.append(li["description"] or "_TODO: description_")
        lines.append("")
        if li["deliverables"]:
            lines.append("**Deliverables**:")
            for d in li["deliverables"]:
                lines.append(f"- {d}")
        lines.append("")
        lines.append(f"**Timeline**: {li['timeline_days']} days")
        lines.append(f"**Investment**: ${li['amount']:,.0f} ({li['model']})")
        lines.append("")

    # Investment summary
    lines.append("## Investment Summary")
    lines.append("")
    lines.append("| Service | Amount |")
    lines.append("|---|---|")
    for li in line_items:
        lines.append(f"| {li['name']} | ${li['amount']:,.0f} |")
    lines.append(f"| **Total** | **${total:,.0f}** |")
    lines.append("")
    lines.append(f"**Payment terms**: {payment_terms}")
    lines.append(f"**Timeline**: {total_timeline} days to first deliverable")
    lines.append("")

    # Why Restore
    lines.append("## Why Restore Marketing Co")
    lines.append("")
    lines.append("_TODO: pull 3-bullet Restore differentiation from `config.brand.voice_attributes`_")
    lines.append("")

    # Next steps
    lines.append("## Next Steps")
    lines.append("")
    lines.append("1. Review this proposal")
    lines.append("2. Reply with questions, or sign the attached agreement")
    lines.append("3. Deposit invoice sent on signature, kick-off within 48 hours")
    lines.append("")
    lines.append(f"Questions? Reply to this email or call {company.get('phone', '—')}.")
    lines.append("")
    lines.append("---")
    lines.append(f"{company.get('owner', 'TODO')}")
    lines.append(f"{company.get('name')}")
    if brand.get("voice_attributes"):
        lines.append(f"_{', '.join(brand['voice_attributes'][:2])}_")
    lines.append("")

    return "\n".join(lines), proposal_id, total, notes


def main():
    parser = argparse.ArgumentParser(description="Draft a proposal from discovery data.")
    parser.add_argument("--input", help="Path to discovery JSON file")
    parser.add_argument("--lead", help="Path to lead note (alternative to --input)")
    parser.add_argument("--services", help="Comma-separated service IDs (with --lead)")
    parser.add_argument("--output", help="Output path (default: stdout)")
    args = parser.parse_args()

    if args.input:
        with open(args.input) as f:
            discovery = json.load(f)
    elif args.lead and args.services:
        discovery = {
            "lead_note": args.lead,
            "client_company": Path(args.lead).stem.split("-", 3)[-1],
            "client_contact": "TODO: fill from lead note",
            "discovery_date": datetime.now().strftime("%Y-%m-%d"),
            "services_requested": args.services.split(","),
            "pain_points": [],
            "competitors_mentioned": [],
        }
    else:
        parser.error("provide --input JSON or --lead + --services")

    config = load_config()
    markdown, proposal_id, total, notes = draft_proposal_markdown(discovery, config)

    if args.output:
        out_path = Path(args.output)
    else:
        out_path = (
            Path(__file__).parent.parent
            / "proposals"
            / f"{proposal_id}.md"
        )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(markdown)

    # Also echo metadata to stdout for the caller (agent)
    metadata = {
        "proposal_id": proposal_id,
        "total_usd": total,
        "file": str(out_path),
        "notes": notes,
        "requires_escalation": any("ESCALATE" in n for n in notes),
    }
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
