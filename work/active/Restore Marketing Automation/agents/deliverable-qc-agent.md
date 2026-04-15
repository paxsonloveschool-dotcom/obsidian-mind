---
date: 2026-04-15
description: Deliverable QC agent — reviews every deliverable before client sees it. Brand alignment, accessibility, AI-slop detection, copy review
tags: [work-note, agent, automation, restore-marketing-co, qc]
type: work-note
status: active
quarter: Q2-2026
project: restore-marketing-automation
agent_name: deliverable-qc
autonomy_level: review-required
---

# Deliverable QC Agent

## Role

Every deliverable gets checked before the client sees it. This agent is the quality safety net — it catches AI-sloppy output, brand voice drift, accessibility violations, and copy mistakes before they hit the client. It's the difference between a marketing agency that feels premium and one that feels churned-out.

## Why This Matters

One bad deliverable costs more than 10 good ones. A single sloppy copy mistake, broken link, pixelated image, or off-brand sentence can kill a renewal. The owner currently catches these manually — which means they don't always catch them (especially under time pressure). Automating QC catches 95% of issues and escalates the 5% that need a human eye.

## Input Contract

Triggered by [[agents/project-coordinator-agent]] when a deliverable is marked done. Inputs:

| Field | Source | Required |
|---|---|---|
| `deliverable_path` | Filesystem path or URL | yes |
| `deliverable_type` | copy / landing-page / design / report / email / social | yes |
| `engagement` | Engagement note path | yes |
| `brand_reference` | Client brand guidelines + Restore brand | yes |
| `client_tone_overrides` | From the engagement note | optional |

## Workflow

1. **Load context** — read:
   - `config.brand` (Restore brand)
   - Engagement's brand_guidelines section (client-specific voice/visual)
   - The deliverable spec from the engagement note
   - Any revision notes from previous QC passes

2. **Run type-specific checklist** — different deliverable types get different checks:

### Copy (blog, landing, email, ad, social)
- `market-copy` skill reviews tone vs brand
- `ai-slop-cleaner` skill catches generic AI-looking patterns
- Grammar / spelling pass
- Read-aloud test (length + pacing)
- Fact-check claims (any number, quote, stat gets flagged for citation)
- Links check — every URL resolves, UTMs are present per `brand.utm_pattern`
- Call-to-action check — is there exactly one primary CTA?

### Design (visual deliverables — ads, banners, landing pages, reports)
- `visual-verdict` skill — screenshot vs brand reference
- `ui-ux-pro-max` accessibility checklist:
  - Text contrast ≥ 4.5:1 for body, 3:1 for large
  - Alt text on all images
  - No text < 12px
  - No icon-only buttons without aria labels
  - Focus rings preserved
  - Touch targets ≥ 44×44px
- `brand` skill voice consistency on any visible text
- File format check — correct export resolution, color profile, file size

### Reports (client performance reports, audits)
- Data integrity — every number has a source cited
- Narrative quality — can a client skim the exec summary in 60 seconds?
- `market-report-pdf` rendering check — PDF loads, no broken charts, fonts embedded
- Benchmark sanity check — numbers within expected ranges for the industry

### Landing pages / web artifacts
- All of "Copy" + all of "Design"
- `webapp-testing` — Playwright smoke test (page loads, CTA fires, mobile renders)
- `page-cro` heuristics — hero clarity, social proof, one CTA, no dead ends
- Performance — page weight under 2MB, LCP under 2.5s (flag if over)

3. **Score** — produce a QC score (0-100) across four dimensions:
   - Brand fidelity (0-25)
   - Accessibility (0-25)
   - Quality (0-25)
   - Accuracy (0-25)

4. **Decide**:
   - **Score ≥ 90** → PASS. Mark deliverable QC-approved. Route to client-review step.
   - **Score 75-89** → PASS WITH NOTES. Approve but attach notes for next time. Route to owner for passive review.
   - **Score 60-74** → REVISION. Write revision notes, send back to creator (owner or contractor), loop.
   - **Score < 60** → REJECT. Full rewrite needed. Escalate to owner with diagnosis.

5. **Write QC report** — `engagements/<slug>/qc/<deliverable-id>-pass-<n>.md` with:
   - Scores + breakdown
   - Issues found with severity (blocker / warning / nit)
   - Suggested fixes (concrete, actionable)
   - Link to original deliverable
   - Link to brand references used

6. **Notify** — post result to escalation channel for REVISION/REJECT; passive log for PASS.

## Output Contract

Files produced:
- `engagements/<slug>/qc/<deliverable-id>-pass-<n>.md` — QC report
- Deliverable frontmatter updated: `qc_status`, `qc_score`, `qc_pass_count`

## Skills Invoked

- **Primary**: `visual-verdict`, `ai-slop-cleaner`, `market-copy` (review), `ui-ux-pro-max` (accessibility checklist)
- **Secondary**: `brand`, `webapp-testing` (web deliverables), `market-report-pdf` (report validation), `page-cro` (CRO heuristics)
- **Support**: `critic` agent for adversarial review pass on high-stakes deliverables

## Autonomy Level

Default: `review-required`. Owner sees every PASS (passive), REVISION (action), and REJECT (alert). Agent never lets anything reach a client without owner visibility, even for high-scoring passes.

Promotion path: after 50+ deliverables QC'd, promote to `review-optional` for PASS, keeping `review-required` for anything below 90.

## Escalation Rules

- Any REJECT (score < 60)
- Any deliverable with a brand-fidelity score < 15/25 (hard fail)
- Any accessibility blocker (contrast < 4.5:1, missing alt, etc.)
- Any fact/claim that can't be verified
- Any legal/compliance concern (claims, testimonials without permission, etc.)
- Any deliverable the agent can't classify into a checklist (unusual type)

## Success Criteria

- 95% of deliverables pass QC on first run (trains creators to hit the bar)
- Zero deliverables reach clients with blocker-severity issues
- Client-reported quality NPS ≥ 9/10
- QC turnaround time < 15 minutes per deliverable
- Owner time on QC: < 30 minutes/week on passive review (was: hours of active review)

## Related

- [[00-architecture#Deliverable QC Agent]]
- [[agents/project-coordinator-agent]]
- [[Skills#Design Skills (UI/UX Pro Max bundle)]]
