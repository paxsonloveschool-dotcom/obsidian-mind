#!/usr/bin/env python3
"""
Daily plugin discovery for Claude Code.

Reads .claude/plugins/allowlist.yml, queries the GitHub search API for
repos that look like Claude Code plugin marketplaces, filters by the
policy (allowlisted author OR stars>=N AND fresh), validates the repo
hosts a real marketplace.json, and appends new entries to
.claude/plugins/discovered.yml.

Idempotent: existing entries (matched by marketplace+name) are skipped.
Requires GITHUB_TOKEN in env.
"""
from __future__ import annotations
import json
import os
import sys
import time
import urllib.request
import urllib.parse
from datetime import datetime, timezone, timedelta
from pathlib import Path

try:
    import yaml
except ImportError:
    print("PyYAML required: pip install pyyaml", file=sys.stderr)
    sys.exit(2)

ROOT = Path(__file__).resolve().parents[2]
ALLOWLIST = ROOT / ".claude" / "plugins" / "allowlist.yml"
DISCOVERED = ROOT / ".claude" / "plugins" / "discovered.yml"
GH = "https://api.github.com"


def gh(path: str, params: dict | None = None) -> dict:
    url = f"{GH}{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        sys.exit("GITHUB_TOKEN not set")
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "obsidian-mind-plugin-discovery",
        },
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read())
        except Exception as e:
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def search_repos(query: str, per_page: int = 50) -> list[dict]:
    return gh("/search/repositories", {"q": query, "per_page": per_page}).get("items", [])


def get_marketplace_manifest(owner: str, repo: str) -> dict | None:
    """Fetch .claude-plugin/marketplace.json from default branch, if present."""
    try:
        meta = gh(f"/repos/{owner}/{repo}/contents/.claude-plugin/marketplace.json")
        import base64
        content = base64.b64decode(meta["content"]).decode("utf-8")
        return json.loads(content)
    except Exception:
        return None


def candidate_keys(plugins_block) -> set[tuple[str, str]]:
    """Build {(marketplace, name)} for dedupe."""
    return {(p["marketplace"], p["name"]) for p in plugins_block or []}


def main() -> int:
    policy = yaml.safe_load(ALLOWLIST.read_text())
    authors = set(policy.get("authors", []))
    min_stars = int(policy.get("min_stars", 1000))
    max_age = int(policy.get("max_age_days", 90))
    queries = policy.get("search_queries", [])
    denylist = set(policy.get("denylist", []))
    cutoff = datetime.now(timezone.utc) - timedelta(days=max_age)

    discovered = yaml.safe_load(DISCOVERED.read_text()) or {"plugins": []}
    existing = candidate_keys(discovered.get("plugins"))
    today = datetime.now(timezone.utc).date().isoformat()
    added: list[dict] = []

    seen_repos: set[str] = set()
    candidates: list[dict] = []
    for q in queries:
        try:
            items = search_repos(q)
        except Exception as e:
            print(f"search failed for {q!r}: {e}", file=sys.stderr)
            continue
        for it in items:
            full = it["full_name"]
            if full in seen_repos:
                continue
            seen_repos.add(full)
            candidates.append(it)

    for repo in candidates:
        owner = repo["owner"]["login"]
        name = repo["name"]
        full = repo["full_name"]
        if full in denylist:
            continue
        stars = repo.get("stargazers_count", 0)
        pushed_at = datetime.fromisoformat(repo["pushed_at"].replace("Z", "+00:00"))

        reason = None
        if owner in authors:
            reason = "author-allowlisted"
        elif stars >= min_stars and pushed_at >= cutoff:
            reason = "popularity-threshold"
        else:
            continue

        manifest = get_marketplace_manifest(owner, name)
        if not manifest:
            continue
        for plugin_entry in manifest.get("plugins", []):
            plugin_name = plugin_entry.get("name")
            if not plugin_name:
                continue
            key = (full, plugin_name)
            if key in existing:
                continue
            existing.add(key)
            added.append(
                {
                    "name": plugin_name,
                    "marketplace": full,
                    "author": owner,
                    "stars": stars,
                    "pushed_at": pushed_at.date().isoformat(),
                    "reason": reason,
                    "discovered": today,
                }
            )

    if not added:
        print("no new plugins discovered")
        return 0

    discovered["plugins"].extend(added)
    DISCOVERED.write_text(
        "# Auto-managed by .github/workflows/discover-plugins.yml.\n"
        "# DO NOT edit by hand.\n\n"
        + yaml.safe_dump(discovered, sort_keys=False, default_flow_style=False)
    )
    for a in added:
        print(f"added: {a['marketplace']}::{a['name']} ({a['reason']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
