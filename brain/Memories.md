---
date: 2026-04-13
description: Memory index — top-level pointer into Claude's operational knowledge across brain/, playbooks/, and reference/
tags: [brain, memory, index, moc]
type: index
---

# Memories

This is the index for Claude's operational memory. The actual knowledge lives in topic notes — this file points at them.

## Operational Memory (brain/)

| Topic | Read when |
|-------|-----------|
| [[North Star]] | Every session start — current goals and priorities |
| [[Capabilities]] | Whenever picking a tool, command, or agent for a task |
| [[Workflows]] | When a task needs multi-step orchestration |
| [[Patterns]] | When designing a note, link, or process — encodes the "why" |
| [[Gotchas]] | When something is failing or behaving oddly |
| [[Key Decisions]] | When understanding the system's history |
| [[Skills]] | When looking up a vault command or workflow |

## Playbooks (brain/playbooks/)

Concrete step-by-step procedures. See [[playbooks/README]] for the index.

| Playbook | Trigger |
|----------|---------|
| [[playbooks/Create Work Note]] | Starting a project or capturing work |
| [[playbooks/Capture Decision]] | A decision needs durable recording |
| [[playbooks/Capture 1-1]] | Structuring a 1:1 meeting |
| [[playbooks/Capture Incident]] | Recording an outage |
| [[playbooks/Onboard Person]] | A person needs a vault note |
| [[playbooks/Promote Thinking]] | Moving thinking-note knowledge to durable notes |
| [[playbooks/Find Missing Links]] | Finding and adding missing wikilinks |
| [[playbooks/Archive Project]] | Completed project leaving active/ |
| [[playbooks/Run Vault Audit]] | Vault hygiene check |
| [[playbooks/Emergency Token Triage]] | Context window pressure |

## Structural Reference (reference/)

| Note | When to read |
|------|--------------|
| [[../reference/vault-architecture]] | Understanding how the vault is wired together |
| [[../reference/command-reference]] | Quick lookup for any slash command |
| [[../reference/agent-reference]] | Quick lookup for any subagent |

## Lookup Table

| Question | Answer location |
|----------|-----------------|
| What are my goals? | [[North Star]] |
| How do I do X in this vault? | [[Workflows]] or [[playbooks/README]] |
| What tools are available? | [[Capabilities]] |
| What's the design rationale? | [[Patterns]] |
| Why is this failing? | [[Gotchas]] |
| What slash commands exist? | [[../reference/command-reference]] |
| What subagents exist? | [[../reference/agent-reference]] |
| Where do I put X note? | CLAUDE.md "Where to Put Things" or [[../reference/vault-architecture]] |
| Active work? | `work/active/` and [[../work/Index]] |
| People context? | `org/people/` and [[../org/People & Context]] |
| Performance? | `perf/` and [[../perf/Brag Doc]] |

## Memory Discipline

- **All durable knowledge lives in `brain/` topic notes.** The `~/.claude/.../memory/MEMORY.md` is an auto-loaded index ONLY — never store content there.
- **Update topic notes, not this index**, when adding a memory. This index gets updated only when a new topic note is created.
- **Atomic memories beat monoliths.** A new pattern → append to [[Patterns]]. A new gotcha → append to [[Gotchas]]. A new procedure → new playbook in `playbooks/`.
- **Memory updates are part of session wrap-up**, not optional.

## Lessons Learned (legacy — being migrated to atomic notes)

- GitHub classic PATs need explicit `repo` scope — see [[Gotchas#GitHub]]
- `gh auth login --web` times out fast — see [[Gotchas#GitHub]]
- Token-optimized context: only CLAUDE.md auto-loads (~450 tokens) — see [[Gotchas#Claude Code Specifics]]

## Systems Built (legacy)

- CLAUDE.md — Autopilot + efficiency rules (vault root)
- [[North Star]] — Goals and priorities
- 15 slash commands, 9 subagents, 5 hooks, 7 bases, 5 templates
- 10 playbooks, 3 reference docs, 8 brain topic notes — see [[Capabilities]]

## Related

- [[Capabilities]]
- [[Patterns]]
- [[Workflows]]
- [[playbooks/README|Playbooks index]]
