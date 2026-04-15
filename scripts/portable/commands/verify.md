---
description: "Verify a change, claim, or note really works before claiming completion. Turns vague 'it should work' into concrete evidence."
---

# Verify

Turn vague "it should work" claims into concrete evidence — whether the thing being verified is a code change, a factual claim, a document's completeness, or a process outcome.

This is the **portable** version of the verify command. The source of truth is the `obsidian-mind` vault; installed at user level by `scripts/sync-to-profile.sh` so it's available in every Claude Code session.

## Usage

```
/verify <target>
```

Examples:
- `/verify the auth fix actually handles expired tokens` (code)
- `/verify the claim "shipped 47 PRs in Q1" in my draft` (factual claim)
- `/verify this document is complete` (document)
- `/verify the deploy went through` (process)

## The principle

Don't say something is complete without evidence. Prefer narrow, direct checks over broad sweeps. Report what you actually verified, not what you assume.

## Workflow

### 1. Identify What Must Be Proven

Parse the argument. Decide the verification class:

| Target class | What to prove |
|--------------|--------------|
| **Code change** | The intended behavior happens; no regressions |
| **Document** | Structure complete, references resolve, content self-consistent |
| **Factual claim** | Claim traces to a source that actually supports it |
| **Process/workflow** | Each step's output is what the step promised |
| **Decision** | Decision is actionable, consequences documented, alternatives considered |

### 2. Pick the Narrowest Verification Path

Order of preference:

**For code:**
1. Existing tests (run them — targeted if possible)
2. Typecheck / build
3. Narrow direct command checks (curl an endpoint, query a DB, grep for a pattern)
4. Manual/interactive validation — only if automation doesn't reach

**For documents:**
1. Check structure (headings, required sections)
2. Verify references (links resolve, files exist)
3. Read end-to-end for self-consistency
4. Check any claims against their sources

**For factual claims:**
1. Search for the claim's source (grep, git log, database query, API call)
2. Classify as: **verified** (found exact source), **supportable** (found related evidence), **unverified** (no source), **contradicted** (evidence disagrees)

**For process/workflow:**
1. Check each step's stated output exists
2. Verify the output matches what the step promised
3. Check downstream steps would accept it

### 3. Run the Checks

Execute the smallest set of checks that actually proves the thing. Don't run the entire test suite if one file covers it. Don't read 20 files if 2 are enough.

### 4. Report Evidence

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
```

## Rules

- **Do not claim completion without evidence.** If you can't verify it, say so.
- **Include failures clearly.** Don't soften them.
- **If no realistic verification path exists, say that explicitly** — don't bluff.
- **Prefer concise evidence.** One line of pass > 30 lines of log.
- **Distinguish levels.** "Tests pass" ≠ "works in production". Say which.
- **Don't broaden scope.** Verify only what was asked.

## Verdicts

| Verdict | Meaning |
|---------|---------|
| **VERIFIED** | Every claim checked, every check passed |
| **PARTIALLY VERIFIED** | Most claims checked, some gaps noted |
| **NOT VERIFIED** | Checks couldn't be run or didn't cover the claim |
| **CONTRADICTED** | Evidence disagrees with the claim |

## Related agents

- `omc-verifier` — purpose-built verifier agent (also installed by sync-to-profile.sh)
- `omc-critic` — for adversarial review when verification alone isn't enough

Target to verify:
$ARGUMENTS
