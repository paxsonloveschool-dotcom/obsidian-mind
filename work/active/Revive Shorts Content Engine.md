---
date: 2026-11-14
description: Automation that finishes Revive Roofing shorts (silence cut, captions, music, loudness) and becomes the content engine for every Restore client.
tags: [work-note, project/content-engine]
status: active
quarter: Q4-2026
team: Restore
---

# Revive Shorts Content Engine

## Context
Revive Roofing has 5 cut and graded 9:16 shorts in Dropbox (`Clients/Revive Roofing/Edited Videos/Reels 9x16`). They still need burned captions and music before they can post.

## What
`tools/content-engine/finish_shorts.py` runs on the black PC against the synced Dropbox folder. It removes dead air, burns captions, adds a music bed and sets web loudness. The same script works for any client folder.

## Open
- Music track and license for Revive.
- Dropbox folder levels for every client (Raw, Selects, Long Form, B-Roll, Shorts, Ready to Post).

## Related
- [[Index]]
- [[North Star]]
