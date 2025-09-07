# Splitting Spec — Common Scenarios and Decisions

## Goals
- MVP: equal splits done right and fast.
- Inform v1.1: pragmatic path to custom splits without UI bloat.

## Common Scenarios (NYC use cases)
- Equal dinner split: all present, tax/tip included in total.
- Partial participation: only a subset joins an event/ticket.
- Repeated payer: one person fronts groceries multiple times; settle later.
- Edge: someone leaves early (skip a round), or buys add-ons (their cost only).

## Rules (MVP)
- Default split: equal among selected participants.
- Participants: choose subset per expense.
- Currency: USD; 2‑decimal rounding.
- Rounding reconciliation: adjust the largest participant by the rounding delta to ensure totals match exactly.

## Near-Term Extensions (v1.1)
- Shares/weights: allow integer weights (e.g., 2 shares vs 1) for uneven appetite.
- Fixed overrides: set a custom amount for a participant; remainder splits equally among others.
- Tax/tip handling: allow entering pre‑tax total + tip %; compute final amount.

## Group Model Implications
- Groups are stable lists of display names; expenses reference member IDs.
- Participation is per‑expense; default selects all members.
- Auth users collaborate via group access (see `group_users`), but members are labels, not tied to a specific auth user. Any group collaborator can add expenses or record settlements for the group.

## Algorithm Overview
1) For each expense: determine participants list, compute each share.
2) Net per member: sum(paid) − sum(owed) across expenses; apply settlements A→B as payments.
3) Suggested transfers: greedily match largest debtor to largest creditor until all within 1 cent.
