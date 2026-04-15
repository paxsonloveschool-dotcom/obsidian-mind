---
date: 2026-04-15
description: Log of important technical and strategic decisions affecting the vault, Claude's behavior, and the underlying businesses
tags: [brain, decisions]
type: brain
---

# Key Decisions

## 2026-04-15 — Install claude-mem as User-Level Plugin, NOT Vendored

**Decision:** Add [[claude-mem]] (thedotmack/claude-mem) as a **user-level plugin** via `/plugin marketplace add` — create only a pointer skill in `.claude/skills/claude-mem/` inside the vault, NOT a full vendor.

**Context:** User asked to "add thedotmack/claude-mem from github". Two install options:
- (a) Vendor the repo into `.claude/skills/claude-mem/` like we did with UI/UX Pro Max, oh-my-claudecode, and the marketing skill bundles.
- (b) Install at user level via `/plugin marketplace add thedotmack/claude-mem` + `/plugin install claude-mem` and add only a pointer skill to the vault.

**Rationale — why vendoring fails for claude-mem specifically:**
1. **Hooks hard-depend on `$CLAUDE_PLUGIN_ROOT`** — every hook in `plugin/hooks/hooks.json` resolves `$CLAUDE_PLUGIN_ROOT` or falls back to `$HOME/.claude/plugins/cache/thedotmack/claude-mem/...`. Vendored into `.claude/skills/` neither path is set; every hook would fail on every tool call.
2. **Collides with the vault's existing hooks** on `SessionStart`, `UserPromptSubmit`, `PostToolUse`, `PreToolUse(Read)`, `Stop`. The vault already has hooks on those events via `.claude/scripts/*.sh` + `.claude/scripts/*.py`. Merging would either double-fire or break existing behavior.
3. **Runs a persistent Node.js + Bun background worker service** on `localhost:37777` (`worker-service.cjs`). Not a script-that-runs-and-exits — it's a long-running process. The vault would have to manage its lifecycle (start, stop, health check, restart).
4. **Runtime dependency chain**: Bun, Node, ChromaDB, Claude Agent SDK. Heavy for a vault that's been stdlib-first for adapters.
5. **AGPL-3.0 license** — copyleft. Vendoring a modified fork creates obligations if obsidian-mind is ever served as a network service. MIT-licensed bundles we vendored have no such obligation.
6. **101 MB repo**. Vendoring bloats git history.
7. **Nothing cherry-pickable** — `.claude/skills/` in the upstream has one CLAUDE.md, `.claude/commands/` has one command. Value is 100% in the worker + compression pipeline, not in markdown content.

**What was installed:**
- [[.claude/skills/claude-mem/SKILL|Pointer skill]] at `.claude/skills/claude-mem/SKILL.md` — describes what it is, when to use it, how to install, post-install checks, dual-memory architecture, troubleshooting. Future sessions discover it in the skill registry automatically.
- Dual-memory section added to [[CLAUDE#3. Compound, Don't Reset]] documenting how `brain/` (manual) and claude-mem (auto) complement each other.
- Updates to [[Memories]] with the dual-memory rule of thumb.

**Actual install** (user task, outside this vault):
```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

**Alternatives rejected:**
- Full vendor — breaks hooks, requires Bun runtime, 101 MB bloat, AGPL drag.
- Skip entirely — rejected because the auto-memory layer is complementary value.
- Submodule — added complexity without solving the runtime issues.

## 2026-04-15 — Vault Repurposed for Solo Founder / M&A Operator

**Decision:** Repurpose obsidian-mind from generic corporate knowledge-worker template to a solo-founder operating vault, oriented toward the 2029 M&A vision.

**Context:** User identified as owner and creator of [[Restore Marketing Co]] and [[HP Landscaping]], building solo, targeting buy-and-sell company operations and retirement by 2029. The inherited vault structure (1:1s, peer reviews, performance cycles, brag doc for promotion) was built for corporate employees and doesn't match the actual use case.

**Rationale:**
- Every workflow should serve the founder's job-to-be-done, not a generic template
- [[North Star]] now reflects real vision (M&A + retired), real Q2 focus (automation), real identity (solo operator)
- Brain topic notes ([[M&A Playbook]], [[Automation]]) created to hold the mechanics of the real vision
- Active work notes ([[Agent Orchestration Buildout]]) created for the real Q2 project
- Existing corporate templates (`/capture-1on1`, `/review-brief`, `/peer-scan`) not deleted — kept as repurposable scaffolds if/when they fit

**Alternatives:** Rip out the corporate templates entirely — rejected because the user might have employees later and the scaffolds are useful optionality.

**Implications:** Future sessions should treat this user as a founder-operator, not an IC. See [[Memories#Who the User Is]] for behavior guidance.

## 2026-04-13 — Vendored oh-my-claudecode Orchestration Bundle (Cherry-Pick)

**Decision:** Cherry-pick vendor the standalone pieces of [`Yeachan-Heo/oh-my-claudecode`](https://github.com/Yeachan-Heo/oh-my-claudecode) — 19 agents + 33 skills — into `.claude/agents/` and `.claude/skills/`. Skip the plugin-runtime-dependent pieces (hooks, `team`, `autopilot` orchestration runtime, 58 Node scripts, `src/`, `dist/`, `bridge/`).

**Context:** User requested full install. Repo is 46 MB and designed for `/plugin marketplace add` user-level installation. Naive full vendoring would break existing vault hooks (`$CLAUDE_PLUGIN_ROOT` unset, hook conflicts).

**Rationale:** Cherry-pick preserves the high-value pieces (agents + standalone skills) without the runtime risk. Full plugin install path documented in [[Skills#Orchestration Bundle (oh-my-claudecode)]] for the user to run themselves.

**Alternatives:**
- Full vendor (rejected — breaks hooks, 46 MB bloat, $CLAUDE_PLUGIN_ROOT dependency)
- Skip entirely (rejected — user explicitly wanted it)
- Submodule (rejected — complexity not justified)

**Implementation:** Commit `450069b`. Zero `$CLAUDE_PLUGIN_ROOT` references in vendored files (verified). No name collisions with existing vault agents.

## 2026-04-13 — Vendored UI/UX Pro Max Design Bundle (7 Skills)

**Decision:** Vendor the full 7-skill bundle from [`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT) into `.claude/skills/`.

**Context:** User's goal is to make Claude "the world's best website designer." Bundle provides UI/UX Pro Max (primary design engine with Python-backed CSV search over 67 styles / 161 palettes / 57 font pairs / 99 UX rules / 25 charts / 15 stacks) plus 6 sibling skills (design, design-system, ui-styling, brand, banner-design, slides).

**Rationale:** Self-contained, MIT licensed, pure data + Python + markdown. No runtime dependencies. Resolves the symlinks on copy so the skill is truly standalone. Ties directly into client-facing deliverables for [[Restore Marketing Co]] and landscaping proposals for [[HP Landscaping]].

**Implementation:** Commit `4a43807`. Symlinks resolved with `cp -rL`. Python search engine smoke-tested and working.

## 2026-04-05 — System Architecture

**Decision:** Use obsidian-mind as primary vault with Claude Code integration.

**Context:** Evaluated 12+ repos (Khoj, COG, PKM, GodMode, etc.).

**Rationale:** Best balance of persistent memory, session hooks, Claude Code native support.

**Alternatives:** Khoj (too heavy), COG (less mature), standalone CLAUDE.md (no persistence).

## 2026-04-05 — Token Optimization Strategy

**Decision:** 4-file context structure with .claudeignore.

**Context:** Default startup ~11,000 tokens; reduced to ~450.

**Rationale:** Based on claude-token-optimizer patterns (83-87% reduction).

**Implementation:** CLAUDE.md auto-load + 3 on-demand files + .claudeignore.

## Related
- [[North Star]]
- [[Memories]]
- [[Patterns]]
- [[Skills]]
