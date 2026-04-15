---
date: 2026-04-15
description: Threat model for adversary-modifies-weights attacks against open-weight LLM deployments — scope, attacker model, assumption failures, and defensive posture menu.
tags:
  - work-note
  - ai-safety
  - threat-model
  - llm-deployment
type: work-note
quarter: Q2-2026
status: active
---

# Deployment Threat Model — Post-hoc Refusal Removal

Working threat model for deployments that ship or depend on open-weight language models, focused on the class of attacks where an adversary with weight access modifies the model to suppress refusal behavior before using it as a component. Sibling note: [[Detection and Monitoring - Modified Open-Weight Models]]. Background: [[Abliteration Research Landscape]].

> [!info] How to use this note
> This is a starting-point threat model, not a finished one. Copy it, specialize it to your actual deployment (what you ship, who your users are, what downstream systems trust the model's output), and delete sections that don't apply. Generic threat models aren't binding; situated ones are.

## Scope

**In scope:**
- Deployments that ship open-weight LLMs as components of a product (fine-tuned, adapted, or redistributed)
- Deployments that consume open-weight LLMs from third-party hubs without independent verification
- Downstream systems that trust model output as a safety-relevant input (content filters, agentic tool-gating, policy enforcement)

**Out of scope for this note:**
- Hosted API deployments where weights never leave the provider (different surface — much of this threat class is moot)
- Prompt injection and jailbreak attacks against unmodified models (covered by other threat models)
- Training-time data poisoning and supply-chain attacks on the base model itself (related but distinct)

## Attacker model

**Capabilities assumed:**

- Read access to open-weight model files (public download, or pulled from a third-party hub)
- Moderate GPU compute (one to a handful of consumer or datacenter GPUs, scaled to model size)
- Public literature and tooling — mechanistic-interpretability research is public and direction-extraction techniques are published
- Standard ML engineering skill. Not a nation-state, not a specialized research lab.

**Capabilities NOT assumed:**

- Insider access to the original training pipeline
- Access to private post-training datasets
- Ability to compromise the user's runtime environment (that is a different threat class)

**Attacker goals (examples, not exhaustive):**

- Repackage a modified model as "the real one" on a mirror or a third-party hub
- Use a modified model in an agentic pipeline to bypass downstream policy checks
- Generate disallowed content at scale using a component that was assumed to refuse
- Ship a product built on a modified model without disclosure

## Attack surface

1. **Weight-edit modifications.** Direct projection or subtraction of refusal-correlated directions from weight matrices. Produces a persistent, standalone modified model.
2. **Inference-time activation steering.** Hooks that add vectors to residual streams at runtime without editing weights. Reversible, harder to detect from weights alone.
3. **LoRA / adapter-based modification.** Low-rank modifications that can be loaded or unloaded at inference time; different detection surface than full weight edits.
4. **Prompt-template bypass.** Not strictly "weight modification," but worth naming: some refusal behavior is anchored in the chat template, not the weights, and swapping templates is a trivial attack requiring none of the above.
5. **Fine-tuning drift.** Legitimate downstream fine-tuning can unintentionally degrade refusal behavior, producing an effectively-modified model without adversarial intent. Impact is the same; belongs in this threat model.

## Assumptions that fail against this threat class

Common deployment assumptions worth auditing:

- **"The base model won't comply with X because it was trained not to."** Weaker than it looks once weights leave the provider. Post-training is a modifiable layer, not an immutable property of the weights.
- **"We tested refusal behavior before shipping."** A one-time eval on the unmodified model does not cover modifications made after shipping, or modifications in the supply chain before download.
- **"Our hash matches the Hugging Face release hash."** True for that specific download, only if you actually verified. It says nothing about what other copies of "the same model" your ecosystem contains, and hash verification is a control that has to be implemented, not assumed.
- **"Downstream filters will catch anything the model gets wrong."** Downstream filters that trust the model to be well-behaved fail when the model is modified. Filters that don't assume anything about the model's training state are more robust.
- **"Adversaries who want to do X will just use something else."** Sometimes true, often irrelevant. If your deployment creates a new avenue (branded model shipped to many users; model gating a sensitive action), you own that avenue regardless of what other avenues exist elsewhere.

## Impact axes

- **Direct content generation** — a modified model produces disallowed output when the unmodified model would refuse.
- **Trust-path breakage** — a downstream system that treated model output as a safety signal silently fails.
- **Reputational** — output attributed to your deployment even if the modification happened elsewhere in the supply chain.
- **Regulatory / policy** — where deployment has obligations tied to model behavior (region-dependent).
- **Agentic amplification** — if the model drives tool calls, a modification that removes "don't do that" behavior in generation removes it in the action path too.

## Defensive posture (menu, not a prescription)

Controls come in layers. Pick the subset that matches your threat model and cost budget; none of these are free.

- **Provenance pinning.** Pin a specific known-good weight hash at load time. Verify every load. Log mismatches and alert. Cheap, catches whole classes of supply-chain substitution.
- **Attestation.** If your deployment chain supports it, attest the loaded weights at runtime to a trust root (TPM, TEE, signed manifest). More expensive; justified for high-trust deployments.
- **Hosted vs. open-weight.** For some threat models the right answer is "don't ship open weights at all" — run inference behind an API boundary so weights never leave your control. Real product tradeoff; should be an explicit decision, not a default.
- **Input/output-side defenses that don't assume model behavior.** Content filters and policy checks applied independently of the model. These keep working against modified models.
- **Runtime behavior monitoring.** See [[Detection and Monitoring - Modified Open-Weight Models]].
- **Tool-call gatekeeping.** For agentic deployments, require affirmative policy approval on sensitive actions rather than relying on the model to decline them.
- **Fine-tuning discipline.** If you fine-tune, treat refusal regression as a testable property and regress-check every downstream variant, not just the base model.
- **Disclosure and logging.** Know what model is running in production at every point. Sounds obvious; often isn't true.

## What this threat model does NOT cover

- Input-side prompt injection and jailbreaks against unmodified models
- Data leakage, training-data extraction, membership inference
- Traditional application-security threats (authn, authz, transport, etc.)
- Copyright and license enforcement on model weights
- Capability elicitation beyond refusal (e.g., hidden capability unlock via fine-tuning)

These are real and important; they belong in their own threat model notes.

## Open questions to specialize this for your deployment

- What exactly do you ship? Weights, a service, a fine-tuned adapter, an agent?
- Who can read your weights? (Public, customers, internal only, never leaves the boundary.)
- What downstream system trusts the model output as a safety signal, and what happens if that trust is wrong?
- What would you detect, and how, if an adversary swapped the model tomorrow?
- What is your fine-tuning discipline — is refusal regression a tracked property across variants?
- Is API-boundary deployment acceptable as a fallback if open-weight turns out to be too costly to defend?

## Related

- [[Detection and Monitoring - Modified Open-Weight Models]] — detection-side sibling
- [[Abliteration Research Landscape]] — descriptive literature background
- [[Home]]
- [[North Star]]
