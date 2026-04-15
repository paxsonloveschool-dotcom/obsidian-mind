---
date: 2026-04-15
description: Playbook for keeping CLAUDE.md, README.md, CHANGELOG.md, vault-manifest.json, and reference docs in sync with the operational layer — run whenever a substantive change lands
tags: [brain, playbook]
type: brain
---

# Playbook: Sync Self-Description

## Trigger

Any time the operational layer (commands, agents, hooks, bases, playbooks, brain topic notes, reference docs) has been added to, removed from, or renamed — the *self-description* layer must be updated in the same session. Also: at every `/wrap-up` if the session touched `.claude/`, `brain/`, `bases/`, or `reference/`.

Specific triggers:
- Added or removed a slash command
- Added or removed a subagent
- Added or removed a hook, or changed what a hook runs
- Added or removed a base
- Added or removed a playbook
- Added or renamed a brain topic note
- Added a reference doc
- Imported content from an external source (like oh-my-claudecode)

## The principle

The vault's self-description (CLAUDE.md, README.md, CHANGELOG.md, vault-manifest.json) is what tells Claude and humans what the vault *is*. If this layer lags behind the operational layer, future sessions load stale guidance, broken counts, and missing references — the system degrades silently. **Stale self-description is technical debt.**

The rule: **never land an operational change without a matching self-description update in the same commit (or at worst, the same session).**

## Inputs

- Awareness of what changed in the session (from your task list, from git status, from the Build Log draft)

## Steps

### 1. Inventory what changed

From your todo list, git status, and session memory, list every operational surface that was touched:

- Added commands → `ls .claude/commands/` and diff against what CLAUDE.md says
- Added agents → `ls .claude/agents/` and diff against CLAUDE.md and README.md
- Added bases → `ls bases/*.base` and diff against CLAUDE.md and README.md
- Added playbooks → `ls brain/playbooks/` and diff against CLAUDE.md "Playbooks" section
- Added brain topic notes → check `brain/Memories.md` index and `brain/Capabilities.md`
- Added reference docs → check `reference/README.md` and `brain/Memories.md`
- Hook changes → check `.claude/settings.json` and CLAUDE.md "Hooks" table

### 2. Update CLAUDE.md

- [ ] **Command table(s)** — add new commands with one-line Purpose, grouped by phase (Daily, Capture, Performance, Maintenance, Thinking & Promotion, Verification & Curation)
- [ ] **Subagents table(s)** — add new agents with Purpose and Invoked-by. Split into vault-native (11) and omc-adapted (17) sections if applicable
- [ ] **Vault Structure table** — update counts (`X slash commands`, `Y subagents`), update Key Files for any row where new files landed, add rows for new folders
- [ ] **Playbooks table** — add new playbooks with "When to use" description
- [ ] **Hooks table** — if a hook command changed (like `stop-checklist.sh`), update the What column
- [ ] **Maintaining Indexes** — if a new brain topic note was added (not an update to existing), list it here
- [ ] **Continuous Self-Improvement section** — confirm triggers list is still accurate

### 3. Update README.md

- [ ] **Commands table** — add new commands with "What It Does" description, matching the CLAUDE.md grouping
- [ ] **Subagents table** — add new vault-native agents; update the "omc-adapted" summary if more omc agents were added
- [ ] **Bases table** — add new bases
- [ ] **Playbooks section** — add new playbooks row
- [ ] **Vault Structure ASCII diagram** — update counts and add new folders/files
- [ ] **"Added in vX.Y"** annotations — label recent additions so readers can see the growth

### 4. Update CHANGELOG.md

Add a new version entry at the top. Shape:

```markdown
## vX.Y — YYYY-MM-DD

One-line summary of what this release does.

### Added

**<Category>** (for each of: Commands, Subagents, Bases, Playbooks, Reference docs, Hook scripts, Brain content)
- `<item>` — what it does, why it's useful

### Changed

- `<file>` — what was updated and why

### Fixed

- `<issue>` — what broke and how it was fixed

### Source & adaptation notes

(If imported from external source, document what was adapted and what was skipped)

### Continuity

(Reference the Build Log entry for the matching session)
```

### 5. Update vault-manifest.json

- [ ] **Bump `version`** — use semver (increment patch for fixes, minor for additions, major for breaking schema changes)
- [ ] **Update `released`** — today's date
- [ ] **Add new infrastructure paths** — any new file that's structural (reference docs, new playbooks, new config files). Use explicit paths for specific files; use `**` glob for directories where everything is infrastructure.
- [ ] **Add new scaffold entries** — for brain topic notes that users might replace
- [ ] **Add a new `version_fingerprints` entry** — pick 3-5 files that exist in the new version but not the previous. These are what `/vault-upgrade` uses to detect the source version. Update the previous version's `missing` array to point at one of the new files.
- [ ] **`frontmatter_required`** — if any type's required fields changed, update here

### 6. Update reference docs

If any reference doc has stale counts or missing sections:

- [ ] **`reference/command-reference.md`** — add sections for new commands, update frontmatter count
- [ ] **`reference/agent-reference.md`** — add sections for new agents, update frontmatter count
- [ ] **`reference/vault-architecture.md`** — update code-tree counts, bases table, hooks table

### 7. Update brain indexes

- [ ] **`brain/Memories.md`** — if a new topic note was created, add it to the lookup table
- [ ] **`brain/Capabilities.md`** — update the agents/commands/bases/playbooks tables; this is Claude's runtime inventory
- [ ] **`brain/Skills.md`** — update the quick-scan registry

### 8. Update Home.md

- [ ] Add any new commands to the command groups
- [ ] Add any new quick-link targets (new brain topic notes, new reference docs)

### 9. Append to Build Log

Add a new session entry to `brain/Build Log.md` (at the top, newest first). Shape:

```markdown
## YYYY-MM-DD — Session N: <short title>

### Goal
<what prompted this session>

### Built
<bulleted list of concrete outputs, grouped by category>

### Key decisions this session
<the reasoning behind non-obvious choices>

### Files touched
<code block listing every file created/modified>

### Next suggested steps (for session N+1)
<ordered-by-leverage list>

### Open questions for session N+1
<things waiting on user input>
```

### 10. Verify the sync is complete

Run this mental checklist before committing:

- [ ] Did I add the actual surface in `.claude/`, `brain/`, `bases/`, or `reference/`?
- [ ] Does CLAUDE.md reflect the new surface?
- [ ] Does README.md reflect the new surface?
- [ ] Does CHANGELOG.md have an entry for it?
- [ ] Is vault-manifest.json bumped and updated?
- [ ] Do reference docs match reality?
- [ ] Do brain indexes point to new content?
- [ ] Is Home.md navigable to new content?
- [ ] Is Build Log updated?

### 11. Commit and push

Use a clear commit message that names the sync explicitly:

```
Sync self-description to v<N>: <summary>

- CLAUDE.md: <changes>
- README.md: <changes>
- CHANGELOG.md: <entry added>
- vault-manifest.json: <version bump + new fingerprints>
- reference docs: <updates>
- Build Log: <session entry appended>
```

## Outputs

- Updated `CLAUDE.md`, `README.md`, `CHANGELOG.md`, `vault-manifest.json`
- Updated `reference/` docs where stale
- Updated `brain/Memories.md`, `brain/Capabilities.md`, `brain/Skills.md`
- Updated `Home.md`
- New Build Log entry
- Clean commit on the current branch

## Linking checklist

- [ ] Every new file mentioned in CLAUDE.md / README.md is also reachable via at least one wikilink from a brain or reference note
- [ ] Build Log entry links to the commit SHA (or at least the session date)
- [ ] CHANGELOG entry references the commit(s) at the top

## Done when

- All 11 checklist items in step 10 are checked
- `git status` is clean after commit
- The Build Log entry is appended
- Future sessions reading CLAUDE.md / Build Log will see the new state, not the old one

## Anti-patterns

- **Landing the operational change in one commit and the sync in another.** The operational change is incomplete until the self-description matches. Keep them together.
- **Updating counts without updating tables.** "20 commands" in prose but the command table still shows 15 is worse than leaving the count stale.
- **Skipping the Build Log.** The Build Log is the cross-session memory layer. If it doesn't reflect this session, the next session starts with a false picture.
- **Silently adopting a new convention.** If you establish a new convention (like the `omc-` prefix for imported agents), document it in CLAUDE.md *and* a brain topic note, so it's not just tribal knowledge.
- **Relying on memory.** Run `git status` and `ls .claude/commands/ .claude/agents/` to check reality — don't trust your recollection of what you added.
- **Bumping the version without a fingerprint.** `/vault-upgrade` depends on fingerprints. A new version without one means upgrades can't detect the source version.

## Related

- [[Archive Project]]
- [[Run Vault Audit]]
- [[../Build Log]] — where session history lives
- [[../Capabilities]] — runtime inventory that must stay in sync
- [[../Patterns]] (evidence vs concept nodes; graph-first thinking)
- [[../../reference/vault-architecture]]
- [[../../reference/ohmyclaude-catalog]] — example of an import catalog format
- [[../../CLAUDE]]
