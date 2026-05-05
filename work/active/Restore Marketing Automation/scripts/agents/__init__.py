"""Agent orchestrators for Restore Marketing Co automation.

Each agent is a Python module that implements one of the 8 agent roles
defined in agents/*.md. Agents compose:

- The shared runtime (runtime.py) — config loading, logging, escalation,
  state tracking, adapter initialization
- The integration adapters (adapters/ghl.py, adapters/video.py)
- The utility scripts (qualify_lead.py, generate_proposal.py,
  invoice_template.py, weekly_report.py)

Each agent module exposes one or more entry-point functions callable from
a cron job, a manual script invocation, or a Claude session via Bash.

Agents implemented:
- invoicing_agent: monthly cycle, payment chase, reconciliation
- (others pending)
"""
