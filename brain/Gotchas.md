---
date: 2026-04-13
description: Known pitfalls — vault conventions, Obsidian quirks, Claude Code behaviors, GitHub auth, hooks, and validation gotchas
tags: [brain, gotchas]
type: brain
---

# Gotchas

## Vault Frontmatter

- **Work notes need `quarter: Q<n>-YYYY`.** Without it, the Work Dashboard base does not show the note. Easy to forget; verify after every work note creation.
- **Incidents need `ticket:`, `severity:`, and `role:`.** All three are required by the Incidents base. A missing field doesn't error — the note just disappears from the dashboard.
- **People notes need `title:` even if "unknown".** The People Directory base filters on it.
- **1:1 notes need `person:` AND `quarter:`.** The 1-1 History base joins on `person`.
- **Description must be filled.** Empty `description:` triggers the validate hook warning. ~150 chars is the convention.
- **`date:` is detection date for incidents**, not today. Backfilled notes need the original date or the timeline lies.

## Vault Linking

- **Orphan = bug.** A note longer than ~300 chars with no `[[wikilinks]]` triggers the validate hook warning. Add at least one outbound link.
- **Wikilinks resolve by note name, not path.** `[[Project X]]` works whether it's in `work/active/` or `work/archive/2026/`. This is why `git mv` for archiving doesn't break links.
- **Person/team links must exist as files.** A `[[John Smith]]` link with no `org/people/John Smith.md` is a broken link — create a stub via [[playbooks/Onboard Person]].
- **Concept nodes should not be over-linked.** Competency notes, decision records, pattern notes — these are clean and receive backlinks. Don't crowd them with outbound links.

## Vault Folder Discipline

- **No user notes at vault root.** Root is reserved for `Home.md`, `CLAUDE.md`, `vault-manifest.json`, `CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`, `LICENSE`, `.gitignore`. Anything else goes in a folder.
- **`work/active/` should hold 1-3 things.** If it grows past that, archive completed projects ([[playbooks/Archive Project]]).
- **`thinking/` is scratch, not storage.** Promote findings ([[playbooks/Promote Thinking]]) and delete the scratch note.
- **Templates live in `templates/`**, never inlined into other folders. Always use them via the Template plugin or by reading and adapting.

## Validation Hook Behavior

- The PostToolUse hook (`validate-write.py`) skips: `.claude/`, `.obsidian/`, `templates/`, `thinking/`, and root files (`README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CLAUDE.md`).
- It checks frontmatter for `date`, `description`, `tags`.
- It checks for `[[wikilinks]]` in any file > 300 chars.
- Warnings come back as `additionalContext` — read them and fix before moving on.
- It does NOT check type-specific frontmatter (quarter, ticket, severity) — that's on you.

## Classify-Message Hook

- Fires on every UserPromptSubmit.
- Matches whole words/phrases, not substrings — "decided" matches but "decideds" does not.
- Returns routing hints in `additionalContext`. They are suggestions, not commands.
- Multiple signals can fire on one message. Handle each.

## Obsidian CLI

- **CLI requires Obsidian to be running.** If it's not, fall back to filesystem.
- **`file=` resolves like a wikilink** (by name, no extension). **`path=` is exact from vault root.** Don't mix them.
- **Use `silent` on creates** to avoid opening every new file in the active pane.
- **`obsidian backlinks file="X"`** is the easiest way to check inbound link health.

## Bases

- **Bases need exact frontmatter property names.** Typos in `quarter` vs `quater` make the whole row vanish silently.
- **Bases queries are not stored in markdown** — they're in `.base` files in `bases/`. Edit there, not in notes.
- **Date filters are inclusive on both ends** for `quarter:` style properties.

## Templates

- **Filling `{{placeholders}}`** is required — Obsidian doesn't auto-substitute when Claude creates files via the Write tool.
- **`templates/Work Note.md` has no `quarter:` field by default.** Add it manually when using the template — this is one of the most common bugs.
- **`templates/Decision Record.md` starts with `status: proposed`.** Flip to `accepted` once the decision is committed.

## Subagent Behavior

- **Agents have separate context windows.** They do NOT see the conversation. Their prompt must be self-contained.
- **Agents should write reports to files**, not return huge results. Read the file from main context.
- **`Explore` agent is best for open-ended search.** Use `Grep`/`Glob` directly for known targets — agents are slower.
- **Don't duplicate agent work.** If you delegated a search, don't also do it yourself.
- **Specialized agents have specific triggers.** Use `slack-archaeologist` for Slack, `people-profiler` for bulk person notes, `vault-librarian` for audits, `cross-linker` for missing links.

## GitHub

- **Classic PATs need explicit `repo` scope checkbox.**
- **Fine-grained tokens show "none" for classic scopes** — misleading; check actual permissions.
- **`gh auth login --web` times out in ~2min** — use `--with-token`.
- **No SSH keys on this machine** — always HTTPS for git remotes.
- **GitHub MCP tools are restricted to one repo here.** Calls to other repos will be denied.

## Claude Code Specifics

- **`.claudeignore` blocks**: `sessions/`, `backups/`, `shell-snapshots/`. Don't try to read those paths.
- **Only `CLAUDE.md` auto-loads** at session start (~450 tokens). Other context comes from the SessionStart hook.
- **`Write` tool requires `Read` first** on existing files. Will error otherwise.
- **`Edit` tool requires exact string match** including indentation. Use `Read` first to see actual whitespace.
- **`Edit` will fail if `old_string` is not unique.** Add more surrounding context, or use `replace_all` for global rename.

## Bash Hygiene

- **Use dedicated tools, not `cat`/`head`/`tail`/`sed`/`awk`/`echo`/`find`/`grep`.** Bash should be reserved for actual shell operations.
- **Avoid `git add .` and `git add -A`.** They risk staging secrets and large binaries. Add files explicitly.
- **Never `--no-verify`** unless explicitly authorized — pre-commit hooks exist for a reason.
- **Don't `cd` if you can use absolute paths.** Working directory state matters across calls.

## Slack/Calendar/Gmail MCPs (when available)

- **Tools are deferred** — they show up as names but need ToolSearch to load schemas before calling.
- **Slack reconstructions belong to `slack-archaeologist`**, not main context — they bloat fast.
- **Calendar/Gmail tools** are powerful but read-only by default. Don't create events or send drafts without explicit user request.

## Performance Reviews

- **Review briefs are private**: `perf/<cycle>/` is for drafts. Anything user-facing gets explicit promotion.
- **Don't mix self-review and peer-review prep** in the same note. Separate files.
- **Fact-check before sending.** Use `review-fact-checker` agent on any review draft.

## Memory System

- **Never create files in `~/.claude/projects/.../memory/` beyond `MEMORY.md`.** They are not git-tracked. All memory lives in `brain/` topic notes.
- **The `MEMORY.md` is an index only**, not storage. It points at vault locations.

## Common One-Time Gotchas (still in the corpus)

- `.claudeignore` blocks: sessions/, backups/, shell-snapshots/
- `gh` CLI on Windows: `export PATH="/c/Program Files/GitHub CLI:$PATH"`

## Related

- [[Patterns]]
- [[Workflows]]
- [[playbooks/README|Playbooks]]
- [[Skills]]
