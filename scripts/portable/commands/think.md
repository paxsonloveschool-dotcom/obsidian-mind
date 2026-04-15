---
description: "Scaffold a thinking note for structured reasoning. Creates a properly-framed scratchpad that's easy to promote later."
---

# Think — Scaffold a Thinking Note

Create a thinking note with proper structure. Thinking notes are scratchpads — this command makes them consistent so they're easy to promote into durable notes/docs later.

This is the **portable** version installed at user level by `scripts/sync-to-profile.sh`. The source of truth is the `obsidian-mind` vault.

## Usage

```
/think <topic>                    # quick start
/think <topic> for <context>      # with context link
/think                            # interactive
```

Examples:
- `/think auth migration trade-offs`
- `/think how to structure this module`
- `/think debugging the flaky test`

## The principle

A thinking note is not storage — it's a tool for reasoning. The shape matters:
- **Question / Problem** up front forces you to state what you're trying to figure out
- **Analysis** is where the messy work happens
- **Conclusions** is what survives
- **Next Steps** is what you do with the conclusions

If a thinking note has been sitting without movement for more than ~7 days, promote it to a durable location or delete it.

## Workflow

### 1. Parse the Topic

Parse the argument:
- If empty → ask the user what they want to think about
- If a topic is given → use it as the note title
- If `for <context>` is present → extract it as a link target

### 2. Determine the Filename

Use `thinking/YYYY-MM-DD-<slug>.md` where:
- `YYYY-MM-DD` is today's date
- `<slug>` is the topic kebab-cased, max 40 chars

If a file with the same name already exists today, suffix with `-2`, `-3`, etc.

If `thinking/` doesn't exist in the current project, create it. It's a universal pattern.

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

<What are you trying to figure out? One or two sentences. Be precise — vague questions produce vague thinking.>

## Context

<What's the situation? What's already known? What was tried? Link anything relevant.>

## Analysis

<Room to reason. Bullets, paragraphs, tables, whatever works. Don't censor — this is the scratchpad.>

### Option A

### Option B

### Trade-offs

## Conclusions

<What have you decided, or what's clearer now? This is what will survive if this note gets promoted.>

## Next Steps

- [ ] <What to do with this conclusion>
- [ ] <When to revisit>

## Feeds Into

*References to what this thinking will inform.*

- <related path, file, or concept>

---

*Remember: this is a scratchpad. Once conclusions are durable, promote them to a durable location and delete this note.*
```

### 4. Report

Tell the user:
- The filename created
- The question as phrased in the note
- A reminder: "Once conclusions are clear, promote them to a durable home and delete this note."

## Important

- **Don't fill in the Analysis section.** That's the user's job. You just scaffold.
- **Don't create a thinking note for a one-sentence thought.** If it's that small, write it directly where it belongs.
- **Use today's date**, not a date the user mentions. Thinking notes are time-stamped to when reasoning happened.

Topic:
$ARGUMENTS
