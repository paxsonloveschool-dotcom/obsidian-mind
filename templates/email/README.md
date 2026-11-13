---
date: 2026-06-16
description: Reusable outbound email templates used by the /email command for recurring or templated sends.
tags: [email, template, index]
type: index
---

# Email Templates

Reusable outbound emails for the [[email|/email]] command's *send template* mode.

Each template is a markdown file with frontmatter (`to`, `cc`, `subject`,
`description`) and a body using `{{placeholders}}` filled at send time.

## How it works

```
/email send Weekly Update
```

The command loads the template, prompts for any `{{placeholders}}`, resolves
recipients, shows the full filled draft, and sends **only after your approval**.

## Frontmatter schema

```yaml
---
type: email-template
to: ""            # default recipients (optional)
cc: ""            # default cc (optional)
subject: "..."    # supports {{placeholders}}
description: "~150 char note on when to use this template"
tags: [email, template]
---
```

## Templates

- [[Weekly Update]] — recurring status note to your manager / team.

Add new templates here as one file per recurring send.
