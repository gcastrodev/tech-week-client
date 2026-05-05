# Tech Week — UniCesumar Londrina

## About
Full-stack application for UniCesumar Londrina's Tech Week event.
Frontend: Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui.
Backend: separate repo (tech-week-api), Rust, Axum, SQLite.

## Running locally
npm run dev

## Project structure
- src/app — pages following Next.js App Router
- src/components — shared components
- src/components/ui — shadcn/ui components, do not edit
- src/lib/types.ts — TypeScript types based on API contract
- src/lib/api.ts — API client and mock data

## Notes
- Brand colors via --brand CSS variable in globals.css
- Set USE_MOCK = false in admin dashboard when backend is ready
- Commits follow conventional commits spec