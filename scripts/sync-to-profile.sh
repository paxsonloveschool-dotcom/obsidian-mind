#!/bin/bash
# sync-to-profile.sh — install portable obsidian-mind items to user-level Claude Code config
#
# Reads profile-sync-manifest.json to know what's portable. Installs omc agents,
# portable command versions, portable playbooks, and a managed section of
# ~/.claude/CLAUDE.md. Safe: backs up existing files, supports --dry-run.
#
# Usage:
#   scripts/sync-to-profile.sh              # install / update
#   scripts/sync-to-profile.sh --dry-run    # show what would happen
#   scripts/sync-to-profile.sh --help       # help
#   scripts/sync-to-profile.sh --uninstall  # remove everything installed by this script
#
set -euo pipefail

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
MANIFEST="$VAULT_ROOT/profile-sync-manifest.json"
PROVENANCE_FILE="$CLAUDE_HOME/.obsidian-mind-provenance.json"
BACKUP_ROOT="$CLAUDE_HOME/.obsidian-mind-backup"

DRY_RUN=false
UNINSTALL=false

# -----------------------------------------------------------------------------
# Colors (only if stdout is a terminal)
# -----------------------------------------------------------------------------

if [ -t 1 ]; then
  BOLD=$(printf '\033[1m')
  DIM=$(printf '\033[2m')
  GREEN=$(printf '\033[32m')
  YELLOW=$(printf '\033[33m')
  RED=$(printf '\033[31m')
  CYAN=$(printf '\033[36m')
  RESET=$(printf '\033[0m')
else
  BOLD=; DIM=; GREEN=; YELLOW=; RED=; CYAN=; RESET=
fi

log()     { echo "${CYAN}==>${RESET} $*"; }
warn()    { echo "${YELLOW}warn:${RESET} $*" >&2; }
err()     { echo "${RED}error:${RESET} $*" >&2; }
ok()      { echo "${GREEN}ok:${RESET} $*"; }
action()  { if $DRY_RUN; then echo "${DIM}would:${RESET} $*"; else echo "${GREEN}do:${RESET} $*"; fi; }

# -----------------------------------------------------------------------------
# Arg parsing
# -----------------------------------------------------------------------------

show_help() {
  cat <<EOF
${BOLD}sync-to-profile.sh${RESET} — install portable obsidian-mind items to user-level Claude Code

${BOLD}USAGE${RESET}
  scripts/sync-to-profile.sh [options]

${BOLD}OPTIONS${RESET}
  --dry-run    Show what would be done without making changes
  --uninstall  Remove everything this script installed (restores backups if present)
  --help       Show this help

${BOLD}WHAT IT DOES${RESET}
  Installs the portable subset of this vault to ${CLAUDE_HOME}:
    - 17 omc-* subagents to ${CLAUDE_HOME}/agents/
    - 2 portable slash commands (/verify, /think) to ${CLAUDE_HOME}/commands/
    - 1 portable playbook (Emergency Token Triage) to ${CLAUDE_HOME}/playbooks/
    - A managed section appended to ${CLAUDE_HOME}/CLAUDE.md

  Before overwriting any existing file, it backs it up to ${BACKUP_ROOT}/<timestamp>/

  After a successful install, writes ${PROVENANCE_FILE} recording the vault
  version, source path, and install time so future runs know what's managed.

${BOLD}SAFETY${RESET}
  - Never deletes user files without backing them up first
  - Never edits outside ${CLAUDE_HOME}
  - --dry-run shows every action before you commit
  - The managed CLAUDE.md section is bounded by HTML comment markers;
    content outside the markers is never touched

${BOLD}SOURCE${RESET}
  Vault root: ${VAULT_ROOT}
  Manifest:   ${MANIFEST}
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)   DRY_RUN=true; shift ;;
    --uninstall) UNINSTALL=true; shift ;;
    --help|-h)   show_help; exit 0 ;;
    *)           err "unknown option: $1"; echo "try --help" >&2; exit 2 ;;
  esac
done

# -----------------------------------------------------------------------------
# Preflight
# -----------------------------------------------------------------------------

if [ ! -f "$MANIFEST" ]; then
  err "manifest not found: $MANIFEST"
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1 && ! command -v python >/dev/null 2>&1; then
  err "python is required to read the manifest"
  exit 1
fi

PYTHON=$(command -v python3 || command -v python)

# Read manifest fields via Python (no jq dependency)
read_manifest() {
  "$PYTHON" - "$MANIFEST" "$1" <<'PY'
import json, sys
with open(sys.argv[1]) as f:
    m = json.load(f)
# sys.argv[2] is a dotted path like "portable.agents.files" or "vault_version"
path = sys.argv[2].split(".")
v = m
for k in path:
    v = v[k]
if isinstance(v, list):
    print("\n".join(v))
else:
    print(v)
PY
}

VAULT_VERSION=$(read_manifest "vault_version")
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"

echo
echo "${BOLD}obsidian-mind profile sync${RESET}"
echo "  vault version: $VAULT_VERSION"
echo "  vault root:    $VAULT_ROOT"
echo "  target:        $CLAUDE_HOME"
if $DRY_RUN; then echo "  ${YELLOW}DRY RUN${RESET} — no changes will be made"; fi
if $UNINSTALL; then echo "  ${YELLOW}UNINSTALL${RESET}"; fi
echo

# -----------------------------------------------------------------------------
# Uninstall path
# -----------------------------------------------------------------------------

if $UNINSTALL; then
  log "uninstalling obsidian-mind items from $CLAUDE_HOME"

  # Remove installed agents (only omc-*)
  while IFS= read -r agent; do
    [ -z "$agent" ] && continue
    target="$CLAUDE_HOME/agents/$agent"
    if [ -f "$target" ]; then
      action "rm $target"
      $DRY_RUN || rm "$target"
    fi
  done < <(read_manifest "portable.agents.files")

  # Remove installed portable commands
  while IFS= read -r cmd; do
    [ -z "$cmd" ] && continue
    target="$CLAUDE_HOME/commands/$cmd"
    if [ -f "$target" ]; then
      action "rm $target"
      $DRY_RUN || rm "$target"
    fi
  done < <(read_manifest "portable.commands.files")

  # Remove installed portable playbooks
  while IFS= read -r pb; do
    [ -z "$pb" ] && continue
    target="$CLAUDE_HOME/playbooks/$pb"
    if [ -f "$target" ]; then
      action "rm $target"
      $DRY_RUN || rm "$target"
    fi
  done < <(read_manifest "portable.playbooks.files")

  # Remove the managed CLAUDE.md section
  if [ -f "$CLAUDE_HOME/CLAUDE.md" ]; then
    action "strip managed section from $CLAUDE_HOME/CLAUDE.md"
    if ! $DRY_RUN; then
      "$PYTHON" - "$CLAUDE_HOME/CLAUDE.md" <<'PY'
import sys, re
path = sys.argv[1]
with open(path) as f:
    content = f.read()
new = re.sub(
    r"\n*<!-- obsidian-mind-profile-sync:start.*?obsidian-mind-profile-sync:end -->\n*",
    "\n",
    content,
    flags=re.DOTALL,
)
with open(path, "w") as f:
    f.write(new)
PY
    fi
  fi

  # Remove provenance marker
  if [ -f "$PROVENANCE_FILE" ]; then
    action "rm $PROVENANCE_FILE"
    $DRY_RUN || rm "$PROVENANCE_FILE"
  fi

  ok "uninstall complete"
  exit 0
fi

# -----------------------------------------------------------------------------
# Install path
# -----------------------------------------------------------------------------

# Ensure target directories exist
for dir in "$CLAUDE_HOME" "$CLAUDE_HOME/agents" "$CLAUDE_HOME/commands" "$CLAUDE_HOME/playbooks"; do
  if [ ! -d "$dir" ]; then
    action "mkdir -p $dir"
    $DRY_RUN || mkdir -p "$dir"
  fi
done

# Backup helper — copies a target to the backup dir before we touch it
backup_if_exists() {
  local target="$1"
  if [ -f "$target" ]; then
    local rel="${target#$CLAUDE_HOME/}"
    local backup_path="$BACKUP_DIR/$rel"
    action "backup $target -> $backup_path"
    if ! $DRY_RUN; then
      mkdir -p "$(dirname "$backup_path")"
      cp "$target" "$backup_path"
    fi
  fi
}

install_file() {
  local source="$1"
  local target="$2"
  if [ ! -f "$source" ]; then
    err "source missing: $source"
    return 1
  fi
  backup_if_exists "$target"
  action "install $source -> $target"
  $DRY_RUN || cp "$source" "$target"
}

# Install omc agents (line-reading loop handles filenames with spaces)
log "installing ${BOLD}17 omc-* subagents${RESET}"
while IFS= read -r agent; do
  [ -z "$agent" ] && continue
  install_file "$VAULT_ROOT/.claude/agents/$agent" "$CLAUDE_HOME/agents/$agent"
done < <(read_manifest "portable.agents.files")

# Install portable commands
log "installing ${BOLD}portable slash commands${RESET}"
while IFS= read -r cmd; do
  [ -z "$cmd" ] && continue
  install_file "$VAULT_ROOT/scripts/portable/commands/$cmd" "$CLAUDE_HOME/commands/$cmd"
done < <(read_manifest "portable.commands.files")

# Install portable playbooks
log "installing ${BOLD}portable playbooks${RESET}"
while IFS= read -r pb; do
  [ -z "$pb" ] && continue
  install_file "$VAULT_ROOT/scripts/portable/playbooks/$pb" "$CLAUDE_HOME/playbooks/$pb"
done < <(read_manifest "portable.playbooks.files")

# Install / update the managed CLAUDE.md section
log "updating ${BOLD}managed section${RESET} in $CLAUDE_HOME/CLAUDE.md"
SNIPPET_FILE="$VAULT_ROOT/scripts/portable/CLAUDE-snippets/user-level-section.md"
CLAUDE_MD="$CLAUDE_HOME/CLAUDE.md"

if [ ! -f "$SNIPPET_FILE" ]; then
  err "snippet missing: $SNIPPET_FILE"
  exit 1
fi

backup_if_exists "$CLAUDE_MD"

if ! $DRY_RUN; then
  "$PYTHON" - "$CLAUDE_MD" "$SNIPPET_FILE" "$TIMESTAMP" <<'PY'
import sys, os, re

claude_md, snippet_path, ts = sys.argv[1], sys.argv[2], sys.argv[3]

with open(snippet_path) as f:
    snippet = f.read()

# Inject the timestamp into the snippet's "Last synced" line
snippet = re.sub(
    r"\*\*Last synced\*\*: \(filled in by the script\)",
    f"**Last synced**: {ts}",
    snippet,
)

existing = ""
if os.path.exists(claude_md):
    with open(claude_md) as f:
        existing = f.read()

start_marker = "<!-- obsidian-mind-profile-sync:start"
end_marker = "obsidian-mind-profile-sync:end -->"

if start_marker in existing and end_marker in existing:
    # Replace the managed section in place
    new = re.sub(
        r"<!-- obsidian-mind-profile-sync:start.*?obsidian-mind-profile-sync:end -->",
        snippet.rstrip(),
        existing,
        flags=re.DOTALL,
    )
else:
    # Append — with a leading blank line for separation
    if existing and not existing.endswith("\n"):
        existing += "\n"
    if existing and not existing.endswith("\n\n"):
        existing += "\n"
    new = existing + snippet

with open(claude_md, "w") as f:
    f.write(new)
PY
else
  action "would write managed section (${TIMESTAMP}) into $CLAUDE_MD"
fi

# Write provenance marker
log "writing provenance marker"
if ! $DRY_RUN; then
  "$PYTHON" - "$PROVENANCE_FILE" "$VAULT_VERSION" "$VAULT_ROOT" "$TIMESTAMP" <<'PY'
import json, sys
path, version, vault_root, ts = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
with open(path, "w") as f:
    json.dump({
        "source": "obsidian-mind",
        "vault_version": version,
        "vault_root": vault_root,
        "installed_at": ts,
        "script": "scripts/sync-to-profile.sh",
    }, f, indent=2)
    f.write("\n")
PY
else
  action "would write $PROVENANCE_FILE"
fi

echo
if $DRY_RUN; then
  ok "dry-run complete — no changes made"
else
  ok "install complete"
  echo
  echo "${BOLD}Installed:${RESET}"
  echo "  17 omc-* agents        -> $CLAUDE_HOME/agents/"
  echo "  2 portable commands    -> $CLAUDE_HOME/commands/"
  echo "  1 portable playbook    -> $CLAUDE_HOME/playbooks/"
  echo "  managed CLAUDE.md section (v$VAULT_VERSION)"
  echo
  if [ -d "$BACKUP_DIR" ] && [ -n "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
    echo "${BOLD}Backups:${RESET} $BACKUP_DIR"
  fi
  echo
  echo "${BOLD}Next:${RESET} start any Claude Code session (in any project) and try ${CYAN}/verify${RESET} or ${CYAN}/think${RESET}"
  echo "     or invoke an omc agent via the Task tool (subagent_type: omc-critic, omc-analyst, etc.)"
fi
