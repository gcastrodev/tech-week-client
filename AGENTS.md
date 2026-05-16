# Tech Week — UniCesumar Londrina

## About

**Frontend-only** Next.js 16 (App Router) app for the Tech Week site. Backend is a separate API; the HTTP contract lives in **`CONTRACT.md`**.

## Running locally

```bash
npm run dev
```

Use `.env.local` with `API_URL` (preferred) or `NEXT_PUBLIC_API_URL` pointing at the API.

## Project structure

- `src/app` — routes and pages (App Router)
- `src/app/actions` — Server Actions (public forms + admin)
- `src/components` — shared UI (not `ui/`)
- `src/components/ui` — shadcn/ui — **do not edit**
- `src/lib/api-server.ts` — server-only `fetch` client; base URL from `API_URL` / `NEXT_PUBLIC_API_URL`
- `src/lib/validation.ts` — server-side form validation
- `src/lib/types.ts` — request/response types aligned with **`CONTRACT.md`**
- `src/lib/event-data.ts` — static event copy, schedule, sponsors (site content, not API seed data)
- `CONTRACT.md` — API contract (endpoints, JSON fields, status codes, `error` codes)

## Notes

- Brand colors via `--brand` in `src/app/globals.css`
- Public forms and admin API calls go through Server Actions → `api-server.ts` (not direct browser `fetch` to the API)
- Admin JWT is stored in an **httpOnly** cookie (`admin_token`), not `localStorage`
- Commits: Conventional Commits in English

## Do not edit

- `src/components/ui/`
- `src/lib/utils.ts`
