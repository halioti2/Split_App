# Technical Design — Split Payments App

## Architecture
- Web app: React + Vite
- Backend: Supabase (Postgres + Auth + Storage optional)
- Hosting: Netlify (frontend), Supabase (managed backend)
- Mobile: iPhone Safari and Android Chrome primary targets; responsive layout

## Data Model (Supabase)
- tables
  - `groups(id, name, owner_user_id)`
  - `group_users(id, group_id, user_id, role)`  // access control: owner|member
  - `group_members(id, group_id, display_name)`
  - `expenses(id, group_id, title, amount_cents, currency, date, payer_member_id, participant_member_ids jsonb, split_type, custom_shares jsonb)`
  - `settlements(id, group_id, from_member_id, to_member_id, amount_cents, date, note)`
  - `payment_requests(id, group_id, from_member_id, to_member_id, amount_cents, note, token, expires_at, created_by, used_at nullable)` (optional/post‑MVP QR)
- security
  - Row‑Level Security (RLS): users can access rows where they are mapped in `group_users` for that `group_id`. Owner has full access; members have read/write to expenses/settlements.
  - Note: `group_members` are labels in a group and are not auth users. Multiple signed‑in users can collaborate in a group via `group_users` linkage.

## API Access
- Use Supabase JS client from the frontend for CRUD operations.
- Validation in client; rely on RLS to protect cross‑user access.

## Algorithm: Minimal Cash Flow
- Inputs: net balances per member (positive = owed money, negative = owes money).
- Process: repeatedly match largest debtor with largest creditor; transfer min(abs(debt), credit); update; stop when all within 1 cent.
- Output: list of suggested transfers.

## Rounding
- Track money in integer cents.
- When splitting, compute per‑person shares in cents; distribute remainder cents to participants with largest fractional parts to ensure sum matches total.

## Auth
- Supabase Auth: email magic link (fastest), optional Google. This is our chosen auth — the “Auth via magic link/Google” phrasing in the plan refers to Supabase Auth.
- iPhone: magic link opens in Safari; ensure redirect URL is configured in Supabase and Netlify.
 - Android: magic link opens in Chrome; ensure redirect URL matches site origin; test Gmail app → Chrome handoff.

## Payment Shortcuts (Optional)
- Venmo: `venmo://pay?txn=pay&recipients=<username>&amount=<amount>&note=<note>`
- Cash App: `https://cash.app/$<handle>/<amount>`
- PayPal.me: `https://paypal.me/<handle>/<amount>`
- Render buttons if a handle is stored on a member; otherwise show copy‑to‑clipboard.

## QR Codes for Payment Requests (Optional/Post‑MVP)
- Goal: Let a payer show a QR that brings a friend to the exact settlement/payment screen after login.
- Data Model (new table): `payment_requests(id uuid, group_id, from_member_id, to_member_id, amount_cents, note, token, expires_at)`
- Flow:
  1) User taps “Show QR” on a suggested transfer or settlement request; app creates a `payment_requests` row with a random `token` and short expiry (e.g., 15 minutes).
  2) App renders a QR code for `https://<app-domain>/pay/<token>`.
  3) Friend scans on iPhone/Android; if not signed in, completes magic‑link login; the app resolves the token, shows the payment details, and provides external payment shortcuts (Venmo/Cash App/PayPal) and a “Mark as paid” action for the requester.
- Security: random high‑entropy tokens, short expiration. One‑time use is ideal but not critical for MVP since no money moves in‑app; access still requires login + group membership via RLS.
- Libraries: lightweight QR code generator (e.g., `qrcode` or `qrcode.react`).

## Environment
- Netlify environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Local `.env`: same variables for dev.

## Testing
- Unit tests for settle algorithm (edge cases: all equal, one payer, rounding).
- Smoke test on iPhone Safari and Android Chrome; verify auth, add expense, balances, settlement.

## Future‑Ready: Receipts & OCR (Post‑MVP)
- Storage: Supabase Storage bucket `receipts/` for images (HEIC/JPG/PNG/PDF).
- Table: `receipts(id, group_id, expense_id nullable, storage_path, uploaded_by, created_at, ocr_text nullable, ocr_status, vendor nullable, total_cents nullable)`.
- Flow later: upload image → serverless OCR (Tesseract in Netlify Function or hosted OCR API) → parse merchant/date/total → suggest prefilled expense → user confirms.
- Privacy: store raw image + extracted text; allow deletion.

## Realtime (Post‑MVP)
- Use Supabase Realtime to subscribe to `expenses` and `settlements` per `group_id` so balances update instantly across users.
- MVP fallback: simple refetch on navigation or every N seconds.

## Export (Post‑MVP)
- Create CSV endpoints/client utility to export expenses and settlements for a group: columns like date, title, payer, amount, participants, per‑member share.
- Google Sheets (future): Netlify Function using Google Sheets API. Recommended flow: user shares a target Sheet with our service account and pastes the Sheet URL; function writes rows.
