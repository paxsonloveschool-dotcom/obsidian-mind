---
name: claude-mem
description: Persistent auto-memory layer for Claude Code — captures every tool use, decision, and file touch across sessions, compresses via Claude Agent SDK, stores in ChromaDB vector DB, injects relevant context into future sessions via MCP. Complements the vault's manual brain/ memory system. Installed via `/plugin marketplace add thedotmack/claude-mem` — user-level plugin, not vendored into this repo. Use this skill when the user asks about "auto memory", "session memory", "context loss between sessions", "Claude forgot something", "persistent memory", "claude-mem", "memory compression", or when troubleshooting memory recall issues.
license: AGPL-3.0
---

# claude-mem — Auto-Memory Layer

**Pointer skill.** The actual plugin lives at the user level, not in this repo. This skill documents what claude-mem is, why we use it, how it complements the existing vault memory system, and how to install / check / troubleshoot it.

- **Upstream**: [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- **License**: AGPL-3.0 (copyleft — relevant if you ever wrap obsidian-mind as a network service)
- **Author**: Alex Newman (@thedotmack)
- **Current version** (as of 2026-04-15): 12.1.3
- **Not vendored into this repo** — see "Why not vendored" below

## What It Does

claude-mem is a Claude Code plugin that provides **automatic, persistent memory across sessions**. It:

1. **Captures everything Claude does** — tool invocations, file reads/writes, decisions, code changes — via `PreToolUse` + `PostToolUse` + `UserPromptSubmit` + `Stop` hooks
2. **Compresses observations** using the Claude Agent SDK into semantic memory units (not raw transcripts)
3. **Stores in ChromaDB** — a local vector database — for semantic retrieval
4. **Injects relevant context** into future sessions on `SessionStart` via MCP integration
5. **Runs a background worker service** on `localhost:37777` to handle the async compression pipeline without blocking the main session

The result: when you start a new session, claude-mem automatically surfaces relevant context from every prior session — without you having to run `/standup`, dig through notes, or explain what you did yesterday.

## Dual-Memory Architecture (With the Existing brain/ System)

The vault already has a **manual, curated memory system** in `brain/`:

| Memory type | Where | Capture style | Best for |
|---|---|---|---|
| **Manual / curated** | `brain/*.md` (Memories, Key Decisions, Patterns, Gotchas, Skills) + `org/` + `work/` | Claude + user both write, under the Second Brain Mandate in [[CLAUDE]] | Durable, opinionated, cross-linked knowledge — decisions, gotchas, playbooks, strategic memory |
| **Auto / raw** | claude-mem ChromaDB (user-level) | Captures everything automatically, compresses async | Tactical recall of "what did I do last week", "which file touched X", "have we seen this bug before" |

**They complement each other, don't compete.** The brain/ notes are for knowledge that deserves a permanent home in the vault with wikilinks and a structured schema. claude-mem is for the everything-else firehose that would be impractical to manually write down but is useful to recall semantically.

**Rule of thumb**:
- If the user says "remember we decided X" → `brain/Key Decisions.md` + wikilinks (manual)
- If the user says "what file did I touch last week to fix the GHL adapter" → claude-mem semantic search (auto)
- If the user says "we've hit this bug before" → check claude-mem first, then promote to `brain/Gotchas.md` if durable
- If the user says "load everything about Cool Towne HVAC" → both: vault brain/org notes first, then claude-mem for session-level details

## Why This Is NOT Vendored Into the Repo

The obsidian-mind vault has been vendoring a lot of third-party skills and agent bundles (UI/UX Pro Max, oh-my-claudecode, gtm-agents, etc.) into `.claude/skills/` and `.claude/agents/`. Those are self-contained markdown + data + scripts with no runtime dependency.

**claude-mem is different**. Vendoring it would break the existing hook pipeline:

1. **Hooks hard-depend on `$CLAUDE_PLUGIN_ROOT`** — every hook in `plugin/hooks/hooks.json` starts with resolving `$CLAUDE_PLUGIN_ROOT` or falling back to `$HOME/.claude/plugins/cache/thedotmack/claude-mem/...`. That variable is only set when the plugin is installed via the official `/plugin marketplace add` path. Vendoring into `.claude/skills/` would leave it unset and every hook would fail.
2. **Hooks collide with the vault's existing hooks**. The vault already has `SessionStart`, `UserPromptSubmit`, `PostToolUse`, `PreCompact`, `Stop` hooks wired via `.claude/scripts/*.sh` and `.claude/scripts/*.py`. Adding claude-mem's hooks on the same events would either double-fire or break existing behavior.
3. **Runs a persistent Node.js + Bun background worker on `localhost:37777`** — it's not a script that runs and exits. The vault would need to manage its lifecycle (start, stop, health check).
4. **Runtime dependency chain**: Bun, Node.js, ChromaDB, Claude Agent SDK. Not stdlib-friendly like the GHL / video adapters.
5. **AGPL-3.0** — copyleft. Vendoring a modified fork creates obligations if the vault is ever served as a network service.
6. **101 MB**. Vendoring bloats history significantly.
7. **Nothing cherry-pickable** — the repo's `.claude/skills/` has one CLAUDE.md and `.claude/commands/` has one command. The value is 100% in the worker service + compression pipeline, not in markdown content.

The right install path is the one the plugin was designed for: **user-level install via the Claude Code plugin marketplace.** That puts it at `~/.claude/plugins/...`, sets `$CLAUDE_PLUGIN_ROOT` correctly, starts the worker service on session start, and lets it coexist with the vault's existing hooks because the plugin installs at the user level, not inside the repo.

## Install — Two Commands (user runs these, not Claude)

These are user-invocable Claude Code CLI commands. Claude cannot run them from inside a session — the user runs them in their own Claude Code CLI:

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

After install, claude-mem starts capturing automatically on the next session start. No further configuration needed for basic operation.

## Post-Install Checks

Once the user has installed it, verify with:

```bash
# Worker service health
curl -sf http://localhost:37777/health && echo "claude-mem worker: UP" || echo "claude-mem worker: DOWN"

# Plugin cache location
ls -lad ~/.claude/plugins/cache/thedotmack/claude-mem/*/ 2>/dev/null | tail -1

# Settings injection (look for the hooks added by claude-mem)
grep -l "claude-mem" ~/.claude/**/*.json 2>/dev/null
```

## Configuration (Optional, After Install)

claude-mem has its own settings at the user level (not in this vault). The most commonly-tuned options:

- **Retention window** — how many past sessions to consider for context injection (default is reasonable)
- **Compression aggressiveness** — controls how terse the stored memory units are
- **ChromaDB collection name** — if running multiple projects and you want separate vector spaces
- **Context injection size** — how much memory to load into each new session's system context (affects token usage)

See the [claude-mem docs](https://docs.claude-mem.ai/) or `claude-mem --help` after install for the current option list.

## How Claude Should Use It During a Session

If claude-mem is installed, claude-mem's `SessionStart` hook automatically injects relevant context from prior sessions. Claude doesn't need to do anything special to read it — the injected context appears at the top of the session like the vault's manual SessionStart hook output.

**When to explicitly query it** (if MCP search is exposed):
- User asks "when did I last touch X" / "what did I decide about Y" → semantic search claude-mem before grepping vault
- User asks "have we hit this before" → claude-mem first, then `brain/Gotchas.md`
- User asks "catch me up on Z" → claude-mem + `brain/Memories.md` + `work/active/Z`

**When NOT to use it**:
- For durable decisions and strategic knowledge — those belong in `brain/Key Decisions.md`
- For client-specific structured data — those belong in `org/teams/<client>.md` or `engagements/`
- For operational state that lives in GHL — query GHL via the adapter, not claude-mem

## Troubleshooting

- **Worker service not responding on :37777** — check `curl http://localhost:37777/health`, restart via `claude-mem restart` if needed
- **Context not appearing in new sessions** — verify hooks are installed: `cat ~/.claude/settings.json | jq '.hooks'` should show claude-mem entries
- **High token usage** — tune the context injection size down
- **Memory growing unbounded** — claude-mem has retention settings; see docs
- **Conflicts with vault hooks** — should not happen because claude-mem installs at user level and the vault's hooks live in `.claude/settings.json` at the project level. If you see weird behavior, check both sets of hooks for overlap

## Related

- [[CLAUDE#Second Brain Mandate]] — the manual memory system's rules
- [[Memories]] — the vault's auto-loaded memory index (manual)
- [[Key Decisions]] — durable decisions log (manual)
- [[Patterns]] — reusable patterns discovered (manual)
- [[Gotchas]] — known pitfalls (manual)
- [[Skills]] — skill registry (manual)
- Upstream: https://github.com/thedotmack/claude-mem
- Docs: https://docs.claude-mem.ai/
