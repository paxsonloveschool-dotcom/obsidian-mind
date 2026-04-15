---
date: 2026-04-15
description: Auto-loaded memory index — points to vault brain/ notes. Updated with user identity and business context.
tags: [brain, memory, index]
type: index
---

# Memories

> This is Claude's auto-loaded memory index. It is NOT where durable knowledge lives — that goes in the topic notes below. This file is the lookup table.

## Who the User Is

- **Identity**: Owner and creator of [[Restore Marketing Co]] + [[HP Landscaping]]
- **Role**: Solo founder / operator — fully responsible for building everything out
- **Not**: A corporate employee, an IC engineer on a team, a knowledge worker with a manager
- **3-year vision**: Buy and sell companies. Retired. See [[North Star]].
- **Q2 2026 focus**: [[Agent Orchestration Buildout]] — automate 80% of operator work
- **Works**: Solo builder — when Claude talks about "the team" it means the user + agents
- **Restore Marketing Co services**: Full-service local marketing agency — websites (project), + retainers for paid ads (Google + Meta), SEO, Google Business Profile, and full-service bundles. ICP: local service businesses, owner-operated, "near me" search driven (HVAC, plumbing, dental, legal, restaurants, salons, etc.)
- **Primary tech stack**: **GoHighLevel (GHL) is used heavily** — source of truth for contacts, pipelines, opportunities, email, SMS, scheduling, invoicing, workflows, reputation. The Restore automation uses GHL as the primary integration via `work/active/Restore Marketing Automation/scripts/adapters/ghl.py`. When capturing anything about Restore's operations, assume GHL is involved. When suggesting workflows, consider whether GHL's native automation engine can handle it before writing custom code.
- **Auto-memory layer**: [[claude-mem]] (thedotmack/claude-mem, AGPL-3.0). Installed at the user level via `/plugin marketplace add thedotmack/claude-mem` + `/plugin install claude-mem` — NOT vendored into this repo because its worker service and hooks depend on `$CLAUDE_PLUGIN_ROOT` and collide with vault hooks. Captures every tool use across sessions, compresses via Claude Agent SDK, stores in ChromaDB, injects relevant context into future SessionStart. Dual-memory model: durable knowledge goes to `brain/` manually, tactical recall lives in claude-mem. When user says "have we hit this before" or "what did I touch last week" → check claude-mem; when user says "we decided X" → write to `brain/Key Decisions.md`. See [[.claude/skills/claude-mem/SKILL|pointer skill]] for the full model.
- **Video generation stack**: **Seedance 2.0** (ByteDance, cinematic + audio) and **LTX-2.3** (Lightricks, open-source, portrait-native 4K) — both wrapped in one unified adapter at `work/active/Restore Marketing Automation/scripts/adapters/video.py` with a VideoRouter that auto-picks per use case. Accessed via fal.ai (single `FAL_KEY`). Routing: portrait short-form → LTX fast, cinematic ads → Seedance, 4K hero → LTX pro, image-to-video product shots → Seedance. Claude-level skill at `.claude/skills/social-video-generation/` describes when/how to invoke. End-to-end social content workflow at `workflows/social-content.md` composes the video adapter with market-social + market-copy + brand skills and the GHL social planner.

**Behavioral implication**: Vault workflows inherited from the corporate-employee template (1:1 meetings with a manager, peer reviews, performance cycles, brag doc for promotion) don't directly apply. Repurpose them for founder context — "1:1" becomes "check-in with self or key contractor," "peer review" becomes "client post-mortem," "brag doc" becomes "win log for sales / M&A storytelling." Don't offer `/capture-1on1` or `/review-brief` in their original context. Offer the repurposed versions.

## What Claude Should Do All Day Long

See [[CLAUDE#Second Brain Mandate]] — proactive, always-on, compounding. Claude is not a chatbot that gets asked questions. Claude is an operator that runs in the background, captures durable knowledge without being asked, links new context to existing notes, and surfaces patterns the user hasn't noticed yet.

## Key Decisions

- 2026-04-05: Set up Claude Code with autopilot, token efficiency, second brain architecture
- 2026-04-13: Vendored UI/UX Pro Max design bundle (7 skills) — Claude can now do world-class UI/UX
- 2026-04-13: Cherry-pick vendored oh-my-claudecode (19 agents, 33 skills) — multi-agent orchestration available
- 2026-04-15: Repurposed vault from generic corporate knowledge-worker template to solo-founder / M&A-bound operator
- See [[Key Decisions]] for full records

## Lessons Learned

- GitHub classic PATs need explicit `repo` scope — fine-grained tokens show "none"
- `gh auth login --web` times out fast — use `--with-token` instead
- Token-optimized context: only CLAUDE.md auto-loads (~450 tokens)
- Vendoring third-party skills into `.claude/skills/` works if they're self-contained; hook-dependent plugins need user-level install via `/plugin marketplace add`

## Systems Built

- [[CLAUDE|CLAUDE.md]] — Autopilot + efficiency + Second Brain Mandate
- [[North Star]] — Vision, goals, Q2 focus
- [[Skills]] — 46 skills + 28 agents registered and loaded
- [[M&A Playbook]] — 2029 vision mechanics
- [[Automation]] — Q2 buildout strategy
- [[Agent Orchestration Buildout]] — active Q2 project

## Businesses

- [[Restore Marketing Co]] — marketing company
- [[HP Landscaping]] — landscaping company, seasonal (Q2 is peak execution)

## Lookup Table

| Topic | Location |
|-------|----------|
| Goals & priorities | [[North Star]] |
| 2029 vision mechanics | [[M&A Playbook]] |
| Q2 automation strategy | [[Automation]] |
| Q2 active project | [[Agent Orchestration Buildout]] |
| Companies | [[Restore Marketing Co]], [[HP Landscaping]] |
| Key decisions | [[Key Decisions]] |
| Reusable patterns | [[Patterns]] |
| Debugging traps | [[Gotchas]] |
| Available skills/agents | [[Skills]] |
| Active work | work/active/ |
| Wins log | [[Brag Doc]] |
