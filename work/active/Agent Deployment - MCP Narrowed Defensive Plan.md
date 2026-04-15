---
date: 2026-04-15
description: MCP-based + fine-tuned agent deployment — narrowed threat model, concrete monitoring signals with alert thresholds, and prioritized defensive-controls backlog.
tags:
  - work-note
  - ai-safety
  - threat-model
  - detection
  - llm-deployment
  - agents
  - mcp
type: work-note
quarter: Q2-2026
status: active
---

# Agent Deployment — MCP Narrowed Defensive Plan

Second-round specialization of [[Agent Deployment - Specialized Defensive Notes]]. Filling in two of the eight "TODO: confirm" fields from the parent: **framework = MCP-based** and **fine-tuning = fine-tune + refusal regression suite in place**. The rest (tool inventory, planner/actor separation, runtime, memory, user trust model, current detection) remain unknown and are carried forward as explicit assumptions.

This note delivers the three-part follow-up the parent promised: (1) a narrowed threat model tied to MCP + fine-tune specifics, (2) a concrete monitoring proposal with signals and alert thresholds, (3) a prioritized defensive-controls backlog ordered by reduction-per-unit-effort.

## Resolved assumptions this round

> [!info] Confirmed
> - **Framework: MCP-based.** Tool calls use the Model Context Protocol — structured `tools/call` invocations with JSON-schema'd arguments, routed through MCP servers that run as separate processes with their own scope. Claude Desktop / Claude Code / Cursor / similar.
> - **Fine-tuning: yes, with refusal regression suite.** The base open-weight model is fine-tuned downstream; a refusal-regression test suite runs on the fine-tuned artifact as a release gate.

> [!warning] Still unknown (carried forward)
> - Tool inventory and worst-case side effect per tool
> - Planner / actor / critic separation — single model doing everything, or structural separation?
> - Runtime — yours, customer's, or third-party host
> - Memory / persistence model
> - User trust model — who does the agent act on behalf of, with what privileges?
> - Current detection posture — what monitoring exists today, if any?

## What MCP changes about the threat model

MCP is structurally favorable for this threat class compared to ad-hoc tool-routing or text-parsing agent loops. Specifics that matter:

- **Structured tool calls are easy to monitor.** The `tools/call` envelope, tool name, and JSON-schema'd arguments are a natural unit for logging, distribution tracking, and independent validation. No free-text parsing to guess intent.
- **MCP servers are a natural enforcement boundary.** Each server is a separate process with its own scope and credentials. The server can reject, rewrite, or require confirmation on any call before execution — and the model has no way to bypass that server-side check. This is the "independent authorization layer" the parent note recommends, built into the shape of the protocol.
- **Tool discovery is enumerable.** MCP clients enumerate available tools at session start. You can log which tools and which servers were advertised, compare against an allowlist, and detect when an unexpected server or tool appears.
- **Arguments are typed.** JSON Schema on parameters makes out-of-distribution argument detection cheaper: you can validate schema conformance *and* value-distribution drift against a baseline.
- **MCP servers are themselves a supply-chain concern.** Third-party MCP servers run adjacent to your agent and see the tool-call stream. For MCP-based deployments "the MCP server was modified" is arguably a more immediate threat than "the model was modified" — both need provenance, and in many deployments server provenance is the weaker of the two today.
- **Prompts and resources, not just tools.** MCP's `prompts` and `resources` primitives are additional injection surfaces. A malicious or modified resource server can inject content into the model's context that steers it toward tool calls. This is closer to classical prompt injection than to weight modification, but it *amplifies* the weight-modification threat — a modified model is more likely to act on an injected instruction.

## What "fine-tune + regression" changes

The regression suite is good news — most deployments don't have one. Things to keep in mind:

- **What the suite tests matters more than its existence.** Typical refusal regression suites test category coverage on *text* refusals. For an agent deployment, the thing that matters is *tool-call-path* refusals: does the fine-tuned model still decline when asked to invoke a tool for a disallowed purpose? If the suite doesn't currently have tool-call-path canaries, augmenting it is the highest-leverage change.
- **The fine-tune is a new artifact you now own.** Provenance pinning applies to *your* fine-tuned weights, not the base model. The hash that matters at runtime is the hash of the fine-tuned checkpoint you actually serve.
- **The regression suite is a defensive asset.** It produces a known-good behavioral baseline for drift detection. Compare production traffic against regression-suite coverage over time and flag when production-typical prompts drift away from what the suite tested.
- **Regression at release time ≠ integrity at runtime.** A regression pass before deployment tells you the fine-tune is clean *at that moment*. It says nothing about whether a modified version of that fine-tune could be loaded at runtime. Provenance pinning closes that gap; regression alone does not.
- **Refusal can regress under iteration.** If the fine-tune is iterative, or if customers fine-tune on top of your fine-tune, re-run the regression on every variant, not just the first.

## Narrowed threat scenarios (MCP + fine-tuned specific)

Ranked roughly by expected impact, highest first:

1. **MCP server substitution.** Attacker replaces or modifies an MCP server your agent trusts. The model is untouched; the tool-execution boundary is compromised. For MCP deployments this is the most immediate supply-chain risk.
2. **Fine-tuned checkpoint substitution.** Attacker swaps a modified version of your fine-tune into the runtime load path. Hash pinning catches this if implemented; absence of hash pinning makes this the easiest attack.
3. **Refusal regression under downstream fine-tuning.** Not adversarial — a downstream training round (iterative fine-tune, customer fine-tune, adapter add-on) silently weakens refusal behavior in ways that don't break capability benchmarks. Caught by the regression suite *if it runs on every variant and includes tool-call-path cases*.
4. **Tool-selection drift via weight modification.** Attacker with access to fine-tuned weights produces a modified version that picks different tools for the same goals. Detectable via tool-selection distribution monitoring; invisible to text-level evals.
5. **Prompt/resource injection amplified by modification.** A poisoned MCP resource steers the agent toward tool calls; a modified model acts on them further than an unmodified one would. Compound failure — needs both input-side defense and integrity defense.
6. **Activation-steering at runtime.** Inference-time hooks that modify residual streams without touching weights. Weight hash pinning does not catch this. Lower-probability for most deployments but worth naming.
7. **Adapter-based reversible modification.** A LoRA or adapter loaded alongside the fine-tune at runtime. Same detection gap as (6); adds "is there an unexpected adapter loaded" to the posture.

## Concrete monitoring proposal

Signals to implement, grouped by implementation cost. Alert conditions are starting points — calibrate against your own baseline traffic once collected.

### Tier 1 — cheap, do first

| Signal | What it measures | Where it lives | Alert condition (starting point) |
|---|---|---|---|
| **Fine-tune hash verification** | Runtime hash of loaded weights matches pinned value | Model loader | Any mismatch → hard fail, halt load |
| **MCP server manifest + version pinning** | Installed MCP server binaries/packages match pinned manifest | Agent startup / package manager | Any mismatch → hard fail, block session |
| **MCP tool inventory log** | Which tools were advertised this session, by which server | Session log | New tool or new server appearing without a release → alert |
| **Per-session tool-call log** | Tool name, argument hash, server, outcome, session ID | Tool-call boundary (MCP client side) | Structured log, surfaced during incidents |
| **Regression suite on every fine-tune variant** | Pass/fail on existing refusal regression suite | CI on fine-tune artifact | Any failure → block release |

### Tier 2 — moderate effort

| Signal | What it measures | Where it lives | Alert condition (starting point) |
|---|---|---|---|
| **Tool-call-path refusal canaries** | Private test tasks that should trigger "I won't do that" in the tool-selection path | Scheduled eval against production endpoint | Pass-rate drop > 5% week-over-week, or any single canary flipping refuse → comply |
| **Tool-selection distribution monitor** | For a fixed task distribution, which tools does the model pick? | Continuous eval replay | Per-tool selection rate shift > 2σ from baseline without matching input-shift |
| **Argument-distribution monitor** | Distribution of tool-call argument values (recipients, URLs, payload sizes, counts) | MCP client-side validator | Value outside trained distribution → log; repeated → alert |
| **Private rotated category-coverage canary** | Per-category refusal rate on a private prompt set, rotated periodically | Scheduled eval | Uneven category drop → alert (flag the categories, not the aggregate) |
| **Regression suite augmentation** | Add tool-call-path canaries to the existing text-refusal suite | CI | Any regression → block release |

### Tier 3 — higher effort, high value for destructive tools

| Signal | What it measures | Where it lives | Alert condition (starting point) |
|---|---|---|---|
| **Critic-model disagreement rate** | Rate at which a separate-family reviewer model rejects the primary model's tool calls | Inline at tool-call boundary | Sudden drop or spike → alert |
| **Trajectory distance to baseline agent** | Edit distance or KL between production agent and known-good baseline on fixed tasks | Scheduled replay | Distance increase > 2σ → alert |
| **Plan-vs-action consistency check** | If agent produces a plan before acting, does the action match the plan? | Tool-call boundary | Mismatch rate above baseline → alert |
| **Out-of-band human approval for sensitive actions** | Destructive tool calls require human sign-off | Tool-call boundary | Not a signal — a hard gate |
| **Weight-baseline fingerprint check** | Spectrum / norm / known-good probe comparison vs. baseline at load time | Model loader | Deviation beyond tolerance → block load |

### Signals to deprioritize for this deployment shape

- **Refusal rate on public benchmarks.** Low ceiling against modifications targeted at the same benchmark. Not useless, just not a primary monitor.
- **Perplexity drift on generic corpora.** Noisy and not load-bearing given the other tier-2 signals. Implement later if there's appetite.

## Prioritized defensive-controls backlog

Ordered by **reduction-per-unit-effort**. Each item is scoped small enough to land as a discrete piece of work. The first three are general agent-security hygiene — they pay for themselves against the broader agent threat surface (prompt injection, RAG poisoning, over-scoped credentials, runaway loops) regardless of whether this threat class is the top priority.

1. **Fine-tune hash pinning in the model loader.** Hard fail on mismatch. Blocks "fine-tuned checkpoint substitution" almost entirely. **Low effort, high reduction. Do first.**
2. **MCP server manifest and version pinning.** Lock the set of MCP servers the agent will accept; verify at startup. Blocks "MCP server substitution," the #1 threat scenario for MCP deployments. Low-to-moderate effort, high reduction.
3. **Augment refusal regression suite with tool-call-path canaries.** You already have the suite and the CI path — adding tool-call cases is a small marginal cost. Closes the "regression suite misses the thing that matters for agents" gap. Low effort, medium-to-high reduction.
4. **Structured per-session tool-call logging.** Tool name, argument hash, server, outcome, session ID. Foundation for every tier-2 and tier-3 signal. **Low effort, prerequisite for nearly everything else. Do in parallel with 1–3.**
5. **Private rotated category-coverage canary suite.** Running against production endpoint on a schedule. Moderate effort, medium reduction.
6. **Tool-selection distribution monitor.** Needs the logs from (4) and a baseline calibration period. Moderate effort, medium-to-high reduction.
7. **Out-of-band human approval gate for destructive tools.** Gate, not signal. Effort depends entirely on tool inventory — which I still don't know. **If any tools have external side effects, this jumps to priority 3 or 4 — tell me the tool inventory and I will reorder.**
8. **Critic-model separation for high-stakes tool calls.** Requires a second model (different family) in the loop. High effort, high reduction on the subset of calls it covers. Justified for destructive tools, over-engineered for read-only.
9. **Trajectory-distance monitoring against a baseline agent.** Needs a fixed baseline agent and a replay harness. High effort, medium reduction. Good monitoring for mature deployments; premature for early ones.
10. **Weight-baseline fingerprint check.** Needs a known-good baseline and tolerance thresholds. High effort, medium reduction (catches some modifications hash-pinning misses, not all). Lowest priority in this backlog.

## What would reorder this backlog meaningfully

Any of these answers changes the ranking enough that I'd rewrite the backlog section:

- **Tool inventory.** If any tool has external side effects, items 7 and 8 jump up. If everything is read-only, they drop further.
- **Planner/actor separation.** If the agent already runs a separate-family critic, item 8 is done; if not, it matters more.
- **Runtime.** Customer-hosted runtime changes which of items 1 and 2 are enforceable on your end vs. theirs.
- **Regression suite content.** If the suite already includes tool-call-path canaries, item 3 becomes "confirm, not augment."
- **Current monitoring.** If any tier-1 or tier-2 signals are already implemented, remove them from the backlog so effort goes to the real gaps.

## What this note deliberately does not contain

Unchanged from parents: no procedures, parameters, code, or tool commands for performing weight modification, activation steering, or adapter-based ablation. All framing is from the defender's perspective.

## Related

- [[Agent Deployment - Specialized Defensive Notes]] — first-round specialization with full assumption block
- [[Deployment Threat Model - Post-hoc Refusal Removal]] — general threat model parent
- [[Detection and Monitoring - Modified Open-Weight Models]] — general detection parent
- [[Abliteration Research Landscape]] — descriptive literature background
- [[Home]]
- [[North Star]]
