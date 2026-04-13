---
date: 2026-04-13
description: Playbook for running a vault audit — orphans, broken links, stale active notes, frontmatter validation, when to invoke vault-librarian
tags: [brain, playbook]
type: brain
---

# Playbook: Run Vault Audit

## Trigger

User runs `/vault-audit`, OR a session created many notes, OR before a substantive long session, OR weekly during `/weekly`.

## Inputs

- None — this is a scan operation

## Steps

1. **Invoke `vault-librarian` subagent** — this is the entry point for any non-trivial audit. It handles:
   - Orphan detection (notes with no inbound links)
   - Broken wikilink detection (links to non-existent files)
   - Frontmatter completeness (missing required fields per type)
   - Stale `status: active` notes (work/active/ items untouched in N days)
   - Cross-linking integrity (people/teams/competencies referenced but not linked)
2. **Review the report** — vault-librarian writes findings to a file in `thinking/` rather than dumping into chat. Read that file.
3. **Triage findings** into three buckets:
   - **Auto-fix**: missing wikilinks for known entities, missing frontmatter fields with obvious values, stale active → archive
   - **Ask-then-fix**: ambiguous orphans, decisions about what to merge or split, what to delete
   - **Defer**: things that need user input or judgment
4. **Auto-fix in batches** — don't make 50 single-edit commits. Group by type.
5. **Surface the ask-then-fix list** to the user with concrete options.
6. **For broken wikilinks** specifically:
   - If the target should exist → create it (probably a stub for a person or team)
   - If the link is a typo → fix the link
   - If the target was deleted → fix or remove the link
7. **For orphans**:
   - First ask: should this exist? If not, delete with confirmation.
   - If yes: invoke `cross-linker` to find link opportunities, OR add to the relevant index manually.
8. **For stale active notes**:
   - Use [[Archive Project]] to move them
   - OR flip `status: paused` if not actually done
9. **Update Memory** — if the audit revealed a new pattern of mistake, append to `brain/Gotchas.md`.

## Outputs

- Audit report in `thinking/YYYY-MM-DD-vault-audit.md` (vault-librarian's output)
- Many small fixes across the vault
- Possibly new stub notes for broken-link targets
- Possibly archived stale projects
- Updated Gotchas if a recurring issue surfaced

## Linking checklist

- [ ] Audit report links to all the notes it discusses
- [ ] Auto-fix changes pass validate hook
- [ ] Any ask-then-fix items have been raised with the user

## Done when

- Orphan count: 0 (or all remaining orphans have explicit "this should be orphan" justification)
- Broken wikilinks: 0
- All work/active/ notes have been touched within the last 14 days OR are flagged
- Audit report is committed (or the thinking note is deleted after promoting findings)

## Anti-patterns

- Running the full audit in main context — wastes tokens, use the agent
- Auto-fixing orphans by linking to random nodes — orphans need MEANINGFUL links, not noise
- Ignoring the report and moving on — defeats the purpose
- Letting `thinking/` accumulate audit reports — promote findings, then delete

## Related

- [[Find Missing Links]]
- [[Promote Thinking]]
- [[Archive Project]]
- [[../../.claude/agents/vault-librarian]]
- [[../../.claude/commands/vault-audit]]
