#!/usr/bin/env python3
"""
Restore Marketing Co — Lead Qualification Script

Takes a lead JSON payload and scores it against the ICP defined in config.yaml.
Produces a score + breakdown + routing decision (qualify / gray-zone / disqualify).

Runs locally with no external APIs. Requires only PyYAML.

Usage:
    python3 qualify_lead.py path/to/lead.json
    cat lead.json | python3 qualify_lead.py -

Lead JSON schema:
{
    "name": "Jane Smith",
    "email": "jane@acme.com",
    "company": "Acme Corp",
    "website": "https://acme.com",
    "role": "VP Marketing",
    "message": "Looking for help with our SEO and content strategy.",
    "source": "website-form",
    "budget_hint": "$5k/month",
    "timeline_hint": "starting in May",
    "industry": "manufacturing",
    "employee_count": 40,
    "annual_revenue_usd": 3500000
}

Output:
{
    "lead_id": "2026-04-15-acme-corp",
    "lead_score": 78,
    "routing": "qualified",
    "breakdown": { ... weighted factor scores ... },
    "top_concerns": [...],
    "recommended_next_step": "trigger discovery-call workflow"
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
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(
            f"config.yaml not found at {CONFIG_PATH}. Fill in config.yaml first."
        )
    with CONFIG_PATH.open() as f:
        return yaml.safe_load(f)


def slugify(text: str) -> str:
    return "".join(c if c.isalnum() else "-" for c in text.lower()).strip("-")


STOPWORDS = {
    "and", "or", "the", "of", "in", "on", "at", "to", "for", "with", "a", "an",
    "&", "plus", "/", "etc", "services", "service", "company", "companies",
}


def _tokenize(text: str) -> set[str]:
    """Lowercase, strip punctuation, split on whitespace, remove stopwords + short tokens."""
    import re

    cleaned = re.sub(r"[^\w\s]", " ", (text or "").lower())
    tokens = cleaned.split()
    return {t for t in tokens if len(t) >= 3 and t not in STOPWORDS}


def score_industry_match(lead: dict, icp: dict) -> tuple[int, str]:
    """Token-overlap scoring so 'home services hvac' matches 'Home services (HVAC, plumbing...)'."""
    weight = icp["scoring"]["weights"]["industry_match"]
    good = [i for i in icp.get("industries_good_fit", []) if i and "TODO" not in i]
    avoid = [i for i in icp.get("industries_avoid", []) if i and "TODO" not in i]
    lead_industry = lead.get("industry") or ""

    if not good:
        return (weight // 2, "industry_match: no ICP defined (partial credit)")

    lead_tokens = _tokenize(lead_industry)
    if not lead_tokens:
        return (weight // 3, "industry_match: no lead industry provided")

    # Check avoid list first (hard zero)
    for av in avoid:
        av_tokens = _tokenize(av)
        if lead_tokens & av_tokens:
            return (0, f"industry_match: '{lead_industry}' matches avoid list ({av})")

    # Score against good-fit list
    best_overlap = 0
    best_entry = ""
    for g in good:
        g_tokens = _tokenize(g)
        overlap = len(lead_tokens & g_tokens)
        if overlap > best_overlap:
            best_overlap = overlap
            best_entry = g

    if best_overlap >= 2:
        return (weight, f"industry_match: strong fit with '{best_entry}' ({best_overlap} token overlap)")
    if best_overlap == 1:
        return (
            weight * 2 // 3,
            f"industry_match: partial fit with '{best_entry}' (1 token overlap)",
        )
    return (
        weight // 3,
        f"industry_match: '{lead_industry}' doesn't match good-fit or avoid list",
    )


def score_budget_fit(lead: dict, icp: dict, pricing_rules: dict) -> tuple[int, str]:
    weight = icp["scoring"]["weights"]["budget_fit"]
    budget_hint = (lead.get("budget_hint") or "").lower()
    budget_min = icp.get("budget_minimum_monthly", 0)

    if not budget_hint:
        return (weight // 3, "budget_fit: no budget signal (partial credit)")

    # Extract any dollar amount from the hint string
    import re

    amounts = re.findall(r"\$?([0-9,]+)", budget_hint)
    if amounts:
        try:
            amount = int(amounts[0].replace(",", ""))
            if amount >= budget_min and amount >= pricing_rules.get("minimum_deal_size", 0):
                return (weight, f"budget_fit: signaled ${amount} (above floor)")
            if amount >= budget_min * 0.7:
                return (weight * 2 // 3, f"budget_fit: signaled ${amount} (close to floor)")
            return (0, f"budget_fit: signaled ${amount} (below floor ${budget_min})")
        except ValueError:
            pass
    return (weight // 3, "budget_fit: budget hint exists but couldn't parse")


def score_company_size(lead: dict, icp: dict) -> tuple[int, str]:
    weight = icp["scoring"]["weights"]["company_size_fit"]
    employees = lead.get("employee_count", 0)
    revenue = lead.get("annual_revenue_usd", 0)

    emp_min = icp["company_size_employees"].get("min", 0)
    emp_max = icp["company_size_employees"].get("max", 0)
    rev_min = icp["company_revenue_annual"].get("min", 0)
    rev_max = icp["company_revenue_annual"].get("max", 0)

    if not employees and not revenue:
        return (weight // 3, "company_size_fit: no size data")

    emp_ok = (not emp_min and not emp_max) or (emp_min <= employees <= (emp_max or float("inf")))
    rev_ok = (not rev_min and not rev_max) or (rev_min <= revenue <= (rev_max or float("inf")))

    if emp_ok and rev_ok:
        return (weight, f"company_size_fit: {employees} employees / ${revenue:,} revenue fits ICP")
    if emp_ok or rev_ok:
        return (weight * 2 // 3, "company_size_fit: partial fit")
    return (0, "company_size_fit: outside ICP range")


def score_decision_maker(lead: dict, icp: dict) -> tuple[int, str]:
    weight = icp["scoring"]["weights"]["decision_maker_reached"]
    role = (lead.get("role") or "").lower()
    dm_roles = [r.lower() for r in icp.get("decision_maker_roles", []) if r and r != "TODO"]

    if not role:
        return (weight // 3, "decision_maker: role unknown")
    if not dm_roles:
        return (weight // 2, "decision_maker: no DM roles defined in ICP (partial)")
    if any(dm in role or role in dm for dm in dm_roles):
        return (weight, f"decision_maker: {role} matches")
    return (weight // 3, f"decision_maker: {role} is not a listed DM role")


def score_geographic_fit(lead: dict, icp: dict) -> tuple[int, str]:
    weight = icp["scoring"]["weights"]["geographic_fit"]
    geo_focus = [g.lower() for g in icp.get("geographic_focus", []) if g and g != "TODO"]
    if not geo_focus:
        return (weight, "geographic_fit: no geo constraint")
    # No way to know from lead data unless it includes region — default to partial credit
    return (weight // 2, "geographic_fit: unknown (partial)")


def check_disqualifiers(lead: dict, icp: dict) -> list[str]:
    """Return a list of hard-fail reasons, if any."""
    disqualifiers = [d.lower() for d in icp.get("disqualifiers", []) if d and d != "TODO"]
    message = (lead.get("message") or "").lower()
    triggered = []
    for dq in disqualifiers:
        if dq in message:
            triggered.append(f"disqualifier triggered: {dq}")
    return triggered


def qualify_lead(lead: dict, config: dict) -> dict:
    icp = config.get("icp", {})
    pricing_rules = config.get("pricing_rules", {})
    thresholds = icp["scoring"]["thresholds"]

    breakdown = {}
    total_score = 0
    reasons = []

    for scorer_name, scorer_fn in [
        ("industry_match", lambda: score_industry_match(lead, icp)),
        ("budget_fit", lambda: score_budget_fit(lead, icp, pricing_rules)),
        ("company_size_fit", lambda: score_company_size(lead, icp)),
        ("decision_maker_reached", lambda: score_decision_maker(lead, icp)),
        ("geographic_fit", lambda: score_geographic_fit(lead, icp)),
    ]:
        score, reason = scorer_fn()
        breakdown[scorer_name] = score
        total_score += score
        reasons.append(reason)

    # Hard disqualifiers
    dq_reasons = check_disqualifiers(lead, icp)
    if dq_reasons:
        total_score = 0
        reasons.extend(dq_reasons)

    # Routing
    if total_score >= thresholds["auto_qualify"]:
        routing = "qualified"
        next_step = "trigger discovery-call workflow"
    elif total_score >= thresholds["gray_zone"]:
        routing = "gray-zone"
        next_step = "escalate to owner for judgment call"
    else:
        routing = "disqualified"
        next_step = (
            "send polite decline email"
            if config.get("features", {}).get("auto_disqualify_leads")
            else "escalate to owner for review"
        )

    today = datetime.now().strftime("%Y-%m-%d")
    lead_id = f"{today}-{slugify(lead.get('company', 'unknown'))}"

    return {
        "lead_id": lead_id,
        "lead_score": total_score,
        "routing": routing,
        "breakdown": breakdown,
        "reasons": reasons,
        "disqualifier_triggered": len(dq_reasons) > 0,
        "recommended_next_step": next_step,
        "scored_at": datetime.now().isoformat(),
    }


def main():
    parser = argparse.ArgumentParser(description="Qualify a lead against the Restore ICP.")
    parser.add_argument("input", help="Path to lead JSON file, or '-' for stdin")
    args = parser.parse_args()

    if args.input == "-":
        lead = json.load(sys.stdin)
    else:
        with open(args.input) as f:
            lead = json.load(f)

    config = load_config()
    result = qualify_lead(lead, config)
    json.dump(result, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
