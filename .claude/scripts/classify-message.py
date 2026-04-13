#!/usr/bin/env python3
"""Classify user messages and inject routing hints for Claude."""
import json
import sys
import re


def _any_word_match(pattern_words: list, text: str) -> bool:
    """Check if any phrase appears as a whole word/phrase in text (not substring)."""
    for phrase in pattern_words:
        if re.search(r'\b' + re.escape(phrase) + r'\b', text):
            return True
    return False


def classify(prompt: str) -> list[str]:
    p = prompt.lower()
    signals = []

    if _any_word_match(["decided", "decision", "we chose", "agreed to", "let's go with", "the call is", "we're going with", "going with", "settled on", "picked"], p):
        signals.append("DECISION detected — consider creating a Decision Record in work/active/ and logging in work/Index.md Decisions Log. See playbook: brain/playbooks/Capture Decision.md")

    if _any_word_match(["incident", "outage", "down", "pagerduty", "severity", "p0", "p1", "p2", "sev1", "sev2", "postmortem", "rca", "root cause", "downtime"], p):
        signals.append("INCIDENT detected — consider using /incident-capture or creating an incident note in work/incidents/. See playbook: brain/playbooks/Capture Incident.md")

    if _any_word_match(["1:1", "1-on-1", "one on one", "1on1", "catch up with", "sync with"], p):
        signals.append("1:1 CONTENT detected — consider /capture-1on1 to create a note in work/1-1/ and update the person note in org/people/. See playbook: brain/playbooks/Capture 1-1.md")

    if _any_word_match(["shipped", "launched", "completed", "achieved", "won", "promoted", "kudos", "shoutout", "great feedback", "recognized", "praised", "celebrated"], p):
        signals.append("WIN detected — consider adding to perf/Brag Doc.md with a link to the evidence note")

    if _any_word_match(["architecture", "system design", "rfc", "tech spec", "trade-off", "design doc", "adr", "schema", "data model"], p):
        signals.append("ARCHITECTURE discussion — consider creating a reference note in reference/ or a decision record")

    if _any_word_match(["told me", "said that", "feedback from", "met with", "talked to", "spoke with", "mentioned that", "asked me", "wants me to"], p):
        signals.append("PERSON CONTEXT detected — consider updating the relevant person note in org/people/ and linking from the conversation note. See playbook: brain/playbooks/Onboard Person.md if the person is new")

    if _any_word_match(["project update", "sprint", "milestone", "shipped feature", "released", "deployed", "rollout"], p):
        signals.append("PROJECT UPDATE detected — consider updating the active work note in work/active/ and checking if wins should go to brag doc")

    # New signals
    if _any_word_match(["new project", "starting", "kicking off", "begin work on", "spinning up", "starting to work on", "new initiative"], p):
        signals.append("NEW PROJECT detected — consider creating a work note in work/active/ via the Create Work Note playbook (brain/playbooks/Create Work Note.md). Don't forget the quarter: frontmatter field.")

    if _any_word_match(["done", "finished", "wrapped up", "shipped it", "complete", "closed out"], p):
        signals.append("PROJECT COMPLETION detected — consider /project-archive to move from work/active/ to work/archive/YYYY/, flip status, capture brag doc entry. See playbook: brain/playbooks/Archive Project.md")

    if _any_word_match(["remember", "memorize", "don't forget", "for next time", "lesson learned", "learned that", "gotcha", "pitfall"], p):
        signals.append("MEMORY detected — consider appending to the relevant brain/ topic note (Patterns.md for reusable insight, Gotchas.md for pitfalls, Key Decisions.md for strategic). NEVER create files in ~/.claude/projects/.../memory/ — vault-only.")

    if _any_word_match(["pattern", "anti-pattern", "always", "never", "every time", "rule of thumb"], p):
        signals.append("PATTERN detected — consider appending to brain/Patterns.md if it's a reusable insight worth keeping")

    if _any_word_match(["broken", "doesn't work", "fails", "error", "bug in", "edge case"], p):
        signals.append("GOTCHA detected — if this is a recurring pitfall, consider appending to brain/Gotchas.md so future-you doesn't hit it again")

    if _any_word_match(["new hire", "joined the team", "new teammate", "onboarding", "new manager"], p):
        signals.append("NEW PERSON detected — consider creating a person note in org/people/ via brain/playbooks/Onboard Person.md, or invoke the people-profiler agent for full profile from Slack")

    if _any_word_match(["review cycle", "self-review", "self review", "performance review", "calibration"], p):
        signals.append("REVIEW CYCLE detected — consider /review-brief, /self-review, or /review-peer depending on what you need. See brain/Workflows.md for the full review arc.")

    if _any_word_match(["wrap up", "wrap-up", "wrapping up", "let's wrap", "end session", "end of day"], p):
        signals.append("WRAP-UP signal — invoke /wrap-up to drive the session-end checklist. This is required behavior per CLAUDE.md.")

    if _any_word_match(["thinking note", "scratchpad", "draft", "brain dump"], p):
        signals.append("THINKING NOTE context — drafts go in thinking/. Once durable, /promote them and delete the scratch. See playbook: brain/playbooks/Promote Thinking.md")

    if _any_word_match(["orphan", "broken link", "missing link", "audit", "vault health", "stale"], p):
        signals.append("VAULT HEALTH signal — consider /vault-audit (full structural) or /connect (link-only). See playbook: brain/playbooks/Run Vault Audit.md")

    if _any_word_match(["competency", "competencies", "skill area", "level up", "next level"], p):
        signals.append("COMPETENCY signal — competency notes live in perf/competencies/. Evidence comes from work note backlinks. Don't edit competency notes directly; link FROM evidence notes TO them.")

    return signals


def main():
    try:
        input_data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    prompt = input_data.get("prompt", "")
    if not prompt:
        sys.exit(0)

    signals = classify(prompt)

    if signals:
        hints = "\n".join(f"- {s}" for s in signals)
        output = {
            "hookSpecificOutput": {
                "additionalContext": (
                    "Content classification hints (act on these if the user's message contains relevant info):\n"
                    + hints
                    + "\n\nRemember: use proper templates, add [[wikilinks]], follow CLAUDE.md conventions."
                )
            }
        }
        json.dump(output, sys.stdout)
        sys.stdout.flush()

    sys.exit(0)

if __name__ == "__main__":
    main()
