---
date: 2026-04-13
description: Playbook for finding and adding missing wikilinks — bidirectional discipline, atomic vs index nodes, when to invoke cross-linker
tags: [brain, playbook]
type: brain
---

# Playbook: Find Missing Links

## Trigger

A note feels orphaned. Or `/vault-audit` flagged it. Or you just wrote a note and need to wire it into the graph. Or the user runs `/connect`.

## The principle

Folders are for browsing. Links are for discovery. Every note must have at least one inbound link (or it's invisible) and at least one outbound link (or it's a dead end). Bidirectional links are preferred.

## Inputs

- The note in question (or a set of recent notes)
- Vault context (which other notes might reference it)

## Steps

1. **Scan the body for mentions** that should be wikilinks but aren't:
   - Person names → `[[org/people/<Name>]]`
   - Team names → `[[org/teams/<Team>]]`
   - Project names → `[[work/active/<Project>]]` or archive equivalent
   - Competency names → `[[perf/competencies/<Competency>]]`
   - Decision names → `[[<Decision Record>]]`
   - Concepts/patterns → `[[brain/Patterns#<heading>]]` or similar
2. **Search for backlink opportunities** — use the Grep tool to find other notes that mention this note's subject. Each hit is a potential inbound link.
3. **Use `obsidian backlinks file="<Note>"`** if Obsidian is running — it shows the existing backlinks; the gap is what's missing.
4. **For bulk work, invoke `cross-linker` subagent** — it scans recent notes for missing wikilinks across people, projects, teams, competencies, and incidents. Use this when more than ~3 notes need linking.
5. **Apply the role rules** when adding links:
   - **Evidence nodes** (work notes, 1:1s, PR analyses): add OUTBOUND links to concepts they demonstrate
   - **Concept nodes** (competencies, patterns, decisions): stay definitional — they receive INBOUND links passively, don't crowd them with outbound
   - **Index nodes** (Index.md, Brag Doc, People & Context, Memories): actively curate links — they ARE the navigation
   - **Person nodes**: bidirectional with their work notes, 1:1s, evidence
6. **Verify** — re-run the validate hook by opening/saving the note. If it still warns about no wikilinks, the linking failed.

## Outputs

- Updated note(s) with new wikilinks
- Possibly updated index notes if discoveries warranted

## Linking checklist

- [ ] At least one outbound wikilink (orphan = bug)
- [ ] At least one inbound link from somewhere (verify with backlinks)
- [ ] Bidirectional where appropriate (evidence ↔ concept is one-way; evidence ↔ evidence is bidirectional)
- [ ] No broken links (target notes exist)

## Done when

- Validate hook passes silently
- Backlinks panel shows at least one inbound link
- Mentioned entities are all linked

## Heuristics

- **Threshold for link-worthy**: if you'd want to find this note from that subject, link it.
- **Density**: a 500-word note with 0 links is broken. With 10+ links is bloated.
- **When in doubt, invoke cross-linker** — its job is exactly this.

## Anti-patterns

- Linking the same note 5 times in one paragraph — once is enough
- Adding outbound links to concept notes — they should stay clean and receive backlinks
- Linking to non-existent targets — create the stub first ([[Onboard Person]] for people)
- Forgetting that aliased links work: `[[Note Title|display text]]`

## Related

- [[Promote Thinking]]
- [[Run Vault Audit]]
- [[../../.claude/agents/cross-linker]]
- [[../Patterns]] (graph-first, evidence vs concept nodes)
