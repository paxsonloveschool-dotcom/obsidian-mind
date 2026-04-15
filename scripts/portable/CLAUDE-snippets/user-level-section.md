<!-- obsidian-mind-profile-sync:start v3.4 -->
## Portable Obsidian Mind Capabilities

This section is managed by `scripts/sync-to-profile.sh` from the [obsidian-mind](https://github.com/paxsonloveschool-dotcom/obsidian-mind) vault. Do not edit manually — changes will be overwritten on the next sync. To update, re-run the sync script.

**Source of truth**: the obsidian-mind vault (usually at `~/obsidian-mind` or wherever it's cloned).
**Installed version**: v3.4
**Last synced**: (filled in by the script)

### Available everywhere (user-level `~/.claude/`)

**Subagents** (17 — adapted from [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode))

Pure software engineering agents — use these in any project for code/plan/analysis work:

| Agent | Best for |
|-------|----------|
| `omc-analyst` | Pre-planning requirements gap analysis (Opus) |
| `omc-architect` | Architecture review, steelman counters, trade-offs (Opus) |
| `omc-code-reviewer` | Thorough multi-perspective code review |
| `omc-critic` | Final quality gate with ADVERSARIAL escalation (Opus) |
| `omc-debugger` | Structured debugging — reproduce, isolate, verify |
| `omc-designer` | UX/UI design review |
| `omc-document-specialist` | Documentation writing and external lookup |
| `omc-executor` | Implement a plan step-by-step with verification |
| `omc-git-master` | Atomic git operations — commits, merges, tags, PRs |
| `omc-planner` | Work plan creation with testable acceptance criteria |
| `omc-qa-tester` | End-to-end QA testing |
| `omc-scientist` | Hypothesis-driven analysis |
| `omc-security-reviewer` | Security audit with threat modeling |
| `omc-test-engineer` | Test design — unit/integration/e2e coverage |
| `omc-tracer` | Causal investigation with competing hypotheses |
| `omc-verifier` | Verify a claim actually worked |
| `omc-writer` | Prose/docs writing assistance |

**Slash commands** (portable versions)

| Command | Purpose |
|---------|---------|
| `/verify` | Verify a change/claim/document with concrete evidence |
| `/think` | Scaffold a properly-structured thinking note in `thinking/` |

Note: when you're inside the obsidian-mind vault, the vault's own project-level versions shadow these user-level ones — so the vault keeps its richer vault-aware variants.

**Playbooks** (in `~/.claude/playbooks/`)

| Playbook | When to use |
|----------|-------------|
| `Emergency Token Triage` | Context window is filling faster than expected |

### Operating principles (from obsidian-mind)

These principles apply to any Claude Code session regardless of project:

- **Token discipline**: Grep before Read. Batch independent tool calls. Delegate heavy work to subagents (separate context). Offload to disk when results would bloat the main window. See Emergency Token Triage playbook.
- **Evidence over assertion**: Don't claim done without evidence. `/verify` exists for this.
- **Scratchpad discipline**: Thinking notes in `thinking/` are scratch. Promote conclusions to a durable home, then delete. `/think` scaffolds; promotion is manual.
- **Agent delegation**: For code/plan/analysis work, prefer an omc-* agent over doing it directly in main context. The agent's context is separate; your main window stays clean.
- **Two-phase execution**: Research & Plan → Execute & Verify. Don't blend them.

### When to update this section

Re-run `scripts/sync-to-profile.sh` from the obsidian-mind vault when:
- You upgrade the obsidian-mind vault (new agents, commands, playbooks become available)
- You want to pick up the latest omc agent adaptations
- You suspect drift between vault and user-level config

<!-- obsidian-mind-profile-sync:end -->
