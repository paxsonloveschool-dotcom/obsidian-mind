---
date: 2026-04-05
description: Reusable patterns discovered during work
tags: [brain, patterns]
type: brain
---

# Patterns

## Token Saving
- Progressive disclosure: metadata always -> body on trigger -> resources on demand
- Context window is a public good — every loaded file costs all subsequent operations
- Challenge each paragraph: "Does this justify its token cost?"
- Batch independent tool calls into single parallel message
- Use agents for parallel work to save main context
- `disable-model-invocation: true` for deterministic operations (git, file moves)

## Context Management
- 50% normal, 70% optimize, 80% /compact, 90% mandatory split
- Offload to files: agents write reports to disk, next agent reads file not chat
- Grep before Read — only load what you need

## Workflow
- Two-part execution: Research & Plan -> Execute & Verify
- Parallel quality gates: validator + tester simultaneously (40% faster)
- Version-first: determine version before work starts

## Integration Architecture
- **Adapter pattern with mock mode by default** — every external system wrapper should degrade gracefully to a mock response when credentials are absent. Lets agents run in dry-run mode without any credentials, and makes smoke tests trivial. Pattern: check `is_live` at adapter init, branch to `_mock_response()` otherwise. Used in [[Restore Marketing Automation/scripts/adapters/ghl|GHL adapter]] — every method returns plausible fake data in mock mode so the full pipeline can be tested end-to-end without hitting an API.
- **GHL-first for marketing agencies** — if a marketing agency uses GoHighLevel, it almost certainly covers 8 of 9 integration categories (CRM, email, SMS, scheduling, invoicing, workflows, reputation, websites). Do NOT build separate adapters for each — consolidate into one GHL adapter and only add secondary adapters for specific gaps (deep analytics, large-file storage, non-GHL messaging). See [[Restore Marketing Automation/integrations]] for the pattern.
- **Offload logic to native platform automation where possible** — GHL has its own workflow engine. When the automation needs "when lead is qualified, send a booking link," prefer triggering a native GHL workflow via `add_contact_to_workflow()` over writing the email/SMS/timing logic in Python. The orchestration layer handles the *decision* (should this lead be qualified?); the platform handles the *execution* (send the email, track opens, retry).
- **Router + providers + mock fallback for multi-model surfaces** — when multiple vendors offer the same capability with different strengths (video: Seedance cinematic vs LTX portrait/open-source), wrap them all in one adapter with a provider router that picks per use case. Each provider is a thin class; the router holds the routing table. Mock mode short-circuits every provider. Same pattern used in [[Restore Marketing Automation/scripts/adapters/video|video adapter]]. Benefits: callers don't need to know which provider handles what, routing rules live in one place, swapping providers = config edit not code change.
