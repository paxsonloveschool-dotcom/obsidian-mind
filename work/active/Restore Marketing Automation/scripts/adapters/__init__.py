"""Integration adapters for Restore Marketing Co automation.

Each adapter wraps an external system API in a stable interface that the
agents consume. Swap providers by swapping adapter implementations; the
agents and workflows stay unchanged.

Currently implemented:
- ghl: GoHighLevel (CRM, email, SMS, scheduling, invoicing, workflows, reputation)

Stub / pending:
- email_fallback: for transactional email if not using GHL
- storage: for file storage (GHL has limited file storage)
- analytics: GA4 / Plausible for client performance data
"""
