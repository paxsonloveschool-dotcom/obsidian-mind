#!/bin/bash
# Update RTK GitHub skills from upstream (adityahimaone/hermes-agent-rtk-caveman)
# Run from vault root: .claude/update-rtk-skills.sh
#
# Pulls only the github/ category + context-hygiene-relevant development skills.
# Does NOT run the upstream install.sh — that installer overwrites ~/.claude/CLAUDE.md
# and modifies ~/.zshrc. We cherry-pick skill files only.

set -e

REPO="adityahimaone/hermes-agent-rtk-caveman"
SKILLS_DIR=".claude/skills"
TEMP_DIR=$(mktemp -d)

trap "rm -rf $TEMP_DIR" EXIT

echo "Fetching latest RTK skills from $REPO..."
git clone --depth 1 "https://github.com/$REPO.git" "$TEMP_DIR" 2>/dev/null

# GitHub category — flatten into .claude/skills/<skill-name>/
for skill in codebase-inspection github-auth github-code-review github-issues \
             github-pr-workflow github-repo-management github-ssh-token-workflow; do
  src="$TEMP_DIR/skills/github/$skill"
  if [ -d "$src" ]; then
    echo "Updating $skill..."
    mkdir -p "$SKILLS_DIR/$skill"
    cp -r "$src"/. "$SKILLS_DIR/$skill/"
  fi
done

echo "Done. RTK GitHub skills updated to latest."
echo "NOTE: context-hygiene is hand-written, not from upstream. Don't overwrite it."
