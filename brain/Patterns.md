---
date: 2026-04-13
description: Reusable patterns for working in this vault and with Claude Code — graph thinking, atomicity, token discipline, and execution patterns
tags: [brain, patterns]
type: brain
---

# Patterns

## Graph-First Thinking

- **Folders group by purpose, links group by meaning.** A note has ONE folder home but MANY link contexts.
- **A note without links is a bug.** Every new note must link to at least one existing note before it counts as "created".
- **Bidirectional by default**, exceptions for concept nodes. If A links to B, B should usually link back. Concept nodes (competencies, definitions) are the exception — they receive backlinks passively.
- **Before creating a subfolder, ask: can a tag, property, or link solve this instead?** Folders are browsing convenience, not categorization.
- **Verify orphans after every substantive session.** Orphans are bugs that compound silently.

## Node Roles in the Graph

Every note has a role that determines how it should link:

| Role | Examples | Linking behavior |
|------|----------|------------------|
| **Evidence** | Work notes, 1:1s, PR analyses, incident reports | Many outbound links to concepts they demonstrate |
| **Concept** | Competencies, patterns, decisions, definitions | Stay clean; receive inbound links passively |
| **Index** | `Home.md`, `work/Index.md`, `Brag Doc`, `Memories`, `People & Context` | Curated outbound links — they ARE the navigation |
| **Person** | `org/people/<Name>.md` | Bidirectional with their work notes, 1:1s, evidence |
| **Team** | `org/teams/<Team>.md` | Bidirectional with members and team work notes |
| **Brain** | Topic notes in `brain/` | Mix — outbound for related topics, inbound from anything teaching the lesson |

## Atomicity

- **One note per distinct concept.** Before writing or appending, ask: "Does this cover multiple things that could be separate nodes?" If yes, split.
- **Threshold**: 3+ independent sections that don't need each other to make sense → split into atomic notes that link.
- **Atomic notes age better.** Monoliths become impossible to update without touching unrelated content.
- **Atomic notes are reusable as link targets.** A monolith can only be linked once; atoms can be linked from many contexts.

## Linking Discipline

- **Add wikilinks FIRST, after writing content.** Not last, not "later". First.
- **Use aliases when display text differs**: `[[Note Title|display text]]`.
- **Use deep links for sections**: `[[Note Title#Heading]]`.
- **Use embeds sparingly**: `![[Note Title]]` inlines the whole thing — only when the embedded content is the point.
- **Don't link the same note 5 times in one paragraph.** Once is enough.

## Token Discipline

- **Progressive disclosure**: metadata always → body on trigger → resources on demand.
- **Context window is a public good.** Every loaded file costs all subsequent operations.
- **Challenge each paragraph: "Does this justify its token cost?"**
- **Grep before Read.** Only load what you need.
- **Batch independent tool calls** into a single parallel message.
- **Use subagents for parallel work** — their context is separate from main.
- **Offload to disk**: agents write reports to files, the next operation reads the file rather than carrying the result in chat.
- **`disable-model-invocation: true`** for deterministic operations (git, file moves) where reasoning is unnecessary.

## Context Pressure Levels

| Level | Action |
|-------|--------|
| < 50% | Normal operation |
| 50%+ | Optimize: grep before read, batch calls, tighten head_limit |
| 70%+ | Aggressive: delegate to agents, write intermediate results to disk |
| 80%+ | Compaction territory: finish atomic step, run `/compact`, recommend session split |
| 90%+ | Mandatory: stop new context, save in-flight work to thinking notes, wrap |

See [[playbooks/Emergency Token Triage]] for the full playbook.

## Workflow Patterns

- **Two-part execution**: Research & Plan → Execute & Verify. Don't blend them.
- **Parallel quality gates**: validator + tester simultaneously when independent (~40% faster than serial).
- **Version-first**: determine version/state before doing work, not during.
- **Thinking notes are scratchpads, not storage.** Reasoning happens there; durable knowledge moves out.
- **Index updates are part of "done"**, not an afterthought.

## Vault-Specific Patterns

### The Stub-First Pattern

When you need a wikilink but the target doesn't exist yet, create a minimal stub first, then write the calling note. Stubs prevent broken links AND give the target note a place to grow.

### The Promotion Pattern

Thinking notes → atomic notes → indexes → backlinks → graph navigation. Knowledge flows from rough to durable. Reverse flow (promoted note → thinking) is rare and usually a smell.

### The Three-Note Incident Pattern

Serious incidents get a main note (high-level summary, the durable artifact), an RCA note (technical depth), and a deep dive (full reconstruction). For minor incidents, just the main note. This separates "what happened" from "why it happened" from "the entire transcript".

### The Evidence-Concept Loop

Work notes (evidence) link to competencies (concepts). The competency note never edits itself — it just receives backlinks. When reviewing evidence for a competency, you read its backlinks panel. This means the harder you work, the richer your competency notes get automatically.

### The Quarter Property Convention

Work notes and incidents need `quarter: Q<n>-YYYY` in frontmatter. This is what the Work Dashboard base depends on. Forgetting it makes the note invisible to dashboards. Always set it.

### The Bidirectional 1:1 Pattern

A 1:1 note links to the person; the person note has a "Recent 1:1s" section that links back. Both directions matter — the person note shows the relationship arc, the 1:1 note shows the meeting.

### The Don't-Mix-Contexts Rule

When capturing from Slack/DMs/meetings: project evidence → work note. Review prep → perf folder. People dynamics → person note. Personal stuff → skip unless review-relevant. Mixing these is the most common capture mistake.

## Anti-Patterns

- **Writing notes without templates.** Templates encode schema; freehand drifts.
- **Creating monoliths instead of atomic notes.**
- **Skipping `[[wikilinks]]` "to add later".** "Later" doesn't come.
- **Promoting verbatim** from thinking notes — they're rough on purpose, polish before promoting.
- **Reading 10 files before deciding which to use.** Decide first, read second.
- **Letting agents dump huge outputs into chat.** Make them write to disk.
- **Mixing folders by topic instead of by purpose.** Topic is a tag/link concern.
- **Building features the user didn't ask for.** Add what's needed; resist adornment.

## Related

- [[Gotchas]]
- [[Key Decisions]]
- [[Workflows]]
- [[Capabilities]]
- [[playbooks/README|Playbooks index]]
