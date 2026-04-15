---
date: 2026-04-15
description: Specialized threat model and detection notes for agentic deployments that use open-weight LLMs — tool-call gating failures, agent-specific signals, and assumptions to confirm.
tags:
  - work-note
  - ai-safety
  - threat-model
  - detection
  - llm-deployment
  - agents
type: work-note
quarter: Q2-2026
status: active
---

# Agent Deployment — Specialized Defensive Notes

Specialization of [[Deployment Threat Model - Post-hoc Refusal Removal]] and [[Detection and Monitoring - Modified Open-Weight Models]] for the concrete case of **AI agents that use an LLM as their decision-maker**. Agentic deployments are the highest-impact case for the post-hoc refusal-removal threat class, because in an agent context model refusal and action refusal are the same thing: if the model can't decline, the agent can't decline.

> [!warning] Assumptions in this note (TODO: confirm)
> I'm writing this with minimal information about the actual deployment. Confirm or correct each of these before treating this note as binding; the defensive posture shifts meaningfully if any flip.
>
> - **Base model:** open-weight (otherwise most of this threat class is moot)
> - **Role:** the model selects and/or invokes tools, or it generates plans that are executed by downstream code
> - **Weight source:** pulled from a third-party hub, not from a pinned internal mirror with verified provenance
> - **Runtime:** unknown — yours, the customer's, or a third-party host
> - **Fine-tuning:** unknown — if you fine-tune, refusal regression posture is unknown
> - **Framework:** unknown (LangChain / LlamaIndex / custom / MCP-style tool routing / Claude Code / OpenAI Responses / other)
> - **Planner/critic separation:** unknown — does the same model plan and act, or is there a separate planner, critic, or policy head?
> - **Memory / persistence:** unknown — single-turn per task, or persistent state across sessions?
> - **Tool destructiveness:** unknown — read-only, read-write, or external-side-effect (send, pay, post, deploy)?

## Why agents are the high-impact case

The parent threat model lists "agentic amplification" as one impact axis. For an agent-first deployment it's the whole ballgame:

- **Refusal and action share a pathway.** A model that lost its refusal behavior doesn't just generate disallowed text — it picks the tool call that enacts the disallowed thing, and emits the arguments. You don't have "the model said something bad"; you have "the agent *did* something bad," potentially with real-world side effects that outrun detection.
- **The "model won't do X" assumption is load-bearing.** Traditional agent security often treats the model itself as a gate: "the agent won't call `send_email` for this prompt because the model will decline." That gate is a property of post-training, not of the weights. Treat it as unreliable under the weight-modification threat model.
- **Prompt injection and weight modification compound.** A deployment that has both open weights *and* untrusted inputs (RAG, tool results, user content) presents two independent bypass surfaces. Either one individually is manageable; together they eliminate most of the model-internal gating.
- **Detection is partially after-the-fact.** Once an agent has sent an email, made an API call, written a file, or moved money, the detection that matters is *pre-execution*, not post-generation. Monitoring that only inspects model text output misses the bar.

## Specialized attack surface

The parent note's five attack-surface items all still apply. Agent-specific additions:

1. **Tool-selection bypass.** Modification that suppresses refusal changes which tool the model picks for a given goal. A model that would have selected `log_and_escalate` may now select `execute_action` instead. This is the primary uplift for an attacker who gets weight access.
2. **Tool-argument uplift.** Modification can affect not just *whether* the model calls a tool but *how*. Arguments that the original model would decline to produce (URLs, recipient lists, payloads) become available.
3. **Planner / critic circumvention.** If your agent has a "plan then act" or "act then self-critique" loop using the *same* model, modification compromises both halves simultaneously. A separate critic (ideally a different model family) is structurally more robust.
4. **Multi-step drift.** In long agent trajectories, small per-step refusal weakenings compound. The step-1 refusal that would have stopped a chain may now become a hedge that the step-2 continuation proceeds past.
5. **RAG / context-injection amplification.** Adversarial content retrieved into context can steer a modified agent further than it could steer an unmodified one, because the refusal floor is lower.

## Assumptions that fail especially hard in an agent context

From the parent note, but called out where agents make them worse:

- **"The model won't call tool X on request Y."** This is a model-behavior assumption masquerading as a capability boundary. If X has real side effects, treat model behavior as advisory, not authoritative.
- **"Our downstream filter will catch it."** Filters that run on model *output text* miss tool-call structure; filters that run on tool calls but trust the model's argument selection miss argument-level exploitation.
- **"Our customers run this on their own hardware so it's not our problem."** If your brand is on the agent, the modification can happen in the customer's runtime and the reputational / policy blast radius is still yours.
- **"We fine-tuned it on our own safety data so it's not the original open-weight model anymore."** Fine-tuning can narrow some threats and widen others. Refusal regression under fine-tuning is a real and common failure mode; without a regression test, you have no basis for the claim.

## Specialized defensive posture

Layered. Pick based on tool destructiveness — read-only tools can get away with less; anything with external side effects needs most of this.

### Independent of the model

These controls hold even if the model is completely modified:

- **Out-of-model tool-call authorization.** An independent policy layer between the model's tool-call emission and actual execution. The model proposes; the policy disposes. Policy should be a deterministic check, not another LLM call.
- **Principle of least privilege per tool.** Each tool gets the narrowest scope that makes it useful. Read-only where possible. Scoped credentials, not blanket ones.
- **Dry-run / preview for destructive tools.** Any tool with external side effects supports a preview mode; production path requires the preview to be shown to a human or a non-LLM validator first.
- **Out-of-band human approval for sensitive actions.** Email sending, code deployment, financial transactions, external posts, deletions. Not "the agent shows a confirmation button" — genuine out-of-band.
- **Rate limits independent of the agent.** Even if the model emits 1000 tool calls, the downstream system doesn't execute 1000 of them.
- **Full audit logs with replay.** Every tool call, every argument, every outcome. Indexed by session. Enough to replay a suspicious trajectory and ask "why did the model pick this."

### Model-adjacent

- **Provenance pinning at agent load.** Pin the exact weight hash the agent is allowed to use. Verify on every load. Log mismatches and halt.
- **Fine-tuning discipline.** If you fine-tune, treat refusal regression as a release gate. Run a private, per-category refusal regression suite on every fine-tune, not just the first.
- **Critic-model separation.** If the agent has a planner / critic / review loop, use a *different* model family (ideally a different provider) for the reviewing role. A modification to one model family is unlikely to survive review by a different one.
- **Baseline-agent comparison.** Keep a known-good version of the agent (original weights, original prompts, original tools) and periodically run it on a fixed task set. Compare against production.
- **Memory hygiene.** If the agent has persistent memory, treat memory contents as untrusted input when read back. A modification doesn't need to attack the model if it can attack the memory the model reads from.

### Eval and monitoring

Specializations of the [[Detection and Monitoring - Modified Open-Weight Models|detection note]]'s signal classes, tuned for agents:

- **Tool-selection drift.** For a fixed task distribution, what fraction of the time does the model pick tool A vs. tool B vs. "decline"? Track this over time and against a baseline agent. Drift in the tool-selection distribution on unchanged inputs is a signal.
- **Refusal-on-action canaries.** Private test tasks that *should* produce "I won't do that" responses in the tool-call path (not just in text output). Run these continuously. Alert on passage.
- **Trajectory-distance monitoring.** For a fixed task, compare trajectories between production and a known-good baseline agent. Edit distance, action-sequence KL, or simpler "did they pick the same tool at step 1" checks. Cheap; informative.
- **Tool-argument distribution monitors.** Argument fields (URLs, recipients, payload sizes) have a distribution on normal traffic. Sudden shifts in that distribution without a matching shift in input distribution are a signal.
- **Plan-vs-action consistency.** If your agent produces a plan before acting, check whether the emitted action matches the plan. Modified models sometimes diverge here because the plan is generated under more of the original distribution than the action.
- **Critic disagreement rate.** If you add a separate-family critic, the rate at which the critic rejects the primary model's actions is itself a monitor. A sudden drop (critic agrees with everything) or spike (critic flags most actions) both merit investigation.
- **Category-coverage canaries.** Parent note's behavioral signal, with agent-specific categories — not just "harmful text" but "harmful tool combinations."

### Controls worth their weight even without this threat class

Several of the above are good agent-security hygiene regardless of the abliteration threat. If you're deploying agents and most of the "Independent of the model" list isn't in place, that's the first gap to close before optimizing for this specific threat class — it pays for itself across the broader agent threat surface (prompt injection, RAG poisoning, over-scoped credentials, runaway loops) as well.

## Questions I need answered to tighten this further

Several decisions below change the recommended posture meaningfully. Tell me whatever you can; anything still unknown becomes a flagged assumption rather than a blocker.

- **Tool inventory.** How many tools, and what's the worst side effect any of them can cause? "Read-only API calls" and "can send emails under our domain" and "can write to prod databases" need very different postures.
- **Planner/actor separation.** Single model does everything, or is there a separate planner / critic / router? Same family or different?
- **Runtime.** Where does the agent run — your infra, your customer's, a third-party host? This determines what provenance and attestation controls are even available.
- **Fine-tuning.** Are you fine-tuning the base model? If yes, is there a refusal regression suite today, or is that a gap?
- **Memory model.** Single-task, session-local memory, or long-lived cross-session memory? Memory is an independent attack surface.
- **Framework.** Which framework and version? Some frameworks (MCP-based, OpenAI Responses, custom) make the "independent authorization layer" easy; others need it retrofitted.
- **User trust model.** Does the agent act on behalf of the user running it, or on behalf of a service account with broader privileges? The latter is much harder to defend.
- **Detection posture today.** What monitoring exists right now? I want to know what's already in place before recommending adds.

Once those are nailed down, the right move is probably to split this into: (1) a narrowed threat model tied to your actual tool inventory, (2) a concrete monitoring proposal with specific signals and thresholds, and (3) a prioritized defensive-controls backlog ordered by effort-vs-reduction. Say the word and I'll do that split.

## What this note deliberately does not contain

- No procedures, parameters, code, or tool commands for performing weight modification, activation steering, or adapter-based ablation.
- No "how to attack an agent" content. The attack surface sections describe *what to defend against*, not how to execute the attack.
- No specific vendor or framework recommendations. The posture is framework-agnostic until you tell me which framework, at which point a more specific note becomes useful.

## Related

- [[Deployment Threat Model - Post-hoc Refusal Removal]] — general-purpose parent threat model
- [[Detection and Monitoring - Modified Open-Weight Models]] — general-purpose parent detection note
- [[Abliteration Research Landscape]] — descriptive literature background
- [[Home]]
- [[North Star]]
