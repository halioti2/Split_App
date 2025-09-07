# Payments Research — Flowglad (Future Integration)

Note: Network access is restricted, so this summary is based on general payment‑integration evaluation criteria. Please confirm details from https://www.flowglad.com so we can refine.

## What We Need (Product Requirements)
- Peer‑to‑peer or peer‑like transfers between friends (not merchant checkout), ideally app‑to‑app on iPhone.
- Minimal compliance/KYC burden for us as the app maker (no money transmitter registration for MVP).
- Simple client UX: tap to pay, or a link/QR that opens the user’s payment method.
- Web‑first integration working on iPhone Safari.

## Key Questions for Flowglad
- Payment Model: Does Flowglad support P2P payments between two end users, or is it merchant/marketplace only?
- Compliance: Who is the merchant of record? Do we need to onboard users (KYC/KYB)? Any money transmitter implications for us?
- Rails: Which rails are supported (ACH, RTP, card, wallet‑to‑wallet)? Settlement times and fees?
- iOS Support: App links/deep links? Mobile web compatibility? Apple Pay support?
- APIs & Webhooks: Create payment intents, status webhooks, refund/cancel flows.
- Identity: How are users identified (emails, handles, Flowglad accounts)?
- Geography: US support (NY) and currency USD.
- Pricing: Per‑transaction fees, monthly minimums, payout costs.
- Data & Security: PCI scope, tokenization, how we avoid handling sensitive data.

## Integration Models (Hypothetical)
- Payment Links/Deep Links
  - We generate a link via API and show a “Pay <Name> $X” button. The payer completes flow in Flowglad’s UI/app; we receive a webhook to mark the settlement as paid.
  - Pros: Easiest UX; minimal sensitive data in our app.
  - Cons: Requires serverless functions for webhooks and signature verification.

- P2P/Marketplace (Platform Accounts)
  - Each user becomes a Flowglad account; our app creates transfers between accounts.
  - Pros: Native P2P flows, clearer balances.
  - Cons: KYC onboarding, compliance obligations, ongoing ops — likely too heavy for near‑term.

- Merchant Checkout (Card/Wallet)
  - Centralizes funds to us, then we “settle” off‑platform.
  - Cons: Misaligned with P2P; creates legal/compliance risk — not recommended for this product.

## MVP Impact
- Recommendation: Keep MVP “record‑only” with optional external links (Venmo/Cash App/PayPal) to meet 5‑hour target and support friends without a specific app.
- Flowglad Pilot (Post‑MVP): If Flowglad offers payment links for person‑to‑person, add a “Pay with Flowglad” button next to suggested transfers.

## Spike Plan (0.5–1 day, after MVP)
1) Confirm P2P support, pricing, and KYC model with Flowglad.
2) Build a Netlify Function to create a payment link via Flowglad API.
3) Add a webhook endpoint to mark settlements as paid when Flowglad confirms.
4) Gate behind a feature flag per group.

## Risks
- Compliance/KYC scope creep if it’s not truly P2P links.
- Mobile deep‑link reliability and user drop‑off mid‑flow.
- Operational burden: disputes, refunds, failed payments, webhook retries.

## Current Decision
- MVP: Record‑only settlements + optional external payment shortcuts.
- Future: Revisit Flowglad once we validate P2P link support and compliance fit.
