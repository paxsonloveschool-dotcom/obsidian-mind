# HP Outdoors

Marketing website for HP Outdoors (landscaping services), exported from
[Figma Make](https://www.figma.com/design/xtOBSCU2pEkqHd00EsRa4F/HP-Outdoors)
and set up as an editable Vite + React + TypeScript project.

## Stack

- **Vite 6** — dev server + build
- **React 18** + **TypeScript**
- **Tailwind CSS 4** — styling (`src/styles/`)
- **shadcn/ui + Radix** — UI primitives (`src/app/components/ui/`)
- Images load from Unsplash via `ImageWithFallback`

## Getting started

```bash
cd hp-outdoors
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Where things live

| Path | What |
|------|------|
| `src/app/App.tsx` | Page composition — the section order of the site |
| `src/app/components/` | Page sections: `Header`, `Hero`, `Services`, `Gallery`, `About`, `Certifications`, `Charity`, `Contact`, `Footer` |
| `src/app/components/ui/` | Reusable shadcn/ui primitives |
| `src/styles/` | `theme.css` (design tokens / colors), `tailwind.css`, `fonts.css` |
| `index.html` | Page shell, `<title>`, meta description |
| `vite.config.ts` | Build config + `@` → `src` alias |

## Editing the site

Each section of the homepage is its own component in `src/app/components/`.
Edit a component file to change copy, layout, or styling — the dev server
hot-reloads on save. Colors and fonts are centralized in `src/styles/theme.css`.

The `@` alias points at `src/`, so imports like `@/app/components/ui/button`
resolve from anywhere.
