---
date: 2026-07-12
description: JARVIS-style operating dashboard for the Hermes agent network — reactor core with clickable dossiers for all 9 vault subagents.
tags: [reference, architecture, agents]
type: reference
---

# Hermes OS

A JARVIS-inspired HUD that visualises the [[Skills|Claude agent network]] running against this vault. Nine subagents orbit a central reactor; click any node to load its dossier — role, toolchain, model, skills, and invocation path.

Open `reference/hermes-os.html` in a browser (or view the shared artifact) to interact with it. The dashboard reads real vault telemetry: node count, command count, skill count, and the last 24h of commit cadence.

## Agents on the web

Each node is defined in `.claude/agents/`:

| ID   | Agent | Role | Invocation |
|------|-------|------|------------|
| BRAG | `brag-spotter`        | Win detection            | `/wrap-up`, `/weekly` |
| CTXL | `context-loader`      | Context aggregation      | Direct |
| XLNK | `cross-linker`        | Graph integrity          | `/vault-audit` |
| PPRO | `people-profiler`     | Org profile sync         | `/incident-capture` |
| FCHK | `review-fact-checker` | Claim verification       | `/self-review`, `/review-peer` |
| RPRP | `review-prep`         | Perf evidence aggregation| `/review-brief` |
| SLCK | `slack-archaeologist` | Conversation recon       | `/incident-capture` |
| VLIB | `vault-librarian`     | Vault maintenance        | `/vault-audit` |
| VMIG | `vault-migrator`      | Vault migration          | `/vault-upgrade` |

## Design notes

- Single-theme HUD (dark). Deliberate visual commit — the reactor aesthetic doesn't survive inversion.
- Radial connection thickness encodes each agent's tool-count (subtle info design).
- Sparkline reflects the real 24h commit distribution at capture time.
- Amber is reserved for advisory state — not decoration.
- Reduced-motion viewers get a static composition.

## Related

- [[Skills]] — full command and agent reference
- [[Home]] — vault entry point
- [[North Star]] — current focus areas
