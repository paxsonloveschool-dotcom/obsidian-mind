---
date: 2026-04-13
description: Multi-step workflows that chain commands, agents, and playbooks — the "operator's manual" for repeatable vault sequences
tags: [brain, workflows]
type: brain
---

# Workflows

Multi-step sequences that combine commands, agents, and playbooks. Where [[playbooks/README|Playbooks]] document a single procedure, workflows describe the full arc from trigger to durable artifact.

## Daily Workflows

### Morning Kickoff

**Goal**: Load context, see what's open, pick today's priorities.

1. Run `/standup` — automated context load, yesterday review, task surface
2. Read the standup output and identify 1-3 priorities
3. Cross-check against `[[North Star]]` — are priorities aligned?
4. If a priority needs new tracking → [[playbooks/Create Work Note]]
5. Confirm priorities with the user before starting work

### End of Day Wrap

**Goal**: Transfer in-flight knowledge from conversation to vault state.

1. Run `/wrap-up` — full review prompt
2. For each new note created today: verify it links somewhere ([[playbooks/Find Missing Links]])
3. For each completed project: [[playbooks/Archive Project]]
4. Update brag doc with wins from the session
5. Update the relevant `brain/` topic note with any new lessons
6. If many notes were created, run `/vault-audit`
7. Commit and push

### Mid-Session Reset

**Goal**: Recover from context pressure without losing progress.

1. Recognize pressure level via [[playbooks/Emergency Token Triage]]
2. Promote any in-flight thinking to a thinking note
3. Update todos so a fresh session can pick up
4. Run `/compact` if work has natural seams, or wrap and split sessions

## Capture Workflows

### From Slack to Incident Note

**Goal**: Reconstruct an outage from Slack and produce review-ready artifacts.

1. Run `/incident-capture` with the Slack channel/DM URLs
2. The command invokes `slack-archaeologist` agent — full reconstruction written to a thinking note
3. The command then drives [[playbooks/Capture Incident]] using that reconstruction
4. Verify the three-note structure (main + RCA + deep dive) is in place
5. Ensure all participants have person notes ([[playbooks/Onboard Person]])
6. Add Brag Doc entry if your role was substantial
7. Link competencies if applicable

### From 1:1 Transcript to Vault Note

**Goal**: Structure a 1:1 with backlinks and action items.

1. Run `/capture-1on1` with the transcript or summary
2. Resolve the person (create stub if needed via [[playbooks/Onboard Person]])
3. Drive [[playbooks/Capture 1-1]]
4. Update the person's "Recent 1:1s" section
5. If project topics surfaced, update the relevant work notes
6. If career talk surfaced, log to perf/ folder (don't mix into the 1:1 note)

### From Freeform Dump to Routed Notes

**Goal**: Capture unstructured info and route it to the right destinations.

1. Run `/dump` with whatever the user pasted
2. The command classifies content (decision, incident, win, 1:1, architecture, person)
3. For each detected category, drive the matching playbook
4. Surface what was captured and where, so the user can verify

## Performance Workflows

### Build a Review Brief

**Goal**: Aggregate all evidence for a review cycle into a brief.

1. Run `/review-brief` with the cycle (e.g., `h2-2026`) and target person
2. The command invokes `review-prep` agent — pulls brag doc, decisions led, incidents handled, competency evidence, 1:1 feedback, PR scans
3. Agent writes the brief to `perf/<cycle>/<Cycle> Review Brief.md`
4. Read the brief and edit for voice
5. Run `review-fact-checker` agent against the draft — every claim must trace to a vault source
6. Address any unverified or flagged claims
7. Promote thinking notes if the process surfaced anything durable

### Write Self-Review

**Goal**: Produce a self-assessment grounded in vault evidence.

1. Run `/self-review` with the cycle
2. The command pulls from `perf/<cycle>/<Cycle> Review Brief.md` if it exists
3. Drafts projects, competencies, principles sections
4. Run `review-fact-checker` on the draft
5. Run `/humanize` to voice-calibrate
6. Save to the review tool / external system per the user's preferred method

### Peer Review for Someone Else

**Goal**: Write a peer review backed by evidence.

1. Run `/peer-scan` with the peer's name and period — invokes deep PR scan, output to `perf/evidence/`
2. Run `/review-peer` with the peer
3. Drafts projects, principles, performance summary using the evidence file
4. Fact-check via `review-fact-checker`
5. Humanize via `/humanize`
6. Verify nothing private leaks (the peer should be okay with everything written)

## Maintenance Workflows

### Weekly Review

**Goal**: Cross-session synthesis — patterns, alignment, uncaptured wins.

1. Run `/weekly` — invokes `brag-spotter` for uncaptured wins, scans recent notes for patterns
2. Read the synthesis
3. Update `[[North Star]]` if focus shifted
4. Add wins to brag doc
5. Add patterns/gotchas to the brain topic notes
6. Archive any completed projects
7. Run `/vault-audit` if the week had heavy capture

### Vault Audit

**Goal**: Find and fix orphans, broken links, stale notes, missing frontmatter.

1. Run `/vault-audit` — invokes `vault-librarian` agent, report written to `thinking/`
2. Read the report
3. Drive [[playbooks/Run Vault Audit]] for triage
4. Auto-fix in batches
5. Surface ask-then-fix items
6. Update Gotchas if a recurring issue surfaced
7. Delete the audit thinking note when done

### Vault Upgrade (Importing from Another Vault)

**Goal**: Pull content from a previous vault into this instance without losing data.

1. Run `/vault-upgrade` with the source vault path
2. The command invokes `vault-migrator` agent in classification mode — produces a migration plan
3. Review the plan with the user
4. Run `/vault-upgrade` again with `--execute` (or however the command implements it)
5. Verify migrated notes pass validation
6. Run `/vault-audit` after migration to catch orphans

## Composition Notes

- **Workflows can be partial.** Not every workflow needs every step; skip what doesn't apply.
- **Workflows nest.** A wrap-up workflow can include an audit workflow.
- **Workflows update over time.** When you discover a better sequence, add it here.
- **Don't run workflows from memory.** Read the relevant section before starting if it's been a while.

## Related

- [[playbooks/README|Playbooks]] — single-procedure references
- [[Capabilities]] — what's available to compose
- [[Patterns]] — design principles behind the workflows
- [[Skills]] — registry of slash commands and agents
