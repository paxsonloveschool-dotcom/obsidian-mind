---
date: 2026-04-13
description: Playbook for creating a person note — minimum viable stub vs full profile, when to invoke the people-profiler agent
tags: [brain, playbook]
type: brain
---

# Playbook: Onboard Person

## Trigger

A person is mentioned who has no `org/people/<Name>.md` note. Often happens during incident capture, 1:1 capture, or PR analysis.

## Inputs

- Full name (preferred) or first name + context to disambiguate
- Optional: title, team, Slack handle, GitHub handle

## Steps

### Stub mode (default — fast)

When you just need a wikilink target so a note isn't orphaned:

1. **Create file** at `org/people/<Full Name>.md`.
2. **Minimal frontmatter**:
   - `date:` today
   - `description:` "Person note for <Name>"
   - `title:` if known, else "unknown"
   - `team:` if known
   - `tags: [person]`
3. **Minimal body**:
   ```markdown
   # <Full Name>
   
   ## Role & Team
   - Title: <unknown or known>
   - Team: <[[org/teams/<Team>]] or unknown>
   
   ## Relationship
   - First captured: <YYYY-MM-DD> via [[<source note>]]
   
   ## Key Moments
   - 
   
   ## Notes
   - 
   ```
4. **Update `org/People & Context.md`** — add to the appropriate section (team, function, etc.).

### Full profile mode

When the user explicitly asks to "profile" or "look up" someone, OR when several people need notes at once:

1. **Invoke `people-profiler` subagent** — it pulls Slack profiles in bulk, checks vault for existing notes, creates missing ones with full data, and updates the `org/People & Context.md` index.
2. **Verify output** — agents can hallucinate; spot-check at least one note.
3. **Cross-link** — if any of the people are in active work notes or 1:1s, ensure those notes link back.

## Outputs

- `org/people/<Full Name>.md` — at minimum a stub, ideally a full profile
- Updated `org/People & Context.md`
- Possibly `org/teams/<Team>.md` if a new team was discovered

## Linking checklist

- [ ] Person note links to their team (if known)
- [ ] `org/People & Context.md` lists them
- [ ] The note that triggered this onboarding now has a working `[[Person]]` link
- [ ] If they appear in any other notes, those backlinks resolve

## Done when

- File exists with at minimum the four sections (Role, Relationship, Key Moments, Notes)
- People & Context index reflects them
- Frontmatter has `title:` set (even if "unknown")

## Stub vs full profile — when to use which

- **Stub**: when you just need to avoid a broken wikilink. Fast, low-context.
- **Full**: when the person is becoming central (recurring 1:1, project collaborator, review subject). Use the agent.

## Anti-patterns

- Creating person notes with first names only — collisions guaranteed
- Skipping the team link — kills graph navigation
- Profiling in main context when you could delegate to people-profiler — wastes tokens

## Related

- [[Capture 1-1]]
- [[Capture Incident]]
- [[../../.claude/agents/people-profiler]]
