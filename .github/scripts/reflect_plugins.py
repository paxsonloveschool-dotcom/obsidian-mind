#!/usr/bin/env python3
"""
Reflection pass for the plugin discovery loop.

Reads the discovery script's stdout (DISCOVERY_OUTPUT) plus the current
discovered.yml, and appends a structured entry to research-log.md so the
agent has an auditable record of every cycle. The log is the
self-improvement memory: what was found, what was new, what was
rejected, what was reconsidered.
"""
from __future__ import annotations
import os
import sys
import datetime as dt
from pathlib import Path

try:
    import yaml
except ImportError:
    print("PyYAML required", file=sys.stderr)
    sys.exit(2)

ROOT = Path(__file__).resolve().parents[2]
DISCOVERED = ROOT / ".claude" / "plugins" / "discovered.yml"
LOG = ROOT / ".claude" / "plugins" / "research-log.md"
OUT = os.environ.get("DISCOVERY_OUTPUT", "/tmp/discover.out")


def parse_added(text: str) -> list[str]:
    return [
        line[len("added: "):].strip()
        for line in text.splitlines()
        if line.startswith("added: ")
    ]


def main() -> int:
    now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    discovery_out = Path(OUT).read_text() if Path(OUT).exists() else ""
    added = parse_added(discovery_out)

    data = yaml.safe_load(DISCOVERED.read_text()) or {"plugins": []}
    total = len(data.get("plugins", []))

    header = "# Plugin discovery research log\n\nAppend-only audit trail. Newest first.\n\n---\n\n"
    if not LOG.exists():
        LOG.write_text(header)

    body = LOG.read_text()
    if body.startswith("# Plugin discovery"):
        prefix, rest = body.split("---\n", 1)
    else:
        prefix, rest = header, body

    if added:
        added_block = "\n".join(f"  - {a}" for a in added)
        note = f"discovered {len(added)} new plugin(s); manifest now tracks {total}"
    else:
        added_block = "  - (none)"
        note = f"no new plugins; manifest unchanged at {total}"

    entry = (
        f"## {now}\n\n"
        f"- **Outcome**: {note}\n"
        f"- **Added this cycle**:\n{added_block}\n\n"
    )

    LOG.write_text(prefix + "---\n\n" + entry + rest.lstrip("\n"))
    print(f"reflection logged ({len(added)} added; manifest={total})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
