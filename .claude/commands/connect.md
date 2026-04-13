---
description: "Find missing wikilinks for a note or recent activity. Scans for mentions of people, projects, teams, competencies, and incidents that should be linked but aren't."
---

# Connect — Find Missing Wikilinks

Find wikilinks that *should* exist but don't, and optionally apply them. The graph is only as good as its links — this command tightens it.

## Usage

```
/connect <note-name>           # check one note
/connect recent                # check notes modified in last 48h
/connect all                   # check the full vault (slow)
/connect                       # default: recent
```

Examples:
- `/connect "Auth Refactor"`
- `/connect recent`
- `/connect all`

## The principle

A note without links is a bug. Folders are for browsing; links are for discovery. Bidirectional links (where appropriate) make the graph navigable from any direction. This command is the targeted version of `/vault-audit` — it focuses purely on link quality, not the whole vault health surface.

## Workflow

### 1. Resolve Scope

Parse `$ARGUMENTS`:
- A note name → resolve as wikilink (try `work/`, `org/`, `perf/`, `brain/`, `reference/`, `thinking/`)
- `recent` → notes modified in the last 48 hours (git diff --name-only HEAD~ + filesystem mtime)
- `all` → every `.md` in the vault (excluding `.claude/`, `templates/`, `.obsidian/`)
- empty → default to `recent`

### 2. Invoke `cross-linker` Subagent

Pass the resolved scope as the agent's input. The agent:
- Builds a lookup of all linkable targets (people, teams, projects, competencies, incidents)
- Scans target notes for mentions that aren't wrapped in `[[...]]`
- Checks for missing backlinks (A links to B but B doesn't link back to A)
- Checks for orphans in the scope
- Checks `## Related` sections on work/incident notes
- Writes findings to `thinking/cross-link-audit-YYYY-MM-DD.md`

### 3. Read the Findings

After the agent finishes, read its output file. The findings include:
- **Missing Links**: `| Note | Mention | Should Link To |`
- **Missing Backlinks**: `| Note A links to B | But B doesn't link back to A |`
- **Orphans**: notes with zero incoming links
- **Empty Related sections**: notes missing `## Related`

### 4. Triage

Group findings into three buckets:

- **Auto-apply** (high confidence):
  - Full name match for a person/team/project/competency
  - Backlinks where A's link to B is unambiguous
  - Adding `## Related` sections where missing
- **Confirm-then-apply** (medium confidence):
  - Partial name matches ("Alice" → "Alice Chen" — could be wrong)
  - Suggested orphan parents
- **Defer** (needs user input):
  - Ambiguous matches
  - Cases where the right link is unclear

### 5. Apply the Fixes

For each auto-apply fix:
- Read the target note (PostToolUse hook will validate after the edit)
- Use Edit to replace the bare mention with `[[Wikilink]]`
- For backlinks, add to the target note's `## Related` section
- For empty `## Related`, add the section with the most obvious links

For confirm-then-apply:
- Present each suggestion with context
- Apply only what the user confirms

For defer:
- Surface the list — let the user decide

### 6. Verify

After applying:
- Confirm the validate hook is silent on each touched file
- Run a quick sanity check: do the new links resolve?
- Check that no `[[...]]` was accidentally double-wrapped

### 7. Report

Summarize:
- **Notes scanned**: N
- **Auto-applied**: M missing links, K backlinks
- **Confirmed and applied**: J
- **Deferred**: L (with one-line summary of each)
- **Orphans found**: P (with suggested parents)
- **Empty Related sections fixed**: Q

If the user wanted only to scan (not apply), present everything as suggestions instead.

## Important

- **Bidirectional discipline**: when adding a link from A to B, check whether B should also link back. Concept nodes (competencies) are an exception — they receive backlinks passively.
- **Don't over-link**: linking the same note 5 times in one paragraph is noise. Once is enough.
- **Don't link non-existent targets**: if the target doesn't exist, create a stub via [[../../brain/playbooks/Onboard Person]] (for people) or flag it.
- **Respect role rules**: Evidence nodes get many outbound links; concept nodes stay clean; index nodes are curated.
- **The agent's output goes to disk** — don't try to absorb its full report into chat.

## Related

- [[../../brain/playbooks/Find Missing Links]]
- [[../../brain/Patterns]] (graph-first, evidence vs concept nodes)
- [[../../.claude/agents/cross-linker]]

Scope:
$ARGUMENTS
