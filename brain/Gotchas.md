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
