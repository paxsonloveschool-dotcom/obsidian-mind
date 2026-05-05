---
name: context-mode
description: "Pointer skill for the context-mode MCP plugin (mksglu/context-mode). Sandboxes tool output for 98% context window reduction, persists session events in SQLite FTS5, rebuilds state on compact/resume. NOT vendored — requires user-level plugin install via /plugin install context-mode. Use when the user mentions 'context window', 'context rot', 'running out of context', 'session too long', 'compacted', 'lost context', or asks about context optimization."
---

# Context Mode — Context Window Optimization

**Pointer skill.** The actual plugin lives at the user level, not in this repo.

- **Upstream**: [mksglu/context-mode](https://github.com/mksglu/context-mode)
- **What it does**: Sandboxes tool output through an MCP server, returns only compressed summaries to the context window. Tracks session events in a local SQLite FTS5 database. Rebuilds state automatically on `--continue`, `--resume`, `/resume`, or after `/compact`.
- **Result**: 315 KB of raw tool output becomes ~5 KB. Session time extends from ~30 min to ~3 hours.

## Why Not Vendored

Context-mode is an **MCP server plugin** — it runs `node ./start.mjs` as a persistent process and intercepts tool calls before they reach the context window. It requires:
- Node.js runtime
- SQLite with FTS5 (better-sqlite3 native module)
- MCP server registration in `.mcp.json`
- Plugin-level hook integration

Same pattern as [[claude-mem]] — runtime plugins belong at the user level via the plugin marketplace, not vendored into the vault repo.

## Install (User Runs These)

```
/plugin marketplace add mksglu/context-mode
/plugin install context-mode
```

After install, context-mode activates automatically. Slash commands become available: `/ctx-stats`, `/ctx-doctor`, `/ctx-upgrade`, `/ctx-purge`, `/ctx-insight`.

## When This Matters

- Sessions exceeding 50% context usage → context-mode prevents quality degradation
- Long autonomous runs (autopilot, ralph, ultrawork) → keeps the window clean
- Sessions with heavy tool output (large file reads, many grep results) → sandboxes the bulk

## Complements (Not Replaces) Existing Patterns

The vault already has context management patterns in [[Patterns#Context Management]]:
- 50% normal, 70% optimize, 80% /compact, 90% mandatory split
- Offload to files: agents write reports to disk, next agent reads file not chat
- Grep before Read — only load what you need

Context-mode automates the "offload to files" pattern at the infrastructure level. The manual rules still apply for strategic decisions about what to load.

## Related

- [[claude-mem]] — complementary: claude-mem captures memory across sessions; context-mode optimizes within a session
- [[Patterns#Context Management]] — manual context hygiene rules
- Upstream: https://github.com/mksglu/context-mode
