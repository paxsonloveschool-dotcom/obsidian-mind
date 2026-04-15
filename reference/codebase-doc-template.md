---
date: "{{date}}"
description: <~150 chars describing what this reference doc is about>
project: <project-slug>
tags: [reference, codebase]
---

# {{title}}

> **Purpose**: One paragraph — what is this thing, why does it exist, who uses it?

## Shape

*High-level structure. Diagram, module list, or directory tree. Don't describe the whole thing — sketch the bones.*

```
<project>/
├── entry-point/
├── core/
│   ├── module-a/
│   └── module-b/
└── adapters/
```

## Key Concepts

*Vocabulary the reader needs before the rest makes sense. Each concept is one paragraph max.*

- **Concept A**: What it means in this system
- **Concept B**: ...

## Dataflow

*How state moves through the system. A diagram or numbered sequence.*

1. **Ingress** — what enters and from where
2. **Transform** — what happens in the middle
3. **Egress** — what leaves and to where

## Entry Points

*Where code execution starts. Files, endpoints, CLI commands, event handlers.*

| Entry | Trigger | What it does |
|-------|---------|--------------|
| `<file>` | <trigger> | <one line> |

## Operational Notes

*How to run, deploy, debug, monitor.*

### Running locally

```bash
<command>
```

### Deployment

<process summary with links>

### Debugging

- **Common issue 1**: symptom → root cause → fix
- **Common issue 2**: ...

## Gotchas

*Project-specific pitfalls. Vault-wide gotchas live in `[[../brain/Gotchas]]`.*

- Gotcha 1
- Gotcha 2

## Decisions

*Links to Decision Records that shaped this thing.*

- [[<Decision Record>]]

## Related

*Wikilinks to work notes, people, teams, and other reference docs.*

- [[<work note>]] — why it's relevant
- [[<person>]] — owner / primary contact
- [[<team>]] — owning team
- [[README]] — reference index
