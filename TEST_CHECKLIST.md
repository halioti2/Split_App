# Test Checklist — MVP Validation

Use this as a quick pass at each checkpoint. Prioritize mobile.

## Unit Tests (Algorithm)
- Equal split across all members → per‑member net equals expected.
- Subset participation → non‑participants owe 0.
- Rounding: totals reconcile; largest remainder absorbs delta cent(s).
- Multiple expenses + one settlement → nets adjust correctly.

## Auth
- iPhone Safari: request magic link → open → returns to app domain, logged in.
- Android Chrome: same; Gmail → Chrome handoff works.
- Sign out/in toggles protected routes.

## Groups & Access
- Create group; generate join code.
- Second account joins with code; both see the same group.
- Unauthorized account cannot access group data (RLS enforced).

## Members & Expenses
- Add members; default new expense selects all.
- Add equal‑split expense → balances update as expected.
- Deselect a member for partial participation → balances adjust.

## Suggested Transfers
- Show minimal set; amounts sum to clear debts.
- After recording a settlement, suggestions update.

## Settlements
- Record A→B payment; net balances adjust immediately.
- External link buttons render if handles exist; “Copy amount + note” always available.

## QR Payment Request (Prototype)
- Generate QR for a suggested transfer; scan on iPhone/Android.
- After login, route resolves token and shows correct details.
- Expired token denied; generate a new one works.

## Mobile UX & A11y
- Tap targets ≥44px; forms labeled; focus states visible.
- Color contrast passes AA; screen resizes to 320px width.

## Deploy Smoke Test
- Open live Netlify URL on iPhone + Android.
- Run: login → create group → add members → add expense → check balances → record settlement → (optional) QR.

