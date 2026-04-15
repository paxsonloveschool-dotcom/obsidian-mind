---
date: 2026-04-13
description: Registry of vault skills, slash commands, and workflows — the index Claude scans when picking how to do a task
tags: [brain, skills]
type: brain
---

# Skills

Quick-scan registry of what's available. For depth, see the topic notes linked from each section.

## Vault Skills (loaded via `Skill` tool)

| Skill | Use for |
|-------|---------|
| `obsidian-markdown` | Always load before creating/editing `.md` files |
| `obsidian-cli` | Vault commands when Obsidian is running |
| `obsidian-bases` | Working with `.base` files |
| `json-canvas` | Working with `.canvas` files |
| `qmd` | Semantic search — preferred over Grep for content questions |
| `defuddle` | Extract clean markdown from web pages |

See [[Capabilities#Skills (load via `Skill` tool)]] for triggers.

## Slash Commands

20 total. Quick reference (full reference at [[../reference/command-reference]]):

**Daily**
- `/standup` — morning kickoff
- `/dump` — freeform capture
- `/wrap-up` — session review

**Capture**
- `/capture-1on1` — 1:1 meeting → vault note
- `/incident-capture` — incident → vault notes
- `/slack-scan` — Slack channel deep scan

**Performance**
- `/peer-scan` — peer GitHub PR deep scan
- `/review-brief` — generate review brief
- `/self-review` — self-assessment writer
- `/review-peer` — peer review writer
- `/humanize` — voice calibration

**Vault Maintenance**
- `/vault-audit` — orphans, broken links, frontmatter
- `/vault-upgrade` — import from another vault
- `/project-archive` — archive completed project
- `/weekly` — cross-session synthesis

**Thinking & Promotion**
- `/think` — scaffold a properly-structured thinking note
- `/promote` — promote thinking note findings to durable atomic notes
- `/connect` — find missing wikilinks (wraps cross-linker)

**Verification & Curation** (adapted from oh-my-claudecode)
- `/verify` — verify a claim/change/note with concrete evidence
- `/remember` — curate session findings into right memory surface

## Subagents

28 total (11 vault-native + 17 omc-adapted). Quick reference (full reference at [[../reference/agent-reference]], import history at [[../reference/ohmyclaude-catalog]]):

### Vault-native (11)

| Agent | Best for |
|-------|----------|
| `brag-spotter` | Uncaptured wins |
| `context-loader` | All vault context for a topic |
| `cross-linker` | Missing wikilinks |
| `memory-curator` | Curate brain/ — stale claims, duplication, overgrowth |
| `people-profiler` | Bulk person notes from Slack |
| `playbook-generator` | Turn pattern into new playbook |
| `review-prep` | Aggregate review evidence |
| `slack-archaeologist` | Full Slack reconstruction |
| `vault-librarian` | Vault hygiene audit |
| `review-fact-checker` | Verify review claims |
| `vault-migrator` | Migrate from source vault |

### omc-adapted (17)

Use for code-side, plan-side, and analytical work:

| Agent | Best for |
|-------|----------|
| `omc-analyst` | Requirements gap analysis |
| `omc-architect` | Architecture review |
| `omc-code-reviewer` | Code review with gap analysis |
| `omc-critic` | Final quality gate with adversarial escalation |
| `omc-debugger` | Structured debugging |
| `omc-designer` | UX/UI design review |
| `omc-document-specialist` | Documentation writing |
| `omc-executor` | Plan execution with verification |
| `omc-git-master` | Atomic git operations |
| `omc-planner` | Work plan creation |
| `omc-qa-tester` | End-to-end QA |
| `omc-scientist` | Hypothesis-driven analysis |
| `omc-security-reviewer` | Security audit |
| `omc-test-engineer` | Test design |
| `omc-tracer` | Causal investigation |
| `omc-verifier` | Verify a claim actually worked |
| `omc-writer` | Prose/docs writing assistance |

## Playbooks

10 playbooks for common procedures. See [[playbooks/README]] for the index.

Most-used:
- [[playbooks/Create Work Note]]
- [[playbooks/Capture Decision]]
- [[playbooks/Capture 1-1]]
- [[playbooks/Find Missing Links]]
- [[playbooks/Archive Project]]

## Workflows

Multi-step orchestrations. See [[Workflows]] for the catalog.

Most-used:
- Morning Kickoff
- End of Day Wrap
- From Slack to Incident Note
- Build a Review Brief
- Vault Audit

## Hooks

5 lifecycle hooks (automatic). See [[Capabilities#Hooks (automatic)]] for triggers.

| Hook | Effect |
|------|--------|
| SessionStart | Inject context |
| UserPromptSubmit | Classify and route |
| PostToolUse | Validate writes |
| PreCompact | Backup transcript |
| Stop | Checklist reminder |

## Claude Code Setup

- **Autopilot**: permissions configured per environment
- **Token efficiency**: see [[Patterns#Token Discipline]]
- **Two-part execution**: Research & Plan → Execute & Verify
- **Memory system**: vault-only, see [[Memories]]

## Composition Heuristic

When a task arrives:
1. Is there a slash command? → use it
2. Is there a playbook? → drive it manually
3. Is it heavy file work? → delegate to a subagent
4. Is it search? → `qmd` skill, then Grep, then Explore agent
5. Is it composition of the above? → see [[Workflows]]

## Related

- [[Capabilities]]
- [[Workflows]]
- [[Patterns]]
- [[playbooks/README|Playbooks]]
