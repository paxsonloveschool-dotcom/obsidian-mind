# Obsidian Mind

Personal Obsidian vault -- an external brain for work notes, decisions, performance tracking, and Claude context.

## Skills & Capabilities

This vault has [obsidian-skills](https://github.com/kepano/obsidian-skills) installed in `.claude/skills/`. Follow these skill conventions:

- **obsidian-markdown**: Obsidian-flavored markdown -- wikilinks, embeds, callouts, properties. See `references/` for callout types, embed syntax, and property specs. Always prefer `[[wikilinks]]` over markdown links.
- **obsidian-cli**: CLI commands for vault operations when Obsidian is running. See CLI section below.
- **json-canvas**: Create `.canvas` files with nodes, edges, and visual layouts. See `references/EXAMPLES.md`.
- **obsidian-bases**: Create `.base` files with views, filters, and formulas. Bases core plugin is enabled. See `references/FUNCTIONS_REFERENCE.md`.
- **defuddle**: Extract clean markdown from web pages via `defuddle parse <url> --md`.
- **qmd**: Semantic search across the vault via [QMD](https://github.com/tobi/qmd). Use PROACTIVELY before reading files -- `qmd query "..."` for hybrid search, `qmd search "..."` for keyword, `qmd vsearch "..."` for semantic. Falls back to grep/glob if QMD not installed.

### Custom Slash Commands

Defined in `.claude/commands/`. See [[Skills]] for full documentation and [[reference/command-reference]] for the full lookup with usage examples.

**Daily workflow**

| Command | Purpose |
|---------|---------|
| `/standup` | Morning kickoff -- load context, review yesterday, surface tasks, priorities |
| `/dump` | Freeform capture -- dump anything, gets routed to the right notes |
| `/wrap-up` | Full session review -- verify notes, indexes, links, suggest improvements |
| `/humanize` | Voice-calibrated editing -- make notes sound like you, not AI |
| `/weekly` | Weekly synthesis -- cross-session patterns, North Star alignment, uncaptured wins |

**Capture**

| Command | Purpose |
|---------|---------|
| `/capture-1on1` | Capture 1:1 meeting transcript into structured vault note |
| `/incident-capture` | Capture incident from Slack channels/DMs into structured vault notes |
| `/slack-scan` | Deep scan Slack channels/DMs for evidence |

**Performance**

| Command | Purpose |
|---------|---------|
| `/peer-scan` | Deep scan a peer's GitHub PRs for review prep |
| `/review-brief` | Generate review brief (manager or peer version) |
| `/self-review` | Write self-assessment for review tool -- projects, competencies, principles |
| `/review-peer` | Write peer review -- projects, principles, performance summary |

**Vault maintenance**

| Command | Purpose |
|---------|---------|
| `/vault-audit` | Audit indexes, links, orphans, stale context |
| `/vault-upgrade` | Import content from an existing vault into this obsidian-mind instance |
| `/project-archive` | Move completed project from active/ to archive/, update indexes |

**Thinking & promotion**

| Command | Purpose |
|---------|---------|
| `/think` | Scaffold a properly-structured thinking note in `thinking/` |
| `/promote` | Promote a thinking note's findings into durable atomic notes |
| `/connect` | Find missing wikilinks (wraps `cross-linker` subagent) |

**Verification & curation** (adapted from oh-my-claudecode)

| Command | Purpose |
|---------|---------|
| `/verify` | Verify a claim/change/note with concrete evidence — code, vault note, factual claim, or decision |
| `/remember` | Curate session findings into the right memory surface with explicit confirmation |

## Vault Structure

| Folder | Purpose | Key Files |
|--------|---------|-----------|
| `Home.md` | **Vault entry point** -- embedded Base views, quick links | Open this first |
| `vault-manifest.json` | **Template metadata** -- version, infrastructure vs user content boundaries, frontmatter schemas, version fingerprints | Used by `/vault-upgrade` for migration |
| `CHANGELOG.md` | **Version history** -- tracks template releases (v1--v3.4) with what changed | Reference for upgrade paths |
| `bases/` | **All Bases centralized** -- dynamic views for navigation | `Work Dashboard`, `Incidents`, `People Directory`, `1-1 History`, `Review Evidence`, `Competency Map`, `Templates`, `Playbooks`, `Brain Topics` |
| `work/` | Work notes index | `Index.md` (detailed MOC) |
| `work/active/` | **Current projects only** (1-3 files) | Move here when starting, move to archive when done |
| `work/archive/YYYY/` | Completed work organized by year | Grows over time |
| `work/incidents/` | Incident docs (main note + RCA + deep dive + drafts) | Per-incident grouping |
| `work/1-1/` | 1:1 meeting notes (accumulate weekly) | Named `<Person> YYYY-MM-DD.md` |
| `perf/` | Performance framework, brag doc | `Brag Doc.md` (index) |
| `perf/brag/` | Quarterly brag notes | One per quarter, e.g. `Q1 2025.md` |
| `perf/competencies/` | Atomic competency notes (link targets) | One note per competency |
| `perf/evidence/` | PR deep scans, data extracts for reviews | Named `<Person> PRs - <Period>.md` |
| `perf/<cycle>/` | Review cycle briefs + artifacts | Review briefs (private, manager, peer) |
| `brain/` | Claude's operational knowledge | `Memories`, `North Star`, `Build Log`, `Key Decisions`, `Patterns`, `Gotchas`, `Skills`, `Workflows`, `Capabilities` |
| `brain/playbooks/` | Repeatable procedures Claude follows | 12 playbooks; see `README.md` |
| `org/` | Organizational knowledge index | `People & Context.md` (MOC) |
| `org/people/` | Atomic person notes | One note per person |
| `org/teams/` | Team notes as graph nodes | One note per team |
| `reference/` | Meta docs + codebase knowledge + external reference | `vault-architecture.md`, `command-reference.md`, `agent-reference.md`, `ohmyclaude-catalog.md`, `codebase-doc-template.md` |
| `thinking/` | Scratchpad for drafts and reasoning | Named `YYYY-MM-DD-topic.md`; promote then delete |
| `templates/` | Obsidian templates | `Work Note.md`, `Decision Record.md`, etc. |
| `.claude/commands/` | 20 slash commands | See command tables above |
| `.claude/agents/` | 28 subagents (11 vault-native + 17 omc-adapted) | See [[reference/agent-reference]] for the full catalog |
| `.claude/scripts/` | Hook scripts | `session-start.sh`, `classify-message.py`, `validate-write.py`, `pre-compact.sh`, `stop-checklist.sh` |
| `.claude/skills/` | Obsidian + QMD skills | Loaded automatically via Skill tool |

## Obsidian CLI

When Obsidian is running, prefer CLI over raw filesystem. It provides vault-aware search, backlink discovery, and property management. Fall back to filesystem when Obsidian is not running.

```bash
obsidian read file="Note Name"                    # Read a note
obsidian create name="Name" content="..." silent   # Create without opening
obsidian append file="Name" content="..."          # Append to note
obsidian search query="text" limit=10              # Vault-aware search
obsidian backlinks file="Name"                     # Discover connections
obsidian tags sort=count counts                    # List all tags
obsidian tasks daily todo                          # Open tasks
obsidian daily:read                                # Today's daily note
obsidian property:set name="status" value="done" file="Name"
obsidian orphans                                   # Unlinked notes
```

`file=` resolves like a wikilink (by name). `path=` for exact path from root. Use `silent` to prevent files from opening. Run `obsidian help` for full reference.

## Session Workflow

### Starting a Substantial Session

The `SessionStart` hook automatically injects rich context: vault file listing, North Star goals, active work, recent git changes, open tasks, and triggers a QMD re-index. Most context is already loaded -- you don't need to manually read files.

**Shortcut**: Run `/standup` for a structured morning kickoff that reads everything and presents a summary with suggested priorities.

If doing it manually:

1. Read `Home.md` -- vault entry point with embedded dashboards
2. Read `brain/North Star.md` -- ground suggestions in current goals
3. Check `work/Index.md` -- see active projects and recent notes
4. Scan `brain/Memories.md` -- index of memory topics, then read relevant topic notes
5. `obsidian tasks daily todo` -- see pending items

### Ending a Substantial Session

**When the user says "wrap up", "let's wrap", "wrapping up", or similar -- invoke `/wrap-up` automatically.** This runs a full review of the session.

If `/wrap-up` is not invoked, at minimum do these before wrapping up:

1. **Archive completed projects**: `git mv` from `work/active/` to `work/archive/YYYY/`, update `status: completed` (or use `/project-archive`)
2. Update `work/Index.md` if new notes or decisions were created
3. Update the relevant brain topic note (`brain/Key Decisions.md`, `brain/Patterns.md`, `brain/Gotchas.md`) with key learnings
4. Update `org/People & Context.md` if org knowledge changed
5. Update `perf/Brag Doc.md` if wins or impact were achieved
6. Offer to update `brain/North Star.md` if goals shifted or new focus emerged
7. Verify all new notes link to at least one existing note (orphans are bugs)
8. If work demonstrates competencies, add competency links to the work note's `## Related`
9. Run `/vault-audit` if the session created many notes

Skip steps that don't apply. The goal is transferring durable knowledge from conversation to vault state.

### Thinking Workflow

Use `thinking/` for drafts, reasoning, and analysis before writing final notes. **Thinking notes are scratchpads, not storage.** They exist to help you reason -- once the reasoning produces durable knowledge, promote it to proper notes and delete the scratchpad.

1. Create a thinking note: `thinking/YYYY-MM-DD-descriptive-name.md`
2. Use the Thinking Note template
3. Reason through the problem, analyze options, draft content
4. Promote findings to atomic notes in the correct folder (not one monolith -- one note per distinct concept)
5. Delete the thinking note -- it served its purpose
6. If the thinking process itself is worth preserving (unusual), keep it but link to the promoted notes

### Creating Notes

1. **Always use YAML frontmatter** with at minimum `date`, `description` (~150 chars), `tags`, and type-specific fields. Work notes and incidents also need `quarter` (e.g., `Q1-2026`). Incidents need `ticket`, `severity`, `role`.
2. **Use templates** from `templates/`. Fill `{{placeholders}}` with real values.
3. **Place files correctly**:
   - **Active** work notes, decisions, peer review prep -- `work/active/`
   - **Completed** work notes -- `work/archive/YYYY/` (by year)
   - Incident docs -- `work/incidents/`
   - 1:1 meeting notes -- `work/1-1/`
   - Performance content -- `perf/` (cycle subfolder for review briefs)
   - PR evidence -- `perf/evidence/`
   - Competency definitions -- `perf/competencies/`
   - People -- `org/people/`
   - Teams -- `org/teams/`
   - Claude operational context -- `brain/`
   - Codebase knowledge -- `reference/`
   - Drafts -- `thinking/`
   - Vault root: `Home.md`, `CLAUDE.md`, `vault-manifest.json`, `CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`, `LICENSE`, `.gitignore`. No user notes at root.
4. **Name files descriptively.** Use the note title as filename.

### Note Types

| Type | Location | Naming | Key Sections |
|------|----------|--------|--------------|
| Work note | `work/active/` (then `archive/YYYY/` when done) | Descriptive title | Context, What/Why, Links, Related |
| Incident | `work/incidents/` | Ticket number or descriptive title | Context, Root Cause, Timeline, Impact, Analysis, Related |
| 1:1 note | `work/1-1/` | `<Person> YYYY-MM-DD.md` | Key Takeaways, Action Items, Quotes, What to Watch, Related |
| PR analysis | `perf/evidence/` | `<Person> PRs - <Period>.md` | PR Count, Projects, Quality, Growth, Full Table |
| Review brief | `perf/<cycle>/` | `<Cycle> Review Brief.md` | Arc, Impact, Competencies, Documentation Trail |
| Person note | `org/people/` | Full name | Role & Team, Relationship, Key Moments, Notes |
| Team note | `org/teams/` | Team name | Members, Scope, Interactions |
| Competency | `perf/competencies/` | Competency name | Definition, level criteria, Evidence (via backlinks) |
| Brain note | `brain/` | Topic name | Topic-specific content |

### Linking -- This Is Critical

**Graph-first, not folder-first.** Folders help browse in the sidebar. Links help discover through connections. Both matter, but links are the primary organizational tool.

**A note without links is a bug.** When creating a note, the FIRST thing to do after writing content is add wikilinks. Every new note must link to at least one existing note.

**Atomicity rule**: Before writing or appending to any note, ask: "Does this cover multiple distinct concepts that could be separate nodes?" If a note has or would have 3+ independent sections that don't need each other to make sense, split into atomic notes that link to each other.

Note types have graph roles:
- **Evidence nodes** (work notes, 1:1s, PR analyses): add outbound links to concepts they demonstrate
- **Concept nodes** (competencies, patterns): stay definitional -- evidence arrives via backlinks
- **Index nodes** (Index, Brag Doc, Memories, People & Context): actively curate links -- they're navigational
- **Person nodes** (org/people/): link to projects, teams, evidence. Receive backlinks from work notes.

Link syntax:
- `[[Note Title]]` -- standard wikilink
- `[[Note Title|display text]]` -- aliased link
- `[[Note Title#Heading]]` -- deep link to section
- `![[Note Title]]` -- embed content inline
- `[[Note Title#^block-id]]` -- link to specific block

#### When to Link

- **Work note <-> Decision**: bidirectional links
- **Work note -> Competency**: in `## Related`, link to competencies demonstrated
- **Work note -> Team**: in `## Related`, link to team(s) involved
- **Work note -> Person**: link people involved (especially in 1:1 notes)
- **Person -> PR analysis**: link to their evidence file if one exists
- **Brag Doc -> Work note**: every entry links to evidence
- **Memories -> Source**: every memory links to where it was learned
- **Index -> Everything**: `work/Index.md` links to all work notes
- **North Star -> Projects**: active focus areas link to project work notes

### Maintaining Indexes

Update these when creating or archiving notes:

- **`work/Index.md`** -- add to Active Projects or Recent Notes, move completed to Archive
- **`brain/Memories.md`** -- index of memory topics. Add new memories to the relevant topic note, not here.
- **`brain/Skills.md`** -- register vault-specific workflows and slash commands
- **`brain/Capabilities.md`** -- update when new agents, commands, bases, or playbooks are added
- **`brain/Build Log.md`** -- append-only session continuity log. Every substantive session gets an entry with goal, builds, decisions, files touched, and next suggested steps.
- **`org/People & Context.md`** -- update when people, teams, or org structure changes
- **`perf/Brag Doc.md`** -- log wins with links to evidence, add new quarters as needed

### Session Continuity

[[brain/Build Log]] is the cross-session memory layer. At session start, reading the most recent entry tells you what state the vault is in and what was suggested for follow-up. At session end, append an entry documenting what you built so the next session can pick up cleanly. This is what makes the vault self-improving over time — Claude's own record of how Claude has been editing the vault.

### Decision Records

1. Create in `work/` using the Decision Record template
2. Link from the work note(s) that led to the decision
3. Add to the Decisions Log table in `work/Index.md`
4. If significant, note in `brain/Key Decisions.md`

### Wins & Achievements

When significant work is completed, add to `perf/Brag Doc.md` with links to the work note(s). Categorize under Impact, Technical Growth, Collaboration, or Feedback.

## North Star

`brain/North Star.md` is a living document of goals and focus areas.

- **Read it** at the start of substantial sessions
- **Reference it** when suggesting priorities or trade-offs
- **Update it** when the user signals a shift in goals
- Both the user and Claude write to it

## Tags Convention

Use tags in frontmatter (not inline):

- **Type**: `work-note`, `decision`, `perf`, `thinking`, `north-star`, `competency`, `person`, `team`, `brain`
- **Index**: `index`, `moc`
- **Status** (frontmatter field): `active`, `completed`, `archived`, `proposed`, `accepted`, `deprecated`
- **Team** (frontmatter field on people + work notes): your team names, e.g. `Backend`, `Platform`, `Mobile`
- **Cycle** (frontmatter field on review-related notes): `h2-2024`, `h1-2025`, etc.
- **Person** (frontmatter field on evidence notes): full name of the person
- **Project**: as needed, e.g. `project/auth-refactor`

## Properties for Querying

Beyond tags, use these frontmatter properties to enable search and Bases views:

- `cycle: h2-2024` -- find all review material for a cycle
- `person: "Jane Smith"` -- find all evidence related to a person
- `team: Backend` -- find all notes related to a team
- `status: active` -- find active projects
- `quarter: Q1-2026` -- find all work for a quarter (used by Work Dashboard Base)
- `ticket: TICKET-123` -- find incident by ticket number
- `severity: high` -- incident severity
- `role: incident-lead` -- your role in an incident

## Memory System

**All project memories live in the vault.** The `~/.claude/` MEMORY.md is an auto-loaded index that points to vault locations. The `~/.claude/` MEMORY.md is the only file that should exist there -- it is an auto-loaded index. Never create additional memory files in that directory.

| System | Location | Purpose |
|--------|----------|---------|
| **MEMORY.md** | `~/.claude/projects/.../memory/MEMORY.md` | Auto-loaded index only. Pointers to vault notes. |
| **Vault memories** | `brain/` topic notes | Git-tracked, Obsidian-browsable, linked. All durable knowledge lives here. |

When asked to "remember" something:
1. Find or create the appropriate `brain/` topic note (Gotchas, Patterns, Key Decisions, etc.)
2. Add the knowledge there with a wikilink to context
3. Update `brain/Memories.md` index if a new topic note was created
4. Do NOT create additional files in `~/.claude/projects/.../memory/` beyond MEMORY.md -- they are not version-controlled

## Agent Guidelines

### Graph-First Thinking

- **Folders group by purpose, links group by meaning.** A note lives in ONE folder (its home) but links to MANY notes (its context).
- When creating a note, add wikilinks FIRST. A note without links is a bug.
- Prefer bidirectional links: if A links to B, B should link back to A (unless B is a concept node that receives backlinks passively).
- Before creating a new subfolder, ask: "Can I solve this with a tag, a property, or a link instead?" Folders are for browsing convenience, not for categorization.
- After every substantial session, verify new notes have at least one inbound link.

### Where to Put Things

- **Writing about a person?** -- `org/people/`
- **Writing about a team?** -- `org/teams/`
- **Writing about how the codebase works?** -- `brain/` (Patterns, Gotchas, Key Decisions)
- **Writing about what Claude should remember?** -- `brain/Memories.md` topic notes
- **Capturing a 1:1 meeting?** -- `work/1-1/`
- **Deep scanning PRs for review?** -- `perf/evidence/`
- **Creating review briefs?** -- `perf/<cycle>/`
- **Tracking active project work?** -- `work/active/`
- **Capturing an incident?** -- `work/incidents/` (use `/incident-capture`)
- **Dumping unstructured info?** -- use `/dump` to auto-classify and route everything

### Don't Mix Contexts

When capturing data from Slack, DMs, or meetings:
- **Project evidence** (PRs, technical decisions, delivery) -- goes to the relevant `work/` note
- **Review prep** (peer selection, manager strategy, brag framing) -- goes to review-related notes in `perf/` or `work/`
- **People dynamics** (feedback, relationships, career) -- goes to `org/people/` notes
- **Personal conversations** -- only capture if review-relevant; otherwise skip

## Subagents

Specialized agents in `.claude/agents/` for heavy operations. They run in isolated context windows with their own tokens — use them to protect main context. Full reference at [[reference/agent-reference]]; omc adaptation history at [[reference/ohmyclaude-catalog]].

**Vault-native agents (11)** — built for this vault, know the conventions.

| Agent | Purpose | Invoked by |
|-------|---------|------------|
| `brag-spotter` | Finds uncaptured wins and competency gaps | `/wrap-up`, `/weekly` |
| `context-loader` | Loads all vault context about a person, project, or concept | Direct |
| `cross-linker` | Finds missing wikilinks, orphans, broken backlinks | `/vault-audit`, `/connect` |
| `memory-curator` | Curates `brain/` — stale claims, duplication, overgrowth, promotion candidates | Direct, or `/remember` at scale |
| `people-profiler` | Bulk creates/updates person notes from Slack profiles | `/incident-capture` |
| `playbook-generator` | Turns an observed pattern into a new playbook in `brain/playbooks/` | Direct |
| `review-prep` | Aggregates all performance evidence for a review period | `/review-brief` |
| `slack-archaeologist` | Full Slack reconstruction -- every message, thread, profile | `/incident-capture` |
| `vault-librarian` | Deep vault maintenance -- orphans, broken links, stale notes | `/vault-audit` |
| `review-fact-checker` | Verifies every claim in a review draft against vault sources | `/self-review`, `/review-peer`, `/verify` |
| `vault-migrator` | Classifies, transforms, and migrates content from a source vault | `/vault-upgrade` |

**omc-adapted agents (17)** — imported from [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode). Use for **code/plan/analysis work** — they don't know vault conventions, so brief them on frontmatter/linking/folders if using for vault tasks. All prefixed `omc-`.

| Agent | Best for |
|-------|----------|
| `omc-analyst` | Pre-planning requirements gap analysis (Opus) |
| `omc-architect` | Architecture review, steelman counters, trade-offs (Opus) |
| `omc-code-reviewer` | Thorough multi-perspective code review |
| `omc-critic` | Final quality gate with ADVERSARIAL escalation (Opus) |
| `omc-debugger` | Structured debugging — reproduce, isolate, verify |
| `omc-designer` | UX/UI design review |
| `omc-document-specialist` | Documentation writing and external lookup |
| `omc-executor` | Implement a plan step-by-step with verification |
| `omc-git-master` | Atomic git operations — commits, merges, tags, PRs |
| `omc-planner` | Work plan creation with testable acceptance criteria |
| `omc-qa-tester` | End-to-end QA testing |
| `omc-scientist` | Hypothesis-driven analysis |
| `omc-security-reviewer` | Security audit with threat modeling |
| `omc-test-engineer` | Test design — unit/integration/e2e coverage |
| `omc-tracer` | Causal investigation with competing hypotheses |
| `omc-verifier` | Verify a claim actually worked (invoked by `/verify`) |
| `omc-writer` | Prose/docs writing assistance |

## Playbooks

Repeatable procedures in `brain/playbooks/`. When a task matches a playbook shape, follow the playbook instead of reasoning from first principles. Full index at [[brain/playbooks/README]].

| Playbook | When to use |
|----------|-------------|
| [[brain/playbooks/Create Work Note]] | Starting a new project or capturing work |
| [[brain/playbooks/Capture Decision]] | A decision was just made that needs durable recording |
| [[brain/playbooks/Capture 1-1]] | A 1:1 meeting transcript needs structuring |
| [[brain/playbooks/Capture Incident]] | An outage/alert/postmortem needs a vault home |
| [[brain/playbooks/Onboard Person]] | A new person needs an `org/people/` note |
| [[brain/playbooks/Promote Thinking]] | A thinking note has produced durable knowledge |
| [[brain/playbooks/Find Missing Links]] | A note feels orphaned or under-connected |
| [[brain/playbooks/Archive Project]] | A project is complete |
| [[brain/playbooks/Run Vault Audit]] | Vault feels messy, or before a substantive session |
| [[brain/playbooks/Emergency Token Triage]] | Context is filling up faster than expected |
| [[brain/playbooks/Sync Self-Description]] | CLAUDE.md / README / CHANGELOG lag behind reality |
| [[brain/playbooks/Sync to Profile]] | Promote portable items (omc agents, /verify, /think) to user-level `~/.claude/` |

## Continuous Self-Improvement

The vault is a **self-editing system**. When you add a new command, agent, hook, base, or playbook, the CLAUDE.md / README.md / CHANGELOG.md / vault-manifest.json layer should be updated in the same session. If they aren't, the next session loads stale counts and stale guidance — and the system degrades silently.

**Triggers for self-improvement work:**
- You added a new command → update CLAUDE.md command table + README.md + CHANGELOG.md
- You added a new agent → update CLAUDE.md agent table + [[reference/agent-reference]] + README.md
- You added a new hook → update CLAUDE.md hooks table + README.md
- You added a new base or playbook → update CLAUDE.md structure table + [[reference/vault-architecture]]
- You imported from another source → add to [[reference/ohmyclaude-catalog]] or a similar import catalog
- You finished a session with substantive changes → append to [[brain/Build Log]]
- `/wrap-up` and `/weekly` should both surface sync drift when detected

**The sync playbook** ([[brain/playbooks/Sync Self-Description]]) describes the full procedure. It exists specifically because this layer is the one most likely to fall behind.

**At session end**, if the session added anything to `.claude/`, `brain/`, `bases/`, or `reference/`, the wrap-up routine must run the sync playbook — not just update the Build Log.

## Profile Sync (vault → user-level `~/.claude/`)

Not everything in this vault is vault-specific. The 17 `omc-*` subagents, the portable versions of `/verify` and `/think`, and the `Emergency Token Triage` playbook all work in any Claude Code session regardless of project. These should live at **user level** (`~/.claude/`) so they're available everywhere — not just when you're inside this vault.

**The script**: `scripts/sync-to-profile.sh` promotes the portable subset to `~/.claude/`. It reads `profile-sync-manifest.json` as the source of truth for what's portable vs vault-specific.

**Usage**:

```bash
bash scripts/sync-to-profile.sh --dry-run    # preview every action
bash scripts/sync-to-profile.sh              # install / update
bash scripts/sync-to-profile.sh --uninstall  # remove everything the script installed
```

**What it installs** (per run):

| Target | Count | Source |
|--------|-------|--------|
| `~/.claude/agents/omc-*.md` | 17 | `.claude/agents/omc-*.md` (direct copy — already generic) |
| `~/.claude/commands/verify.md`, `think.md` | 2 | `scripts/portable/commands/` (generic versions) |
| `~/.claude/playbooks/Emergency Token Triage.md` | 1 | `scripts/portable/playbooks/` |
| `~/.claude/CLAUDE.md` managed section | 1 | `scripts/portable/CLAUDE-snippets/user-level-section.md` |
| `~/.claude/.obsidian-mind-provenance.json` | 1 | Generated at install time |

**Safety**:
- Every existing file at a target path is backed up to `~/.claude/.obsidian-mind-backup/<timestamp>/` before being overwritten.
- The managed CLAUDE.md section is bounded by `<!-- obsidian-mind-profile-sync:start ... end -->` markers; content outside the markers is never touched.
- `--uninstall` removes installed items and strips the managed section but leaves user-authored content intact.
- `--dry-run` shows every action before any write happens.

**Portable vs vault-specific (the classification rule)**:

- **Portable** — pure software engineering. No dependency on `brain/`, `work/`, `org/`, `perf/`, `bases/`, or Obsidian wikilinks.
- **Vault-specific** — depends on the vault structure or conventions. Stays at project level.

See [[brain/playbooks/Sync to Profile]] for the full playbook and [[profile-sync-manifest]] for the declarative manifest.

**When to run the sync**:

- After upgrading this vault (new omc agents, new portable commands)
- On a new machine where you want `/verify` and `omc-*` available everywhere
- When you suspect drift between vault and `~/.claude/`
- After the Sync Self-Description playbook reports new portable items

**When NOT to run it**:

- If you've heavily customized `~/.claude/CLAUDE.md` — the managed section is safe, but always dry-run first
- If you want vault-specific hooks or agents at user level — they won't work there
- If `~/.claude/` is managed by another tool that you don't want to conflict with

## Hooks

Five lifecycle hooks in `.claude/settings.json`:

| Hook | When | What |
|------|------|------|
| SessionStart | On startup/resume | QMD re-index, inject North Star, active work, recent changes, tasks, file listing |
| UserPromptSubmit | Every message | Classifies content (decision, incident, win, 1:1, architecture, person, pattern, gotcha, win, wrap-up, etc.) and injects routing hints |
| PostToolUse | After writing `.md` | Validates frontmatter, checks for wikilinks, verifies folder placement |
| PreCompact | Before context compaction | Backs up session transcript to `thinking/session-logs/` |
| Stop | End of every session | `stop-checklist.sh` runs a real vault health check (uncommitted changes, stale thinking, oversized `work/active/`, potential orphans, recent notes missing frontmatter). For thorough review, use `/wrap-up`. |

## Rules

- Never modify `.obsidian/` config files unless explicitly asked.
- Preserve existing frontmatter when editing notes.
- Git sync is handled by the user's preferred method (obsidian-git, manual commits, etc.) -- don't configure git hooks or auto-commit.
- When asked to "remember" something, write to the relevant `brain/` topic note with a link to context. Never create memory files in `~/.claude/` -- they are not git-tracked.
- Prefer Obsidian CLI over filesystem when Obsidian is running.
- **Always invoke Obsidian skills via the Skill tool** before doing vault work. Load `obsidian-markdown` when creating/editing `.md` files. Load `obsidian-cli` when running vault commands. Load `obsidian-bases` or `json-canvas` when working with those file types.
- Always check for and suggest connections between notes.
- Every note must have a `description` field (~150 chars). Claude fills this automatically.
- **Zero data loss**: when reorganizing, always use `git mv`. Never delete without explicit user confirmation.
