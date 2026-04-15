---
date: 2026-04-15
description: Playbook for handling context window pressure — what to offload, what to compact, when to delegate, when to split sessions
tags: [brain, playbook]
---

# Playbook: Emergency Token Triage

**Portable playbook** — installed at user level by `scripts/sync-to-profile.sh`. Applies in any Claude Code session.

## Trigger

Context is filling up faster than expected (roughly: above 50% normal, 70% optimize, 80% compact, 90% mandatory action). Or a task is bigger than I estimated. Or I'm reading large files repeatedly.

## The principle

Context window is a public good. Every loaded file costs all subsequent operations. Token discipline is the difference between finishing a session and stalling halfway.

## Triage by pressure level

### 50%+ — Normal optimization

- **Grep before Read.** Don't load whole files when you need a single section.
- **Use head_limit and offset on Grep.** Tighten for confirmation-only searches.
- **Read with offset and limit** for known-location reads in big files.
- **Batch tool calls.** Independent calls go in one message.

### 70%+ — Aggressive optimization

- **Delegate to subagents.** Anything that requires reading 5+ files should go to an Explore agent or domain-specific subagent. Their context is separate.
- **Write intermediate results to disk.** Long agent reports go to a scratch file, then I read the file later instead of carrying the result in chat.
- **Drop reading anything I won't immediately use.** No "just in case" reads.
- **Stop using Bash for things with dedicated tools** — Read instead of cat, Grep instead of grep, Glob instead of find. Bash output accumulates.

### 80%+ — Compaction territory

- **Run /compact** if the work has natural seams.
- **Finish the current atomic step**, then break and recommend a new session.
- **Write in-flight reasoning to a thinking note** BEFORE compacting — compaction loses scratch work.
- **Update todos** so a fresh session can pick up cleanly.

### 90%+ — Mandatory action

- **Stop adding new context.** No more reads, no more agent calls.
- **Write any in-progress reasoning to a scratch file** so it survives.
- **Tell the user** I need to wrap or split the session.
- **Recommend a clean wrap** to end with state preserved.

## Offload patterns (what to push out of context)

| Type of content | Where it goes |
|-----------------|---------------|
| Long Slack/transcript reconstructions | Scratch file via specialized agent |
| Multi-file research findings | Explore agent's report, written to disk |
| Audit reports | Agent writes to disk |
| Draft prose | Scratch file |

## Inputs that don't justify their cost

- Reading a whole 2000-line file when you need 30 lines → use Read with offset/limit
- Loading template files repeatedly → read once, keep in context
- Re-reading project memory/instructions mid-session — it's already loaded
- Reading files "to see what's there" → use Glob/Grep instead

## Done when

- Pressure level is back to acceptable, OR
- Session has been wrapped and a fresh one continues the work, OR
- The user has been told the trade-offs and approved a compact

## Anti-patterns

- Reading 10 files and then deciding which to use — decide first, read second
- Letting agents dump huge outputs into chat — make them write to disk
- Pretending nothing is wrong and hitting hard limits mid-task
