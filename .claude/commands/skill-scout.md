# Skill Scout

Run the daily skill-discovery agent on-demand. Searches GitHub for newly-released Claude Code skills, evaluates them, and proposes adoptions for the vault.

## Usage

```
/skill-scout [lookback_days]
```

Defaults to looking back 1 day. Pass an integer to scan a wider window — e.g. `/skill-scout 7` for the last week.

## What happens

1. Invokes the `skill-scout` subagent (`.claude/agents/skill-scout.md`)
2. Subagent reads its playbook at `.github/scripts/skill-scout-prompt.md`
3. Searches GitHub via MCP, evaluates candidates, writes `thinking/skill-scout-YYYY-MM-DD.md`
4. If anything is worth adopting, cherry-picks `SKILL.md` files into `.claude/skills/<name>/` and registers them in `brain/Skills.md`

## When to run manually

- After missing a few days of cron runs (use a larger lookback)
- Before reviewing the daily skill-scout PR — to verify the cron's findings
- When you've heard about a hot new skill and want to confirm it's been discovered

## Related

- Daily cron: `.github/workflows/skill-scout.yml` (runs 09:17 UTC)
- Playbook: `.github/scripts/skill-scout-prompt.md`
- Subagent: `.claude/agents/skill-scout.md`
- Setup: ensure `ANTHROPIC_API_KEY` is set in repo Actions secrets for the cron to work
