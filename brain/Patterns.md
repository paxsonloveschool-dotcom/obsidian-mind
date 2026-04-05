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

## Workflow
- Two-part execution: Research & Plan -> Execute & Verify
- Parallel quality gates: validator + tester simultaneously (40% faster)
- Version-first: determine version before work starts
