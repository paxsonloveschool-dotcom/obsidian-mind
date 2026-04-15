---
date: 2026-04-05
description: Known pitfalls and debugging notes
tags: [brain, gotchas]
type: brain
---

# Gotchas

## GitHub
- Classic PATs need explicit `repo` scope checkbox
- Fine-grained tokens show "none" for classic scopes (misleading)
- `gh auth login --web` times out in ~2min — use `--with-token`
- No SSH keys on this machine — always use HTTPS

## Windows/Bash
- Forward slashes in Git Bash, backslashes in PowerShell
- `gh` CLI needs `export PATH="/c/Program Files/GitHub CLI:$PATH"` each session
- Python not installed yet (pending winget install)

## Claude Code
- `.claudeignore` blocks: sessions/, backups/, shell-snapshots/
- Only CLAUDE.md auto-loads (~450 tokens)
- Write tool requires Read first on existing files

## Python f-strings
- f-string expression parts cannot contain backslashes (SyntaxError before Python 3.12). If you need `\"` inside an f-string, extract the value to a variable first: `name = data.get("client"); f"Hello {name}"` instead of `f"Hello {data.get(\"client\")}"`. Hit this in `Restore Marketing Automation/scripts/invoice_template.py`.

## ICP industry matching
- **Substring matching is too strict for real-world industry strings** because users write "home services hvac" while ICP lists write "Home services (HVAC, plumbing, electrical, roofing, flooring, windows)" — the parenthesis breaks substring matching in both directions. **Solution**: tokenize both sides (strip punctuation, lowercase, split on whitespace, filter short tokens + stopwords), match on set overlap of ≥2 tokens for full credit, ≥1 for partial. Hit this while wiring up [[Restore Marketing Automation/scripts/qualify_lead]]. Pattern applies to any fuzzy string matching against user-written lists.
