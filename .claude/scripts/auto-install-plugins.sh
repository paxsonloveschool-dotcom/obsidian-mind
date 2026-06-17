#!/bin/bash
# Read .claude/plugins/discovered.yml and install any plugin not already
# present in `claude plugin list`. Idempotent. Runs from SessionStart hook.
#
# Logs to thinking/session-logs/plugin-install-YYYY-MM-DD.log so every
# auto-install is auditable. Never fails the session start -- errors are
# logged and swallowed.

set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

MANIFEST=".claude/plugins/discovered.yml"
LOG_DIR="thinking/session-logs"
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/plugin-install-$(date +%Y-%m-%d).log"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" >> "$LOG"; }

[ -f "$MANIFEST" ] || { log "no manifest at $MANIFEST"; exit 0; }
command -v claude >/dev/null || { log "claude CLI not on PATH"; exit 0; }

# Cooldown: skip if we ran within the last 6h
STAMP=".claude/plugins/.last-install"
if [ -f "$STAMP" ]; then
  last=$(date -r "$STAMP" +%s 2>/dev/null || echo 0)
  now=$(date +%s)
  if [ $((now - last)) -lt 21600 ]; then
    exit 0
  fi
fi

installed=$(claude plugin list 2>/dev/null | awk '/^  > /{print $2}' | sort -u)
markets=$(claude plugin marketplace list 2>/dev/null | awk '/Source: GitHub \(/{gsub(/[()]/,""); print $3}' | sort -u)

# Parse discovered.yml with python (already required for the workflow side).
python3 - "$MANIFEST" <<'PY' > /tmp/cc-plugins-todo.txt 2>>"$LOG" || { log "yaml parse failed"; exit 0; }
import sys, yaml
data = yaml.safe_load(open(sys.argv[1])) or {}
for p in data.get("plugins", []):
    print(f"{p['marketplace']}\t{p['name']}")
PY

while IFS=$'\t' read -r marketplace name; do
  [ -z "$marketplace" ] && continue
  spec="${name}@$(basename "$marketplace")"

  if echo "$installed" | grep -qx "$spec"; then
    continue
  fi

  if ! echo "$markets" | grep -qx "$marketplace"; then
    log "adding marketplace $marketplace"
    if ! claude plugin marketplace add "$marketplace" >>"$LOG" 2>&1; then
      log "FAILED marketplace add $marketplace"
      continue
    fi
    markets=$(claude plugin marketplace list 2>/dev/null | awk '/Source: GitHub \(/{gsub(/[()]/,""); print $3}' | sort -u)
  fi

  log "installing $spec"
  if claude plugin install "$spec" >>"$LOG" 2>&1; then
    log "OK $spec"
  else
    log "FAILED $spec"
  fi
done < /tmp/cc-plugins-todo.txt

rm -f /tmp/cc-plugins-todo.txt
touch "$STAMP"
exit 0
