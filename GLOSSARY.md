# Glossary

- Persistence: Storing data in the cloud so it’s available across devices and sessions (not just in your browser).
- Read‑only link: A shareable URL that shows balances/expenses but does not allow edits.
- Settlement: A recorded payment between two members that reduces outstanding balances.
- Suggested transfers: Minimal list of who should pay whom to clear all debts.
- RLS (Row‑Level Security): Database rules that limit which rows a user can read/write.
- Supabase Auth: Managed authentication from Supabase; we’ll use email magic links (and optionally Google) to sign users in.
- Magic link: A one‑time sign‑in link sent to your email. Tap the link on your phone and you’re signed in without a password.
- CSV export: Downloading expenses/balances as a CSV file to keep a backup, analyze in spreadsheets, or share with friends who don’t use the app.
- Realtime collaboration: Live updates (e.g., another user’s new expense appears instantly). Possible later with Supabase Realtime; not required for MVP.
- QR payment request: A QR code that points to a short‑lived app URL for a specific settlement so a friend can scan on iPhone/Android, log in, and land on the correct screen.
- Join code: A short code or link the group owner shares so other signed‑in users can join a group; can be revoked or expire.
