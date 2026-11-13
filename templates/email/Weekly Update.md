---
type: email-template
to: ""
cc: ""
subject: "Weekly update — {{week}}"
description: Recurring weekly status email to manager/team — shipped, in-progress, blockers, next week.
tags: [email, template]
---

Hi {{recipient_name}},

Quick update for the week of {{week}}.

**Shipped**
- {{shipped_1}}
- {{shipped_2}}

**In progress**
- {{in_progress_1}}

**Blockers / needs**
- {{blockers_or_none}}

**Next week**
- {{next_1}}

Happy to go deeper on any of these.

Thanks,
{{your_name}}
