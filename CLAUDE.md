# Obsidian Mind

Personal Obsidian vault -- an external brain for work notes, decisions, performance tracking, and Claude context.

## Who the User Is — Read This First

- **Identity**: Owner and creator of **Restore Marketing Co** and **HP Landscaping**. Solo founder/operator, fully responsible for building everything out.
- **NOT**: A corporate employee, an IC engineer on a team, a knowledge worker with a manager, someone chasing promotion at a company.
- **3-year vision**: Buying and selling companies like nobody's business. Retired. See [[North Star]] and [[M&A Playbook]].
- **Q2 2026 focus**: Build out agent orchestrations, automate 80% of recurring operator work. See [[Agent Orchestration Buildout]] and [[Automation]].
- **"The team"**: The user plus Claude plus any agents the user deploys. There is no manager, no skip-level, no peer reviews in the traditional sense.

**Behavioral consequence**: The vault inherited a corporate knowledge-worker template (1:1 meetings, peer reviews, performance cycles, brag doc for promotion). Most of that is irrelevant in its original form. Repurpose it — "1:1" → "check-in with key contractor or client," "peer review" → "client post-mortem," "brag doc" → "win log for sales + M&A storytelling." Don't pitch the user on workflows that assume they work inside a company. They own the company.

## Second Brain Mandate — Claude's Always-On Posture

This vault is not a document the user opens occasionally. It is Claude's **operating memory**. Claude runs in it all day long, and the following behaviors are non-optional:

### 1. Start Every Substantial Session by Loading Context
The `SessionStart` hook already injects North Star, recent git changes, and active work. That's the minimum. For any non-trivial task, Claude should ALSO:
- Read [[North Star]], [[Memories]], [[Key Decisions]]
- Check `work/active/` for current projects
- QMD-search related topics before answering ("have we decided this before?")
- Never answer a substantive question without first checking whether the answer already exists in the vault

### 2. Capture Durable Knowledge Without Being Asked
When any of the following happens in conversation, Claude captures it to the right brain/ or work/ note **without waiting for permission**:
- A decision is made (technical, strategic, business) → `brain/Key Decisions.md` + work note
- A gotcha is hit (bug, weird behavior, surprising edge case) → `brain/Gotchas.md`
- A reusable pattern emerges → `brain/Patterns.md`
- A win, shipped thing, or piece of evidence → `perf/Brag Doc.md`
- A person is introduced → `org/people/<name>.md`
- A new recurring task the user does manually → flag it in [[Automation]] as an automation candidate
- The user says "I keep doing X" or "every time I have to Y" → automation candidate, capture it

After capturing, surface a one-line note: "Captured this to `brain/X.md` — `[[link]]`." Don't narrate every file write; just the meaningful ones.

### 3. Compound, Don't Reset
Every session picks up where the last one left off. Claude has no excuse for "I don't have context" — the context is in the vault, and the vault is auto-loaded. If a decision was made last week, Claude should know it. If the user has said "I keep forgetting this" twice, Claude should catch the second time and remind them of where it's written down.

### 4. Proactively Link
Every new note gets wikilinks on the same write. Backlinks matter as much as content. When Claude creates a work note about a client, it links to the company. When Claude captures a decision, it links to the project it affects. A note without links is a bug — ship it with links or don't ship it.

### 5. Pattern-Match Across Sessions
When the same thing comes up more than twice, Claude should notice and call it out: "You've hit this exact issue three times in the last two weeks — want me to write a Gotcha note and/or build an automation for it?" Compounding is the point.

### 6. Align Every Suggestion to the North Star
Before suggesting a feature, refactor, priority, or trade-off, Claude checks against [[North Star]]. If the suggestion doesn't move the user toward the 2029 vision (M&A capable + retired) or the Q2 focus (agent orchestration + automation), Claude says so explicitly: "This is useful, but it's not Q2-aligned. Do you want to do it anyway?"

### 7. Use the Full Skill Stack
The vault has **203 skills, 95 agents, and 82 commands** loaded. Claude should compose them aggressively — the vault has specialized tooling for nearly every founder/operator task:

- **For any UI/design task** → load `ui-ux-pro-max` first, compose with `brand` + `design-system` + `ui-styling`, verify with `visual-verdict`
- **For any automation buildout** → `plan` → `ralph`/`autopilot` → `verify` → `ai-slop-cleaner` → commit
- **For any ambiguous request** → `ralplan` gates first, then execute
- **For any bug/investigation** → `deep-dive` (`trace` → `deep-interview`)
- **For any recurring knowledge task** → `wiki`, `remember`, `learner` skills (second-brain-native, use aggressively)
- **For any parallel work** → `ultrawork` or spawn multiple agents in one message
- **For any research** → `external-context` spawns parallel document-specialist agents
- **For any new client proposal** → `market-proposal` → `ui-ux-pro-max` → `docx`/`pdf` for deliverable
- **For any lead intake** → `icp-builder` → `lead-qualification` → `cold-email`/`build-sequence`
- **For any landing page** → `market-landing` → `ui-ux-pro-max` → `ui-styling` → `page-cro` review → `visual-verdict`
- **For any website audit** (client prospecting) → `market-audit` → `serp-analyzer` → `seo-audit` → `market-report-pdf`
- **For any sales call prep** → `prepare-call` → `meddic-checklist` → `persona-intel` → `discovery-calls`
- **For any deal review** → `audit-pipeline` → `deal-review` → `forecast-discipline` → `deal-quality-model`
- **For any M&A target evaluation** → `gathering-competitive-intelligence` → `modeling-finances` → `designing-business-models` → [[M&A Playbook]]
- **For any financial model** → `modeling-finances` → `xlsx` → `build-forecast-scenarios`
- **For any founder-level strategic decision** → `steering-strategy` → `shaping-product-strategy` → `decision-making frameworks`
- **For any investor / capital raise work** → `raising-capital` → `pptx` → `launching-go-to-market`
- **For any new business idea / acquisition thesis** → `validating-ideas` → `designing-business-models` → `planning-market-entry`
- **For any brand/positioning work** → `building-brand` → `brand` → `market-brand` → `design`
- **For any content marketing push** → `content-strategy` → `keyword-research` → `write-blog` → `content-repurposing`
- **For any recurring reporting** → `xlsx` + `analyst` agent + `market-report-pdf` for client-facing; `scientist` agent for analysis
- **For any customer success task** → `adoption-playbook` → `sentiment-feedback-loop` → `retention-dashboard`
- **For any churn / retention** → `churn-prevention` → `risk-scoring-framework` → `save-play-library`

### 8. Never Start Fresh When the Vault Has the Answer
If Claude is about to say "I don't know the answer to that" — check the vault first. QMD search, read related brain notes, read active work. "I don't know" should be the answer after searching, not the default.

## Skills & Capabilities

This vault has [obsidian-skills](https://github.com/kepano/obsidian-skills) installed in `.claude/skills/`. Follow these skill conventions:

- **obsidian-markdown**: Obsidian-flavored markdown -- wikilinks, embeds, callouts, properties. See `references/` for callout types, embed syntax, and property specs. Always prefer `[[wikilinks]]` over markdown links.
- **obsidian-cli**: CLI commands for vault operations when Obsidian is running. See CLI section below.
- **json-canvas**: Create `.canvas` files with nodes, edges, and visual layouts. See `references/EXAMPLES.md`.
- **obsidian-bases**: Create `.base` files with views, filters, and formulas. Bases core plugin is enabled. See `references/FUNCTIONS_REFERENCE.md`.
- **defuddle**: Extract clean markdown from web pages via `defuddle parse <url> --md`.
- **qmd**: Semantic search across the vault via [QMD](https://github.com/tobi/qmd). Use PROACTIVELY before reading files -- `qmd query "..."` for hybrid search, `qmd search "..."` for keyword, `qmd vsearch "..."` for semantic. Falls back to grep/glob if QMD not installed.

### Design Skills (UI/UX Pro Max bundle)

Vendored from [`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT). These auto-activate whenever work touches how a feature **looks, feels, moves, or is interacted with** -- new pages, components, color/typography choices, UI reviews, accessibility, animation, responsive behavior, brand output, slides, banners.

- **ui-ux-pro-max**: Primary design intelligence engine. 67 UI styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, 25 chart types across 15 stacks. Query via `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <style|color|typography|product|landing|chart|ux>`. Use for every substantial UI task.
- **design**: Umbrella design skill -- brand identity, logos (55 styles), CIP mockups, HTML presentations, banners, icons (15 styles, SVG), social photos.
- **design-system**: Three-layer token architecture (primitive → semantic → component), CSS variables, spacing/typography scales, component specs.
- **ui-styling**: shadcn/ui + Radix + Tailwind component patterns, canvas-based visuals, dark mode, accessible layouts.
- **brand**: Voice, visual identity, messaging frameworks, style guides, brand compliance.
- **banner-design**: Social/ads/web/print banners across 13+ styles and all major platforms.
- **slides**: Strategic HTML presentations with Chart.js, design tokens, copywriting formulas.

**Mandate**: On any UI, visual, or design-adjacent task, load `ui-ux-pro-max` first via the Skill tool and query the relevant domain before writing code or markup. Treat the 10-priority rule table in its SKILL.md as a hard checklist (accessibility → touch → performance → style → layout → typography/color → animation → ...). Never ship raw hex colors, text < 12px, focus-ring removal, icon-only buttons without aria labels, or hover-only interactions. For multi-surface work (brand + components + presentation), compose the skills: `brand` + `design-system` → `ui-styling` → `ui-ux-pro-max` review pass.

### Orchestration Skills & Agents (oh-my-claudecode bundle)

Cherry-pick vendored from [`Yeachan-Heo/oh-my-claudecode`](https://github.com/Yeachan-Heo/oh-my-claudecode) (MIT, v4.11.6). This vault pulls in the standalone pieces only -- the 19 agents and 33 skills that do **not** depend on the plugin runtime, hooks, or `$CLAUDE_PLUGIN_ROOT`. Skipped: `cancel`, `hud`, `omc-setup`, `team` (require the plugin loader), plus the hooks, Node scripts, `src/`, `dist/`, `bridge/`, `shellmark/`, `missions/`, npm dependencies.

**Agents** (`.claude/agents/`, 19): `analyst`, `architect`, `code-reviewer`, `code-simplifier`, `critic`, `debugger`, `designer`, `document-specialist`, `executor`, `explore`, `git-master`, `planner`, `qa-tester`, `scientist`, `security-reviewer`, `test-engineer`, `tracer`, `verifier`, `writer`. These are generic dev roles that coexist with the vault-specific agents (`brag-spotter`, `vault-librarian`, `slack-archaeologist`, etc.) -- no name collisions.

**Skills** (`.claude/skills/`, 33 new):

| Category | Skills |
|----------|--------|
| Planning & reasoning | `plan`, `ralplan`, `deep-dive`, `deep-interview`, `deepinit`, `sciomc` |
| Execution modes | `autopilot`, `ralph`, `ultrawork`, `ultraqa`, `ccg` (Claude+Codex+Gemini tri-model) |
| Debugging & verification | `debug`, `trace`, `verify`, `visual-verdict`, `ai-slop-cleaner` |
| Memory & knowledge | `remember`, `wiki`, `writer-memory`, `learner`, `omc-reference` |
| Meta / skill authoring | `skill`, `skillify`, `self-improve` |
| Project workflow | `project-session-manager`, `release`, `setup`, `omc-doctor`, `omc-teams` |
| Context & comms | `ask`, `external-context`, `configure-notifications`, `mcp-setup` |

**Usage guidance**: Most OMC skills are for dev/orchestration work inside the repo (modifying `.claude/`, scripts, hooks, templates) — compose `plan` → `ralph`/`autopilot` → `verify` → `ai-slop-cleaner` before commit. For ambiguous requests, `ralplan` gates with consensus planning. For bug hunts, use `deep-dive` (`trace` → `deep-interview`).

**Second-brain-native skills (promote these into vault workflows, not just dev work)**:
- **`wiki`** — persistent markdown knowledge base that compounds across sessions (Karpathy model). This is the closest thing to a literal "external brain" in the installed set. Use it for any compounding knowledge that isn't already served by a specific brain topic note.
- **`remember`** — decides what belongs in project memory vs notepad vs durable docs. Invoke this whenever the user says "remember this" or "don't forget."
- **`learner`** — extracts a learned skill from the current conversation. Run at end of session if the conversation taught something worth keeping.
- **`writer-memory`** — agentic memory system for long-form writing: tracks entities, relationships, scenes, themes. Useful for any multi-session drafting work (proposals, campaigns, M&A write-ups).
- **`omc-reference`** — the OMC agent catalog and routing reference. Auto-loads when delegating to agents.

Vault-native workflows (`/standup`, `/dump`, `/wrap-up`, `/weekly`) remain the primary entry points for note-taking. OMC's knowledge skills are complements, not replacements.

**Team orchestration not available in this install.** `team`, `cancel`, `hud`, and `omc-setup` were intentionally skipped because they hard-depend on the OMC plugin loader. To get those plus the full hook pipeline, install at the user level via:

```
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
```

That is a separate install outside this vault repo -- run it yourself in the Claude Code CLI when you want the full orchestration runtime.

### Founder / M&A / Marketing / Sales Bundles

Vendored 2026-04-15. **92 curated skills + 67 harvested commands + 67 harvested agents** from six MIT/Apache-licensed GitHub sources, cherry-picked for a solo founder running two service businesses toward M&A. All self-contained, zero runtime dependencies, zero plugin-root references.

| Source | Skills installed | Focus |
|--------|-----------------|-------|
| [`anthropics/skills`](https://github.com/anthropics/skills) | 10 | Official: `skill-creator`, `mcp-builder`, `docx`, `pptx`, `xlsx`, `pdf`, `webapp-testing`, `doc-coauthoring`, `internal-comms`, `web-artifacts-builder` |
| [`bwerneckm/startup-skills`](https://github.com/bwerneckm/startup-skills) | 13 | Founder playbooks: `closing-deals`, `raising-capital`, `modeling-finances`, `validating-ideas`, `designing-business-models`, `launching-go-to-market`, `measuring-growth`, `planning-market-entry`, `steering-strategy`, `shaping-product-strategy`, `navigating-regulations`, `building-brand`, `gathering-competitive-intelligence` |
| [`zubair-trabzada/ai-marketing-claude`](https://github.com/zubair-trabzada/ai-marketing-claude) | 14 | Agency-ready `market-*` suite: `market-ads`, `market-audit`, `market-brand`, `market-competitors`, `market-copy`, `market-emails`, `market-funnel`, `market-landing`, `market-launch`, `market-proposal`, `market-report`, `market-report-pdf`, `market-seo`, `market-social` |
| [`syntax-syndicate/marketingskills`](https://github.com/syntax-syndicate/marketing-skills) | 18 | CRO + lead gen: `form-cro`, `onboarding-cro`, `page-cro`, `popup-cro`, `signup-flow-cro`, `paywall-upgrade-cro`, `cold-email`, `lead-magnets`, `marketing-psychology`, `content-strategy`, `customer-research`, `churn-prevention`, `revops`, `site-architecture`, `free-tool-strategy`, `referral-program`, `launch-strategy`, `programmatic-seo` |
| [`OpenClaudia/openclaudia-skills`](https://github.com/OpenClaudia/openclaudia-skills) | 15 | Research/content/growth: `content-calendar`, `content-repurposing`, `content-gap-analysis`, `demand-gen`, `icp-builder`, `keyword-research`, `write-landing`, `write-blog`, `newsletter`, `email-subject-lines`, `google-reviews`, `growth-strategy`, `affiliate-marketing`, `brand-monitor`, `serp-analyzer` |
| [`gtmagents/gtm-agents`](https://github.com/gtmagents/gtm-agents) | 22 bundles → **87 flattened skills** + **67 commands** + **67 agents** | Enterprise-grade GTM ops flattened for solo use: sales pipeline (`crm-hygiene`, `deal-review`, `forecast-discipline`), prospecting (`cold-outreach`, `discovery-calls`, `meddic-checklist`, `objection-handling`, `social-selling`), customer success (`adoption-playbook`, `executive-ebr-kit`, `risk-scoring-framework`), revenue ops (`forecast-modeling`, `variance-analysis`, `deal-quality-model`), content ops (`case-studies`, `webinars`, `whitepapers`, `editorial-ops`), community (`champion-engagement-system`, `community-kpi-dashboard`), VoC (`customer-feedback-taxonomy`, `closed-loop-playbook`), PR (`messaging-frameworks`, `crisis-playbooks`, `media-database`), partnerships (`partner-ecosystem-map`, `joint-solution-blueprint`) |

**Newly-harvested commands** worth knowing (all in `.claude/commands/`): `run-forecast`, `build-forecast-scenarios`, `audit-pipeline`, `prepare-call`, `build-sequence`, `generate-leads`, `qualify-lead`, `monitor-customer-health`, `monitor-retention`, `monitor-abm`, `design-nurture`, `orchestrate-journey`, `monitor-automation`, `configure-workflow`, `produce-campaign-report`, `run-market-landscape-study`, `synthesize-insights`, `pitch-media`, `manage-crisis`, `plan-qbr`, `plan-launch`, `generate-blog`, `create-ebook`, `content-pipeline`, and more.

**Newly-harvested agents** (all in `.claude/agents/`): 67 specialist agents including pipeline-analyst, forecast-coach, cs-strategist, nurture-architect, content-strategist, pr-strategist, research-lead, and many more. Use the Agent tool to delegate specialized sub-work.

**Usage guidance**: These bundles were curated for **founder-operator work at two service businesses driving toward M&A**. Skip anything industry-inappropriate (we skipped healthcare, financial-services, edtech, manufacturing bundles). Skip anything platform-specific for platforms the user doesn't use (we skipped discord/telegram/bluesky/reddit). Compose aggressively — most marketing agency work touches 5-10 skills in one task.

### Custom Slash Commands

Defined in `.claude/commands/`. See [[Skills]] for full documentation.

| Command | Purpose |
|---------|---------|
| `/standup` | Morning kickoff -- load context, review yesterday, surface tasks, priorities |
| `/dump` | Freeform capture -- dump anything, gets routed to the right notes |
| `/wrap-up` | Full session review -- verify notes, indexes, links, suggest improvements |
| `/humanize` | Voice-calibrated editing -- make notes sound like you, not AI |
| `/weekly` | Weekly synthesis -- cross-session patterns, North Star alignment, uncaptured wins |
| `/capture-1on1` | Capture 1:1 meeting transcript into structured vault note |
| `/incident-capture` | Capture incident from Slack channels/DMs into structured vault notes |
| `/slack-scan` | Deep scan Slack channels/DMs for evidence |
| `/peer-scan` | Deep scan a peer's GitHub PRs for review prep |
| `/review-brief` | Generate review brief (manager or peer version) |
| `/self-review` | Write self-assessment for review tool -- projects, competencies, principles |
| `/review-peer` | Write peer review -- projects, principles, performance summary |
| `/vault-audit` | Audit indexes, links, orphans, stale context |
| `/vault-upgrade` | Import content from an existing vault into this obsidian-mind instance |
| `/project-archive` | Move completed project from active/ to archive/, update indexes |

## Vault Structure

| Folder | Purpose | Key Files |
|--------|---------|-----------|
| `Home.md` | **Vault entry point** -- embedded Base views, quick links | Open this first |
| `vault-manifest.json` | **Template metadata** -- version, infrastructure vs user content boundaries, frontmatter schemas, version fingerprints | Used by `/vault-upgrade` for migration |
| `CHANGELOG.md` | **Version history** -- tracks template releases (v1--v3.3) with what changed | Reference for upgrade paths |
| `bases/` | **All Bases centralized** -- dynamic views for navigation | `Work Dashboard`, `Incidents`, `People Directory`, `1-1 History`, `Review Evidence`, `Competency Map`, `Templates` |
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
| `brain/` | Claude's operational knowledge | `Memories.md`, `Key Decisions.md`, `Patterns.md`, `Gotchas.md`, `Skills.md`, `North Star.md` |
| `org/` | Organizational knowledge index | `People & Context.md` (MOC) |
| `org/people/` | Atomic person notes | One note per person |
| `org/teams/` | Team notes as graph nodes | One note per team |
| `reference/` | Codebase knowledge, architecture maps | Flow docs, architecture docs |
| `thinking/` | Scratchpad for drafts and reasoning | Named `YYYY-MM-DD-topic.md` |
| `templates/` | Obsidian templates | `Work Note.md`, `Decision Record.md`, etc. |
| `.claude/commands/` | 15 slash commands | See command table above |
| `.claude/agents/` | 9 subagents | See subagents table below |
| `.claude/scripts/` | Hook scripts | `session-start.sh`, `classify-message.py`, `validate-write.py`, `pre-compact.sh` |
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
- **`org/People & Context.md`** -- update when people, teams, or org structure changes
- **`perf/Brag Doc.md`** -- log wins with links to evidence, add new quarters as needed

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

Specialized agents in `.claude/agents/` for heavy operations. They run in isolated context windows.

| Agent | Purpose | Invoked by |
|-------|---------|------------|
| `brag-spotter` | Finds uncaptured wins and competency gaps | `/wrap-up`, `/weekly` |
| `context-loader` | Loads all vault context about a person, project, or concept | Direct |
| `cross-linker` | Finds missing wikilinks, orphans, broken backlinks | `/vault-audit` |
| `people-profiler` | Bulk creates/updates person notes from Slack profiles | `/incident-capture` |
| `review-prep` | Aggregates all performance evidence for a review period | `/review-brief` |
| `slack-archaeologist` | Full Slack reconstruction -- every message, thread, profile | `/incident-capture` |
| `vault-librarian` | Deep vault maintenance -- orphans, broken links, stale notes | `/vault-audit` |
| `review-fact-checker` | Verifies every claim in a review draft against vault sources | `/self-review`, `/review-peer` |
| `vault-migrator` | Classifies, transforms, and migrates content from a source vault | `/vault-upgrade` |

## Hooks

Five lifecycle hooks in `.claude/settings.json`:

| Hook | When | What |
|------|------|------|
| SessionStart | On startup/resume | QMD re-index, inject North Star, active work, recent changes, tasks, file listing |
| UserPromptSubmit | Every message | Classifies content (decision, incident, win, 1:1, architecture, person) and injects routing hints |
| PostToolUse | After writing `.md` | Validates frontmatter, checks for wikilinks, verifies folder placement |
| PreCompact | Before context compaction | Backs up session transcript to `thinking/session-logs/` |
| Stop | End of every session | Lightweight checklist reminder: archive, update indexes, check orphans. For thorough review, use `/wrap-up` instead. |

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
