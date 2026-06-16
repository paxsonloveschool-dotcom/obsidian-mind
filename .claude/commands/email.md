---
description: "Email assistant — triage the inbox, draft replies to inbound mail, and compose outbound/templated sends. Always proposes before sending (approve-then-send)."
---

# Email

AI email automation over Gmail. Triages the inbox, drafts context-aware replies,
and composes outbound or templated sends. **Nothing is ever sent without your
explicit approval** — Claude proposes, you confirm, then it sends.

## Usage

```
/email                      # default: triage the inbox, surface what needs attention
/email triage               # scan + categorize + summarize unread/important mail
/email reply <query>        # draft replies to matching inbound threads
/email compose <intent>     # compose a new outbound email from a description
/email send <template>      # send a stored template from templates/email/
```

`<query>` is a Gmail search (e.g. `is:unread from:jane@`, `newer_than:2d`,
`label:important`). `<intent>` is plain English (e.g. "ask Sam to reschedule
Thursday's sync to Friday").

## Prerequisites — Gmail tools

This command drives the **Gmail MCP server**. The Gmail tools are *deferred* —
their schemas are not loaded until you fetch them, and the server requires a
one-time OAuth authorization.

**At the start of every run:**

1. Load the Gmail tool schemas:
   `ToolSearch` with query `select:mcp__Gmail__authenticate` plus a keyword
   search like `gmail list messages send reply draft labels` to surface the
   real operation tools.
2. If the tools report the server is **not authenticated**, call
   `mcp__Gmail__authenticate`, share the returned authorization URL with the
   user, and wait. After they authorize, the browser redirects to a
   `http://localhost:<port>/callback?...` URL (the page won't load on remote
   sessions — that's expected). Ask the user to paste that full URL, then call
   `mcp__Gmail__complete_authentication` with it. The real Gmail tools appear
   automatically once auth succeeds.
3. Discover the exact tool names available (list/search messages, get message,
   create/send draft, modify labels, etc.) and use those — do not assume names.

## The Golden Rule — Approve Before Send

> [!warning] Never send, reply, archive-in-bulk, or delete without explicit user approval.
> Drafting, reading, searching, and labeling proposals are safe. **Any action
> that leaves the user's outbox or mutates mail state requires a clear "yes"**
> for that specific message. When in doubt, save as a draft instead of sending.

For each outbound action, show the user:
- **To / Cc**, **Subject**, and the **full body** (not a summary)
- The thread it replies to, if any
- Then ask: *"Send this, edit it, or save as draft?"*

Only call the send tool after an unambiguous approval. If the user approves
several at once ("send all three"), confirm the count back before firing.

---

## Mode: Triage (default)

Goal: turn a noisy inbox into a short, ranked action list.

1. Fetch recent unread / important mail (default scope: `is:unread newer_than:7d`,
   or honor a `<query>` if given). Pull enough headers + snippets to judge each.
2. For each thread, classify into one bucket:
   - **Needs reply** — a person is waiting on you
   - **FYI / no action** — informational, can be archived or read later
   - **Scheduling** — meeting requests, reschedules (cross-check
     `Google_Calendar` tools if relevant)
   - **Automated / noise** — newsletters, notifications, receipts
   - **Important / sensitive** — flag, never auto-anything
3. Present a ranked table: sender · subject · bucket · one-line "why" · suggested action.
4. Offer next steps:
   - "Draft replies for the *Needs reply* items?" → Reply mode
   - "Label/archive the *noise*?" → propose the label/archive changes, apply on approval
   - "Anything review-relevant for the vault?" → see **Vault Capture** below

Labeling and archiving are *proposed as a batch* and only applied after approval.

## Mode: Reply

Goal: draft high-quality, in-voice replies to inbound threads.

1. Resolve the target thread(s) from `<query>` (or the triage selection).
2. Read the **full thread** — every message, not just the latest — so the reply
   has real context. Note prior commitments, open questions, tone.
3. For each, draft a reply that:
   - Answers the actual asks; doesn't invent facts. If you need info only the
     user has, leave a `[[bracketed placeholder]]` and ask them.
   - Matches the user's voice. If a `/humanize`-style voice note exists in the
     vault, apply it; otherwise keep it concise, direct, and warm — not AI-stiff.
   - Preserves the thread's subject and quoting conventions.
4. Show each draft in full and ask **send / edit / save-as-draft** (the Golden Rule).
5. On approval, send (reply within the existing thread). On "save as draft,"
   create a Gmail draft so the user can finish in their client.

## Mode: Compose

Goal: write a brand-new outbound email from an intent.

1. Turn `<intent>` into recipients, subject, and body. Ask for anything missing
   (recipient address, key facts) rather than guessing.
2. If the intent matches a recurring need, offer to save it as a reusable
   template in `templates/email/` (see below).
3. Show the full draft → **send / edit / save-as-draft**.

## Mode: Send template (scheduled / recurring outbound)

For repeatable sends (weekly update, status note, intro).

1. List templates in `templates/email/` if no name given.
2. Load the chosen template, fill `{{placeholders}}` (ask for values or infer
   from vault/context), resolve recipients.
3. Show the filled draft → **send / edit / save-as-draft**.

> [!note] True scheduling (cron/unattended send) is out of scope for a slash command.
> This mode prepares and sends *on demand*. If the user later wants hands-off
> scheduled sends, that needs a GitHub Action or external scheduler — flag it,
> don't fake it.

---

## Email Templates

Reusable outbound emails live in `templates/email/<name>.md` with frontmatter:

```yaml
---
type: email-template
to: ""            # default recipients, optional
cc: ""
subject: "Weekly update — {{week}}"
description: "~150 char summary of when to use this template"
tags: [email, template]
---
```

The body uses `{{placeholders}}` filled at send time. See
`templates/email/Weekly Update.md` for an example.

## Vault Capture (optional, opt-in)

This is an Obsidian vault — only persist what's durable, and never dump raw
inbox contents in. Offer, don't auto-write:

- A decision reached over email → a Decision Record in `work/` (link the thread).
- Review-relevant feedback about a person → an `org/people/` note.
- A commitment/action you made → surface it; offer to add a task.

Follow the vault's linking rules: any note created must link to an existing note.
Keep personal/non-durable mail out of the vault entirely.

## Important

- **Read full threads before replying** — context lives in the earlier messages.
- **Never fabricate facts, commitments, or dates.** Use placeholders and ask.
- **Approve-before-send is absolute** — see the Golden Rule. Prefer drafts when unsure.
- **Batch destructive/label changes** and apply only on explicit approval.
- **Respect privacy** — don't copy sensitive email bodies into the git-tracked vault.
- **Discover real Gmail tool names at runtime** — don't hardcode assumptions.
