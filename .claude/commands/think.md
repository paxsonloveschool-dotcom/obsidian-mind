---
description: "Scaffold a thinking note for structured reasoning. Creates a properly-framed scratchpad that's easy to promote later."
---

# Think — Scaffold a Thinking Note

Create a thinking note in `thinking/` with proper frontmatter, standard sections, and a clear question to reason about. Thinking notes are scratchpads — this command makes them consistent so promotion later ([[../../brain/playbooks/Promote Thinking]]) is clean.

## Usage

```
/think <topic>                    # quick start with a topic
/think <topic> for <context>      # link to context (project, person, decision)
/think                            # interactive — will ask for topic
```

Examples:
- `/think auth migration trade-offs`
- `/think how to structure the brain folder for this vault`
- `/think debugging the incident timeline gaps for INC-1234`

## The principle

A thinking note is not storage — it's a tool for reasoning. The shape matters:
- **Question / Problem** up front forces you to state what you're trying to figure out
- **Analysis** is where the messy work happens
- **Conclusions** is what survives promotion
- **Next Steps** is what you do with the conclusions
- **Feeds Into** is the wikilink web so the thinking doesn't float unattached

If a thinking note has been sitting more than 7 days without movement, it should be promoted or deleted. `/wrap-up` and the Stop hook flag stale thinking notes.

## Workflow

### 1. Parse the Topic

Parse `$ARGUMENTS`:
- If empty → ask the user what they want to think about
- If a topic is given → use it as the note title
- If `for <context>` is present → extract it as a link target

### 2. Determine the Filename

Use `thinking/YYYY-MM-DD-<slug>.md` where:
- `YYYY-MM-DD` is today's date
- `<slug>` is the topic kebab-cased, max 40 chars

Example: `thinking/2026-04-15-auth-migration-tradeoffs.md`

If a file with the same name already exists today, suffix with `-2`, `-3`, etc.

### 3. Write the Note

Use this structure:

```markdown
---
date: YYYY-MM-DD
description: <~150 chars — what question this note is trying to answer>
context: <optional: project or topic this feeds into>
tags: [thinking]
---

# <Title>

## Question / Problem

<What are you actually trying to figure out? One or two sentences. Be precise — vague questions produce vague thinking.>

## Context

<What's the situation that makes this question worth asking? What's already known? What was tried? Link anything relevant.>

## Analysis

<Room to reason. Bullet points, paragraphs, tables, whatever works. Don't censor — this is the scratchpad.>

### Option A

### Option B

### Trade-offs

## Conclusions

<What have you decided, or what's clearer now? This is what will promote to a durable note if it survives.>

## Next Steps

- [ ] <What to do with this conclusion>
- [ ] <When to revisit>

## Feeds Into

*Wikilinks to what this thinking will inform — a decision record, work note, playbook, brain topic, etc.*

- [[<relevant note>]]

## Promote To

*When this note has conclusions, promote them to:*

- [ ] <proposed durable destination> (e.g. `work/active/<project>` or `brain/Patterns.md`)

---

*Remember: this is a scratchpad. Once conclusions are durable, [[../brain/playbooks/Promote Thinking|promote them]] and delete this note.*
```

### 4. Link the Context

If a context was given (`for <context>`), add a wikilink to it in the "Context" section and the "Feeds Into" section.

### 5. Write the File

Use the Write tool to create `thinking/<filename>.md` with the structured content above (with `<Title>` replaced, frontmatter dates filled, and any context links inserted).

### 6. Report

Tell the user:
- The filename created
- The question as phrased in the note
- The suggested "Feeds Into" destinations
- A reminder: "Run /promote <filename> when you have conclusions, or /wrap-up will flag it if it goes stale."

## Important

- **Don't fill in the Analysis section.** That's the user's job. You just scaffold.
- **Don't create a thinking note for a one-sentence thought.** If it's that small, it belongs as an append to an existing note.
- **Don't create a thinking note when a work note is the right home.** Thinking is for open questions; work notes are for active project state.
- **Set `context:` in frontmatter when you know it.** This makes promotion easier.
- **Use today's date, not the user's specified date.** Thinking notes are time-stamped to when reasoning happened.

## Related

- [[../../brain/playbooks/Promote Thinking]] — how to graduate thinking notes
- [[../../brain/Patterns]] — the thinking-notes-are-scratchpads principle
- [[../../templates/Thinking Note]] — the underlying template

Topic:
$ARGUMENTS
