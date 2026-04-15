#!/usr/bin/env python3
"""Batch vault validation for CI and local use.

Runs these checks across the whole vault:

1. Frontmatter — every user-authored .md note has `date`, `description`, `tags`
2. Wikilinks — notes over 300 chars have at least one [[link]]
3. Required files exist — Home.md, CLAUDE.md, vault-manifest.json, etc.
4. settings.json is valid JSON
5. settings.json hook commands reference scripts that exist and are executable
6. .sh hook scripts pass `bash -n` syntax check
7. .py hook scripts pass `python -m py_compile`

Exit codes:
- 0: all checks passed
- 1: one or more hard errors (missing file, bad syntax, invalid JSON)
- 2: soft warnings only (missing frontmatter field, no wikilinks)

CLI:
    python3 .claude/scripts/check-vault.py              # strict: warnings fail
    python3 .claude/scripts/check-vault.py --warn-only  # warnings don't fail
    python3 .claude/scripts/check-vault.py --quiet      # only show failures
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

# Folders to skip entirely (not vault notes)
SKIP_DIRS = {".git", ".github", ".obsidian", ".claude", "templates", "thinking", "node_modules"}

# Files in the vault root that are not notes
ROOT_NON_NOTES = {
    "README.md",
    "README.ja.md",
    "README.ko.md",
    "README.zh-CN.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "CLAUDE.md",
    "LICENSE",
    "LICENSE.md",
}

# Required top-level files that must exist
REQUIRED_FILES = [
    "Home.md",
    "CLAUDE.md",
    "README.md",
    "vault-manifest.json",
    ".claude/settings.json",
]

# Scripts that settings.json hooks reference — these must exist and be executable
# (We'll also cross-check by parsing settings.json, but this is the minimum set.)
REQUIRED_SCRIPTS = [
    ".claude/scripts/session-start.sh",
    ".claude/scripts/classify-message.py",
    ".claude/scripts/validate-write.py",
    ".claude/scripts/find-python.sh",
    ".claude/scripts/pre-compact.sh",
]


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def err(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def ok(self) -> bool:
        return not self.errors and not self.warnings


def iter_vault_notes(root: Path):
    """Yield every user-authored .md note path in the vault."""
    for dirpath, dirnames, filenames in os.walk(root):
        # prune skipped dirs in place
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        rel_dir = Path(dirpath).relative_to(root)
        for name in filenames:
            if not name.endswith(".md"):
                continue
            rel = rel_dir / name
            # Skip root-level non-note files
            if rel_dir == Path("."):
                if name in ROOT_NON_NOTES:
                    continue
            # Skip README.md in subfolders (they are index docs, not vault notes)
            if name == "README.md":
                continue
            yield root / rel


def check_frontmatter(path: Path, report: Report) -> None:
    try:
        content = path.read_text(encoding="utf-8")
    except Exception as e:
        report.err(f"{path}: could not read ({e})")
        return

    rel = path.name
    if not content.startswith("---"):
        report.warn(f"{path}: missing YAML frontmatter")
        return

    parts = content.split("---", 2)
    if len(parts) < 3:
        report.warn(f"{path}: malformed frontmatter (no closing ---)")
        return

    fm = parts[1]
    for field in ("date", "description", "tags"):
        if f"{field}:" not in fm and f"{field} :" not in fm:
            report.warn(f"{path}: frontmatter missing `{field}`")

    # Wikilinks
    if len(content) > 300 and "[[" not in content:
        report.warn(f"{path}: no [[wikilinks]] found (note over 300 chars)")


def check_required_files(root: Path, report: Report) -> None:
    for rel in REQUIRED_FILES:
        p = root / rel
        if not p.exists():
            report.err(f"required file missing: {rel}")


def check_script_permissions(root: Path, report: Report) -> None:
    for rel in REQUIRED_SCRIPTS:
        p = root / rel
        if not p.exists():
            report.err(f"required script missing: {rel}")
            continue
        if not os.access(p, os.X_OK):
            report.err(f"script not executable: {rel} (run `chmod +x {rel}`)")


def check_settings_json(root: Path, report: Report) -> None:
    p = root / ".claude" / "settings.json"
    if not p.exists():
        report.err(".claude/settings.json missing")
        return
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        report.err(f".claude/settings.json: invalid JSON ({e})")
        return

    # Walk the hooks structure and collect referenced command strings
    hooks = data.get("hooks", {})
    for hook_event, entries in hooks.items():
        if not isinstance(entries, list):
            continue
        for entry in entries:
            for inner in entry.get("hooks", []) if isinstance(entry, dict) else []:
                cmd = inner.get("command", "") if isinstance(inner, dict) else ""
                # Heuristic: look for .claude/scripts/... references
                for token in cmd.split():
                    if ".claude/scripts/" in token or ".claude\\scripts\\" in token:
                        # strip shell quoting
                        clean = token.strip("'\"")
                        # skip substitution tokens like $CLAUDE_PROJECT_DIR
                        if clean.startswith("$") or clean.startswith("${"):
                            continue
                        # removeprefix (not lstrip — lstrip strips chars, not a prefix)
                        rel = clean.removeprefix("./") if hasattr(clean, "removeprefix") else (
                            clean[2:] if clean.startswith("./") else clean
                        )
                        script_path = root / rel
                        if not script_path.exists():
                            report.err(
                                f".claude/settings.json {hook_event} hook references missing script: {clean}"
                            )


def check_shell_syntax(root: Path, report: Report) -> None:
    scripts = list((root / ".claude" / "scripts").glob("*.sh"))
    for sh in scripts:
        result = subprocess.run(
            ["bash", "-n", str(sh)],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            report.err(f"{sh}: bash syntax error\n{result.stderr.strip()}")


def check_python_syntax(root: Path, report: Report) -> None:
    scripts = list((root / ".claude" / "scripts").glob("*.py"))
    for py in scripts:
        result = subprocess.run(
            [sys.executable, "-m", "py_compile", str(py)],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            report.err(f"{py}: python syntax error\n{result.stderr.strip()}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--warn-only", action="store_true", help="warnings do not cause exit 1")
    parser.add_argument("--quiet", action="store_true", help="suppress warning output, only show errors")
    parser.add_argument("--root", default=".", help="vault root (default: cwd)")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    report = Report()

    # Structural checks
    check_required_files(root, report)
    check_script_permissions(root, report)
    check_settings_json(root, report)
    check_shell_syntax(root, report)
    check_python_syntax(root, report)

    # Per-note checks
    for note in iter_vault_notes(root):
        check_frontmatter(note, report)

    # Report
    if report.errors:
        print(f"ERRORS ({len(report.errors)}):", file=sys.stderr)
        for e in report.errors:
            print(f"  [ERR] {e}", file=sys.stderr)
    if report.warnings and not args.quiet:
        print(f"WARNINGS ({len(report.warnings)}):", file=sys.stderr)
        for w in report.warnings:
            print(f"  [WARN] {w}", file=sys.stderr)

    note_count = len(list(iter_vault_notes(root)))

    if report.errors:
        print(
            f"FAIL: {note_count} notes checked, {len(report.errors)} error(s), {len(report.warnings)} warning(s)",
            file=sys.stderr,
        )
        return 1
    if report.warnings and not args.warn_only:
        print(
            f"FAIL: {note_count} notes checked, {len(report.warnings)} warning(s) (use --warn-only to allow)",
            file=sys.stderr,
        )
        return 2
    if report.warnings:
        print(f"OK (warn-only): {note_count} notes checked, {len(report.warnings)} warning(s)")
    else:
        print(f"OK: {note_count} notes checked, no issues")
    return 0


if __name__ == "__main__":
    sys.exit(main())
