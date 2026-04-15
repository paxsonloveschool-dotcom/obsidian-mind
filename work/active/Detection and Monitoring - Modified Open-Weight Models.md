---
date: 2026-04-15
description: Detection and monitoring gaps for modified open-weight LLMs — why standard safety evals miss abliteration-style changes and what more robust signals would measure.
tags:
  - work-note
  - ai-safety
  - detection
  - monitoring
  - llm-deployment
type: work-note
quarter: Q2-2026
status: active
---

# Detection and Monitoring — Modified Open-Weight Models

Working notes on the detection side of the [[Deployment Threat Model - Post-hoc Refusal Removal|deployment threat model]]: how refusal-direction modifications slip past standard safety evals, what signals might catch them, and what a more robust monitoring posture would measure. Descriptive, defensive framing. Background: [[Abliteration Research Landscape]].

> [!warning] Detection lags removal
> The tooling maturity gap between "modify a model to strip refusals" and "detect that someone modified a model to strip refusals" is real and not trivial. This note catalogs signal classes that *could* close the gap, not a turnkey detection pipeline. Nobody has a turnkey detection pipeline right now — treat defense in depth as the operational answer until the field catches up.

## The gap in one sentence

Standard safety benchmarks measure refusal rate on held-out harmful prompts and report that rate as a scalar. Modifications that target the same "refuse harmful prompts" objective the benchmarks were designed to test are, unsurprisingly, the hardest modifications for those benchmarks to catch — the benchmark's sensitivity dropped by design.

## How standard evals fail against modified models

- **Refusal-rate benchmarks measure a single axis.** A modification optimized against that axis will move the number without being detected elsewhere.
- **Public benchmarks aren't actually held out from modifiers.** Public benchmarks are public; modification methods can be iterated against them.
- **Pass/fail scoring hides distribution shifts.** A model that used to refuse across 40 disjoint categories and now refuses only in the 10 present in the benchmark looks identical on the benchmark and is very different in deployment.
- **Upstream eval ≠ downstream eval.** A result from the model card was not generated against your deployment's prompt distribution, your chat template, your temperature, or your adversarial input shape. It is not a runtime guarantee.
- **Coherence-preserving modifications look clean on capability evals too.** General benchmarks stay flat, so "the model is fine, refusals are fine" from a standard suite can coexist with a meaningfully modified model.

## Signal classes that might work

This is a menu. None of these are mature; several are active research.

### 1. Behavioral signals

- **Private category-coverage canaries.** Curate a *private* prompt set covering a wide range of refusal categories. Track per-category refusal rate over time; look for uneven drops. Modifications often produce uneven category coverage because the modification geometry isn't category-uniform.
- **Out-of-distribution refusal canaries.** OOD refusal prompts the modeler is unlikely to have optimized against. Harder to maintain (they stop being OOD once published) but informative while fresh.
- **Consistency probes.** Ask related questions at different specificity or framing levels; modified models often show inconsistent refusal between abstract and specific versions of the same request in ways unmodified models do not.
- **Response-style fingerprint drift.** Unmodified post-trained models have a recognizable refusal vocabulary and structural pattern. Modifications tend to disturb that style even when the refusal still occurs. A cheap style-classifier over refusals is a useful monitor.

### 2. Activation-geometry signals

Described here from the defender's side — what you would look for on your own known-good baseline. The underlying methodology is the same interpretability literature cited in [[Abliteration Research Landscape]]; what changes is the *use*.

- **Weight-diff baseline.** If you know the original weights, direct comparison (norm, cosine, singular-value spectrum) catches naive weight edits cheaply and reliably. Not useful against inference-time or adapter-based modifications.
- **Known-good probe at runtime.** Train a linear probe on your known-good model's activations during refusal behavior; apply it at inference time and flag drops in probe response on inputs that should trigger refusal. (Probe methodology: Alain & Bengio 2017.)
- **Subspace fingerprinting.** Known-good models have a characteristic activation geometry (direction spectrum, layer-wise alignment). Drift from a fingerprint baseline is a signal even without knowing the attack method.
- **Residual-stream sanity checks.** Norm and entropy distributions in the residual stream during refusal-triggering inputs are measurable and tend to move under modification.

### 3. Provenance and attestation signals

- **Hash pinning at load.** Cheapest, catches the largest class of supply-chain substitution. Log every load; alert on mismatch. If this isn't in place, it's always the first thing to add.
- **Signed manifests.** Distributor signs a manifest of expected weights and metadata; loaders verify the signature. Good if the distributor cooperates.
- **Remote attestation (TEE/TPM).** Runtime attestation that the weights in memory match a trust root. Expensive; justified for high-trust deployments.
- **Chain-of-custody logging.** Record where weights came from, who fine-tuned them, with what data, when. Most deployments do not log this at all — logging alone is a significant uplift.

### 4. Distribution-shift signals

- **Perplexity drift on a reference corpus.** Cheap to measure continuously; modifications often show subtle perplexity changes even when capability benchmarks look flat.
- **Response-distribution entropy.** Aggressive modification can flatten or sharpen next-token distributions in detectable ways on probe inputs.
- **KL to a known-good reference.** If a reference model is available, continuous KL sampling against it on a fixed prompt set is blunt but useful.

### 5. Downstream-outcome signals

- **Independent content-filter trip rate.** If your deployment has a filter downstream of the model, its trip rate over time is a proxy for whether the model is behaving as before. A sudden drop in filter trips despite similar traffic is a signal worth alerting on.
- **Policy-violation escalation rate.** Same idea, measured at the policy layer.
- **Human-review rubric drift.** Randomly sample outputs for human review against a fixed rubric; track rubric scores over time. Expensive but robust.

## What a more robust eval would measure

Rough sketch of an evaluation harness that would be harder to game:

1. **Private, rotated category coverage** — not a fixed public benchmark.
2. **Per-category refusal rate reported as a vector, not a scalar**, with alerting on uneven drops rather than aggregate drops.
3. **OOD / adversarial probes** refreshed faster than public method iteration cycles.
4. **Activation-geometry checks** run alongside behavioral checks against a known-good baseline.
5. **Provenance verification** as a pass/fail gate, not an optional step.
6. **Downstream-outcome cross-checks** so the eval environment and the production environment measure the same thing.
7. **Continuous monitoring**, not a one-shot pre-deploy gate. Modifications can happen after the gate.

No single item is sufficient alone. Defense in depth is the whole point.

## Open research problems

- **Detection of activation-steering-only modifications.** Weight-diff approaches don't work — the weights are unchanged and the modification lives in inference-time hooks.
- **Detection of LoRA / adapter-based modifications.** Detachable; presents a different detection surface than full weight edits.
- **Robust category-coverage evals that stay private** across updates without requiring a growing internal team to maintain them.
- **Fingerprinting standards.** No shared format exists for publishing an "expected activation geometry" alongside a model release. This is a real gap worth filling.
- **Attribution.** Given a detected modification, attributing it to a point in the supply chain is mostly an open problem.

## Defensive literature pointers (non-operational)

See [[Abliteration Research Landscape#Key public papers]] for the shared paper list. On the specifically detection-oriented side:

- Probing / linear-classifier literature (Alain & Bengio 2017 and follow-ons) as a foundation for runtime probes
- Activation-patching / causal-tracing methods (Meng et al. 2022) reused for locating integrity regions rather than modifying them
- Distribution-shift / OOD-detection literature for the perplexity and entropy signal class
- The broader "model auditing" subfield emerging around interpretability-driven monitoring

## Related

- [[Deployment Threat Model - Post-hoc Refusal Removal]] — threat-side sibling
- [[Abliteration Research Landscape]] — descriptive background
- [[Home]]
- [[North Star]]
