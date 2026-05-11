---
date: 2026-04-05
description: Reusable patterns discovered during work
tags: [brain, patterns]
type: brain
---

# Patterns

## Token Saving
- Progressive disclosure: metadata always -> body on trigger -> resources on demand
- Context window is a public good — every loaded file costs all subsequent operations
- Challenge each paragraph: "Does this justify its token cost?"
- Batch independent tool calls into single parallel message
- Use agents for parallel work to save main context
- `disable-model-invocation: true` for deterministic operations (git, file moves)

## Context Management
- 50% normal, 70% optimize, 80% /compact, 90% mandatory split
- Offload to files: agents write reports to disk, next agent reads file not chat
- Grep before Read — only load what you need
- Edit prompts instead of sending "no, fix this" follow-ups (mistake + correction stay in context forever)
- Connect ALL MCP servers before starting work — adding mid-session busts prompt cache
- `/model opusplan` for architecture, then Sonnet/Haiku to execute
- Isolate heavy reads in Haiku sub-agents — sub-agent context dies with the sub-agent
- Run `/compact` MANUALLY before auto-compact fires; 3 failed auto-compacts trips the circuit breaker
- Fast Path tools (ls/grep/glob/TodoWrite) skip the AI classifier in Auto mode — zero latency
- CLAUDE.md = pointers (~150 chars/line), not walls of text — memory is hints, not facts
- See `context-hygiene` skill for the full playbook

## Workflow
- Two-part execution: Research & Plan -> Execute & Verify
- Parallel quality gates: validator + tester simultaneously (40% faster)
- Version-first: determine version before work starts
