# Split Pay — MVP Scaffold

This is a Vite + React scaffold wired for Supabase Auth, basic group sharing, expenses, balances with a minimal cash-flow algorithm, settlements, and a QR payment request route.

## Prerequisites
- Node 18+
- Supabase project with Email (magic link) enabled
- Env vars set in a `.env` or via Netlify:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Install & Run
```
npm install
npm run dev
```

Open `http://localhost:5173`.

## Configure Supabase
- Use `SETUP_TASKS.md` to provision the project and set redirect URLs.
- In Supabase SQL editor, run the schema from the Appendix in `SETUP_TASKS.md`.

## App Structure
- Auth: email magic link (`/` → `AuthPage`).
- Groups: create/join, list (`/groups`).
- Group dashboard: members, expenses, balances, settlements (`/groups/:groupId/*`).
- QR/Payment request route: `/pay/:token`.

## Tests
Algorithm tests with Vitest: `npm test`.

## Notes
- This scaffold expects the Supabase tables and RLS policies from `SETUP_TASKS.md` to be present.
- QR flow uses short-lived tokens from `payment_requests`. In MVP, tokens require login and group access; one-time use can be added later.

