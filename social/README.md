---
date: 2026-04-16
description: Social media pipeline — one markdown file fans out to every platform via GitHub Actions.
tags:
  - social
  - index
  - moc
---

# Social Pipeline

One markdown file → every platform. The vault is the source of truth; a GitHub Action does the fan-out.

## How it works

1. **Draft** — copy `templates/Social Post.md` into `social/drafts/<slug>.md`. Write once.
2. **Queue** — `git mv` the file to `social/queue/`. Set `status: queued` (or `status: publish` for immediate).
3. **Push** — on push to `main`, the `social-post` workflow picks up any queued file where `status: publish` and fans it out.
4. **Archive** — workflow writes post IDs back into frontmatter and moves the file to `social/posted/YYYY/<slug>.md`.

## Providers

| Platform | Status | Secret(s) needed |
|---|---|---|
| Bluesky | ready | `BSKY_HANDLE`, `BSKY_APP_PASSWORD` |
| Mastodon | ready | `MASTODON_INSTANCE`, `MASTODON_TOKEN` |
| Threads | stub | `THREADS_USER_ID`, `THREADS_ACCESS_TOKEN` |
| LinkedIn | stub | `LINKEDIN_URN`, `LINKEDIN_ACCESS_TOKEN` |
| X | stub | `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_SECRET` |

Stubs are safe no-ops — the pipeline skips any provider whose secrets are missing, logs it, and keeps going. Drop credentials into repo secrets when you're ready to enable each one.

## Frontmatter schema

```yaml
date: 2026-04-16
description: short summary for the vault
tags: [social-post]
status: draft | queued | publish | posted | failed
platforms: [bluesky, mastodon, threads, linkedin, x]  # subset to override default
post_at: 2026-04-16T14:00:00Z  # optional; future-dated posts are deferred
thread: false  # true to split into a thread on platforms that support it
media: []  # list of paths relative to this note, e.g. ["img/shot.png"]
post_ids: {}  # filled by the workflow after success
```

## Adding a new provider

1. Add `scripts/social/providers/<name>.ts` exporting `{ name, ready(), post(content) }`.
2. Register it in `scripts/social/post.ts`.
3. Document its secret(s) in the table above.

## Kill switch

Set the repo variable `SOCIAL_PAUSED=1` to pause all posting. The workflow will no-op until cleared.

## Related
- [[Home]]
- [[Skills]]
