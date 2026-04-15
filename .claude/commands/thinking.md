---
description: "Thinking scratchpad workflow. Start a reasoning note for a topic, then promote durable findings to atomic notes and delete the scratchpad. Operates in two modes based on arguments."
---

Thinking scratchpad helper. `thinking/` notes are reasoning space, not storage — once a scratchpad has produced durable knowledge, promote it to atomic notes and delete the original.

Choose mode based on `$ARGUMENTS`:

- Starts with `promote` → **Mode 2: Promote**
- Anything else (or empty) → **Mode 1: Start**

## Mode 1: Start — create a scratchpad for `$ARGUMENTS`

If `$ARGUMENTS` is empty, ask the user for a topic before proceeding.

1. **Generate the filename**: `thinking/YYYY-MM-DD-<slug>.md` where `<slug>` is a short kebab-case version of the topic (e.g., `auth-refactor-tradeoffs`). Use today's date.
2. **Check for an existing scratchpad** on the same topic (search `thinking/` by slug and recent date). If one exists, ask whether to append or start fresh.
3. **Create the note** using `templates/Thinking Note.md` with frontmatter filled in:
   - `date: "YYYY-MM-DD"` (today)
   - `description:` ~150 chars stating the question being reasoned through
   - `context:` one line — why this is being thought about now (trigger, meeting, incident, etc.)
   - `tags: [thinking]`
   - H1: human-readable topic title
4. **Seed the Analysis section**: run `qmd vsearch "<topic>"` (fall back to `obsidian search` or Grep if QMD is unavailable) and paste the top 3-5 related vault notes as wikilinks under a `### Related vault context` subheading so reasoning starts grounded.
5. **Leave empty** for the user: Conclusions, Next Steps, Feeds Into.
6. **Report to the user**:
   - Path of the new scratchpad
   - Which related notes were seeded
   - Reminder: "When you're done reasoning, run `/thinking promote` to turn conclusions into atomic notes and delete the scratchpad."

## Mode 2: Promote — extract findings from a scratchpad, then delete it

Arguments:
- `/thinking promote` — promote the most recent `thinking/*.md`
- `/thinking promote <filename>` — promote a specific scratchpad

Steps:

1. **Locate the target**. If no filename given, list `thinking/*.md` sorted by mtime, pick the most recent, and show the user which file you're about to promote. Confirm before continuing.
2. **Read the scratchpad**. Identify durable knowledge in the **Conclusions** and **Next Steps** sections.
3. **Stop if the scratchpad is thin**. If Conclusions is empty, unchanged from the template, or clearly incomplete, do NOT promote. Tell the user the note needs more work and stop.
4. **Split atomically**. For each distinct concept in Conclusions (atomicity rule from CLAUDE.md: 3+ independent sections = separate notes), route to the correct folder:
   - Decision → `work/active/` using `templates/Decision Record.md`
   - New pattern → append to `brain/Patterns.md`
   - New gotcha → append to `brain/Gotchas.md`
   - Key decision worth remembering → append to `brain/Key Decisions.md`
   - Work plan → `work/active/` using `templates/Work Note.md`
   - Person insight → appropriate `org/people/` note
   - Claude operational knowledge → appropriate `brain/` topic note
5. **Link everything**. Each promoted note gets:
   - Full frontmatter with `date`, `description`, `tags`
   - Wikilinks to notes mentioned in the scratchpad's Analysis section
   - A back-reference to the **triggering context** (incident, work note, 1:1) — NOT to the scratchpad itself, since the scratchpad is about to be deleted
6. **Flag conflicts**. Before promoting, check each finding against existing brain notes. If a promoted conclusion contradicts an existing pattern/decision/gotcha, stop and surface the conflict to the user. Do not silently overwrite.
7. **Present summary and ask to delete**:
   - Table: `Promoted finding` | `Destination path` | `Created/Appended`
   - Explicit question: "Delete `thinking/<file>`? (yes/no)"
   - **Only delete on explicit `yes`**. Use `git rm` so the deletion is tracked.
8. **Update indexes** as needed per CLAUDE.md (work/Index.md, brain/Memories.md, etc.).

## Rules

- **Never delete a scratchpad without explicit user confirmation.**
- **Never promote conclusions that contradict existing brain notes** without flagging the conflict first.
- **Atomicity over monoliths**: one promoted note per distinct concept.
- If the user's reasoning process itself is unusual and worth preserving (rare), offer to keep the scratchpad and add it to `thinking/` as a permanent reference — but default is to delete.

Topic or command: $ARGUMENTS
