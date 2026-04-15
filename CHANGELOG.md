# Changelog

## v3.4 — 2026-04-15

A large expansion session landing the operational-memory layer, a set of curated sub-systems, an import from oh-my-claudecode, and the sync machinery that keeps this layer from drifting from reality. Commits: `eb0c945`, `773df6c`, `c7e22ca`, `4bd270f`, plus v3.4 self-description sync.

### Added

**Brain content (operational memory)**
- `brain/Workflows.md` — multi-step orchestrations chaining commands and agents (daily, capture, performance, maintenance)
- `brain/Capabilities.md` — inventory of every tool, skill, command, subagent, hook, MCP integration, base, template, brain topic, and reference doc available to Claude in this vault
- `brain/Build Log.md` — append-only session history; cross-session continuity layer. Read at every session start to know what was built and what's suggested next.
- `brain/playbooks/` — 11 repeatable procedures (`Create Work Note`, `Capture Decision`, `Capture 1-1`, `Capture Incident`, `Onboard Person`, `Promote Thinking`, `Find Missing Links`, `Archive Project`, `Run Vault Audit`, `Emergency Token Triage`, `Sync Self-Description`) plus `README.md` index.
- `brain/Patterns.md` — rewritten with graph-first thinking, node roles, atomicity, linking discipline, token discipline, context pressure levels, workflow patterns, vault-specific patterns, and anti-patterns
- `brain/Gotchas.md` — expanded with vault frontmatter rules, linking pitfalls, folder discipline, validation hook behavior, classify-message hook, Obsidian CLI, Bases, templates, subagent behavior, GitHub, Claude Code specifics, bash hygiene, MCP, performance reviews, and memory system

**Slash commands** (15 → 20)
- `/think` — scaffold a thinking note with standard structure (Question, Analysis, Conclusions, Next Steps, Feeds Into, Promote To)
- `/promote` — promote thinking note findings into durable atomic notes; atomicity-aware, polishes before promoting
- `/connect` — find missing wikilinks for a note or recent activity (wraps `cross-linker` subagent)
- `/verify` — verify a claim/change/note with concrete evidence (adapted from oh-my-claudecode)
- `/remember` — curate session findings into the right memory surface with explicit confirmation (adapted from oh-my-claudecode)

**Subagents** (9 → 28)
- `memory-curator` — scans `brain/` for stale claims, duplication, overgrowth, promotion candidates, link health, voice drift. Reports only, does not modify files directly.
- `playbook-generator` — takes an observed pattern and generates a new playbook in `brain/playbooks/` following the strict playbook shape. Updates index, capabilities, memories.
- 17 omc-adapted agents (prefixed `omc-`): `analyst`, `architect`, `code-reviewer`, `critic`, `debugger`, `designer`, `document-specialist`, `executor`, `git-master`, `planner`, `qa-tester`, `scientist`, `security-reviewer`, `test-engineer`, `tracer`, `verifier`, `writer`. Imported from [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode); see `reference/ohmyclaude-catalog.md`. `explore` and `code-simplifier` skipped (conflict with Claude Code built-ins).

**Bases** (7 → 9)
- `Playbooks.base` — three views (All, By Reference Count, Recently Updated) over `brain/playbooks/`
- `Brain Topics.base` — three views (All, By Reference Count, Stale 30+ days) over `brain/` (excluding playbooks)

**Reference docs**
- `reference/README.md` — index for reference/ with guidance on what lives there (meta, codebase, external) and how to write reference notes
- `reference/vault-architecture.md` — full meta documentation of folder roles, frontmatter contracts, dataflow between capture/commands/agents/bases/indexes, hooks pipeline, auto-loaded vs on-demand context budget
- `reference/command-reference.md` — quick-lookup table for all 20 slash commands with per-command detail (purpose, usage, subagents, when-to-use, outputs, related)
- `reference/agent-reference.md` — quick-lookup table for all 28 subagents with per-agent detail, token budget per invocation, vault-native vs omc decision heuristic
- `reference/ohmyclaude-catalog.md` — oh-my-claudecode import history; status for all 36 skills + 19 agents (adapted, cataloged-only, skipped) with rationale for each decision
- `reference/codebase-doc-template.md` — template for project-scoped reference docs

**Hook scripts**
- `.claude/scripts/stop-checklist.sh` — real vault health check at session end. Detects uncommitted changes, oversized `work/active/`, stale thinking notes (>7 days), potential orphans (>300 chars without wikilinks), recent notes missing frontmatter. Non-blocking.
- `.claude/scripts/classify-message.py` — expanded with signals for new project, project completion, memory, pattern, gotcha, new person, review cycle, wrap-up, thinking note, vault health, competency (previously covered only 7 signals)

### Changed

- `brain/North Star.md` — rewritten as rich scaffold with vision, goals, quarter focus, active projects, principles, anti-goals, how-it-gets-updated table, and guidance for filling in. Real content still TODO — placeholders remain where user input is needed.
- `brain/Memories.md` — rewritten as a proper index pointing to topic notes, playbooks, and reference docs
- `brain/Skills.md` — rewritten as substantive registry with daily/capture/performance/maintenance/thinking/verification groups, subagents table (11 + 17), playbooks reference
- `Home.md` — added Build Log, playbook index, reference folder, thinking-promotion commands, verification commands
- `CLAUDE.md` — updated command table (20 commands, grouped by phase), agents table (11 vault + 17 omc, split by tier), playbooks table, reference pointers, Continuous Self-Improvement section, Session Continuity section, stop hook description
- `.claude/settings.json` — Stop hook rewired from inline echo to `stop-checklist.sh`
- `vault-manifest.json` — bumped to v3.4, added v3.4 fingerprint, added new infrastructure paths

### Source & adaptation notes

- oh-my-claudecode agents imported with light adaptation: stripped `level:` frontmatter, rewrote `oh-my-claudecode:<name>` cross-refs to `omc-<name>`, redirected `.omc/` paths to `thinking/omc-*`, added provenance comment. See `reference/ohmyclaude-catalog.md` for decisions.
- Most omc skills NOT imported — they are tightly coupled to omc's pipeline engine (ralplan, autopilot, team, state management) and would drag in broken infrastructure. Only `verify` and `remember` were portable.

### Continuity

- Build Log has three session entries (2026-04-13 Session 1, 2026-04-15 Session 2, 2026-04-15 Session 3) plus the v3.4 self-description sync. Future sessions read the most recent entry at startup to know what state the vault is in.

## v3.3 — 2026-03-29

### Added
- `/vault-upgrade` command — import and migrate content from an existing Obsidian vault (any version of obsidian-mind or arbitrary vaults). Detects source version via fingerprints, classifies notes, transforms frontmatter, fixes wikilinks, rebuilds indexes. Supports `--dry-run`.
- `vault-migrator` subagent — classifies files (tiered heuristics: structural → frontmatter → content → fallback) and executes approved migration plans. Two modes: classification and execution.
- `vault-manifest.json` — declares template version, infrastructure vs user content boundaries, frontmatter schemas, version fingerprints, and field aliases. Enables version detection and targeted migrations.

### Changed
- CLAUDE.md: added `/vault-upgrade` command and `vault-migrator` agent, updated counts (14→15 commands, 8→9 agents)
- README: added "Upgrading" section explaining the migration workflow
- `brain/Skills.md`: added `/vault-upgrade` to Maintenance category and `vault-migrator` to subagents table

## v3.2.1 — 2026-03-29

### Fixed
- `find-python.sh`: detect Windows via `uname -s` and skip `python3` entirely (Windows Store stub is unreliable — can hang, consume stdin, or cause hook timeouts)
- `find-python.sh`: use `command -v` instead of `python3 --version` on macOS/Linux (faster, no side effects)
- `classify-message.py`: replace substring matching (`in`) with word-boundary regex (`\b`) — fixes false positives where "markdown", "wonder", "download", etc. triggered signals
- `classify-message.py`: add `sys.stdout.flush()` before exit to prevent buffered output loss on Windows
- `validate-write.py`: remove unused `import re` and dead `body` variable, add `sys.stdout.flush()` before exit
- `pre-compact.sh`: use `find-python.sh` instead of hardcoded `python3` (was bypassing the cross-platform resolver), merge two Python calls into one
- `session-start.sh`: quote `$CLAUDE_PROJECT_DIR` in exported value (paths with spaces broke the export)
- `session-start.sh`: exclude `.git/` from vault file listing (consistent with other exclusions)
- `charcount.sh`: use `${1:-}`, `${2:-}`, `${3:-}` for positional args (with `set -u`, missing args crashed before reaching the friendly usage message)

## v3.2 — 2026-03-29

### Added
- `/humanize` command — voice-calibrated editing that matches your writing style, not a generic AI word blacklist
- `/weekly` command — cross-session weekly synthesis with North Star alignment, pattern detection, and uncaptured win spotting

### Fixed
- `validate-write.py`: normalized path separators for Windows (backslashes weren't matching forward-slash skip list)
- `validate-write.py`: added `thinking/` to skip list (scratchpad notes shouldn't trigger validation warnings)

### Changed
- CLAUDE.md: reordered command table by category, added new commands, fixed stale counts (10→14 commands, 7→8 agents), added `review-fact-checker` subagent
- README: updated command table, daily workflow section, command and agent counts
- `brain/Skills.md`: added Editing & Synthesis category, new commands, usage notes, and Weekly Review workflow

## v3.1 — 2026-03-27

### Added
- Vault-first memory system — all project memories live in `brain/` (git-tracked), `MEMORY.md` becomes an index-only pointer
- `/self-review` command — guided self-assessment workflow with strategic calibration, fact-checking, and character limit validation
- `/review-peer` command — peer review writer with visibility classification, tone rules, and quality checks
- `review-fact-checker` subagent — verifies every claim in a review draft against vault sources
- `charcount.sh` utility script — counts characters in markdown sections for review tools with character limits
- `.claude/memory-template.md` — template users copy to `~/.claude/` to wire up vault-first memory

### Changed
- CLAUDE.md: "Two Memory Systems" replaced with "Memory System" (vault-first rule, setup instructions)
- CLAUDE.md: Rules section updated to enforce vault-first memory (never create files in `~/.claude/`)
- README: updated memory description, command/agent counts, added new commands and subagent
- `brain/Skills.md`: added new commands, subagent, and updated review cycle workflow

## v3 — 2026-03-26

### Added
- `/standup` command — morning kickoff that loads context and suggests priorities
- `/dump` command — freeform capture that auto-classifies and routes to the right notes
- 7 subagents: `brag-spotter`, `context-loader`, `cross-linker`, `people-profiler`, `review-prep`, `slack-archaeologist`, `vault-librarian`
- 5 lifecycle hooks: SessionStart (rich context injection), UserPromptSubmit (message classification), PostToolUse (write validation), PreCompact (transcript backup), Stop (session end checklist)
- QMD semantic search integration (optional) with custom skill in `.claude/skills/qmd/`
- Hook scripts in `.claude/scripts/`: `session-start.sh`, `classify-message.py`, `validate-write.py`, `pre-compact.sh`
- `thinking/session-logs/` for transcript backups before context compaction

### Changed
- README rewritten as product documentation with badges, scenarios, daily workflow, and performance graph sections
- CLAUDE.md updated with subagents table, hooks table, QMD skill reference, `/standup` shortcut in session workflow
- `brain/Skills.md` reorganized by category (Daily, Capture, Performance, Maintenance) with subagents and hooks tables

## v2 — 2026-03-26

### Added
- `Home.md` — vault dashboard with embedded Base views
- `bases/` — 7 centralized Obsidian Bases (Work Dashboard, Incidents, People Directory, 1-1 History, Review Evidence, Competency Map, Templates)
- `work/active/` + `work/archive/YYYY/` — explicit project lifecycle
- `work/incidents/` — structured incident tracking
- `work/1-1/` — 1:1 meeting notes
- `org/` — organizational knowledge (`org/people/`, `org/teams/`, `People & Context.md`)
- `reference/` — codebase knowledge and architecture docs
- `perf/evidence/` — PR deep scans for review prep
- `perf/brag/` — quarterly brag notes
- 8 slash commands: `/peer-scan`, `/slack-scan`, `/capture-1on1`, `/vault-audit`, `/review-brief`, `/incident-capture`, `/project-archive`, `/wrap-up`
- `.claude/update-skills.sh` for syncing obsidian-skills from upstream

### Changed
- Renamed `claude/` → `brain/` with split files (Memories index, Key Decisions, Patterns, Gotchas, Skills, North Star)
- Moved `perf/Review Template.md` → `templates/Review Template.md`
- CLAUDE.md rewritten with comprehensive session workflow, note types, linking conventions, Bases documentation, properties for querying, agent guidelines
- `perf/Brag Doc.md` updated to quarterly sub-note structure

### Removed
- `claude/Memories.md` monolith (replaced by split brain/ files)

## v1 — 2026-03-01

Initial release. Basic vault structure with:
- `claude/` — Memories, North Star, Skills (monolithic)
- `work/` — flat work notes with Index.md
- `perf/` — Brag Doc, Review Template, competencies/
- `templates/` — Work Note, Decision Record, Thinking Note, Competency Note
- `thinking/` — scratchpad
- SessionStart hook (file listing injection)
- [obsidian-skills](https://github.com/kepano/obsidian-skills) pre-installed
