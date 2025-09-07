# User Scenarios — Split Payments App

## Scenario 1: Equal Dinner Split (Mobile‑first)
- Persona: Alice (NYC, uses iPhone Safari/Android Chrome), friends Bob, Carol, You.
- Goal: Capture a dinner bill quickly and know who owes whom.
- Flow:
  1) Alice signs in via magic link.
  2) Opens group “NYC Friends” with members preset.
  3) Taps Add Expense → Title “Dinner @ Xi’an”, Amount $120, Payer: Alice, Participants: All.
  4) Saves. Balances view shows Bob and Carol each owe Alice $40; You owe $40.
  5) Alice taps Suggested Transfers to see minimal set; copies her Venmo handle link for Bob (optional) or shows a QR code for Bob to scan on Android.
- Edge cases: Tip already included; no receipt photo now (could add later via OCR).
- Success: Entry < 20s, balances instantly clear and shareable.

## Scenario 2: Grocery Runs Over a Week (Desktop + Mobile)
- Persona: You (desktop) and Bob (mobile), same group.
- Goal: Track multiple grocery expenses and settle at week’s end.
- Flow:
  1) You add groceries Mon ($60, you paid), Wed ($40, Bob paid), Fri ($100, you paid); all members participate.
  2) Balances auto‑compute net positions across expenses.
  3) On Friday night, app suggests a single minimal transfer from Bob to You.
  4) Bob records a settlement of the suggested amount.
- Edge cases: Rounding to cents, one member skipping one expense (deselect participant).
- Success: 1–2 taps per expense, one settlement clears the week.

## Scenario 3: Event Tickets with Partial Participation + No Venmo
- Persona: Carol (organizer), friend Dan doesn’t have Venmo.
- Goal: Carol fronts event tickets for 3 of 4 friends and collects without requiring specific apps.
- Flow:
  1) Carol adds expense: “Comedy tickets”, $180, Payer: Carol, Participants: Carol, You, Dan (Bob not attending).
  2) Balances show Dan and You owe Carol $60 each.
  3) Dan doesn’t have Venmo; Carol shows a QR code that opens the app’s payment request screen. Dan scans on Android Chrome, logs in, and sees the payment details with copy‑amount. If he has Cash App, Carol can offer that link too.
  4) When Dan pays outside the app, Carol records a settlement Dan → Carol $60; balances update.
- Edge cases: Different payment apps across members; missing handles.
- Success: Works even when friends lack a specific payment app; record‑only flow remains consistent.
