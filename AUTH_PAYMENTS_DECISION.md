# Auth, Persistence, and Payments — Decision Memo

## Persistence (Plain English)
Persistence means your data lives in the cloud (a database) so you and your friends can log in from any device, anywhere in NYC, and see the same groups/expenses. We will use Supabase (hosted Postgres) for this.

## Auth Choice
- Supabase Auth: email magic links (fast), optional Google sign‑in.
- Why: Quick to integrate in a 5‑hour window, works on iPhone Safari, and ties directly into our database security (RLS).

## Payments: Options and Tradeoffs
- Record‑only (Chosen for MVP)
  - Pros: Fastest to build; no compliance/KYC; works for friends without Venmo; one flow for all.
  - Cons: You still pay outside the app; less “magic”.
  - Timeline: ~20–30 min to add settlement UI and optional external links.

- External Links (Optional add‑on in MVP)
  - Venmo deep links (e.g., `venmo://pay?recipients=<username>&amount=<amt>&note=Split`) open the app on iPhone.
  - Cash App links (`https://cash.app/$handle/amount`) and PayPal.me links are similar.
  - Pros: Convenience for those who have the app.
  - Cons: Some friends don’t have Venmo; usernames/handles required; detection is tricky. We’ll treat this as optional shortcuts.
  - Timeline: ~20–30 min to format links and copy buttons.
  - Enhancement: Show a QR code that encodes a short‑lived payment request URL so a friend on iPhone/Android can scan and land on the right screen after login.

- Stripe (Not for MVP)
  - Stripe Payment Links or Checkout are built for merchants, not P2P. Stripe Connect (for person‑to‑person) requires onboarding, KYC, and complex flows.
  - Pros: Robust infra if we later charge or collect money centrally.
  - Cons: Heavy setup, compliance, and design work — not feasible in 5 hours.
  - Timeline: Multiple days to weeks for a real, compliant flow.

- Flowglad (Future Research)
  - Open questions: Does it support P2P payment links between users with minimal KYC for our app? What are the fees, rails, and webhook support?
  - Potential fit: If Flowglad can generate person‑to‑person payment links, we can attach “Pay with Flowglad” next to suggested transfers and reconcile via webhooks.
  - Status: Defer to post‑MVP spike. See `PAYMENTS_RESEARCH.md` for evaluation criteria and a spike plan.

## Decision Summary
- MVP: Record settlements inside the app. Provide optional external payment shortcuts (Venmo/Cash App/PayPal) when a member’s handle is known; otherwise “copy amount + note”.
- Future: Consider Stripe Connect only if moving to managed, compliant flows (not peer‑to‑peer among friends).
