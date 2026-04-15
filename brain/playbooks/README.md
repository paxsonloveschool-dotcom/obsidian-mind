---
date: 2026-04-13
description: Index of operational playbooks — repeatable, vault-specific procedures Claude follows for common tasks
tags: [brain, playbooks, index, moc]
type: index
---

# Playbooks

Concrete, step-by-step procedures for the most common operations in this vault. These are Claude's "muscle memory" — when a task matches one of these shapes, follow the playbook instead of reasoning from first principles.

## Why playbooks exist

CLAUDE.md describes *what* the vault is. Playbooks describe *how to do things in it*. They live in `brain/` because they are operational knowledge — read at the moment of action, not at session start.

## Index

| Playbook | When to use |
|----------|-------------|
| [[Create Work Note]] | Starting a new project or capturing a piece of work |
| [[Capture Decision]] | A decision was just made that needs durable recording |
| [[Capture 1-1]] | A 1:1 meeting transcript or notes need structuring |
| [[Capture Incident]] | An outage, alert, or postmortem needs a vault home |
| [[Onboard Person]] | A new person needs an `org/people/` note |
| [[Promote Thinking]] | A thinking note has produced durable knowledge |
| [[Find Missing Links]] | A note feels orphaned or under-connected |
| [[Archive Project]] | A project is complete and should leave `work/active/` |
| [[Run Vault Audit]] | The vault feels messy or before a substantive session |
| [[Emergency Token Triage]] | Context is filling up faster than expected |
| [[Sync Self-Description]] | CLAUDE.md / README / CHANGELOG / vault-manifest lag behind the operational layer |

## Playbook conventions

Every playbook has the same shape:

1. **Trigger** — what prompted this action
2. **Inputs** — what Claude needs before starting
3. **Steps** — numbered, executable
4. **Outputs** — what files were created/modified
5. **Linking** — what wikilinks must exist when done
6. **Done when** — verification checklist

## Related

- [[Workflows]] — multi-command sequences
- [[Capabilities]] — inventory of what Claude can do here
- [[Patterns]] — design principles that explain *why* the playbooks work this way
- [[../Memories]] — memory index
