---
name: context-hygiene
description: Token budget discipline for Claude Code sessions. Use when a session is growing long, when planning heavy refactors, when context usage climbs past 50%, or when the user asks about saving tokens, avoiding limits, or "managing the context window". Codifies the Nate Herk context-hygiene playbook.
version: 1.0.0
license: MIT
---

# Context Hygiene

A field guide for keeping Claude Code sessions cheap, fast, and coherent. Apply these rules proactively — don't wait for the user to hit a limit.

## Tier 1 — Cheap habits

**Edit, don't follow up.** When Claude gives a wrong answer, the user should up-arrow + edit the original prompt, not send "no, fix this". Follow-ups bake the mistake and the correction into context forever. If the user does send a correction, suggest editing the original prompt instead.

**Short sessions.** Break work into focused tasks. Start a fresh session when switching context. A 2-hour session on three unrelated topics is more expensive than three 40-min sessions.

**Off-peak heavy work.** Big refactors, multi-agent runs, and large codebase ingests are best done evenings/weekends when the usage meter is forgiving.

**Tune auto-compact threshold.** Default auto-compaction triggers near the limit, which is too late. Ask the user if they want it earlier (~60–75%) — that's a settings change, not a per-session toggle. Use the `update-config` skill.

## Tier 2 — Caching & model delegation

**Don't bust the prompt cache.** Connect ALL MCP servers BEFORE starting work. Adding/removing MCP tools mid-session invalidates the cache → latency spike + token cost spike. Same for changing the system prompt mid-session.

**Opusplan trick.** Use `/model opusplan` to let Opus plan the architecture, then switch to Sonnet or Haiku to execute. Opus is for thinking; Sonnet/Haiku are for typing.

**Isolate heavy reads in a sub-agent.** Parsing a 50-page doc? Ingesting a huge changelog? One-off research? Delegate to a Haiku sub-agent. Sub-agent context dies with the sub-agent — the main session only sees the summary. Build "walls" around expensive reads.

## Tier 3 — Power moves

**Pointer-style CLAUDE.md.** Memory files are treated as *hints to verify against the codebase*, not authoritative facts. Long walls of text are wasted tokens. Target ~150 chars per line, pointer-style entries. If something needs full detail, link to a separate file the agent can read on demand.

**Avoid the compaction circuit breaker.** Auto-compact fires near the limit. If it fails three times in a row, the breaker trips and compaction is disabled for the rest of the session — agent quality degrades fast. In a long session, run `/compact` MANUALLY well before the limit. Better: don't push sessions that long in the first place.

**Lean on the Fast Path.** In Auto mode, read-only tools skip the AI classifier and execute with zero latency: `ls`, `grep`, `glob`, `TodoWrite`, `TaskCreate`, `TaskList`. Use these freely for exploration and planning. Batch writes together at the end of the planning phase, not interleaved.

## When to invoke this skill

- User says "save tokens" / "context full" / "running out of context" / "hitting limits"
- Context usage visibly climbs past 50% in a session
- Planning a refactor that will touch >10 files
- Before kicking off a long-running agent
- User asks how to use Claude Code more efficiently

## Quick decision tree

| Situation | Action |
|-----------|--------|
| Wrong answer from Claude | Suggest user edits the original prompt, don't send a "fix this" follow-up |
| About to read a huge file | Delegate to Haiku sub-agent, return only the summary |
| Need to plan + implement | `/model opusplan` for plan, switch to Sonnet for code |
| Context past 50% | Suggest `/compact` now, before auto-compact kicks in |
| New MCP server needed | Stop work, connect server, restart session — don't add mid-flight |
| CLAUDE.md getting long | Move details to linked files, leave pointers in CLAUDE.md |
| Exploring codebase | Use ls/grep/glob (Fast Path), don't Read large files speculatively |

## Anti-patterns

- ❌ "No, that's wrong, please fix..." — bloats context with mistake + correction
- ❌ Adding an MCP server in the middle of a long session
- ❌ Reading 5 large files speculatively "to get context"
- ❌ Letting auto-compact handle it — it fires too late and can hard-fail
- ❌ Multi-paragraph entries in CLAUDE.md / memory files
- ❌ Using Opus for routine code edits

## Related
- [[Patterns]] — token-saving patterns in the vault
- [[Skills]] — skill registry
- `update-config` skill — for the auto-compact threshold tweak
