---
description: "Verify a change, claim, or note really works/holds before claiming completion. Turns vague 'it should work' into concrete evidence."
---

# Verify

*Adapted from oh-my-claudecode's `verify` skill. See [[../../reference/ohmyclaude-catalog]].*

Turn vague "it should work" claims into concrete evidence — whether the thing being verified is a code change, a vault note's completeness, a factual claim in a review draft, or a process outcome.

## Usage

```
/verify <target>
```

Examples:
- `/verify the auth fix actually handles expired tokens` (code)
- `/verify work/active/Project Alpha.md is complete` (vault note)
- `/verify the claim "shipped 47 PRs in Q1" in my self-review draft` (factual claim)

## The principle

Don't say something is complete without evidence. Prefer narrow, direct checks over broad sweeps. Report what you actually verified, not what you assume.

## Workflow

### 1. Identify What Must Be Proven

Parse `$ARGUMENTS`. Decide the verification class:

| Target class | What to prove |
|--------------|--------------|
| **Code change** | The intended behavior happens; no regressions |
| **Vault note** | Frontmatter complete, wikilinks present, folder correct, content self-consistent |
| **Factual claim** | Claim traces to a vault source that actually supports it |
| **Process/workflow** | Each step's output is what the step promised |
| **Decision** | Decision is actionable, consequences are documented, alternatives considered |

### 2. Pick the Narrowest Verification Path

Order of preference:

**For code:**
1. Existing tests (run them — targeted if possible)
2. Typecheck / build
3. Narrow direct command checks (curl an endpoint, query a DB, grep for a pattern)
4. Manual/interactive validation (browser, REPL) — only if automation doesn't reach

**For vault notes:**
1. Run the `validate-write.py` hook equivalent — check frontmatter, wikilinks, folder placement
2. Check type-specific required fields (quarter, ticket, person, etc.)
3. Read the note end-to-end for self-consistency
4. Check that any linked notes actually exist
5. Check that the note appears in relevant indexes

**For factual claims:**
1. Invoke `review-fact-checker` agent if the claim is in a review draft
2. Otherwise, grep the vault for the claim's source
3. Classify as: **verified** (found exact source), **supportable** (found related evidence), **unverified** (no vault source), **contradicted** (vault disagrees)

**For process/workflow:**
1. Check each step's stated output exists
2. Verify the output matches what the step promised
3. Check that downstream steps would accept it

### 3. Run the Checks

Execute the smallest set of checks that actually proves the thing. Don't run the entire test suite if a single test file covers the behavior. Don't read 20 files if 2 are enough.

### 4. Report Evidence

Use this structure:

```
## Verified: <target>

### What Was Proven
- <specific behavior or claim>

### Checks Run
- [x] <Check 1 — specific command or action>
- [x] <Check 2>

### Results
- ✓ <What passed, with minimal evidence snippet>
- ✗ <What failed, with exact failure message>
- ? <What could not be checked and why>

### Verdict
**VERIFIED** / **PARTIALLY VERIFIED** / **NOT VERIFIED** / **CONTRADICTED**

### Unverified Items
- <thing 1 — why it couldn't be verified>
```

## Rules

- **Do not claim completion without evidence.** If you can't verify it, say so.
- **If a check fails, include the failure clearly.** Don't soften it.
- **If no realistic verification path exists, say that explicitly** — don't bluff.
- **Prefer concise evidence summaries over noisy logs.** One line of pass > 30 lines of log.
- **Distinguish levels of verification.** "Tests pass" ≠ "works in production". Say which.
- **Don't broaden scope.** Verify only what was asked.

## Verification Verdicts

| Verdict | Meaning |
|---------|---------|
| **VERIFIED** | Every claim checked, every check passed |
| **PARTIALLY VERIFIED** | Most claims checked, some gaps noted |
| **NOT VERIFIED** | Checks couldn't be run or didn't cover the claim |
| **CONTRADICTED** | Evidence disagrees with the claim |

## Important

- **This is not a rubber stamp.** `/verify` exists because people sometimes claim "done" without evidence. Being honest about failures is the value.
- **For review drafts, always invoke `review-fact-checker`** — it's purpose-built for verifying review claims.
- **For work notes, verification is PostToolUse-hook-adjacent** — the hook catches basic stuff; `/verify` does the deeper check.
- **Don't verify what isn't asked.** Scope creep during verification is a smell.

## Related

- [[../../brain/playbooks/Run Vault Audit]] — vault-wide verification
- [[../../.claude/agents/review-fact-checker]] — claim-level verification for reviews
- [[../../.claude/agents/omc-verifier]] — omc-adapted verifier agent
- [[../../reference/ohmyclaude-catalog]] — provenance

Target to verify:
$ARGUMENTS
