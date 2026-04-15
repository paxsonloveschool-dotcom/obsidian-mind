---
date: 2026-04-05
description: Registry of vault workflows and slash commands
tags: [brain, skills]
type: brain
---

# Skills

## Obsidian Mind Commands
See CLAUDE.md for full command table (15 commands, 9 agents).

## Claude Code Setup
- Autopilot mode: all permissions pre-approved
- Token efficiency: 4-file context structure
- Two-part execution: Research & Plan -> Execute & Verify
- MASTER_SOP: ~/claude-code-config/MASTER_SOP.md

## Design Skills (UI/UX Pro Max bundle)

Vendored on 2026-04-13 from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT). Seven skills installed under `.claude/skills/`:

| Skill | Trigger | Core capability |
|-------|---------|-----------------|
| `ui-ux-pro-max` | Any UI/visual/UX task | 67 styles, 161 palettes, 57 font pairs, 99 UX rules, 25 charts, 15 stacks. Python search engine over CSV databases. Primary design brain. |
| `design` | Brand/logo/CIP/icons/social | 55 logo styles, 50 CIP deliverables, 22 banner styles, 15 icon styles, social photo generation |
| `design-system` | Tokens, component specs | Three-layer tokens (primitive → semantic → component), CSS vars, spacing/typography scales |
| `ui-styling` | shadcn/ui, Tailwind, Radix | Accessible components, canvas visuals, dark mode, responsive layouts |
| `brand` | Voice, style guides, brand compliance | Messaging frameworks, asset management |
| `banner-design` | Social/ads/web/print banners | 13+ styles × all major platforms |
| `slides` | HTML presentations | Chart.js, design tokens, copywriting formulas |

**Query the ui-ux-pro-max search engine**:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <max>]
# domains: product | style | typography | color | landing | chart | ux
# stack search:
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>
# stacks: html-tailwind, react, nextjs, astro, vue, nuxtjs, nuxt-ui, svelte, swiftui,
#         react-native, flutter, shadcn, jetpack-compose
```

**Usage mandate**: Auto-invoke `ui-ux-pro-max` via the Skill tool on any task that changes how a feature looks, feels, moves, or is interacted with. Follow the priority ladder in its SKILL.md: 1) accessibility → 2) touch/interaction → 3) performance → 4) style selection → 5) layout/responsive → 6) typography/color → 7) animation. Never ship: raw hex in components, text < 12px body, focus-ring removal, icon-only buttons without aria labels, hover-only interactions, CLS ≥ 0.1.

## Orchestration Bundle (oh-my-claudecode)

Cherry-pick vendored on 2026-04-13 from [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) (MIT, v4.11.6). Only the standalone pieces that do not require the plugin runtime were installed. The full plugin (with hooks, team mode, `$CLAUDE_PLUGIN_ROOT`-dependent scripts) is available via user-level install:

```
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
```

### Agents (19)

Added to `.claude/agents/` alongside the vault-specific agents. No name collisions.

| Agent | Role |
|-------|------|
| `analyst` | Data and qualitative analysis |
| `architect` | High-level system design and tradeoffs |
| `code-reviewer` | Independent code review pass |
| `code-simplifier` | Delete-first refactoring to cut complexity |
| `critic` | Adversarial critique of plans and output |
| `debugger` | Bug reproduction and root-cause isolation |
| `designer` | UI/UX design decisions (pairs with ui-ux-pro-max) |
| `document-specialist` | External documentation and literature search |
| `executor` | Implementation of approved plans |
| `explore` | Codebase search and relationship discovery |
| `git-master` | Git workflow, history rewriting, conflict resolution |
| `planner` | Step-by-step execution plans |
| `qa-tester` | Test case generation and regression hunting |
| `scientist` | Hypothesis-driven experiments and measurement |
| `security-reviewer` | Security audit pass on diffs |
| `test-engineer` | Test infrastructure and coverage strategy |
| `tracer` | Evidence-based causal tracing |
| `verifier` | Independent verification of completion claims |
| `writer` | Documentation and prose authoring |

### Skills (33)

| Category | Skill | Purpose |
|----------|-------|---------|
| Planning | `plan` | Strategic planning with optional interview workflow |
| Planning | `ralplan` | Consensus planning gate -- auto-activates for vague ralph/autopilot/team requests |
| Planning | `deep-dive` | 2-stage pipeline: `trace` → `deep-interview` for complex investigations |
| Planning | `deep-interview` | Socratic ambiguity gating before autonomous execution |
| Planning | `deepinit` | Hierarchical `AGENTS.md` initialization for unknown codebases |
| Planning | `sciomc` | Parallel scientist-agent orchestration |
| Execution | `autopilot` | Full autonomous idea → working code loop |
| Execution | `ralph` | Self-referential loop until completion with verification |
| Execution | `ultrawork` | Parallel high-throughput task execution |
| Execution | `ultraqa` | Test → verify → fix cycling |
| Execution | `ccg` | Claude + Codex + Gemini tri-model synthesis |
| Debug/Verify | `debug` | Session + repo state diagnosis |
| Debug/Verify | `trace` | Evidence-driven causal tracing with competing hypotheses |
| Debug/Verify | `verify` | Verify change really works before claiming completion |
| Debug/Verify | `visual-verdict` | Screenshot vs reference structured QA |
| Debug/Verify | `ai-slop-cleaner` | Regression-safe deletion-first cleanup of AI-generated code |
| Memory | `remember` | Decide what belongs in project memory vs notepad vs docs |
| Memory | `wiki` | Persistent markdown knowledge base (Karpathy model) |
| Memory | `writer-memory` | Agentic memory for writers (characters, scenes, themes) |
| Memory | `learner` | Extract a learned skill from current conversation |
| Memory | `omc-reference` | OMC agent catalog and routing reference |
| Meta | `skill` | Manage local skills -- list, add, remove, edit |
| Meta | `skillify` | Turn a repeatable workflow into a reusable skill draft |
| Meta | `self-improve` | Evolutionary code improvement with tournament selection |
| Workflow | `project-session-manager` | Worktree-first environment manager for issues/PRs |
| Workflow | `release` | Release assistant with repo rule caching |
| Workflow | `setup` | Install/update routing for OMC flows |
| Workflow | `omc-doctor` | Diagnose OMC installation issues |
| Workflow | `omc-teams` | CLI-team runtime for tmux process parallelism |
| Comms | `ask` | Process-first advisor routing for Claude/Codex/Gemini |
| Comms | `external-context` | Parallel doc-specialist agents for web/doc lookups |
| Comms | `configure-notifications` | Telegram/Discord/Slack notification setup |
| Comms | `mcp-setup` | Popular MCP server configuration |

**Intentionally skipped** (require plugin runtime): `team`, `cancel`, `hud`, `omc-setup`. Also skipped: 58 Node scripts, hook definitions, `src/`, `dist/`, `bridge/`, `shellmark/`, `missions/`, `package.json`, `$CLAUDE_PLUGIN_ROOT`-dependent code.

**Usage guidance**: OMC skills are for **dev/orchestration work**, not note-taking. Vault workflows (notes, people, reviews, incidents) stay on `/standup`, `/dump`, `/wrap-up`, etc. When working inside this repo on actual code/config (`.claude/`, hooks, templates), compose: `plan` → `ralph`/`autopilot` → `verify` → `ai-slop-cleaner` before commit. For ambiguous requests, `ralplan` gates with consensus planning. For bug hunts, use `deep-dive`.

## Founder / M&A / Marketing / Sales Bundles

Vendored 2026-04-15. **92 curated skills + 67 commands + 67 agents harvested** from six MIT/Apache-licensed GitHub sources. All self-contained, zero runtime deps, matched to a solo founder running two service businesses toward M&A.

### Source summary

| Source | Skills | License | Focus |
|--------|--------|---------|-------|
| [anthropics/skills](https://github.com/anthropics/skills) | 10 | Apache-2.0 | Official Anthropic skills (office docs, skill creation, MCP) |
| [bwerneckm/startup-skills](https://github.com/bwerneckm/startup-skills) | 13 | MIT | Founder-operating playbooks |
| [zubair-trabzada/ai-marketing-claude](https://github.com/zubair-trabzada/ai-marketing-claude) | 14 | MIT | Marketing agency `market-*` suite |
| [syntax-syndicate/marketingskills](https://github.com/syntax-syndicate/marketing-skills) | 18 | MIT | CRO + lead gen |
| [OpenClaudia/openclaudia-skills](https://github.com/OpenClaudia/openclaudia-skills) | 15 | MIT | Research, content, growth |
| [gtmagents/gtm-agents](https://github.com/gtmagents/gtm-agents) | 87 (flattened from 22 bundles) + 67 commands + 67 agents | MIT | Enterprise-grade GTM ops (flattened for solo use) |

### Deep-use categories

**Founder-operator playbooks** (run these when making strategic / business decisions)
- `steering-strategy` — annual planning, OKRs, operating rhythm
- `shaping-product-strategy` — Shape Up + DIBB + ICE + Opportunity Solution Trees
- `validating-ideas` — Lean Canvas + RAT + Mom Test + Pretotyping
- `designing-business-models` — Business Model Canvas + WTP + unit economics
- `modeling-finances` — forecasts, burn, runway, scenario planning
- `launching-go-to-market` — Crossing the Chasm + growth diagnostics
- `planning-market-entry` — market scoring, regulatory readiness
- `navigating-regulations` — multi-jurisdiction compliance
- `measuring-growth` — AARRR metrics, North Star, funnel analysis
- `gathering-competitive-intelligence` — Wardley Mapping + 7 Powers + battlecards
- `building-brand` — Dunford Positioning + StoryBrand + content architecture
- `closing-deals` — pipeline, qualification, objection handling
- `raising-capital` — deck, investor CRM, updates (repurpose for M&A deal flow)

**Marketing agency delivery** (Restore Marketing Co client work)
- `market-audit` — client website audit (use for prospecting + onboarding)
- `market-proposal` — client proposal generation
- `market-landing` — landing page CRO analysis
- `market-copy`, `market-ads`, `market-emails`, `market-social` — content generation
- `market-funnel` — funnel analysis and optimization
- `market-brand`, `market-competitors`, `market-seo` — research
- `market-launch` — product/service launch playbook
- `market-report-pdf` — client-ready PDF reports
- `content-strategy`, `content-calendar`, `content-repurposing`, `content-gap-analysis` — content ops
- `write-blog`, `write-landing`, `newsletter` — long-form writing
- `keyword-research`, `serp-analyzer`, `programmatic-seo` — SEO
- `email-subject-lines`, `cold-email`, `build-sequence` — email
- `page-cro`, `form-cro`, `popup-cro`, `signup-flow-cro`, `onboarding-cro`, `paywall-upgrade-cro` — CRO suite
- `lead-magnets`, `free-tool-strategy`, `referral-program` — lead gen
- `marketing-psychology` — persuasion primitives
- `growth-strategy`, `demand-gen`, `launch-strategy`, `revops` — strategy
- `icp-builder`, `customer-research` — ICP + research
- `churn-prevention`, `brand-monitor`, `google-reviews` — lifecycle + local

**Sales pipeline + RevOps** (directly usable for both businesses)
- `crm-hygiene`, `deal-review`, `forecast-discipline` — pipeline management
- `cold-outreach`, `discovery-calls`, `meddic-checklist`, `objection-handling`, `lead-qualification`, `social-selling` — prospecting
- `call-brief-framework`, `call-analysis-framework`, `call-review-kit`, `persona-intel` — call prep + review
- `battlecard-system`, `messaging-framework`, `reinforcement-loop` — sales enablement
- `coaching-framework`, `reinforcement-drills` — sales coaching
- `capacity-modeling`, `comp-mechanics`, `territory-optimization`, `roe-governance`, `quota-health` — sales ops
- `forecast-modeling`, `variance-analysis`, `executive-briefs` — forecasting
- `cohort-analysis`, `deal-quality-model`, `revenue-health-dashboard`, `exec-briefing-kit` — revenue analytics

**Customer success** (any recurring client engagement)
- `adoption-playbook`, `executive-ebr-kit`, `risk-scoring-framework`, `sentiment-feedback-loop` — CS playbooks
- `retention-dashboard`, `activation-map`, `save-play-library`, `segmentation-framework` — customer analytics
- `expansion-playbook`, `account-health-framework`, `exec-briefing`, `success-planning-framework` — account management

**Content + PR**
- `case-studies`, `thought-leadership`, `storytelling`, `seo-writing`, `editorial-ops`, `webinars`, `whitepapers` — content marketing
- `messaging-frameworks`, `crisis-playbooks`, `media-database` — PR/comms

**Community + advocacy**
- `champion-engagement-system`, `community-program-matrix`, `community-kpi-dashboard`, `moderation-safety-playbook`, `community-insight-taxonomy`, `closed-loop-community-playbook` — community building
- `advocacy-roster-system`, `customer-feedback-taxonomy`, `closed-loop-playbook`, `signal-correlation-workbench` — VoC

**Marketing analytics + automation**
- `attribution-playbook`, `exec-dashboard-blueprint`, `channel-pacing-guardrails`, `roi-benchmark-library` — analytics
- `lifecycle-mapping`, `data-governance`, `workflow-testing` — automation governance
- `personalization-logic`, `lifecycle-cadence`, `nurture-testing` — nurture programs
- `hypothesis-library`, `experiment-design-kit`, `guardrail-scorecard` — experimentation

**ABM + partnerships**
- `account-tiering`, `signal-intel`, `personalization` — ABM
- `partner-ecosystem-map`, `joint-solution-blueprint`, `partner-revenue-desk`, `co-marketing-governance` — partnerships

**Office deliverables** (client-ready)
- `docx` — Word docs, proposals, memos, letters
- `pptx` — pitch decks, presentations, investor decks
- `xlsx` — financial models, spreadsheets, data cleanup
- `pdf` — invoices, reports, contracts, forms, OCR
- `web-artifacts-builder` — interactive React/shadcn/ui artifacts
- `webapp-testing` — Playwright-based UI testing
- `internal-comms` — status reports, newsletters, announcements
- `doc-coauthoring` — structured documentation workflows

**Meta / skill authoring**
- `skill-creator` — build new skills programmatically (critical for the Q2 automation buildout)
- `mcp-builder` — build MCP servers for custom integrations (critical for connecting to CRMs, invoicing, scheduling systems)

### Bonus: 67 GTM-ops commands (in `.claude/commands/`)

Single-purpose slash-command style entry points, all usable via the harness. Examples:
`run-forecast`, `build-forecast-scenarios`, `audit-pipeline`, `prepare-call`, `build-sequence`, `generate-leads`, `qualify-lead`, `monitor-customer-health`, `monitor-retention`, `monitor-abm`, `design-nurture`, `orchestrate-journey`, `monitor-automation`, `configure-workflow`, `produce-campaign-report`, `run-market-landscape-study`, `synthesize-insights`, `pitch-media`, `manage-crisis`, `plan-qbr`, `plan-launch`, `generate-blog`, `create-ebook`, `content-pipeline`, `design-territories`, `design-comp-plan`, `build-capacity-plan`, `build-coaching-plan`, `launch-coaching-program`, `launch-experiment`, `prioritize-hypotheses`, `synthesize-learnings`, `build-success-plan`, `build-adoption-program`, `run-account-review`, `run-escalation-playbook`, `run-partner-qbr`, `build-co-sell-playbook`, `design-partner-ecosystem`, `plan-plays`, `ingest-pipeline`, `forecast-coverage`, `inspect-pipeline-levers`, `run-call-review`, `review-call`, `analyze-call`, `reinforce-program`, `evaluate-attribution-models`, `report-variance`, `monitor-revenue-health`, `monitor-channel-pacing`, `audit-content`, `audit-pipeline`, `launch-community-activation-series`, `launch-quantitative-survey`, `orchestrate-qualitative-lab`, `launch-program`, `design-community-strategy`, `enablement-kit`, `target-accounts`, `segment-customers`, `run-voc-listening-tour`, `run-member-insight-sprint`, `activate-advocacy-program`, `configure-branches`, `optimize-nurture`, `synthesize-voc-insights`, `review-call`, `build-playbook`, `pitch-media`

### Vault counts after install

- **203 skills** — 46 from prior installs + 37 curated + 87 flattened + 33 from other sources
- **95 agents** — 28 prior + 67 harvested
- **82 commands** — 15 prior + 67 harvested

Related: [[Patterns]], [[Gotchas]], [[Key Decisions]], [[Automation]], [[M&A Playbook]]
