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

Related: [[Patterns]], [[Gotchas]], [[Key Decisions]]
