# Shield Roofing Website

Marketing site for Top Shield Roofing (College Station & Houston), exported from
[Figma Make](https://www.figma.com/design/NCRbqTiailnpih1zbowDDR/Shield-Roofing-Website)
and wired up to run and be edited locally.

## Stack

- **Vite 6** + **React 18** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **react-router 7** for client-side routing
- **Radix UI** primitives + shadcn-style components in `src/app/components/ui`

## Running locally

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Editing

The site is a standard React app — edit the files and the dev server hot-reloads.

| What | Where |
|------|-------|
| Pages | `src/app/pages/` (`Home`, `Services`, `About`, `Contact`) |
| Routes | `src/app/routes.tsx` |
| Header / Footer / Layout | `src/app/components/` |
| Reusable UI components | `src/app/components/ui/` |
| Global styles & theme | `src/styles/` (`theme.css`, `tailwind.css`, `fonts.css`) |
| HTML shell / page metadata | `index.html` |

The `@` import alias maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`).
