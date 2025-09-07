# Export Plan — CSV and Google Sheets (Future)

## MVP (Now)
- Provide CSV download for a group’s expenses/settlements/balances.
- Use consistent columns for easy import into Google Sheets/Excel.

## v1.1 (Future): One‑Click “Export to Google Sheets”
- Approach A (Recommended): User pastes a Google Sheets URL they own; we use a Google service account (key stored server‑side) that the user explicitly shares the sheet with. Netlify Function writes rows via Google Sheets API.
  - Pros: Simple user flow, no OAuth prompts, permission is explicit by sharing the sheet with the service account email.
  - Cons: Requires a small serverless function and secure secret storage.
- Approach B: User signs in with Google (OAuth) and authorizes Sheets scope; app writes to their Drive.
  - Pros: No manual sharing step.
  - Cons: More complex auth scopes and review; heavier for MVP.

## Data Shapes
- Expenses CSV: date, title, payer, amount_cents, currency, participants (pipe‑separated), split_type
- Settlements CSV: date, from_member, to_member, amount_cents, note
- Balances CSV: member, net_cents

## Security/Privacy
- Never store Google tokens in the client. Keep service account keys in Netlify env vars.
- Export initiated only by group owner.

