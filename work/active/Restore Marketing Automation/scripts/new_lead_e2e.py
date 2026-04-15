#!/usr/bin/env python3
"""
End-to-end new-lead workflow test.

Simulates the full workflows/new-lead.md pipeline:
  1. Raw lead arrives
  2. Qualifier scores it (qualify_lead.py logic)
  3. GHL adapter creates contact, creates opportunity in pipeline
  4. Based on routing:
     - qualified -> move to Qualified stage, add tag, book discovery call
     - gray-zone -> add tag, escalate to owner (vault note)
     - disqualified -> add tag, add decline note

Runs end-to-end in GHL mock mode by default (no credentials needed).
With real GHL_ACCESS_TOKEN + GHL_LOCATION_ID in env, it makes real API calls.

Usage:
    python3 new_lead_e2e.py test-lead.json
    cat lead.json | python3 new_lead_e2e.py -

Reads the same lead JSON schema as qualify_lead.py.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

# Make the script runnable from its directory
sys.path.insert(0, str(Path(__file__).parent))

from qualify_lead import load_config, qualify_lead  # noqa: E402
from adapters.ghl import GHL  # noqa: E402


# GHL pipeline stage IDs — these are set in config.yaml when owner wires up real GHL
def get_stage_ids(config: dict) -> dict:
    ghl_cfg = config.get("ghl", {})
    return {
        "new": ghl_cfg.get("stage_id_new_lead", "mock-stage-new"),
        "qualified": ghl_cfg.get("stage_id_qualified", "mock-stage-qualified"),
        "gray_zone": ghl_cfg.get("stage_id_gray_zone", "mock-stage-new"),
        "disqualified": ghl_cfg.get("stage_id_lost", "mock-stage-lost"),
    }


def get_tag_names(config: dict) -> dict:
    ghl_cfg = config.get("ghl", {})
    tags = ghl_cfg.get("tags", {})
    return {
        "qualified": tags.get("qualified", "restore:qualified"),
        "gray_zone": tags.get("gray_zone", "restore:gray-zone"),
        "disqualified": tags.get("disqualified", "restore:disqualified"),
        "hvac": tags.get("industry_match", "restore:industry-match"),
    }


def run_new_lead(lead: dict, config: dict) -> dict:
    """Execute the full new-lead workflow and return the trace."""
    trace = {"steps": [], "lead": lead, "final_state": None}

    # Step 1: qualify
    result = qualify_lead(lead, config)
    trace["steps"].append(
        {
            "step": "qualify",
            "score": result["lead_score"],
            "routing": result["routing"],
            "breakdown": result["breakdown"],
        }
    )

    # Step 2: GHL — create contact
    ghl = GHL()
    mode = "LIVE" if ghl.config.is_live else "MOCK"
    trace["ghl_mode"] = mode

    contact_resp = ghl.create_contact(
        first_name=lead.get("name", "").split(" ", 1)[0] if lead.get("name") else "Unknown",
        last_name=(lead.get("name", "").split(" ", 1)[1] if " " in lead.get("name", "") else ""),
        email=lead.get("email", ""),
        phone=lead.get("phone", ""),
        source=lead.get("source", "website-form"),
        tags=[f"source:{lead.get('source', 'unknown')}"],
        custom_fields={
            "industry": lead.get("industry", ""),
            "budget_hint": lead.get("budget_hint", ""),
            "lead_score": str(result["lead_score"]),
            "lead_routing": result["routing"],
        },
    )
    contact = contact_resp.get("contact", {})
    contact_id = contact.get("id", "mock-contact-unknown")
    trace["steps"].append({"step": "ghl_create_contact", "contact_id": contact_id})

    # Step 3: GHL — create opportunity in pipeline
    ghl_cfg = config.get("ghl", {})
    pipeline_id = ghl_cfg.get("pipeline_id_sales", "mock-pipe-sales")
    stages = get_stage_ids(config)

    opp_resp = ghl.create_opportunity(
        pipeline_id=pipeline_id,
        pipeline_stage_id=stages["new"],
        name=f"{lead.get('company', 'Unknown')} — {', '.join([k for k, v in result['breakdown'].items() if v > 0][:2])}",
        contact_id=contact_id,
        monetary_value=_estimate_value(lead, result),
    )
    opp_id = opp_resp.get("opportunity", {}).get("id", "mock-opp-unknown")
    trace["steps"].append({"step": "ghl_create_opportunity", "opportunity_id": opp_id})

    # Step 4: route
    tag_names = get_tag_names(config)

    if result["routing"] == "qualified":
        ghl.add_contact_tag(contact_id, [tag_names["qualified"]])
        ghl.move_opportunity_stage(opp_id, stages["qualified"])
        ghl.add_contact_note(
            contact_id,
            f"Qualified by automation. Score: {result['lead_score']}/100. "
            f"Top factors: {', '.join([f'{k}={v}' for k, v in result['breakdown'].items()])}. "
            f"Next: trigger discovery-call workflow.",
        )
        discovery_wf = ghl_cfg.get("workflow_id_discovery_call_booking", "mock-wf-discovery")
        ghl.add_contact_to_workflow(contact_id, discovery_wf)
        trace["steps"].append(
            {
                "step": "route_qualified",
                "tags_added": [tag_names["qualified"]],
                "workflow_triggered": discovery_wf,
                "stage_moved_to": stages["qualified"],
            }
        )
    elif result["routing"] == "gray-zone":
        ghl.add_contact_tag(contact_id, [tag_names["gray_zone"]])
        ghl.add_contact_note(
            contact_id,
            f"GRAY ZONE — owner review required. Score: {result['lead_score']}/100. "
            f"Reasons: {' | '.join(result['reasons'])}",
        )
        trace["steps"].append(
            {
                "step": "route_gray_zone",
                "tags_added": [tag_names["gray_zone"]],
                "escalation": "owner review required",
            }
        )
    else:  # disqualified
        ghl.add_contact_tag(contact_id, [tag_names["disqualified"]])
        ghl.move_opportunity_stage(opp_id, stages["disqualified"])
        ghl.add_contact_note(
            contact_id,
            f"Disqualified by automation. Score: {result['lead_score']}/100. "
            f"Reasons: {' | '.join(result['reasons'])}",
        )
        if config.get("features", {}).get("auto_disqualify_leads"):
            decline_wf = ghl_cfg.get("workflow_id_polite_decline", "mock-wf-decline")
            ghl.add_contact_to_workflow(contact_id, decline_wf)
            trace["steps"].append(
                {
                    "step": "route_disqualified",
                    "tags_added": [tag_names["disqualified"]],
                    "workflow_triggered": decline_wf,
                    "stage_moved_to": stages["disqualified"],
                }
            )
        else:
            trace["steps"].append(
                {
                    "step": "route_disqualified",
                    "tags_added": [tag_names["disqualified"]],
                    "note": "auto_disqualify_leads feature flag off — no email sent",
                }
            )

    trace["final_state"] = {
        "contact_id": contact_id,
        "opportunity_id": opp_id,
        "routing": result["routing"],
        "score": result["lead_score"],
    }
    return trace


def _estimate_value(lead: dict, result: dict) -> float:
    """Rough deal value estimate from budget hint. Just a heuristic for the pipeline."""
    import re

    hint = lead.get("budget_hint", "") or lead.get("message", "")
    amounts = re.findall(r"\$?([0-9,]+)", hint)
    if amounts:
        try:
            amt = int(amounts[0].replace(",", ""))
            # If it looks like monthly, multiply by 12 for annual contract value
            if "month" in hint.lower() or "/mo" in hint.lower():
                return amt * 12
            return amt
        except ValueError:
            return 0
    return 0


def main():
    import argparse

    parser = argparse.ArgumentParser(description="End-to-end new-lead workflow test")
    parser.add_argument("input", help="Lead JSON file or '-' for stdin")
    args = parser.parse_args()

    if args.input == "-":
        lead = json.load(sys.stdin)
    else:
        with open(args.input) as f:
            lead = json.load(f)

    config = load_config()
    trace = run_new_lead(lead, config)
    json.dump(trace, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
