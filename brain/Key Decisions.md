---
date: 2026-04-05
description: Log of important technical and strategic decisions
tags: [brain, decisions]
type: brain
---

# Key Decisions

## 2026-04-05 — System Architecture
**Decision:** Use obsidian-mind as primary vault with Claude Code integration
**Context:** Evaluated 12+ repos (Khoj, COG, PKM, GodMode, etc.)
**Rationale:** Best balance of persistent memory, session hooks, Claude Code native support
**Alternatives:** Khoj (too heavy), COG (less mature), standalone CLAUDE.md (no persistence)

## 2026-04-05 — Token Optimization Strategy
**Decision:** 4-file context structure with .claudeignore
**Context:** Default startup ~11,000 tokens; reduced to ~450
**Rationale:** Based on claude-token-optimizer patterns (83-87% reduction)
**Implementation:** CLAUDE.md auto-load + 3 on-demand files + .claudeignore
