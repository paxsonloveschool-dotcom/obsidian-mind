# Claude Code Plugin Auto-Install

This directory drives **daily discovery + local auto-install** of reputable Claude Code plugins. The vault becomes the source of truth: clone it on a new machine, open a Claude Code session, and the same plugins install themselves.

## What's here

| File | Purpose |
|------|---------|
| `allowlist.yml` | Policy: trusted authors, star threshold, freshness, search queries, denylist |
| `discovered.yml` | Auto-managed manifest of `{name, marketplace, author, ...}` entries the local hook will install |
| `.last-install` | Local cooldown stamp (gitignored) -- prevents reruns within 6h |
| `README.md` | This file |

## Two moving parts

### 1. Continuous discovery + reflection (GitHub Actions)

`.github/workflows/discover-plugins.yml` runs on cron `*/15 * * * *` (every 15 minutes -- effectively continuous; cron's min granularity is 5min, 15 keeps us safely under GitHub's 1000 req/hr API limit). Manual trigger available via `workflow_dispatch`.

Each cycle runs two scripts:

**`.github/scripts/discover_plugins.py`** -- the discovery pass:
1. Reads `allowlist.yml`.
2. Searches GitHub for repos matching `search_queries`.
3. Keeps a repo if (a) its owner is in `authors`, OR (b) `stars >= min_stars` AND `pushed within max_age_days`.
4. Fetches `.claude-plugin/marketplace.json` from each surviving repo to confirm it's a real Claude Code marketplace.
5. Appends new `{marketplace, name}` pairs to `discovered.yml`.

**`.github/scripts/reflect_plugins.py`** -- the self-improvement pass:
1. Reads the discovery script's stdout.
2. Appends a timestamped entry to `research-log.md` recording what was found, what was new, current manifest size.
3. This is the agent's durable memory across cycles -- inspect it to see what the loop has been doing.

Both files are committed in one cycle commit (`chore(plugins): discovery cycle YYYY-MM-DDTHH:MMZ [skip ci]`). Workflow runs are serialized via `concurrency:` -- a slow cycle won't pile up on the next tick.

### 2. Local install (SessionStart hook)

`.claude/scripts/auto-install-plugins.sh` runs from the `SessionStart` hook in `.claude/settings.json`. On each session start (with a 6h cooldown):

1. Parses `discovered.yml`.
2. For each entry, runs `claude plugin marketplace add <repo>` if not already present.
3. Runs `claude plugin install <name>@<repo>` if not already installed.
4. Logs everything to `thinking/session-logs/plugin-install-YYYY-MM-DD.log`.

Never fails the session -- errors are logged and swallowed.

## How to share this with someone else

Recipient steps after cloning the repo:

```bash
git clone <this-repo-url> obsidian-mind
cd obsidian-mind
claude  # open Claude Code; SessionStart hook adds marketplaces + installs plugins
```

That's it. The first session takes ~1-2 min to install everything. Subsequent sessions are no-ops within the cooldown window.

## Tuning

| Want | Change |
|------|--------|
| More frequent discovery | Edit cron in `.github/workflows/discover-plugins.yml`. Min granularity 5min |
| Add a trusted author | Append to `authors:` in `allowlist.yml` |
| Block a plugin | Add `owner/repo` to `denylist:` in `allowlist.yml` |
| Force re-install now | `rm .claude/plugins/.last-install` then start a new session |
| Disable auto-install | Remove the second hook entry in `.claude/settings.json` under `SessionStart` |
| Audit what was installed | `cat thinking/session-logs/plugin-install-*.log` |

## Risk note

`auto-install` is opt-in trust. Once `discovered.yml` contains an entry, the local hook runs `claude plugin install` without further prompting. Anyone who can push to this repo can append to `discovered.yml`. Protect the branch (require PR review on `main`) before sharing widely.
