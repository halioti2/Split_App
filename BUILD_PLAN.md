# Split Payments App — Build Plan

This document is the working plan to build a minimal, fast, and reliable app for dividing payments among friends within a 5‑hour timebox. Tailored for a LinkedIn Associate Product Builder (APB) application: emphasizes clear product thinking, pragmatic scope, and AI‑assisted execution.

## Objectives
- Track shared expenses in groups and compute fair balances.
- Show “who owes whom” with a minimal set of settlements.
- Allow recording settlements to keep balances up to date.

## MVP Scope
- Multi‑device with accounts (friends can log in anywhere in NYC).
- Create a group with named members.
- Add expenses: title, amount, payer, date, participants, split method (equal by default; allow per‑person adjustments in later iteration if time allows).
- View per‑member net balances and suggested transfers to settle.
- Record settlements (mark a payment from A → B); optional payment link shortcuts (no in‑app money movement).
- Cloud persistence (so data is available on any device) with Auth.

Out of scope for MVP: real money transfers, multi‑currency, receipt scanning, invitations, notifications, roles/permissions, realtime, complex analytics.

## 5‑Hour Timebox Plan
1) 0:00–0:20 — Lock requirements; pick stack; align on splitting cases.
2) 0:20–0:50 — Scaffold app (Vite + React), configure Supabase (Auth + Postgres), wire environment for Netlify.
3) 0:50–1:30 — Data model + settle algorithm + unit tests.
4) 1:30–2:30 — Core UI: auth flow, groups, members, add expense, balances.
5) 2:30–3:10 — Settlements UI; optional payment links (Venmo/Cash App/PayPal) as deep links; rounding edge cases.
6) 3:10–4:10 — Polish UX, validation, mobile/iPhone testing; accessibility basics.
7) 4:10–4:40 — Deploy to Netlify; seed demo data; demo script.
8) 4:40–5:00 — Buffer for fixes; record 60‑sec demo.

### Validation Checkpoints
- After step 2: Auth smoke test (magic link iOS/Android), Supabase client read/write test row.
- After step 3: Unit tests green for settlement algorithm (equal, subset, rounding, multi‑expense + settlement).
- After step 4: Manual flow — create group, join with code, add members and an expense, balances correct.
- After step 5: Record settlement updates balances; suggested transfers reflect change; external links/copy work.
- After QR prototype: Scan QR on iPhone/Android → login → lands on payment request route; token expiry respected.
- Before deploy (step 6/7): Mobile smoke tests on iPhone Safari + Android Chrome; accessibility spot‑checks (contrast/focus/tap targets).
- Post‑deploy: Open live URL on both devices; repeat core flow end‑to‑end.

## Architecture Decision
- Chosen: Web app (React + Vite) + Supabase (Auth + Postgres) + Netlify deploy.
- Rationale: multi‑device accounts and cloud persistence with minimal backend work. Works on iPhone Safari. Serverless fits 5‑hour limit better than rolling our own API.

## Data Model (MVP)
- User: `id`, `email`, `name` (from Auth provider)
- Group: `id`, `name`, `ownerUserId`
- GroupMember: `id`, `groupId`, `displayName` (not tied to auth unless invited later)
- Expense: `id`, `groupId`, `title`, `amount`, `currency=USD`, `date`, `payerMemberId`, `participantMemberIds[]`, `splitType` (equal|custom), `customShares` (optional)
- Settlement: `id`, `groupId`, `fromMemberId`, `toMemberId`, `amount`, `date`, `note`

Computed:
- Net balance per member = paid − owed (expenses minus shares, plus/minus settlements).
- Suggested transfers: min‑cash‑flow algorithm to reduce number of transactions.

## UX Flow
- Sign up / sign in (email magic link; optional Google).
- Create/select group ➜ add members (friend names).
- Add expense: payer, participants, amount, date, notes; equal split (custom later if time).
- View balances: per‑member net and suggested transfers.
- Record settlement: mark payment from A → B; balances update.
- Optional: tap a suggested transfer to open an external payment link (Venmo/Cash App/PayPal) or copy amount.

## Non‑Functional
- Currency: USD only; locale‑aware formatting.
- Rounding: 2 decimals; reconcile rounding deltas on largest share.
- Responsive for iPhone Safari and Android Chrome, plus desktop.
- Cloud persistence (Supabase Postgres + RLS), Auth via magic link/Google.
- Deployed demo on Netlify.

### Design & Craft (MVP bar)
- Clear mobile‑first layout with large tap targets (≥44×44px) and spacing.
- Accessible color contrast (WCAG AA), focus states, and form labels.
- Friendly, concise microcopy; obvious primary actions; destructive actions confirmed.
- Predictable formatting: currency and dates locale‑aware; live input formatting.
- Empty states with guidance; inline validation errors; toasts for success/fail.
- Loading skeletons/spinners for async actions; disable while submitting.
- Keyboard support on desktop (tab order, Enter/Escape for dialogs).
- Basic analytics: track key actions for the 60‑sec demo (optional).

## Clarified Decisions (from you)
- Platform: Web app; must work well on iPhone.
- Sync: Multi‑device with accounts.
- Auth: Use Supabase Auth (magic link, optional Google); supports cloud persistence; payment integration kept external for MVP.
- Persistence: Cloud (Supabase Postgres) so friends can use it anywhere in NYC.
- Currency: USD only.
- Split methods: Start with equal split; see Splitting Spec for common cases to inform next iteration.
- Groups: Named groups; tie expenses to groups; see Splitting Spec for nuances.
- Payments: Record‑only in MVP with optional external payment links; see Payments Decision doc.
- Export/share: CSV export later; read‑only link is a view‑only URL you can share (nice‑to‑have; not in MVP).
- Deploy: Netlify.
- Mobile: iPhone Safari tested.

## Assumptions (tightened for MVP)
- Equal split first; custom shares only if time allows.
- No invitations or complex roles; group members are labels.
- Record settlements only; no in‑app money movement.
- Minimal styling; focus on correctness and clarity.
- 60‑second demo oriented.

## Success Criteria (MVP)
- Sign up, create group, add members and expenses.
- Correct per‑member net balances and suggested transfers.
- Record settlements and see balances update immediately.
- Data persists across devices (cloud DB) and sessions.
- Deployed on Netlify and usable on iPhone Safari and Android Chrome.
- Unit tests for settlement algorithm and rounding.

## Implementation Tasks (Checklist)
- [ ] Initialize Vite + React app; set up routing and state.
- [ ] Configure Supabase project, tables, and RLS; integrate Auth (magic link, Google optional).
- [ ] Implement group access: `group_users` table + RLS so multiple signed‑in users can see/edit the same group.
- [ ] Implement core data model/types and API helpers.
- [ ] Implement settle/min‑cash‑flow algorithm + unit tests.
  - [ ] Checkpoint: tests cover equal, subset, rounding, multi‑expense + settlement.
- [ ] UI: auth flow, groups/members management.
  - [ ] Checkpoint: sign in/out on iOS/Android; create group; join with code.
- [ ] UI: add expense (equal split first).
- [ ] Balances view + suggested transfers.
- [ ] Record settlement flow; optional external payment links.
  - [ ] Checkpoint: balances update; suggested transfers change; links/clipboard work.
- [ ] Validation, rounding reconciliation, and mobile polish.
- [ ] Design/usability pass using the checklist (contrast, focus, tap targets, microcopy).
- [ ] Deployment to Netlify; env setup; smoke test on iPhone.
- [ ] Demo script; usage docs and tradeoffs.
  
Optional (time‑permitting)
- [ ] QR code for payment request link (deep link or app route), to help friends open the right screen after login on mobile.
  - [ ] Checkpoint: scan on iPhone/Android → resolves token → shows request; expiry works.
- [ ] Join via QR: client-side limits (only 1 active token per member, max 3 active per group); show revoke UI.

## Risks & Mitigations
- Timebox: strict MVP; push custom splits and invites to v1.1.
- Auth integration hiccups: prefer magic links; skip complex providers.
- Rounding drift: reconcile by adjusting the largest participant by delta cents.
- Payments complexity: stick to record‑only + external links; avoid Stripe.
- Mobile quirks: test on iPhone Safari early; keep layout simple.

## Future Enhancements
- User accounts and cloud sync.
- Multi‑currency and currency conversion.
- Photo receipts and OCR.
- Import from bank/CSV; export to CSV.
- Realtime collaboration and notifications.
