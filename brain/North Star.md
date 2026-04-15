---
date: 2026-04-15
description: Living goals document — vision, annual goals, current focus, active projects, principles, anti-goals. Read at every session start.
tags: [north-star, goals, brain]
type: brain
---

# North Star

> **Purpose**: This is the single source of truth for what matters right now. Claude reads it at every session start and references it when suggesting priorities or trade-offs. Both the user and Claude write to it. Keep it living — update when focus shifts.

## Vision (3-Year)

*What does success look like by 2029? Think outcomes, not activities.*

- [ ] **TODO**: Define your 3-year vision
  - Example formats: "I want to be the go-to X at my company for Y" / "I want to have built and shipped Z" / "I want to have transitioned from IC to lead"
  - Anchor it in identity ("the kind of engineer who...") not titles
  - One sentence is enough

## Annual Goals (2026)

*What does a successful year look like?*

- [ ] **TODO**: Define 2026 goals (3-5 max, each measurable)
  - Example: "Ship the X migration end-to-end" / "Get promoted to L5" / "Present at 2 conferences" / "Reduce on-call pages by 50%"
  - Each goal should ladder up to the 3-year vision
  - Put dates if relevant

## Current Quarter Focus (Q2 2026)

*What are you heads-down on for the next 3 months?*

- [ ] **TODO**: Define Q2 2026 priorities (1-3 max)
  - These should be the things that, if done, make this the most productive quarter of the year
  - Anything that isn't one of these is lower priority by default
  - Link active projects: `[[work/active/<project>]]`

## Active Projects

*What's actually in flight right now? Should match `work/active/` contents.*

- None yet — create a work note in `work/active/` and link it here
- Run `/standup` each morning to surface current state

## Principles

*How you operate — the non-negotiables that shape decisions.*

- Act with urgency
- Build systems, not just solutions
- Automate the repetitive
- Graph-first: every note links somewhere
- Atomic over monolithic
- Evidence over assertion

## Anti-Goals

*What you explicitly don't want to do — the tempting traps.*

- Perfectionism over progress
- Manual work that can be automated
- Context-mixing (projects, review prep, and personal talk all in one note)
- Building features nobody asked for
- Backwards-compatibility hacks when a clean break is possible
- Orphan notes (a note without links is a bug)

## How This Note Gets Updated

| Trigger | Who | What |
|---------|-----|------|
| User signals a focus shift ("I'm pivoting to X") | Claude | Update Current Quarter Focus |
| New project in `work/active/` | Claude | Add to Active Projects with wikilink |
| Project archived | Claude | Remove from Active Projects |
| Quarter rolls over | User + Claude | Replace Current Quarter Focus, review Annual Goals |
| Year rolls over | User | Replace Annual Goals, review Vision |
| User says "update North Star with X" | Claude | Do it |

## Cross-Links

- [[Memories]] — index of operational memory
- [[Capabilities]] — what Claude can do to help you hit these goals
- [[Workflows]] — how the vault operations ladder up to goal progress
- [[../work/Index]] — active project tracker
- [[../perf/Brag Doc]] — wins against these goals

## How to Fill This In

When you're ready:

1. Tell Claude "help me fill in North Star" — Claude will ask structured questions
2. Or just edit this file directly — the TODOs are placeholders
3. Or paste a brain-dump of goals and run `/dump` — Claude will structure it into this file

The goal isn't polish. It's clarity about what matters right now so every other decision has a reference point.
