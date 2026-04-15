#!/bin/bash
# Stop hook — session-end checklist. Scans recent vault state and flags anything
# that looks like a loose end before the session closes. Non-blocking: prints
# a concise checklist so the user knows what to address before or during
# the next session.
set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" 2>/dev/null || exit 0

# Swallow hook input (we don't need it here).
cat >/dev/null 2>&1 || true

findings=()

# 1. Uncommitted changes in the vault
if git rev-parse --git-dir >/dev/null 2>&1; then
  dirty=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  if [ "$dirty" -gt 0 ]; then
    findings+=("$dirty uncommitted change(s) in working tree — review with \`git status\`")
  fi
fi

# 2. Active projects that look stale (no status:completed check — just a reminder surface)
if [ -d "work/active" ]; then
  active_count=$(find work/active -maxdepth 1 -name "*.md" -not -name ".gitkeep" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$active_count" -gt 3 ]; then
    findings+=("work/active/ has $active_count notes — target is 1-3; consider archiving completed work")
  fi
fi

# 3. Thinking notes older than 7 days (scratch that never got promoted)
if [ -d "thinking" ]; then
  stale_thinking=$(find thinking -maxdepth 1 -name "*.md" -not -name "README.md" -mtime +7 2>/dev/null | wc -l | tr -d ' ')
  if [ "$stale_thinking" -gt 0 ]; then
    findings+=("$stale_thinking thinking note(s) older than 7 days — consider /promote or delete")
  fi
fi

# 4. Orphan detection — notes without any outbound wikilinks (coarse check)
#    Only scan work/, org/, perf/, reference/ (brain/ has its own shape)
orphan_count=0
for dir in work org perf reference; do
  if [ -d "$dir" ]; then
    while IFS= read -r f; do
      if [ -s "$f" ]; then
        size=$(wc -c < "$f" | tr -d ' ')
        if [ "$size" -gt 300 ] && ! grep -q '\[\[' "$f" 2>/dev/null; then
          orphan_count=$((orphan_count + 1))
        fi
      fi
    done < <(find "$dir" -type f -name "*.md" 2>/dev/null)
  fi
done
if [ "$orphan_count" -gt 0 ]; then
  findings+=("$orphan_count potential orphan(s) (>300 chars with no [[wikilinks]]) — run /connect or /vault-audit")
fi

# 5. Recently created notes without frontmatter (common gotcha)
recent_missing_fm=0
while IFS= read -r f; do
  if [ -s "$f" ] && ! head -1 "$f" | grep -q '^---$' 2>/dev/null; then
    recent_missing_fm=$((recent_missing_fm + 1))
  fi
done < <(find work org perf reference brain -type f -name "*.md" -mtime -1 2>/dev/null || true)
if [ "$recent_missing_fm" -gt 0 ]; then
  findings+=("$recent_missing_fm recent note(s) missing YAML frontmatter")
fi

# Print the checklist
echo "=== Session end checklist ==="
if [ ${#findings[@]} -eq 0 ]; then
  echo "All clear — vault is tidy."
else
  for finding in "${findings[@]}"; do
    echo "  - $finding"
  done
  echo ""
  echo "For a full review, run /wrap-up. For vault health, run /vault-audit."
fi

exit 0
