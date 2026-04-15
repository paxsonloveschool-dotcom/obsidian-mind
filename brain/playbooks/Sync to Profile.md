---
date: 2026-04-15
description: Playbook for promoting the portable subset of this vault to user-level Claude Code config so omc agents, /verify, /think, and Emergency Token Triage work in every session
tags: [brain, playbook]
type: brain
---

# Playbook: Sync to Profile

## Trigger

Any time the vault gains a new portable capability (an omc agent, a portable slash command, a portable playbook) and you want it available in every Claude Code session on your machine — not just when you're working inside this vault. Also: any time you suspect drift between the vault and your user-level `~/.claude/` config.

Specific triggers:
- You just upgraded this vault (pulled or edited) and new portable items are available
- You've started a new project and want `/verify`, `/think`, and the `omc-*` agents available there without cloning this whole vault
- You want to pick up the latest omc agent adaptations on a second machine
- You suspect `~/.claude/` is stale vs the vault

## The principle

The vault has two tiers of capability:

1. **Vault-specific** — commands, agents, and hooks that depend on `brain/`, `work/`, `org/`, `perf/`, `bases/`, or Obsidian wikilinks. They only make sense inside the vault. They stay at `.claude/` project level.
2. **Portable** — items that work in any Claude Code session regardless of project (pure software engineering agents, generic thinking/verification commands, general playbooks). These should live at `~/.claude/` user level so they're available everywhere.

This playbook promotes the portable tier to user level, safely, with backups and a managed section so nothing the user wrote by hand gets clobbered.

## Inputs

- The vault checked out somewhere on disk (the `scripts/sync-to-profile.sh` script reads from its own vault root)
- Optionally: awareness of what's been added since the last sync

## Steps

### 1. Preview first — always `--dry-run` before touching anything

```bash
bash scripts/sync-to-profile.sh --dry-run
```

Read the output. Confirm the counts look right:
- 17 omc-* agents to `~/.claude/agents/`
- 2 portable commands (`verify.md`, `think.md`) to `~/.claude/commands/`
- 1 portable playbook (`Emergency Token Triage.md`) to `~/.claude/playbooks/`
- Managed section in `~/.claude/CLAUDE.md`
- Provenance marker at `~/.claude/.obsidian-mind-provenance.json`

If the counts don't match what you expect, check `profile-sync-manifest.json` — the script reads it as the source of truth.

### 2. Run the install

```bash
bash scripts/sync-to-profile.sh
```

Any existing file at the target path is backed up to `~/.claude/.obsidian-mind-backup/<timestamp>/` before being overwritten. The managed CLAUDE.md section is bounded by `<!-- obsidian-mind-profile-sync:start ... end -->` markers so it can be updated in place on re-runs without touching anything else in the file.

### 3. Verify the install

Start a **fresh Claude Code session in any non-vault project** and test:

```
/verify hello world
```

The command should be available. If it's not, check:
- Did Claude Code pick up the new commands? (Some versions require a session restart.)
- Is `~/.claude/commands/verify.md` actually there? (`ls ~/.claude/commands/`)
- Does `~/.claude/CLAUDE.md` contain the managed section? (`grep obsidian-mind-profile-sync ~/.claude/CLAUDE.md`)

Also try invoking an omc agent via the Task tool:
```
Agent(subagent_type="omc-critic", ...)
```

If that works, the sync is fully operational.

### 4. Check the provenance marker

```bash
cat ~/.claude/.obsidian-mind-provenance.json
```

Should show:
```json
{
  "source": "obsidian-mind",
  "vault_version": "<current>",
  "vault_root": "<path>",
  "installed_at": "<timestamp>",
  "script": "scripts/sync-to-profile.sh"
}
```

Future sessions read this to know which version is installed.

### 5. Update the Build Log

Append a short entry to `brain/Build Log.md` noting that the sync was run, what version was installed, and on which machine. This is the cross-session record — future-you will want to know when you last synced.

### 6. If you found drift, also fix the vault

If the dry-run revealed that `~/.claude/` already had items installed from an older version, the install itself will fix `~/.claude/`. But: did the vault also lose anything? Run `/vault-audit` to be sure the vault side is clean.

## Outputs

- `~/.claude/agents/omc-*.md` (17 files)
- `~/.claude/commands/verify.md`, `~/.claude/commands/think.md`
- `~/.claude/playbooks/Emergency Token Triage.md`
- Managed section in `~/.claude/CLAUDE.md` (bounded by markers)
- `~/.claude/.obsidian-mind-provenance.json` (install record)
- Backups in `~/.claude/.obsidian-mind-backup/<timestamp>/` (if anything was overwritten)
- Build Log entry noting the sync

## Linking checklist

- [ ] Provenance marker exists at `~/.claude/.obsidian-mind-provenance.json`
- [ ] Managed CLAUDE.md section present and bracketed by `obsidian-mind-profile-sync:start/end`
- [ ] `~/.claude/commands/verify.md` actually works in a fresh non-vault session
- [ ] Build Log reflects the sync

## Done when

- A fresh Claude Code session in any project can use `/verify`, `/think`, and `omc-*` agents
- The provenance marker shows the current vault version
- No user-authored content was clobbered (backups are in `~/.claude/.obsidian-mind-backup/`)

## Uninstall

If you ever want to remove everything the sync installed:

```bash
bash scripts/sync-to-profile.sh --uninstall
```

This removes the installed agents, commands, and playbooks; strips the managed section from `~/.claude/CLAUDE.md` (leaving the rest of the file untouched); and removes the provenance marker. Backups remain in `~/.claude/.obsidian-mind-backup/` for manual recovery.

## Anti-patterns

- **Running `cp -r .claude/ ~/.claude/` by hand.** This drags in all the vault-specific hooks and agents that will fail outside the vault. Always use the sync script — it knows what's portable.
- **Editing the managed CLAUDE.md section by hand.** Anything between the `start/end` markers is overwritten on the next sync. If you want a permanent customization, put it OUTSIDE the markers.
- **Skipping `--dry-run`.** The script is safe, but the habit of previewing before writing is worth keeping.
- **Forgetting to re-run the sync after upgrading the vault.** If the vault adds a new omc agent or a new portable command, the user-level copy is stale until you sync again.
- **Running the sync and not appending to the Build Log.** Cross-session memory loses the fact that you did it.
- **Installing from a stale clone.** If this vault is git-behind vs remote, you'll install an older version. Pull first.

## Related

- [[Sync Self-Description]] — keeps vault self-description in sync with operational layer (this is its counterpart for the user-level layer)
- [[../Capabilities]] — inventory of what's in the vault
- [[../../reference/ohmyclaude-catalog]] — provenance for the omc agents being installed
- [[../../scripts/sync-to-profile.sh]] — the script this playbook drives
- [[../../profile-sync-manifest.json]] — the spec the script reads
