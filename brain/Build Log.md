---
date: 2026-04-15
description: Append-only log of vault-expansion work — what was built, when, why. Read at session start to maintain continuity across sessions.
tags: [brain, build-log, index]
type: brain
---

# Build Log

Append-only record of how the obsidian-mind vault has been expanded. This is the "continuity layer" — when a new session starts, reading this catches Claude up on what's been built and what's in flight.

**Append format**: date, session summary, concrete outputs, next suggested steps. Most recent at the top.

---

## 2026-04-15 — Session 5: Profile sync — promote portable items to `~/.claude/`

### Goal

User asked: "how can we get this to be synced up into the roots of parameters for all of my claude code profiles"

Translation: the vault now has a substantial set of capabilities (20 commands, 28 agents, 12 playbooks, 9 bases) but they only work when Claude Code is running **inside this vault**. The user wants the portable subset (omc agents, general commands, general playbooks) available at **user level** (`~/.claude/`) so they work in every Claude Code session regardless of project.

### Classification (the first decision)

Audited each vault item for portability. The rule: does it depend on `brain/`, `work/`, `org/`, `perf/`, `bases/`, or Obsidian wikilinks? If yes → vault-specific, stays at project level. If no → portable, can be promoted.

- **Portable**: 17 omc-* agents (pure software engineering, already generic) + portable versions of `/verify` and `/think` (stripped of vault-specific sections) + `Emergency Token Triage` playbook (general context-pressure handling)
- **Vault-specific**: 11 vault-native agents, 18 other commands, all 5 hooks, all vault-specific skills, all brain topic notes, all other playbooks — all would fail or produce wrong output outside the vault

### Built (across two commits this session)

**Commit eb387ea — mechanism**

- `profile-sync-manifest.json` — declarative manifest. Lists what's portable, what's vault-specific, backup policy, provenance spec. The install script reads this as source of truth so adding new portable items later is a one-line manifest edit.
- `scripts/sync-to-profile.sh` — the installer. Reads the manifest, copies files to `~/.claude/`, backs up existing files, writes a managed section in `~/.claude/CLAUDE.md`, writes a provenance marker. Supports `--dry-run`, `--uninstall`, `--help`. Uses Python (no jq dep) to parse the manifest.
- `scripts/portable/commands/verify.md` — portable version. Strips vault-specific references, keeps the general verification workflow and the five target classes (code, document, factual claim, process, decision).
- `scripts/portable/commands/think.md` — portable version. Same scaffold but generic frontmatter (no vault-specific fields) and generic `thinking/` folder assumption.
- `scripts/portable/playbooks/Emergency Token Triage.md` — portable version. No vault references, general principles that apply in any Claude Code session.
- `scripts/portable/CLAUDE-snippets/user-level-section.md` — the managed section injected into `~/.claude/CLAUDE.md`. Bounded by `<!-- obsidian-mind-profile-sync:start ... end -->` markers. Lists installed items, operating principles, sync instructions. Re-runs replace the section in place; everything outside the markers is untouched.

**This commit — documentation**

- `brain/playbooks/Sync to Profile.md` — the full playbook. Trigger, principle, 6-step workflow (dry-run → install → verify → provenance check → Build Log → audit drift). Uninstall procedure. Anti-patterns (manual `cp -r`, editing managed section, skipping dry-run, forgetting to re-sync).
- `CLAUDE.md` — new "Profile Sync" section after "Continuous Self-Improvement" explaining the script, what's portable, when to run, when NOT to run. Playbooks table updated with Sync to Profile row. Playbooks folder count 11→12.
- `README.md` — new "Installing to all Claude Code profiles" section between Playbooks and Upgrading. Shows dry-run → install → uninstall commands with explanation of what gets installed, safety mechanism, verification steps. Playbooks table updated.
- `brain/playbooks/README.md` — Sync to Profile row added
- `brain/Memories.md` — Sync to Profile added to playbook index
- `vault-manifest.json` — bumped to 3.5.0; added `scripts/**`, `profile-sync-manifest.json`, and `brain/playbooks/Sync to Profile.md` to infrastructure; added v3.5 fingerprint keyed on `scripts/sync-to-profile.sh`, `profile-sync-manifest.json`, `brain/playbooks/Sync to Profile.md`, `scripts/portable/commands/verify.md`; v3.4's `missing` array now points at `scripts/sync-to-profile.sh`
- `CHANGELOG.md` — v3.5 entry with Added / Changed / Tested sections

### Key decisions this session

- **Manifest drives the script.** The alternative was hardcoding paths in the bash script. With a manifest, adding a new portable item is a JSON edit, not a script edit. The script is data-driven. This also makes uninstall deterministic — it removes exactly what the manifest declares.
- **Managed section with HTML-comment markers.** The alternative was replacing the entire `~/.claude/CLAUDE.md`. That would clobber user customizations. Bounded markers let the script update the section in place without touching anything else. Re-runs are safe.
- **Per-file backups, timestamped.** The alternative was a single "restore from last backup" slot. Multiple timestamped backups are safer — users can roll back to any prior state if something breaks.
- **Python over jq for manifest parsing.** The alternative was adding a jq dependency. Python 3 is already required for other hook scripts; reusing it means no new install burden.
- **Skip `sync-from-profile.sh` for now.** A bidirectional sync would let users push changes from `~/.claude/` back into the vault. That's a future possibility but adds complexity (merge conflicts, whose version wins?). Deferred until there's a real use case.
- **While-read loops for filename handling.** Caught during smoke test — the original for-loop split on whitespace and broke `Emergency Token Triage.md`. Fixed to `while IFS= read -r`. Now handles any filename.
- **Shadow semantics**: user-level `/verify` at `~/.claude/commands/verify.md` is the portable version; the vault's `.claude/commands/verify.md` is the richer vault-aware version. Claude Code loads project-level first, so inside the vault you get the richer version, outside you get the portable version. Both exist; they don't conflict.

### Smoke tests passed

With `CLAUDE_HOME=/tmp/fake-claude-home`:

1. **Dry run** — preview of every action, no writes ✓
2. **First install** — 21 files written (17 agents + 2 commands + 1 playbook + managed CLAUDE.md section), provenance marker written, backup dir created but empty ✓
3. **Second install** — all 21 files backed up to `.obsidian-mind-backup/<ts>/` before being overwritten ✓
4. **Uninstall** — installed files removed, managed section stripped from CLAUDE.md, rest of CLAUDE.md intact, provenance marker removed ✓

### Files touched

```
profile-sync-manifest.json                              created
scripts/sync-to-profile.sh                              created (chmod +x)
scripts/portable/commands/verify.md                     created
scripts/portable/commands/think.md                      created
scripts/portable/playbooks/Emergency Token Triage.md    created
scripts/portable/CLAUDE-snippets/user-level-section.md  created
brain/playbooks/Sync to Profile.md                      created
brain/playbooks/README.md                               updated (Sync to Profile row)
brain/Memories.md                                       updated (playbook index)
CLAUDE.md                                               updated (Profile Sync section, playbooks table, folder count)
README.md                                               updated (Installing section, playbooks table)
CHANGELOG.md                                            appended (v3.5 entry)
vault-manifest.json                                     updated (3.5.0 bump, scripts/**, v3.5 fingerprint)
brain/Build Log.md                                      appended (this entry)
```

### Next suggested steps (for session 6)

1. **Actually run the sync on the user's machine.** This session built and tested the mechanism but cannot reach the user's real `~/.claude/` from this sandboxed environment. User should run `bash scripts/sync-to-profile.sh --dry-run` first, then the real install.
2. **Verify in a fresh session.** After install, open a Claude Code session in a non-vault project and try `/verify` and `omc-critic`. Validates the install end-to-end.
3. **Consider `/sync` slash command** that wraps the shell script for users who prefer a slash-command UX over `bash scripts/...`.
4. **Consider `sync-from-profile.sh`** if users start customizing `~/.claude/` and want those changes back in the vault. Deferred until a real use case exists.
5. **Add a drift-detection check** to `stop-checklist.sh` or a new hook: if `~/.claude/.obsidian-mind-provenance.json` shows an older version than the vault's current version, warn the user to re-sync. This closes the loop on "continuous self-improvement."
6. **Multi-machine workflow**: document how to keep multiple machines in sync (e.g., git-pull the vault on each machine, run sync on each). Belongs in a new playbook or in the Sync to Profile playbook's "Advanced" section.
7. **Consider symlink mode** as an opt-in (`--symlink` flag). Symlinks would keep user-level in live sync with the vault instead of requiring re-runs, but they break if the vault moves. Default stays as copy-based.

### Open questions for session 6

- Does the user want a `/sync` slash command wrapper, or is `bash scripts/sync-to-profile.sh` fine?
- Should re-running the sync be wired into `/wrap-up`? It would catch drift automatically but might run too often.
- How should multi-machine sync work — via the vault's git repo pushed/pulled on each machine, or via a separate config-sync mechanism?

---

## 2026-04-15 — Session 4: Self-description sync + continuous improvement mechanism

### Goal

User asked: "how can we get it to sync up with all the upgrades that have been made" and then affirmed: "perfect as long as claude code is continuously editing itself and improving."

The operational layer (agents, commands, brain, reference) had grown substantially across sessions 1–3, but the **self-description layer** (CLAUDE.md, README.md, CHANGELOG.md, vault-manifest.json) was still reflecting the v3.3 pre-expansion state. Future sessions would load stale counts and miss new capabilities. This session closed that gap AND added the durable mechanism to keep it closed.

### Audit findings

Before fixing, I audited the self-description layer:

- `CLAUDE.md`: "15 commands, 9 subagents" (actual: 20 commands, 28 agents), no mention of playbooks folder, no Build Log, stale command/agent tables, Stop hook described as inline echo (actual: `stop-checklist.sh`)
- `README.md`: command table missing `/think`, `/promote`, `/connect`, `/verify`, `/remember`; agent table missing memory-curator, playbook-generator, and all 17 omc agents; vault structure ASCII tree showed "15 slash commands, 9 subagents"; bases table missing Playbooks, Brain Topics
- `CHANGELOG.md`: last entry was v3.3 (2026-03-29), no entry for any of the sessions 1–3 expansions
- `vault-manifest.json`: version "3.3.0", infrastructure list missing new playbooks / reference docs, scaffold missing Build Log, no v3.4 fingerprint

### Built

**Updated self-description layer**
- `CLAUDE.md` — rewrote command table into phase-grouped sub-tables (Daily, Capture, Performance, Maintenance, Thinking & Promotion, Verification & Curation); rewrote subagents table with vault-native (11) and omc-adapted (17) tiers; added Playbooks section with all 11 playbooks; added Continuous Self-Improvement section with trigger list; added Session Continuity section pointing at Build Log; updated Vault Structure table with new counts, playbooks folder, reference subfolder contents; updated Hooks table to reference `stop-checklist.sh` instead of inline echo; added `brain/Capabilities.md` and `brain/Build Log.md` to Maintaining Indexes
- `README.md` — rewrote command tables with phase grouping and v3.4 annotations; rewrote subagents section with vault-native table + omc summary list + pointer to catalog; added Playbooks section; added Brain Topics and Playbooks bases to Bases table; expanded vault structure ASCII tree with Build Log, Capabilities, Workflows, playbooks/, reference/ subfolder contents, and updated `.claude/` counts
- `CHANGELOG.md` — added comprehensive v3.4 entry covering all of sessions 1–4 with sub-sections for Brain Content, Slash Commands, Subagents, Bases, Reference Docs, Hook Scripts, Changed items, source/adaptation notes, and continuity
- `vault-manifest.json` — bumped to 3.4.0, released 2026-04-15; added explicit paths for all 11 playbook files and 6 reference docs to `infrastructure`; added `brain/Build Log.md` to `scaffold` with note that it's append-only (never replace); added v3.4 fingerprint keyed on `brain/playbooks/README.md`, `brain/Build Log.md`, `brain/Capabilities.md`, `reference/ohmyclaude-catalog.md`, `.claude/agents/omc-analyst.md`, `.claude/commands/think.md`, `.claude/commands/verify.md`; updated v3.3 fingerprint's `missing` to point at `brain/playbooks/README.md`

**Continuous improvement mechanism** (the durable part)
- `brain/playbooks/Sync Self-Description.md` — 11-step playbook for keeping CLAUDE.md, README.md, CHANGELOG.md, vault-manifest.json, reference docs, brain indexes, Home.md, and Build Log in sync with the operational layer. Triggered whenever a command/agent/hook/base/playbook/brain-topic/reference-doc is added. The specific triggers are listed in CLAUDE.md's new "Continuous Self-Improvement" section so future sessions can't miss them.
- CLAUDE.md "Continuous Self-Improvement" section — documents the rule: never land an operational change without a matching self-description update in the same session. Lists specific triggers. References the sync playbook. Wires the sync into `/wrap-up` and `/weekly`.
- CLAUDE.md "Session Continuity" section — establishes Build Log as the cross-session memory layer and makes appending to it part of session wrap-up.

**Index updates**
- `brain/playbooks/README.md` — added Sync Self-Description row
- `brain/Memories.md` — added Sync Self-Description to playbook index table; added `reference/ohmyclaude-catalog.md` and other reference docs to structural reference table
- `brain/Capabilities.md` — playbook count updated (10 → 11), added Sync Self-Description to most-used list, added full reference notes table (was missing ohmyclaude-catalog, README, codebase-doc-template)
- `Home.md` — added `/verify` and `/remember` to Daily Commands table

### Key decisions this session

- **Sync is a playbook, not a script.** A script could check file existence, but deciding what to write into CLAUDE.md / README.md / CHANGELOG.md requires judgment — is this a new capability worth a README mention? Is this a version bump or a patch? A script would be brittle. A playbook lets Claude apply judgment consistently across sessions.
- **Trigger list goes in CLAUDE.md, not just the playbook.** The playbook is read on-demand. CLAUDE.md is auto-loaded. Putting the triggers in CLAUDE.md guarantees Claude sees them before they're needed.
- **v3.4 is one version, not three.** Sessions 1–3 produced a coherent expansion. Splitting into v3.4, v3.5, v3.6 would be theater — one CHANGELOG entry with everything is clearer.
- **vault-manifest fingerprint uses 7 files, not 1.** The more distinctive markers, the less likely a false positive on version detection. All 7 must exist for `/vault-upgrade` to detect a v3.4 source vault.
- **Append to Build Log, not rewrite.** The Build Log is append-only. Past session entries are historical record; they never get edited even if decisions they described were later overridden. New decisions go in new entries.
- **The "continuous self-editing" frame from the user is now a rule, not a hope.** CLAUDE.md explicitly says: "The vault is a self-editing system." This is the frame future sessions should operate under.

### Files touched

```
CLAUDE.md                                updated (major — command/agent tables, playbooks section, continuous self-improvement, session continuity, hooks table)
README.md                                updated (major — command/agent tables, bases, playbooks, vault structure)
CHANGELOG.md                             appended (v3.4 entry)
vault-manifest.json                      updated (v3.4 bump, infrastructure, scaffold, fingerprints)
Home.md                                  updated (daily commands table)
brain/playbooks/Sync Self-Description.md created
brain/playbooks/README.md                updated (added Sync row)
brain/Memories.md                        updated (added Sync playbook, reference docs)
brain/Capabilities.md                    updated (playbook count, reference notes table)
brain/Build Log.md                       appended (this entry)
```

### Next suggested steps (for session 5)

1. **First real exercise of the sync playbook.** The next session that adds anything operational should invoke [[playbooks/Sync Self-Description]] in the same session and validate it works end-to-end.
2. **Consider a `/sync` slash command** that wraps the sync playbook — would make it a one-command operation for future sessions.
3. **Add a sync-drift check to `stop-checklist.sh`.** Specifically, detect if `.claude/commands/` has more files than CLAUDE.md mentions, same for agents, bases, and playbooks. Warn if drift detected.
4. **Fill the North Star with real content.** Still the oldest open todo.
5. **Run `memory-curator` on the now-substantive brain/** — validate the agent design and find early duplications.
6. **Add `/self-improve` meta-command** — wraps the loop: run memory-curator → run sync playbook → append Build Log. Makes continuous improvement a single command.
7. **Import catalog format** — `reference/ohmyclaude-catalog.md` established a pattern (status: adapted / cataloged / skipped, with rationale). Future imports from other sources (claude-skills, everything-claude-code, etc.) should use the same shape.

### Open questions for session 5

- Should the sync playbook be invokable via a slash command (`/sync`) or stay manual?
- Should `/wrap-up` automatically invoke the sync playbook when it detects changes in `.claude/`, `brain/`, `bases/`, or `reference/`?
- The `stop-checklist.sh` sync-drift check would be a useful feedback loop — worth implementing?
- North Star is still scaffold — is it blocking anything, or is it OK to stay unfilled until there's real content?

---

## 2026-04-15 — Session 3: oh-my-claudecode import

### Goal

Pull the rest of the oh-my-claudecode (omc) GitHub repo's skills and agents and implement them in this vault. The user explicitly asked to "pull the rest of the ohmyclaude code github repo skills and then implement them as well".

### What omc is

[Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) is a multi-agent orchestration plugin for Claude Code: 19 agents + 36 skills, built for a pipeline engine (ralplan, autopilot, team, ultrawork) with `.omc/` state folders, tmux runners, and cross-skill handoffs via state management.

### Approach

**Agents** port cleanly — they're largely self-contained instructions.
**Skills** are tightly coupled to omc's infrastructure — direct import would drag in broken dependencies.

Decision: import all 17 portable agents with light adaptation, adapt 2 skills to vault commands, catalog the rest for reference.

### Built

**Source acquisition**
- Shallow-cloned `https://github.com/Yeachan-Heo/oh-my-claudecode` to `/tmp/ohmyclaude-import/` (not committed — scratch)

**Adapted agents** (17 copied to `.claude/agents/omc-*.md`)
- `omc-analyst` — requirements gap analysis
- `omc-architect` — architecture review
- `omc-code-reviewer` — code review
- `omc-critic` — quality gate with ADVERSARIAL escalation
- `omc-debugger` — structured debugging
- `omc-designer` — UX/UI design review
- `omc-document-specialist` — documentation writing
- `omc-executor` — plan execution
- `omc-git-master` — atomic git ops
- `omc-planner` — work plan creation
- `omc-qa-tester` — end-to-end QA
- `omc-scientist` — hypothesis-driven analysis
- `omc-security-reviewer` — security audit
- `omc-test-engineer` — test design
- `omc-tracer` — causal investigation
- `omc-verifier` — verify claims actually worked
- `omc-writer` — prose/docs writing

**Skipped agents** (2)
- `explore` — conflicts with Claude Code built-in `Explore` agent type
- `code-simplifier` — duplicates the built-in `simplify` skill

**Adaptations applied to every omc agent**
- Rename `name:` field in frontmatter from `X` to `omc-X`
- Strip omc-specific `level: N` frontmatter
- Rewrite `oh-my-claudecode:X` cross-references to `omc-X`
- Redirect `oh-my-claudecode:explore` → `Agent(subagent_type="Explore")`
- Redirect `oh-my-claudecode:code-simplifier` → `Skill("simplify")`
- Redirect `.omc/` paths to `thinking/omc-*/`
- Add provenance comment: `<!-- Adapted from oh-my-claudecode ... -->`

**Adapted skills as slash commands**
- `/verify` — verify a change/claim/note with concrete evidence. Supports code/vault-note/factual-claim/process/decision targets.
- `/remember` — curate session findings into the right memory surface (brain topic note, playbook, work note, indexes). Differentiated from `/dump` by focus on session curation with explicit per-item confirmation.

**Reference catalog**
- `reference/ohmyclaude-catalog.md` — complete inventory of all 36 skills + 19 agents with import status (adapted / cataloged / skipped) and rationale for each decision. Provenance, usage notes, when-to-use-which guidance.

**Brain index updates**
- `brain/Capabilities.md` — 28 agents now (11 vault-native + 17 omc), 20 slash commands (was 18), with separate tables for vault vs omc agents
- `brain/Skills.md` — same agent/command table updates
- Both include a "when to use omc vs vault" heuristic: omc for code/plan/analysis-shaped work, vault for vault-shaped work

### Key decisions this session

- **`omc-` prefix for imported agents.** Makes provenance clear, prevents name collisions with vault-native agents, enables future imports from other sources without conflict.
- **Adapted the agents, not the skills.** Agents port cleanly; skills drag in infrastructure. Adapting 36 skills would have been a rewrite, not an import.
- **Catalog-only for skipped skills.** Instead of silently dropping them, the catalog lists every one with a reason. If a future session needs one, the catalog tells you what's there.
- **`/verify` and `/remember` were the only two skills worth porting.** Most others duplicate existing vault commands (dump, connect, promote, vault-audit) or require infrastructure that doesn't exist here.
- **omc agents don't know vault conventions.** Their prompt is about software engineering, not Obsidian. When calling them for vault tasks, the invocation must brief them on frontmatter/linking/folder rules — this is noted in the catalog.

### Files touched

```
.claude/agents/omc-analyst.md            created (adapted)
.claude/agents/omc-architect.md          created (adapted)
.claude/agents/omc-code-reviewer.md      created (adapted)
.claude/agents/omc-critic.md             created (adapted)
.claude/agents/omc-debugger.md           created (adapted)
.claude/agents/omc-designer.md           created (adapted)
.claude/agents/omc-document-specialist.md created (adapted)
.claude/agents/omc-executor.md           created (adapted)
.claude/agents/omc-git-master.md         created (adapted)
.claude/agents/omc-planner.md            created (adapted)
.claude/agents/omc-qa-tester.md          created (adapted)
.claude/agents/omc-scientist.md          created (adapted)
.claude/agents/omc-security-reviewer.md  created (adapted)
.claude/agents/omc-test-engineer.md      created (adapted)
.claude/agents/omc-tracer.md             created (adapted)
.claude/agents/omc-verifier.md           created (adapted)
.claude/agents/omc-writer.md             created (adapted)
.claude/commands/verify.md               created (adapted)
.claude/commands/remember.md             created (adapted)
reference/ohmyclaude-catalog.md          created
brain/Capabilities.md                    updated (omc tables)
brain/Skills.md                          updated (omc tables)
brain/Build Log.md                       appended (this entry)
```

### Next suggested steps (for session 4)

1. **Exercise the new commands.** Next substantive task should use `/verify` and `/remember` so friction surfaces.
2. **Invoke an omc agent on a real task.** Try `omc-critic` on the next review draft, or `omc-analyst` on the next decision. Validate the adaptations work end-to-end.
3. **Update `reference/agent-reference.md`** — it still reflects only 9 agents. Should show 28 now (vault + omc).
4. **Update `reference/command-reference.md`** — should reflect 20 commands.
5. **Consider a `/consult` meta-command** — wrapper that picks the right omc agent for a task (analyst for requirements, critic for review, scientist for hypothesis, etc.).
6. **Consider adapting omc's `deep-interview` skill** — it's the closest analog to `/think` but with interactive interview. Could strengthen thinking note creation.
7. **Run `memory-curator` now that brain/ has real content.** Validate it finds useful things.
8. **Fill North Star with real goals.** Still scaffolded — user input is the blocker.

### Open questions for session 4

- Which omc agents actually get used? Should we trim the unused ones or keep them all for completeness?
- Does the omc-prefix convention scale if we import from more sources (e.g. affaan-m/everything-claude-code, claude-skills)?
- Should omc agents be updated when upstream releases new versions? (Currently a one-time snapshot as of session 3.)

---

## 2026-04-15 — Session 2: Subagents, Bases, Hooks, /think

### Goal

Execute the six expansion ideas proposed at the end of Session 1: fill North Star scaffold, add two new subagents, build `reference/` scaffolding, create Bases for new content, wire the Stop hook to a real script, add `/think` command. Plus: create this Build Log so sessions can continue without re-discovering prior state.

### Built

**Brain**
- [[North Star]] — rewrote with rich scaffold, principles, anti-goals, how-it-gets-updated table, and guidance for filling in. TODOs remain where user input is needed.
- [[Build Log]] — this file. Append-only history of vault-expansion sessions.

**Subagents** (`.claude/agents/`)
- `memory-curator.md` — scans `brain/` for stale claims, duplication, overgrowth, promotion candidates, link health, voice drift. Reports to `thinking/memory-curation-YYYY-MM-DD.md`. Does NOT modify files directly.
- `playbook-generator.md` — takes an observed pattern and generates a new playbook in `brain/playbooks/` following the strict playbook shape. Updates index, capabilities, memories.

**Slash commands** (`.claude/commands/`)
- `/think` — scaffolds a thinking note in `thinking/YYYY-MM-DD-<slug>.md` with standard structure (Question, Context, Analysis, Conclusions, Next Steps, Feeds Into, Promote To). Makes later promotion clean.

**Reference scaffolding** (`reference/`)
- `reference/README.md` — index for meta-reference, codebase docs, external reference. Explains what lives here and how to write reference notes.
- `reference/codebase-doc-template.md` — template for project reference docs (Shape, Concepts, Dataflow, Entry Points, Operational Notes, Gotchas, Decisions, Related).

**Bases** (`bases/`)
- `Playbooks.base` — three views (All Playbooks, By Reference Count, Recently Updated) over `brain/playbooks/`.
- `Brain Topics.base` — three views (All, By Reference Count, Stale 30+ days) over `brain/` (excluding playbooks).

**Hooks** (`.claude/scripts/` and `.claude/settings.json`)
- `stop-checklist.sh` — replaces the inline echo in the Stop hook. Checks for: uncommitted changes, oversized `work/active/`, stale thinking notes (>7 days), potential orphans (>300 chars without wikilinks), recent notes missing frontmatter. Non-blocking, prints concise checklist.
- `settings.json` — Stop hook command updated to run the new script.

### Key decisions this session

- **Build Log is append-only.** It's a chronological record, not an index. The index for brain content is [[Memories]].
- **Stop hook is non-blocking.** It surfaces findings but does not prevent session end. Hard checks should go in the wrap-up command or vault-audit, not the Stop hook.
- **memory-curator reports only.** It does not modify brain files — the main conversation applies fixes after user confirmation. Same pattern as vault-librarian and cross-linker.
- **playbook-generator writes files directly.** New playbooks are low-risk (additive, easy to revert), unlike brain/ edits which touch canonical memory.
- **North Star stays scaffolded, not filled.** User input is required for real vision/goals — Claude shouldn't fabricate them. The scaffold makes filling it in frictionless when the user is ready.

### Files touched

```
brain/North Star.md                      rewritten
brain/Build Log.md                       created
brain/Memories.md                        updated (new topic refs)
brain/Capabilities.md                    updated (new agents, bases, commands)
brain/Skills.md                          updated (new commands/agents)
.claude/agents/memory-curator.md         created
.claude/agents/playbook-generator.md     created
.claude/commands/think.md                created
.claude/scripts/stop-checklist.sh        created (chmod +x)
.claude/settings.json                    Stop hook command rewired
reference/README.md                      created
reference/codebase-doc-template.md       created
bases/Playbooks.base                     created
bases/Brain Topics.base                  created
Home.md                                  updated (new quick links)
```

### Next suggested steps (for session 3)

Ordered by leverage:

1. **Fill North Star.md with real content** — the scaffold is there; the user needs to provide vision/goals/Q2 focus. Claude should prompt for this when appropriate.
2. **Use the new commands in anger** — next substantive task should exercise `/think`, `/promote`, `/connect` so friction points surface.
3. **Run `memory-curator` agent** — after a few more sessions, run it and see what it finds. This validates the agent design.
4. **Build codebase reference for an actual project** — once the user is working on real code, use `reference/codebase-doc-template.md` to document it.
5. **Harden classify-message.py signals** — track which signals fire but weren't acted on (could add a log for analysis).
6. **Embed new Bases in Home.md** — Home.md currently has quick links, but embedded views of Playbooks + Brain Topics would make those surfaces visible.
7. **Add a `/curate` slash command** — wraps the memory-curator agent, same pattern as `/connect` wraps cross-linker.
8. **Add a `/playbook` slash command** — wraps the playbook-generator agent.
9. **Consider a Build Log base** — append-only structure lends itself to a timeline view.

### Open questions for user

- What are the real North Star goals? (vision, 2026 goals, Q2 focus)
- Is there an active codebase to document in `reference/`?
- Does the user want `/curate` and `/playbook` wrappers, or is invoking the agents directly fine?

---

## 2026-04-13 — Session 1: Playbooks, References, First Commands

### Goal

Expand the vault's brain-content beyond scaffolded stubs. Infrastructure was solid (15 commands, 9 agents, 5 hooks, 7 bases) but `brain/` and `reference/` were sparse. Focus: build Claude's operational knowledge surface.

### Built

**Brain** (`brain/`)
- [[playbooks/README]] — index for brain/playbooks/
- `playbooks/Create Work Note.md`
- `playbooks/Capture Decision.md`
- `playbooks/Capture 1-1.md`
- `playbooks/Capture Incident.md`
- `playbooks/Onboard Person.md`
- `playbooks/Promote Thinking.md`
- `playbooks/Find Missing Links.md`
- `playbooks/Archive Project.md`
- `playbooks/Run Vault Audit.md`
- `playbooks/Emergency Token Triage.md`
- [[Patterns]] — expanded with graph-first thinking, node roles, atomicity, linking discipline, token discipline, context pressure levels, workflow patterns, vault-specific patterns, anti-patterns
- [[Gotchas]] — expanded with vault frontmatter, linking, folder discipline, validation hook behavior, classify-message hook, Obsidian CLI, Bases, templates, subagent behavior, GitHub, Claude Code specifics, bash hygiene, MCP, performance reviews, memory system
- [[Workflows]] — new: daily workflows, capture workflows, performance workflows, maintenance workflows, composition notes
- [[Capabilities]] — new: inventory of native tools, skills, commands, subagents, built-in agent types, hooks, MCP integrations, bases, templates, brain topic notes, reference notes, composition heuristics
- [[Memories]] — rewrote as a proper index
- [[Skills]] — rewrote with substantive registry

**Reference** (`reference/`)
- `vault-architecture.md` — meta documentation
- `command-reference.md` — quick-lookup for slash commands
- `agent-reference.md` — quick-lookup for subagents

**Slash commands** (`.claude/commands/`)
- `/promote` — promote thinking note findings to durable atomic notes
- `/connect` — find missing wikilinks (wraps cross-linker agent)

**Hook scripts** (`.claude/scripts/`)
- `classify-message.py` — expanded with signals for: new project, project completion, memory, pattern, gotcha, new person, review cycle, wrap-up, thinking note, vault health, competency

### Key decisions this session

- **Playbooks live in `brain/playbooks/` as a sub-folder.** Topic notes stay in `brain/` root; playbooks are atomic procedures that complement them.
- **Every playbook has the same shape.** Trigger → Inputs → Steps → Outputs → Linking checklist → Done when → Anti-patterns → Related. Consistency makes them scannable.
- **Reference is meta + codebase + external.** Meta docs this vault itself; codebase docs each project; external caches stable outside knowledge.
- **Claude's operational memory must be graph-linked.** Brain notes, playbooks, and references all cross-link — they're not isolated silos.

### Next suggested steps (listed at end of session 1, now captured in Session 2)

- Fill out North Star — done (as scaffold) in session 2
- Add more subagents — done in session 2 (memory-curator, playbook-generator)
- Build reference codebase docs for any project — partial (template + README done; real project docs deferred to when user has a project)
- Add Bases for the new content — done in session 2
- Wire up the Stop hook — done in session 2
- Add a `/think` command — done in session 2

---

## How to Use This Log

- **At session start**: read the most recent session entry. It tells you what state the vault is in and what was just built.
- **During a session**: when you finish a meaningful piece of work, add a new "In-flight" section or append to the current session entry.
- **At session end (during `/wrap-up`)**: promote any in-flight entry into a full session entry with outputs, decisions, and next steps.
- **Never edit past session entries.** If a past decision was wrong, note the correction in a new entry — don't rewrite history.

## Related

- [[Memories]] — index of brain content
- [[Capabilities]] — what can be composed
- [[Workflows]] — multi-step orchestrations
- [[North Star]] — what all this is in service of
- [[playbooks/README|Playbooks]] — repeatable procedures
