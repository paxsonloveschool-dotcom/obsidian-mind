---
description: "Review session findings and route durable knowledge to the right vault surface — brain topic notes, playbooks, work notes, or memory indexes."
---

# Remember

*Adapted from oh-my-claudecode's `remember` skill. See [[../../reference/ohmyclaude-catalog]].*

Preserve durable session knowledge in the right memory surface. Unlike `/dump` (which captures freeform input and routes it), `/remember` curates session findings — what was learned, decided, or discovered during this conversation — and places each piece where it belongs.

## Usage

```
/remember                           # interactive — Claude reviews session
/remember <specific finding>        # store a specific thing
```

## The principle

Promote durable, reusable knowledge into the right memory surface instead of leaving it buried in chat history. Session memory is ephemeral; vault memory compounds. Every valuable finding should have a vault home by the end of the session.

## Memory Surfaces in This Vault

| Surface | For | File(s) |
|---------|-----|---------|
| **`brain/Patterns.md`** | Reusable patterns, design principles | Single topic note |
| **`brain/Gotchas.md`** | Known pitfalls, edge cases, surprises | Single topic note |
| **`brain/Key Decisions.md`** | Strategic technical/system decisions | Single topic note |
| **`brain/playbooks/<name>.md`** | Repeatable procedures | One playbook per procedure |
| **`brain/Memories.md`** | Index of what's in brain/ | Updated only when new topics are added |
| **`work/active/<project>.md`** | Project-specific learnings | Appended to the relevant work note |
| **`work/incidents/<ticket>.md`** | Incident-specific learnings | Appended to the relevant incident |
| **`org/people/<name>.md`** | Person-specific context | Appended to the relevant person note |
| **`perf/Brag Doc.md`** | Wins and achievements | New row in brag table |
| **`reference/<topic>.md`** | Architecture/codebase knowledge | New or updated reference note |

## Workflow

### 1. Gather Session Findings

Scan the conversation for:
- **Decisions made** — what was chosen and why
- **Patterns discovered** — reusable insights
- **Gotchas hit** — pitfalls that future-you shouldn't repeat
- **Wins achieved** — things worth logging to brag doc
- **People context** — what was learned about anyone
- **Project context** — what changed in active work
- **Architecture insights** — how systems work that wasn't understood before

For each, note: what it is, where it came from (link if possible), confidence level.

### 2. Classify Each Finding

For each item, decide its class:

- **Durable team/project fact** → brain topic or reference note
- **Operator preference or rule** → CLAUDE.md (rare — only for enduring behavior changes)
- **Temporary working context** → thinking/ note (and promote later)
- **Duplicate of existing knowledge** → don't store; maybe update the existing entry
- **Conflict with existing knowledge** → surface the conflict to the user

### 3. Propose Destinations

Before writing anything, present a table:

```
| Finding | Class | Destination | Action |
|---------|-------|-------------|--------|
| <one-liner> | durable pattern | brain/Patterns.md | append |
| <one-liner> | new playbook | brain/playbooks/New Name.md | create |
| <one-liner> | incident gotcha | work/incidents/INC-123.md | append |
```

Ask the user to confirm. This prevents silently dumping things in the wrong place.

### 4. Apply

For each confirmed finding:
- **Append** to existing notes (don't rewrite; add to the right section)
- **Create** new notes only when a new concept emerges (use templates; follow [[../../brain/playbooks/Create Work Note]] or equivalent)
- **Update indexes** if a new topic note was created (`brain/Memories.md`)
- **Preserve source attribution** — add a brief "context" or "from" link where useful

### 5. Flag Duplicates and Conflicts

If you discover:
- The same knowledge already exists in two places → propose a merge
- A new finding contradicts an existing note → surface both, let the user decide which is current
- The existing note is clearly stale → propose an update

Do not silently overwrite existing knowledge.

### 6. Report

Summarize:
- **Stored**: what was saved, where
- **Skipped**: what was considered but not stored (with brief reason)
- **Duplicates**: any identified
- **Conflicts**: any flagged for user review
- **Indexes updated**: yes/no

## Rules

- **Don't dump everything into one store.** Routing is the job.
- **Prefer `brain/` topic notes for durable knowledge**, `thinking/` for ephemeral working context.
- **Keep entries concise and actionable.** No narrative prose; one sentence with the fact.
- **Mark uncertainty as uncertain.** If you're not sure something is true, don't store it as fact — store it with a "?" marker.
- **Preserve existing frontmatter** on any note you touch.
- **Add wikilinks.** Every stored finding should link to its source or context.

## Difference from `/dump`

| | `/dump` | `/remember` |
|---|---------|-------------|
| Input | Freeform text pasted by user | Session conversation |
| Mode | Bulk routing | Curation |
| User confirm | Implicit | Explicit per-item confirmation |
| Use when | User has a chunk to capture | Session produced scattered insights |

## Related

- [[../../brain/Memories]] — the memory index
- [[../../brain/Patterns]], [[../../brain/Gotchas]], [[../../brain/Key Decisions]] — primary topic notes
- [[../../brain/playbooks/Promote Thinking]] — related playbook for thinking → durable
- [[../../.claude/commands/dump]] — freeform bulk capture
- [[../../reference/ohmyclaude-catalog]] — provenance

Content to remember (optional):
$ARGUMENTS
