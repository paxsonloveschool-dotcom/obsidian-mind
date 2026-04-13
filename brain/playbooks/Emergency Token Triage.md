---
date: 2026-04-13
description: Playbook for handling context window pressure — what to offload, what to compact, when to delegate, when to split sessions
tags: [brain, playbook]
type: brain
---

# Playbook: Emergency Token Triage

## Trigger

Context is filling up faster than expected (roughly: above 50% normal, 70% optimize, 80% compact, 90% mandatory action). Or a task is bigger than I estimated. Or I'm reading large files repeatedly.

## The principle

Context window is a public good. Every loaded file costs all subsequent operations. Token discipline is the difference between finishing a session and stalling halfway. From [[../Patterns#Token Saving]]: "Challenge each paragraph: does this justify its token cost?"

## Inputs

- Awareness of the current pressure level
- The task in flight

## Triage by pressure level

### 50%+ — Normal optimization

- **Grep before Read.** Don't load whole files when you need a single section.
- **Use head_limit and offset on Grep.** Default head_limit is 250 — tighten it for confirmation-only searches.
- **Read with offset and limit** for known-location reads in big files.
- **Batch tool calls.** Independent calls go in one message.

### 70%+ — Aggressive optimization

- **Delegate to subagents.** Anything that requires reading 5+ files should go to an Explore agent or a domain-specific subagent. Their context is separate.
- **Write intermediate results to disk.** Long agent reports go to `thinking/`, then I read the file later instead of carrying the result in chat.
- **Drop reading anything I won't immediately use.** No "just in case" reads.
- **Stop using Bash for things that have dedicated tools** — Read instead of cat, Grep instead of grep, Glob instead of find. Bash output accumulates.

### 80%+ — Compaction territory

- **Run /compact** if the work has natural seams.
- **Finish the current atomic step**, then break and recommend a new session.
- **Promote any thinking-in-flight** to vault notes BEFORE compacting — compaction loses scratch work.
- **Update todos** so a fresh session can pick up cleanly.

### 90%+ — Mandatory action

- **Stop adding new context.** No more reads, no more agent calls.
- **Write any in-progress reasoning to a thinking note** so it survives.
- **Tell the user** I need to wrap or split the session.
- **Recommend /wrap-up** to end cleanly with vault state preserved.

## Offload patterns (what to push out of context)

| Type of content | Where it goes |
|-----------------|---------------|
| Long Slack reconstructions | `thinking/<date>-slack-<topic>.md` via slack-archaeologist |
| Multi-file research findings | Explore agent's report, written to `thinking/` |
| PR analyses | `perf/evidence/<Person> PRs - <Period>.md` |
| Audit reports | vault-librarian writes to `thinking/` |
| Draft prose | `thinking/<date>-draft-<topic>.md` |

## Inputs that don't justify their cost

- Reading a whole 2000-line file when you need 30 lines → use Read with offset/limit
- Loading template files on every note creation → templates are small, but if you're creating many notes, batch
- Re-reading CLAUDE.md mid-session → it's already in context from session start
- Reading files "to see what's there" → use Glob/Grep instead

## Done when

- Pressure level is back to acceptable, OR
- Session has been wrapped and a fresh one continues the work, OR
- The user has been told the trade-offs and approved a compact

## Anti-patterns

- Reading 10 files and then deciding which to use — decide first, read second
- Letting agents dump huge outputs into chat — make them write to disk
- Loading personal data "for context" when the task is structural
- Pretending nothing is wrong and hitting hard limits mid-task

## Related

- [[../Patterns]] (token saving)
- [[Run Vault Audit]]
- [[../../CLAUDE.md]]
