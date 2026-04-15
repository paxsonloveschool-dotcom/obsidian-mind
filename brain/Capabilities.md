---
date: 2026-04-13
description: Inventory of what Claude can do in this vault — tools, commands, agents, hooks, skills, MCP integrations, and their composition surfaces
tags: [brain, capabilities]
type: brain
---

# Capabilities

Inventory of everything available to Claude when operating in this vault. This is the "what can I do" surface — when a task arrives, scan this to find the right tool before improvising.

## Native Tools (always available)

| Tool | Use for |
|------|---------|
| `Read` | File contents (with offset/limit for large files) |
| `Write` | Create new file or full rewrite (must Read existing first) |
| `Edit` | Surgical string replace (must Read first) |
| `Glob` | Find files by pattern |
| `Grep` | Search file contents (ripgrep) |
| `Bash` | Shell commands — only when no dedicated tool exists |
| `TodoWrite` | Track multi-step work |
| `Skill` | Invoke skills (obsidian-markdown, qmd, defuddle, etc.) |
| `Agent` | Spawn specialized subagents in isolated context |

## Skills (load via `Skill` tool)

| Skill | When to load |
|-------|--------------|
| `obsidian-markdown` | Creating or editing `.md` notes — wikilinks, callouts, properties, embeds |
| `obsidian-cli` | Running CLI commands when Obsidian is running |
| `obsidian-bases` | Working with `.base` files (queries, views, formulas) |
| `json-canvas` | Working with `.canvas` files (visual layouts) |
| `qmd` | Semantic search across the vault (preferred over Grep for content questions) |
| `defuddle` | Extract clean markdown from web pages (instead of WebFetch) |

## Slash Commands

18 commands in `.claude/commands/`. Full reference: [[../reference/command-reference]].

| Command | Purpose |
|---------|---------|
| `/standup` | Morning kickoff — load context, review yesterday, surface tasks |
| `/dump` | Freeform capture — auto-route to right notes |
| `/wrap-up` | Full session review |
| `/humanize` | Voice-calibrate AI-drafted text |
| `/weekly` | Weekly synthesis |
| `/capture-1on1` | Structure 1:1 transcript into a note |
| `/incident-capture` | Capture incident from Slack into notes |
| `/slack-scan` | Deep scan Slack channels/DMs |
| `/peer-scan` | Deep scan peer GitHub PRs |
| `/review-brief` | Generate review brief |
| `/self-review` | Write self-assessment |
| `/review-peer` | Write peer review |
| `/vault-audit` | Audit indexes, links, orphans |
| `/vault-upgrade` | Import from another vault |
| `/project-archive` | Archive completed project |
| `/promote` | Promote thinking note findings to durable atomic notes |
| `/connect` | Find missing wikilinks (wraps cross-linker) |
| `/think` | Scaffold a properly-structured thinking note |

## Subagents

11 agents in `.claude/agents/`. Full reference: [[../reference/agent-reference]].

| Agent | Best for |
|-------|----------|
| `brag-spotter` | Find uncaptured wins and competency gaps |
| `context-loader` | Load all vault context about a person/project/concept |
| `cross-linker` | Find missing wikilinks, orphans, broken backlinks |
| `memory-curator` | Curate brain/ — stale claims, duplication, overgrowth, promotion candidates |
| `people-profiler` | Bulk create/update person notes from Slack |
| `playbook-generator` | Turn an observed pattern into a new playbook in brain/playbooks/ |
| `review-prep` | Aggregate all evidence for a review period |
| `slack-archaeologist` | Full Slack reconstruction — every message and thread |
| `vault-librarian` | Deep vault maintenance — orphans, broken links, stale notes |
| `review-fact-checker` | Verify every claim in a review draft |
| `vault-migrator` | Classify, transform, migrate from a source vault |

## Built-in Agent Types (from Claude Code)

| Agent type | Best for |
|-----------|----------|
| `general-purpose` | Complex multi-step research and tasks |
| `Explore` | Fast codebase/vault exploration with thoroughness control |
| `Plan` | Software architect planning |
| `claude-code-guide` | Questions about Claude Code, Agent SDK, Claude API |
| `statusline-setup` | Configure Claude Code status line |

## Hooks (automatic)

5 lifecycle hooks in `.claude/settings.json`:

| Hook | Fires | Effect |
|------|-------|--------|
| `SessionStart` | startup/resume/clear | Inject North Star, active work, recent changes, tasks, file listing; QMD re-index |
| `UserPromptSubmit` | every message | Classify content, inject routing hints |
| `PostToolUse` | after Write/Edit/MultiEdit on `.md` | Validate frontmatter and wikilinks |
| `PreCompact` | before context compaction | Backup session transcript to `thinking/session-logs/` |
| `Stop` | session end | Lightweight checklist reminder |

## MCP Integrations (when available)

These appear as deferred tools — load schemas via `ToolSearch` before calling.

| Integration | Capabilities |
|-------------|--------------|
| GitHub (`mcp__github__*`) | PRs, issues, branches, comments, reviews, search, file operations — restricted to `paxsonloveschool-dotcom/obsidian-mind` |
| Google Calendar (`mcp__*gcal_*`) | List events, create/update/delete, find meeting times |
| Gmail (`mcp__*gmail_*`) | Read messages, search, drafts, labels |
| Cloudflare (`mcp__*`) | D1 databases, KV namespaces, R2 buckets, Workers, docs search |
| Figma (`mcp__*`) | Design context, code connect, screenshots, variables |

## Bases (dynamic vault views)

9 bases in `bases/`. Each is a `.base` file driving a queryable view.

| Base | Surface |
|------|---------|
| `Work Dashboard` | All work notes by quarter, status, project |
| `Incidents` | Incidents by ticket, severity, role |
| `People Directory` | All person notes |
| `1-1 History` | All 1:1s by person and date |
| `Review Evidence` | Evidence by cycle, person |
| `Competency Map` | Competencies and their backlink-count evidence |
| `Templates` | All templates in one view |
| `Playbooks` | All playbooks by reference count and recency |
| `Brain Topics` | All brain topic notes with stale-flag view |

## Templates

5 templates in `templates/`. Always use these — they encode the schema contract.

| Template | For |
|----------|-----|
| `Work Note.md` | Work notes (active or archived) |
| `Decision Record.md` | Decisions |
| `Thinking Note.md` | Scratchpad reasoning |
| `Competency Note.md` | Competency definitions |
| `Review Template.md` | Review briefs and reviews |

## Brain Topic Notes (operational memory)

| Note | Contents |
|------|----------|
| `[[North Star]]` | Living goals — read at session start |
| `[[Build Log]]` | Append-only log of vault expansion — session continuity |
| `[[Memories]]` | Memory index — pointers to topic notes |
| `[[Key Decisions]]` | Strategic technical decisions |
| `[[Patterns]]` | Reusable patterns — graph thinking, atomicity, token discipline |
| `[[Gotchas]]` | Known pitfalls and edge cases |
| `[[Skills]]` | Workflow registry |
| `[[Workflows]]` | Multi-step workflows chaining commands and agents |
| `[[Capabilities]]` | This file |
| `[[playbooks/README|Playbooks]]` | Repeatable procedures for common tasks |

## Reference Notes (structural knowledge)

| Note | Contents |
|------|----------|
| `[[../reference/vault-architecture]]` | How the vault is structured |
| `[[../reference/command-reference]]` | Quick lookup for all slash commands |
| `[[../reference/agent-reference]]` | Quick lookup for all subagents |

## Composition Heuristics

When you face a new task, compose from the surface above:

1. **Is there a slash command for this?** Use it directly.
2. **Is there a playbook?** Drive it manually if no command wraps it.
3. **Does it require heavy file work?** Delegate to a subagent.
4. **Does it need vault search?** Use `qmd` skill first, then Grep, then Explore.
5. **Does it need external data?** Check MCP integrations.
6. **Is it a one-off thought?** Thinking note → promote later.

## Related

- [[Workflows]]
- [[Patterns]]
- [[Skills]]
- [[playbooks/README|Playbooks]]
- [[Memories]]
