#!/usr/bin/env python3
"""
Restore Marketing Co — Invoice Generator

Generates a monthly invoice markdown file for a given engagement. Pure local.
The invoicing-agent then takes this draft, renders to PDF via the `pdf` skill,
and pushes to the invoicing adapter for delivery.

Usage:
    python3 invoice_template.py --engagement engagements/acme-corp.md --period 2026-04
    python3 invoice_template.py --input invoice-data.json

Invoice data JSON schema:
{
    "engagement": "engagements/acme-corp.md",
    "client_company": "Acme Corp",
    "client_contact": "Jane Smith",
    "client_email": "jane@acme.com",
    "period": "2026-04",
    "line_items": [
        {"description": "Monthly retainer — April 2026", "amount": 5000}
    ],
    "work_summary_bullets": [
        "Shipped 4 blog posts targeting primary keywords",
        "Ran CRO test on pricing page, +18% conversion",
        "Set up GA4 events for new onboarding flow"
    ]
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
INVOICE_COUNTER_PATH = Path(__file__).parent.parent / ".invoice-counter"


def load_config():
    with CONFIG_PATH.open() as f:
        return yaml.safe_load(f)


def next_invoice_number():
    """Sequential invoice counter persisted in .invoice-counter."""
    if INVOICE_COUNTER_PATH.exists():
        current = int(INVOICE_COUNTER_PATH.read_text().strip() or "0")
    else:
        current = 1000  # start at 1001
    next_val = current + 1
    INVOICE_COUNTER_PATH.write_text(str(next_val))
    return next_val


def slugify(text: str) -> str:
    return "".join(c if c.isalnum() else "-" for c in (text or "").lower()).strip("-")


def compute_due_date(payment_terms: str) -> datetime:
    days_map = {"Net 7": 7, "Net 15": 15, "Net 30": 30, "Net 45": 45, "Net 60": 60}
    days = days_map.get(payment_terms, 15)
    return datetime.now() + timedelta(days=days)


def generate_invoice(data: dict, config: dict):
    company = config.get("company", {})
    pricing_rules = config.get("pricing_rules", {})
    payment_terms = pricing_rules.get("payment_terms_default", "Net 15")

    invoice_number = next_invoice_number()
    today = datetime.now().strftime("%Y-%m-%d")
    due_date = compute_due_date(payment_terms).strftime("%Y-%m-%d")
    client_slug = slugify(data.get("client_company", "unknown"))
    period = data.get("period", datetime.now().strftime("%Y-%m"))

    line_items = data.get("line_items", [])
    subtotal = sum(li.get("amount", 0) for li in line_items)
    # No tax by default — add config.company.tax_rate if needed
    total = subtotal

    invoice_id = f"{period}-{client_slug}-{invoice_number}"
    client_name = data.get("client_company", "")
    description = f'"Invoice #{invoice_number} — {client_name} — {period} — ${total:,.2f}"'

    # Frontmatter
    frontmatter_lines = [
        "---",
        f"date: {today}",
        f"description: {description}",
        "tags: [invoice, restore-marketing-co, q2-2026]",
        "type: work-note",
        "status: active",
        "quarter: Q2-2026",
        "project: restore-marketing-automation",
        f"invoice_number: {invoice_number}",
        "invoice_status: draft",
        f'client: "{client_name}"',
        f"amount_usd: {total}",
        f'period: "{period}"',
        f"due_date: {due_date}",
        "sent_date: null",
        "paid_date: null",
        "chase_count: 0",
        "---",
        "",
    ]

    body_lines = [
        f"# Invoice #{invoice_number}",
        "",
        "## From",
        f"**{company.get('name', 'Restore Marketing Co')}**",
        f"{company.get('legal_entity', 'TODO')}",
        f"{company.get('address', {}).get('line1', 'TODO')}",
        f"{company.get('address', {}).get('city', 'TODO')}, "
        f"{company.get('address', {}).get('state', '')} "
        f"{company.get('address', {}).get('zip', '')}",
        f"Tax ID: {company.get('tax_id', 'TODO')}",
        f"Email: {company.get('email', 'TODO')}",
        "",
        "## To",
        f"**{data.get('client_company')}**",
        f"Attn: {data.get('client_contact', 'TODO')}",
        f"Email: {data.get('client_email', 'TODO')}",
        "",
        "## Invoice Details",
        "",
        f"- **Invoice #**: {invoice_number}",
        f"- **Issue date**: {today}",
        f"- **Due date**: {due_date}",
        f"- **Payment terms**: {payment_terms}",
        f"- **Period**: {period}",
        "",
        "## Line Items",
        "",
        "| Description | Amount |",
        "|---|---:|",
    ]
    for li in line_items:
        body_lines.append(f"| {li.get('description', '')} | ${li.get('amount', 0):,.2f} |")
    body_lines.extend(
        [
            "| | |",
            f"| **Subtotal** | **${subtotal:,.2f}** |",
            f"| **Total Due** | **${total:,.2f}** |",
            "",
        ]
    )

    # Optional summary of work delivered (for retainer invoices)
    if data.get("work_summary_bullets"):
        body_lines.append("## Summary of Work Delivered This Period")
        body_lines.append("")
        for bullet in data["work_summary_bullets"]:
            body_lines.append(f"- {bullet}")
        body_lines.append("")

    # Payment instructions
    body_lines.extend(
        [
            "## Payment",
            "",
            f"Pay online: [Payment link will be inserted by invoicing adapter]",
            "",
            "Or via:",
            f"- ACH/Wire: details in separate email",
            f"- Check: payable to {company.get('legal_entity', 'TODO')}, mail to address above",
            "",
            f"Questions? Reply to this email or call {company.get('phone', 'TODO')}.",
            "",
            f"Thank you for working with {company.get('name')}.",
            "",
            "---",
            "",
            f"_Invoice #{invoice_number} generated {today} by Restore Marketing Automation_",
        ]
    )

    markdown = "\n".join(frontmatter_lines + body_lines)
    return invoice_id, markdown, total, invoice_number


def main():
    parser = argparse.ArgumentParser(description="Generate an invoice.")
    parser.add_argument("--input", help="Invoice data JSON")
    parser.add_argument("--engagement", help="Engagement note path")
    parser.add_argument("--period", help="Billing period YYYY-MM")
    parser.add_argument("--output", help="Output path")
    args = parser.parse_args()

    if args.input:
        with open(args.input) as f:
            data = json.load(f)
    elif args.engagement and args.period:
        # Minimal mode — requires the owner to fill in real data
        data = {
            "engagement": args.engagement,
            "client_company": "TODO: read from engagement note",
            "client_contact": "TODO: read from engagement note",
            "client_email": "TODO",
            "period": args.period,
            "line_items": [
                {"description": f"Monthly retainer — {args.period}", "amount": 0}
            ],
            "work_summary_bullets": [],
        }
        print(
            "NOTE: --engagement mode produces a stub. For real invoices, "
            "pass --input with a fully-populated JSON.",
            file=sys.stderr,
        )
    else:
        parser.error("provide --input or (--engagement AND --period)")

    config = load_config()
    invoice_id, markdown, total, invoice_number = generate_invoice(data, config)

    if args.output:
        out_path = Path(args.output)
    else:
        out_path = (
            Path(__file__).parent.parent
            / "invoices"
            / f"{invoice_id}.md"
        )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(markdown)

    result = {
        "invoice_id": invoice_id,
        "invoice_number": invoice_number,
        "total_usd": total,
        "file": str(out_path),
        "status": "draft",
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
