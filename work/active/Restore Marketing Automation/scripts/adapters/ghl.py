#!/usr/bin/env python3
"""
GoHighLevel (GHL) Adapter — Restore Marketing Co Automation

Wraps the GHL API v2 (Lead Connector) in a stable interface used by the
automation agents. GHL is Restore Marketing Co's primary platform — it holds
contacts, opportunities (leads), pipelines, calendars, invoices, workflows,
and SMS/email comms.

API docs: https://highlevel.stoplight.io/docs/integrations/
Base URL: https://services.leadconnectorhq.com

Auth: Bearer token via Authorization header + Version header.
Rate limits: 100 req / 10 sec per resource (per GHL docs, as of 2025).

This adapter:
- Uses stdlib only (urllib.request) so the vault has zero new Python deps
- Supports MOCK mode when credentials are absent (returns fake data) so
  agents can run in dry-run / testing mode
- Logs every call to a rolling log file for debugging and observability
- Retries on 429 + 5xx with exponential backoff (3 attempts max)

Usage:
    from adapters.ghl import GHL

    ghl = GHL()  # reads GHL_ACCESS_TOKEN + GHL_LOCATION_ID from env
    contact = ghl.get_contact(contact_id="abc123")
    opportunities = ghl.list_opportunities(pipeline_id="pipe_xyz", limit=50)
    ghl.add_contact_tag(contact_id="abc123", tag="qualified")
    ghl.move_opportunity_stage(opp_id="opp_456", stage_id="stage_789")
    invoice = ghl.create_invoice(
        contact_id="abc123",
        line_items=[{"name": "April retainer", "amount": 500000}],  # cents
    )

Environment variables:
    GHL_ACCESS_TOKEN  — OAuth access token or API key (required)
    GHL_LOCATION_ID   — sub-account (location) ID this adapter operates in
    GHL_API_VERSION   — API version header, default "2021-07-28"
    GHL_BASE_URL      — override base URL (default https://services.leadconnectorhq.com)
    GHL_MOCK          — set to "1" to force mock mode regardless of credentials
    GHL_LOG_PATH      — override log file path (default: runs/ghl-adapter.log)
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
from typing import Any, Optional


# --------------------------------------------------------------------------
# Config + Logging
# --------------------------------------------------------------------------

DEFAULT_BASE_URL = "https://services.leadconnectorhq.com"
DEFAULT_API_VERSION = "2021-07-28"
DEFAULT_LOG_PATH = (
    Path(__file__).parent.parent.parent / "runs" / "ghl-adapter.log"
)


def _log(message: str, log_path: Optional[Path] = None) -> None:
    path = log_path or DEFAULT_LOG_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a") as f:
        f.write(f"{datetime.now().isoformat()} {message}\n")


# --------------------------------------------------------------------------
# Core Adapter
# --------------------------------------------------------------------------


@dataclass
class GHLConfig:
    access_token: str = ""
    location_id: str = ""
    base_url: str = DEFAULT_BASE_URL
    api_version: str = DEFAULT_API_VERSION
    mock: bool = False

    @classmethod
    def from_env(cls) -> "GHLConfig":
        return cls(
            access_token=os.getenv("GHL_ACCESS_TOKEN", ""),
            location_id=os.getenv("GHL_LOCATION_ID", ""),
            base_url=os.getenv("GHL_BASE_URL", DEFAULT_BASE_URL),
            api_version=os.getenv("GHL_API_VERSION", DEFAULT_API_VERSION),
            mock=(os.getenv("GHL_MOCK") == "1"),
        )

    @property
    def is_live(self) -> bool:
        return bool(self.access_token) and bool(self.location_id) and not self.mock


class GHLError(Exception):
    """Raised when a GHL API call fails after retries."""


class GHL:
    """Thin adapter around the GoHighLevel API v2."""

    def __init__(self, config: Optional[GHLConfig] = None):
        self.config = config or GHLConfig.from_env()
        if not self.config.is_live:
            _log(
                "GHL adapter initialized in MOCK mode "
                f"(token_present={bool(self.config.access_token)}, "
                f"location_present={bool(self.config.location_id)}, "
                f"mock_flag={self.config.mock})"
            )
        else:
            _log(f"GHL adapter initialized LIVE for location {self.config.location_id}")

    # ----------------------------------------------------------------------
    # Raw HTTP
    # ----------------------------------------------------------------------

    def _request(
        self,
        method: str,
        path: str,
        *,
        params: Optional[dict] = None,
        body: Optional[dict] = None,
        max_retries: int = 3,
    ) -> dict:
        """Make an HTTP request to GHL with retries + logging."""
        if not self.config.is_live:
            return self._mock_response(method, path, params, body)

        url = f"{self.config.base_url}{path}"
        if params:
            url += "?" + urllib.parse.urlencode(params)

        headers = {
            "Authorization": f"Bearer {self.config.access_token}",
            "Version": self.config.api_version,
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

        data = json.dumps(body).encode("utf-8") if body else None

        for attempt in range(max_retries):
            try:
                req = urllib.request.Request(url, data=data, headers=headers, method=method)
                with urllib.request.urlopen(req, timeout=30) as resp:
                    raw = resp.read().decode("utf-8")
                    _log(f"{method} {path} -> {resp.status} ({len(raw)} bytes)")
                    return json.loads(raw) if raw else {}
            except urllib.error.HTTPError as e:
                body_text = e.read().decode("utf-8", errors="replace")
                _log(f"{method} {path} -> HTTPError {e.code}: {body_text[:200]}")
                if e.code == 429 or e.code >= 500:
                    if attempt < max_retries - 1:
                        backoff = 2 ** attempt
                        time.sleep(backoff)
                        continue
                raise GHLError(f"GHL {method} {path} failed: {e.code} {body_text}") from e
            except urllib.error.URLError as e:
                _log(f"{method} {path} -> URLError {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                    continue
                raise GHLError(f"GHL {method} {path} failed: {e}") from e
        raise GHLError(f"GHL {method} {path} exhausted retries")

    def _mock_response(
        self,
        method: str,
        path: str,
        params: Optional[dict],
        body: Optional[dict],
    ) -> dict:
        """Return a plausible mock response so agents can be tested without credentials."""
        _log(f"MOCK {method} {path} params={params} body={bool(body)}")

        # Order matters: more specific paths first.

        # Pipelines (more specific than /opportunities/)
        if "/opportunities/pipelines" in path:
            return {
                "pipelines": [
                    {
                        "id": "mock-pipe-sales",
                        "name": "Sales Pipeline",
                        "stages": [
                            {"id": "mock-stage-new", "name": "New Lead"},
                            {"id": "mock-stage-qualified", "name": "Qualified"},
                            {"id": "mock-stage-discovery", "name": "Discovery Call"},
                            {"id": "mock-stage-proposal", "name": "Proposal Sent"},
                            {"id": "mock-stage-contract", "name": "Contract Out"},
                            {"id": "mock-stage-won", "name": "Closed Won"},
                            {"id": "mock-stage-lost", "name": "Closed Lost"},
                        ],
                    }
                ]
            }

        # Opportunities search / list
        if "/opportunities/search" in path:
            return {
                "opportunities": [
                    {
                        "id": "mock-opp-001",
                        "name": "Mock Opportunity",
                        "monetaryValue": 5000,
                        "pipelineId": (params or {}).get("pipelineId", "mock-pipe-sales"),
                        "pipelineStageId": "mock-stage-new",
                        "status": "open",
                    }
                ],
                "total": 1,
            }
        if method == "POST" and path.endswith("/opportunities"):
            return {"opportunity": {"id": "mock-opp-new", **(body or {})}}
        if method == "PUT" and "/opportunities/" in path:
            return {"opportunity": {"id": path.rsplit("/", 1)[-1], **(body or {})}}

        # Contacts — specific endpoints
        if "/contacts/search" in path:
            return {
                "contacts": [
                    {
                        "id": "mock-contact-abc123",
                        "firstName": "Mock",
                        "lastName": "Contact",
                        "email": "mock@example.com",
                    }
                ],
                "total": 1,
            }
        if "/contacts/" in path and "/tags" in path:
            return {"tagsAdded": (body or {}).get("tags", [])}
        if "/contacts/" in path and "/notes" in path:
            return {"note": {"id": "mock-note-1", **(body or {})}}
        if "/contacts/" in path and "/workflow/" in path:
            return {"success": True, "mock": True}
        if method == "GET" and "/contacts/" in path:
            return {
                "contact": {
                    "id": path.rsplit("/", 1)[-1],
                    "firstName": "Mock",
                    "lastName": "Contact",
                    "email": "mock@example.com",
                    "tags": ["mock"],
                    "customFields": [],
                }
            }
        if method == "POST" and path.endswith("/contacts"):
            return {"contact": {"id": "mock-contact-new", **(body or {})}}
        if method == "PUT" and "/contacts/" in path:
            return {"contact": {"id": path.rsplit("/", 1)[-1], **(body or {})}}

        # Invoices
        if method == "POST" and "/invoices/" in path and "/send" in path:
            return {"sent": True, "invoiceId": path.split("/")[-2]}
        if method == "POST" and path.endswith("/invoices/"):
            total = sum(
                (li.get("amount", 0) * li.get("qty", 1))
                for li in (body or {}).get("items", [])
            )
            return {
                "invoice": {
                    "id": "mock-invoice-inv1001",
                    "invoiceNumber": "1001",
                    "status": "draft",
                    "total": total,
                    "paymentUrl": "https://mock.leadconnectorhq.com/pay/mock-invoice-inv1001",
                }
            }
        if method == "GET" and "/invoices/" in path:
            return {
                "invoice": {
                    "id": path.rsplit("/", 1)[-1],
                    "status": "sent",
                    "total": 5000,
                }
            }

        # Calendars
        if "/calendars/" in path and "/free-slots" in path:
            return {
                "slots": [
                    {"startTime": "2026-04-17T10:00:00Z", "endTime": "2026-04-17T10:30:00Z"},
                    {"startTime": "2026-04-17T14:00:00Z", "endTime": "2026-04-17T14:30:00Z"},
                    {"startTime": "2026-04-18T11:00:00Z", "endTime": "2026-04-18T11:30:00Z"},
                ]
            }
        if "/calendars/events/appointments" in path:
            return {
                "appointment": {
                    "id": "mock-appt-1",
                    "status": "confirmed",
                    **(body or {}),
                }
            }
        if method == "GET" and "/calendars" in path:
            return {
                "calendars": [
                    {
                        "id": "mock-cal-discovery",
                        "name": "Discovery Calls",
                        "slotDurationMinutes": 30,
                    },
                    {
                        "id": "mock-cal-kickoff",
                        "name": "Client Kickoff",
                        "slotDurationMinutes": 60,
                    },
                ]
            }

        return {"mock": True, "method": method, "path": path}

    # ----------------------------------------------------------------------
    # Contacts
    # ----------------------------------------------------------------------

    def get_contact(self, contact_id: str) -> dict:
        return self._request("GET", f"/contacts/{contact_id}")

    def search_contacts(self, query: str, limit: int = 25) -> dict:
        return self._request(
            "POST",
            "/contacts/search",
            body={
                "locationId": self.config.location_id,
                "query": query,
                "pageLimit": limit,
            },
        )

    def create_contact(
        self,
        *,
        first_name: str,
        last_name: str = "",
        email: str = "",
        phone: str = "",
        source: str = "restore-automation",
        tags: Optional[list[str]] = None,
        custom_fields: Optional[dict[str, Any]] = None,
    ) -> dict:
        body: dict = {
            "locationId": self.config.location_id,
            "firstName": first_name,
            "lastName": last_name,
            "source": source,
        }
        if email:
            body["email"] = email
        if phone:
            body["phone"] = phone
        if tags:
            body["tags"] = tags
        if custom_fields:
            body["customFields"] = [
                {"id": k, "value": v} for k, v in custom_fields.items()
            ]
        return self._request("POST", "/contacts", body=body)

    def update_contact(self, contact_id: str, **fields: Any) -> dict:
        return self._request("PUT", f"/contacts/{contact_id}", body=fields)

    def add_contact_tag(self, contact_id: str, tags: list[str] | str) -> dict:
        tag_list = [tags] if isinstance(tags, str) else tags
        return self._request(
            "POST", f"/contacts/{contact_id}/tags", body={"tags": tag_list}
        )

    def add_contact_note(self, contact_id: str, body: str, user_id: str = "") -> dict:
        payload: dict = {"body": body}
        if user_id:
            payload["userId"] = user_id
        return self._request("POST", f"/contacts/{contact_id}/notes", body=payload)

    # ----------------------------------------------------------------------
    # Pipelines + Opportunities
    # ----------------------------------------------------------------------

    def list_pipelines(self) -> dict:
        return self._request(
            "GET", "/opportunities/pipelines",
            params={"locationId": self.config.location_id},
        )

    def list_opportunities(
        self,
        *,
        pipeline_id: Optional[str] = None,
        stage_id: Optional[str] = None,
        limit: int = 50,
    ) -> dict:
        params: dict = {"location_id": self.config.location_id, "limit": limit}
        if pipeline_id:
            params["pipelineId"] = pipeline_id
        if stage_id:
            params["stageId"] = stage_id
        return self._request("GET", "/opportunities/search", params=params)

    def create_opportunity(
        self,
        *,
        pipeline_id: str,
        pipeline_stage_id: str,
        name: str,
        contact_id: str,
        monetary_value: float = 0,
        status: str = "open",
        custom_fields: Optional[dict] = None,
    ) -> dict:
        body: dict = {
            "pipelineId": pipeline_id,
            "pipelineStageId": pipeline_stage_id,
            "locationId": self.config.location_id,
            "name": name,
            "contactId": contact_id,
            "monetaryValue": monetary_value,
            "status": status,
        }
        if custom_fields:
            body["customFields"] = custom_fields
        return self._request("POST", "/opportunities", body=body)

    def move_opportunity_stage(self, opp_id: str, stage_id: str) -> dict:
        return self._request(
            "PUT",
            f"/opportunities/{opp_id}",
            body={"pipelineStageId": stage_id},
        )

    def update_opportunity_value(self, opp_id: str, monetary_value: float) -> dict:
        return self._request(
            "PUT",
            f"/opportunities/{opp_id}",
            body={"monetaryValue": monetary_value},
        )

    # ----------------------------------------------------------------------
    # Invoices
    # ----------------------------------------------------------------------

    def create_invoice(
        self,
        *,
        contact_id: str,
        line_items: list[dict],
        currency: str = "USD",
        due_date: Optional[str] = None,
        notes: str = "",
    ) -> dict:
        """Create an invoice. Each line_item: {name, amount (in dollars), qty?}."""
        body: dict = {
            "altId": self.config.location_id,
            "altType": "location",
            "contactDetails": {"id": contact_id},
            "currency": currency,
            "items": [
                {
                    "name": li["name"],
                    "currency": currency,
                    "amount": li["amount"],
                    "qty": li.get("qty", 1),
                }
                for li in line_items
            ],
            "description": notes,
        }
        if due_date:
            body["dueDate"] = due_date
        return self._request("POST", "/invoices/", body=body)

    def get_invoice(self, invoice_id: str) -> dict:
        return self._request(
            "GET",
            f"/invoices/{invoice_id}",
            params={"altId": self.config.location_id, "altType": "location"},
        )

    def send_invoice(self, invoice_id: str) -> dict:
        return self._request(
            "POST",
            f"/invoices/{invoice_id}/send",
            body={"altId": self.config.location_id, "altType": "location"},
        )

    # ----------------------------------------------------------------------
    # Calendars
    # ----------------------------------------------------------------------

    def list_calendars(self) -> dict:
        return self._request(
            "GET", "/calendars/", params={"locationId": self.config.location_id}
        )

    def get_calendar_slots(
        self,
        calendar_id: str,
        start_date_ms: int,
        end_date_ms: int,
    ) -> dict:
        return self._request(
            "GET",
            f"/calendars/{calendar_id}/free-slots",
            params={"startDate": start_date_ms, "endDate": end_date_ms},
        )

    def create_calendar_event(
        self,
        *,
        calendar_id: str,
        contact_id: str,
        start_time: str,
        end_time: str,
        title: str,
        appointment_status: str = "confirmed",
    ) -> dict:
        body = {
            "calendarId": calendar_id,
            "locationId": self.config.location_id,
            "contactId": contact_id,
            "startTime": start_time,
            "endTime": end_time,
            "title": title,
            "appointmentStatus": appointment_status,
        }
        return self._request("POST", "/calendars/events/appointments", body=body)

    # ----------------------------------------------------------------------
    # Workflows (trigger native GHL automations)
    # ----------------------------------------------------------------------

    def add_contact_to_workflow(self, contact_id: str, workflow_id: str) -> dict:
        return self._request(
            "POST",
            f"/contacts/{contact_id}/workflow/{workflow_id}",
            body={},
        )

    def remove_contact_from_workflow(self, contact_id: str, workflow_id: str) -> dict:
        return self._request(
            "DELETE", f"/contacts/{contact_id}/workflow/{workflow_id}"
        )


# --------------------------------------------------------------------------
# CLI — smoke test
# --------------------------------------------------------------------------


def _cli():
    import argparse

    parser = argparse.ArgumentParser(description="GHL adapter smoke test")
    parser.add_argument(
        "--action",
        choices=["ping", "pipelines", "search", "create-contact", "create-invoice"],
        default="ping",
    )
    parser.add_argument("--query", default="mock")
    args = parser.parse_args()

    ghl = GHL()
    mode = "LIVE" if ghl.config.is_live else "MOCK"
    print(f"Mode: {mode}")
    print(f"Location: {ghl.config.location_id or '(none)'}")
    print()

    if args.action == "ping":
        print(json.dumps(ghl.list_pipelines(), indent=2))
    elif args.action == "pipelines":
        print(json.dumps(ghl.list_pipelines(), indent=2))
    elif args.action == "search":
        print(json.dumps(ghl.search_contacts(args.query), indent=2))
    elif args.action == "create-contact":
        print(
            json.dumps(
                ghl.create_contact(
                    first_name="Test",
                    last_name="Lead",
                    email="test@example.com",
                    source="automation-test",
                    tags=["automation-test"],
                ),
                indent=2,
            )
        )
    elif args.action == "create-invoice":
        print(
            json.dumps(
                ghl.create_invoice(
                    contact_id="mock-contact-abc123",
                    line_items=[
                        {"name": "Monthly retainer", "amount": 5000, "qty": 1}
                    ],
                    notes="April 2026 retainer",
                ),
                indent=2,
            )
        )


if __name__ == "__main__":
    _cli()
