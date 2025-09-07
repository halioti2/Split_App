# Design, Usability, and Craft — Checklist

## Principles
- Mobile‑first: prioritize one clear primary action per screen.
- Clarity over cleverness: short labels, plain language, obvious next steps.
- Accessibility: meet WCAG AA contrast; support keyboard and screen readers.

## Visual
- Touch targets ≥44×44px; comfortable spacing; single‑column on mobile.
- Typographic scale (e.g., 16/20/24) with sufficient line height.
- Color palette with AA contrast; visible focus rings; distinguishable disabled state.

## Interaction
- Forms: label + helper text; inline errors; required vs optional indicated.
- Validation: amount must be positive; participants ≥1; payer ∈ participants.
- Feedback: toasts for success/fail; loading spinners; disable submit while pending.
- Undo affordance for destructive actions where feasible.

## Content & Formatting
- Currency: format USD with locale; live format as user types; store cents.
- Dates: default to today; show relative times where helpful.
- Empty states: explain what this view does and offer a next action.
- Microcopy: avoid jargon (“Split equally”, “Record payment”).

## Navigation
- Auth gate routes; preserve return path after magic link.
- Clear back paths; avoid dead ends after save; offer “Add another”.

## Accessibility
- Semantic HTML; ARIA only when necessary.
- Keyboard order predictable; Enter submits; Escape closes dialogs.
- Labels on inputs; describe buttons that rely on icons.

## Testing (Spot‑check)
- iPhone Safari and Android Chrome: auth, add expense, balances, settlement, QR scan.
- Desktop: keyboard only flow, focus states, resize to 320px width.

