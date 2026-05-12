# Tech Week — UniCesumar Londrina

## About

**Frontend** (this repo): Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui. Consumes a separate REST API.

**Backend**: separate repository (e.g. tech-week-api — Rust, Axum, SQLite). Contract with this app is documented in **`CONTRACT.md`**.

## Running locally

```bash
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to the API base URL (must not conflict with Next’s port if both run locally). API must expose **CORS** for the browser origin.

## Conventions

- Commits in **English**, [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `perf:`, `style:`, etc.)
- Components in `src/components` (not `ui/`)
- Pages in `src/app` (App Router)
- Brand styling via `--brand` and tokens in `src/app/globals.css`
- API shapes and errors: follow **`CONTRACT.md`** and `src/lib/types.ts`

## Do not touch

- `src/components/ui/` — shadcn/ui generated; do not edit manually
- `src/lib/utils.ts` — used by shadcn/ui
