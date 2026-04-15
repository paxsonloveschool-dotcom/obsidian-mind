---
date: 2026-04-15
description: External system adapter spec — CRM, email, invoicing, scheduling, e-sign, project mgmt, analytics. Owner fills in which to use, automation composes around it.
tags: [work-note, integrations, automation]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
---

# Integrations

> The orchestration is adapter-agnostic. Workflows describe *what* needs to happen; adapters translate to *how* it happens in your specific stack. Pick one provider per category, drop credentials in `.env`, and the automation runs.

## Credentials Pattern — NEVER commit secrets

Credentials live in `.env` at the repo root (already in `.gitignore`). Each adapter reads from `.env`. Example:

```bash
# .env — NEVER commit this file
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...
STRIPE_SECRET_KEY=sk_live_...
CALENDLY_PERSONAL_TOKEN=...
CRM_API_KEY=...
```

Verify `.env` is ignored:
```bash
grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
```

## Required Adapters (pick one per category)

Every adapter has a **stub implementation** in `scripts/adapters/` that just logs what it would do. Swap the stub for a real implementation when you pick your tool.

### 1. CRM — source of truth for leads, contacts, deals, clients

| Option | Best for | Cost | API maturity |
|---|---|---|---|
| **Airtable** | Starting solo, flexible schema | Free → $10/mo | Excellent |
| **Notion** | Already-using-Notion | Free → $8/mo | Good (via Notion API) |
| **HubSpot Free** | Proper CRM, room to grow | Free → $15+/mo | Excellent |
| **Pipedrive** | Sales-pipeline-first | $14+/mo | Good |
| **Close** | Sales-calls-heavy | $49+/mo | Good |
| **Monday.com** | Visual boards, many uses | $8+/mo | Good |
| **Custom (Google Sheets)** | Zero-budget, messy | Free | Minimal |

**Default recommendation for solo founder**: **Airtable** — flexible, free tier handles the first 100 leads, API is first-class, templates exist for marketing agency CRMs. Migration path to HubSpot or Close is clean when the business scales.

**Adapter stub**: `scripts/adapters/crm_stub.py` — replace with `scripts/adapters/crm_airtable.py` when you pick Airtable (or `crm_hubspot.py`, etc.).

### 2. Email — outbound (to prospects, clients), inbound (lead capture)

| Option | Best for | Cost |
|---|---|---|
| **Gmail (Google Workspace)** | You already use Gmail | $6/mo/user |
| **Outlook 365** | You already use Outlook | $6/mo/user |
| **Resend** | Developer-friendly, transactional | Free → $20/mo |
| **SendGrid** | High volume | Free → $19.95/mo |
| **Postmark** | Transactional, great deliverability | $15/mo |
| **Mailgun** | API-first, many regions | $15/mo |

**Default**: Whatever mailbox you already use for day-to-day business (Gmail or Outlook). Use Resend or Postmark as a secondary for *transactional* email (invoices, confirmations) where deliverability matters.

**Adapter stub**: `scripts/adapters/email_stub.py`

### 3. Invoicing + payments

| Option | Best for | Cost |
|---|---|---|
| **Stripe** | Online payments, invoicing, subscriptions | 2.9% + $0.30/txn |
| **QuickBooks Online** | Full accounting integration | $30+/mo |
| **FreshBooks** | Solo/small biz, time tracking included | $17+/mo |
| **Wave** | Free, great for solos | Free |
| **Xero** | Accounting-first | $15+/mo |
| **Invoice Ninja** | Self-hosted, free | Free |

**Default for solo founder with mixed fixed + retainer clients**: **Stripe Invoicing + Wave for bookkeeping**, or **Stripe + QuickBooks** if you want proper accounting and tax help.

**Adapter stub**: `scripts/adapters/invoicing_stub.py`

### 4. Scheduling — discovery calls, kick-offs, check-ins

| Option | Best for | Cost |
|---|---|---|
| **Cal.com** | Open-source, self-hostable | Free → $12/mo |
| **Calendly** | Industry standard | Free → $10+/mo |
| **SavvyCal** | Better group scheduling | $12+/mo |
| **Google Calendar direct** | Low-friction, already paid for | Included with Google Workspace |

**Default**: **Cal.com** (free tier is generous, open API) or **Calendly** (if you want zero setup friction).

**Adapter stub**: `scripts/adapters/scheduling_stub.py`

### 5. E-sign — contracts, MSAs, SOWs

| Option | Best for | Cost |
|---|---|---|
| **DocuSign** | Industry standard | $10+/mo |
| **HelloSign / Dropbox Sign** | Simpler UX | $15+/mo |
| **PandaDoc** | Proposals + contracts in one | $19+/mo |
| **SignNow** | Lower cost | $8+/mo |
| **DocSeal (self-hosted)** | Free, open-source | Free |

**Default for solo founder**: **PandaDoc** — combines proposals and contracts with e-sign, cuts the toolchain by one. If budget is tight, **DocSeal self-hosted** or **SignNow**.

**Adapter stub**: `scripts/adapters/esign_stub.py`

### 6. Project management — active engagement tracking

| Option | Best for | Cost |
|---|---|---|
| **Notion** | Already using for docs, flexible | Free → $8/mo |
| **ClickUp** | Agency ops, dense feature set | Free → $7/mo |
| **Asana** | Clean, task-first | Free → $10.99/mo |
| **Linear** | If client work overlaps with dev | $8/mo |
| **Monday.com** | Visual, team-heavy | $8+/mo |
| **Basecamp** | Simple, flat-rate | $99/mo flat |

**Default**: **Notion** if already using it for docs (one tool = one mental model). **ClickUp** if you want purpose-built agency ops.

**Adapter stub**: `scripts/adapters/pm_stub.py`

### 7. Analytics — client performance data

| Option | Best for | Cost |
|---|---|---|
| **Google Analytics 4** | Standard, free | Free |
| **Plausible** | Privacy-first, simple | $9+/mo |
| **Fathom** | Privacy-first | $14+/mo |
| **Mixpanel** | Product/SaaS analytics | Free → $24/mo |
| **Matomo** | Self-hosted, full ownership | Free (self-hosted) |

**Default**: **Google Analytics 4** for clients who already use it, **Plausible** for clients who want privacy-first tracking.

**Adapter stub**: `scripts/adapters/analytics_stub.py`

### 8. Messaging / notifications — where agents post alerts

| Option | Best for | Cost |
|---|---|---|
| **Slack** | You use Slack already | Free → $8.75+/mo |
| **Discord** | Informal, you use Discord | Free |
| **Telegram** | Personal mobile alerts | Free |
| **Email only** | Simplest, no new tool | Free |
| **Vault-only** | Alerts as vault notes, you read when ready | Free |

**Default for solo founder**: **Vault-only** + **email** for urgent. Slack is overkill for one person. Upgrade when you hire first employee.

**Adapter stub**: `scripts/adapters/notify_stub.py`

### 9. File storage — deliverables, assets, client files

| Option | Best for | Cost |
|---|---|---|
| **Google Drive** | Already using Google Workspace | Included |
| **Dropbox** | Dropbox-first workflow | $11.99+/mo |
| **Notion** | Docs-as-files | Included |
| **Local + git** | Technical, free | Free |

**Default**: **Google Drive** (if Google Workspace) — everyone can access, clients can too.

**Adapter stub**: `scripts/adapters/storage_stub.py`

---

## Quick Start — Minimum Viable Stack

**If you're starting from zero and want the cheapest working stack to get the first automation live**:

| Need | Pick |
|---|---|
| CRM | Airtable (free) |
| Email | Gmail (Google Workspace, ~$6/mo) |
| Invoicing | Stripe Invoicing (pay-per-use) + Wave (free) |
| Scheduling | Cal.com (free tier) |
| E-sign | DocSeal self-hosted (free) or PandaDoc trial |
| PM | Notion (free tier) |
| Analytics | Google Analytics 4 (free) |
| Messaging | Vault-only + email |
| Storage | Google Drive |

**Total monthly cost**: ~$6 (Google Workspace) + Stripe txn fees. Everything else free.

**If you already have tools, use those first** — swap the adapters. Don't add new tools just because this doc lists them.

---

## What You Give Me to Flip the Switch

For each of the 9 categories, I need:

1. **Provider choice** (e.g., "Airtable for CRM, Gmail for email, Stripe for invoicing")
2. **API credentials** — go in `.env` only, never committed
3. **Workspace/account identifiers** — Airtable base ID, Google Workspace domain, Stripe account ID, etc.
4. **Any existing data** — if you have existing clients in whatever CRM you use, export and I'll migrate into Airtable (or skip if new)

Once those are in, the automation goes from "on disk" to "running."

## Related

- [[README]]
- [[00-architecture]]
- [[config]]
- [[runbook]]
- [[open-questions]]
