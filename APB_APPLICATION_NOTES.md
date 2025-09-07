# APB Application Notes — What I Built + How

## Product Summary
- Built a web app to split group expenses, compute fair balances, and suggest minimal settlements. Cloud sync with accounts; works well on iPhone.

## What’s Live (MVP)
- Auth via email magic link (Supabase)
- Groups and members
- Add expenses (equal split)
- Balances + suggested transfers
- Record settlements
- Netlify deploy; iPhone Safari tested

## Scope Tradeoffs
- Deferred: complex custom splits, invites/roles, in‑app payments, receipts
- Prioritized: speed, correctness, and clarity on mobile

## Tech Choices
- Frontend: React + Vite for speed and familiar DX
- Backend: Supabase (Postgres + Auth) for instant cloud persistence and security
- Hosting: Netlify (CI + quick environment setup)

## AI‑Assisted Workflow
- Planning: used AI to draft build plan, splitting spec, and decision memos
- Coding: leveraged AI to scaffold data models, algorithm tests, and UI structure
- Iteration: prompted AI for edge cases (rounding, minimal cash flow)

## Risks + How Addressed
- Time: constrained scope to equal split and record‑only payments
- Mobile UX: designed for single‑column, large tap targets, and clear summaries
- Data integrity: use integer cents, rounding reconciliation, unit tests

## Future Directions
- Custom shares/weights, invitations, read‑only share links
- App‑link recognition and richer payment shortcuts
- Receipts with OCR and CSV import/export

