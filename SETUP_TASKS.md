# Setup Tasks — Step‑by‑Step Instructions

This guide lets you prep everything I need before scaffolding. It also locks decisions we’ll encode during implementation.

## 1) Create Supabase Project
1. Go to `https://app.supabase.com` and create a new project.
2. Choose a strong Postgres password; keep it safe (you won’t need it locally).
3. Wait for the project to provision.

Deliverables:
- Supabase Project URL (e.g., `https://xyzcompany.supabase.co`).

## 2) Enable Auth (Magic Links) and Redirects
1. In Supabase Dashboard → Authentication → Providers → Email, enable Email (Magic Link).
2. Authentication → URL Configuration:
   - Add Site URL(s) you’ll use:
     - Local dev: `http://localhost:5173`
     - Netlify preview (later): `https://<netlify-site-name>.netlify.app`
     - Netlify prod (later): your custom domain if any.
3. Save.

Deliverables:
- Email sign‑in enabled with the above URLs saved.

## 3) Grab Supabase Env Vars
1. Settings → API → copy:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Store them for when we configure Netlify and local `.env`.

Deliverables:
- Two values saved: URL and ANON KEY.

## 4) Decide Join Code Policy
1. Default expiry: choose an expiry (recommendation: 24 hours).
2. Revocation: owner can revoke existing join codes.
3. Note these in `ACCESS_MODEL.md` (policy section) so we encode them later.

Deliverables:
- Decision written into `ACCESS_MODEL.md`.

## 5) Create Netlify Site and Set Env Vars
1. Go to `https://app.netlify.com` → Add new site → Import from Git when code is ready (for now you can create a placeholder).
2. Site settings → Environment variables:
   - Add `VITE_SUPABASE_URL` with the value from step 3.
   - Add `VITE_SUPABASE_ANON_KEY` with the value from step 3.
3. We will add build command and deploy after scaffolding.

Deliverables:
- Netlify site created and env vars set.

## 6) Magic Link Sanity Test (Mobile)
1. In Supabase, test “Send magic link” to your email.
2. On iPhone: open link from Apple Mail; ensure it opens in Safari and reaches the configured domain (it may 404 until app exists — that’s OK).
3. On Android: open link from Gmail; ensure it opens in Chrome.
4. If links open inside in‑app webviews, use “Open in browser.”

Deliverables:
- Confirmation that links open in Safari (iOS) and Chrome (Android).

## 7) Prepare Devices
1. Have one iPhone and one Android device available.
2. Sign in to your email on both.

Deliverables:
- Devices ready for spot checks during deploy.

## 8) Demo Group and Handles
1. Pick 3–4 member names and any payment handles (Venmo/Cash App/PayPal) if available.
2. Edit `SCENARIOS.md` to include these names/handles.
3. Edit `DEMO_SCRIPT.md` if you want to use specific names.

Deliverables:
- Updated `SCENARIOS.md` and (optionally) `DEMO_SCRIPT.md`.

## 9) Demo Expenses
1. Choose concrete demo expenses (titles/amounts): e.g., “Dinner @ Xi’an $120”, “Groceries $60”.
2. Add them to `DEMO_SCRIPT.md` and keep them consistent with `SCENARIOS.md`.

Deliverables:
- Updated `DEMO_SCRIPT.md` with exact amounts.

## 10) Rounding Policy Confirmation
1. We currently reconcile rounding by adjusting the participant with the largest fractional remainder.
2. If you prefer a different rule, update `SPLITTING_SPEC.md` to state it.

Deliverables:
- Confirmed or updated rounding rule in `SPLITTING_SPEC.md`.

## 11) QR Expiry Choice
1. Choose default expiry for QR payment requests (recommendation: 15 minutes).
2. Add your choice to `TECH_DESIGN.md` under “QR Codes for Payment Requests.”

Deliverables:
- QR expiry documented in `TECH_DESIGN.md`.

## 12) Flowglad Vendor Facts
1. From `https://www.flowglad.com`, capture:
   - P2P link support? (between end users)
   - KYC/compliance model and who is merchant of record
   - Supported rails (ACH/card/RTP), fees, settlement speed
   - iOS/Android deep link behavior; mobile web support
   - APIs and webhooks (payment intent creation, status)
2. Paste these into `PAYMENTS_RESEARCH.md` under the open questions and fill the evaluation checklist.

Deliverables:
- Updated `PAYMENTS_RESEARCH.md` with Flowglad details.

## 13) Design Choices (Palette & Font)
1. Pick a simple, high‑contrast palette (light background, dark text, one primary accent that meets WCAG AA).
2. Choose a web‑safe font stack or Google Font (e.g., Inter, Source Sans, system UI).
3. Record choices in `DESIGN_USABILITY.md` (Visual section) and ensure AA contrast.

Deliverables:
- Palette and font documented in `DESIGN_USABILITY.md`.

## 14) Microcopy Decisions
1. Confirm button labels and terms: “Add expense”, “Record payment”, “Suggested transfers”, “Show QR”.
2. Add these to `DESIGN_USABILITY.md` (Content & Formatting).

Deliverables:
- Microcopy documented in `DESIGN_USABILITY.md`.

## 15) Privacy Notes
1. Decide what we communicate: “Data stored in Supabase (cloud), local cache for speed, no in‑app payments in MVP.”
2. Add a short Privacy note to `PRODUCT_BRIEF.md` and a sentence in the README later.

Deliverables:
- Privacy note added to `PRODUCT_BRIEF.md`.

## 16) Calendar Block
1. Reserve a 5‑hour window for build + test + 60‑second demo recording.
2. Ensure devices and test accounts are available.

Deliverables:
- Blocked time on your calendar.

---

## Appendix: Supabase SQL (Schema + Basic RLS)

Paste into Supabase SQL Editor and run. Adjust if needed.

```sql
-- Extensions (if not already enabled)
create extension if not exists pgcrypto;

-- Tables
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null,
  created_at timestamptz not null default now()
);

create table if not exists group_users (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner','member')),
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table if not exists group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  title text not null,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'USD',
  date date not null default now(),
  payer_member_id uuid not null references group_members(id) on delete restrict,
  participant_member_ids jsonb not null,
  split_type text not null default 'equal',
  custom_shares jsonb,
  created_at timestamptz not null default now()
);

create table if not exists settlements (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  from_member_id uuid not null references group_members(id) on delete restrict,
  to_member_id uuid not null references group_members(id) on delete restrict,
  amount_cents integer not null check (amount_cents > 0),
  date date not null default now(),
  note text,
  created_at timestamptz not null default now()
);

-- Optional: short‑lived payment request tokens for QR flow
create table if not exists payment_requests (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  from_member_id uuid not null references group_members(id) on delete restrict,
  to_member_id uuid not null references group_members(id) on delete restrict,
  amount_cents integer not null check (amount_cents > 0),
  note text,
  token text not null unique,
  expires_at timestamptz not null,
  created_by uuid not null,
  used_at timestamptz
);

-- Join tokens for QR-based group join (multi-use within short window)
create table if not exists group_join_tokens (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  token text not null unique,
  created_by uuid not null,
  expires_at timestamptz not null,
  max_joins integer,
  joins_count integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS
alter table groups enable row level security;
alter table group_users enable row level security;
alter table group_members enable row level security;
alter table expenses enable row level security;
alter table settlements enable row level security;
alter table payment_requests enable row level security;
alter table group_join_tokens enable row level security;

-- Policies
-- Groups: owners can do everything, members can read
drop policy if exists groups_owner_all on groups;
create policy groups_owner_all on groups
  for all using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

drop policy if exists groups_member_read on groups;
create policy groups_member_read on groups
  for select using (exists (
    select 1 from group_users gu where gu.group_id = groups.id and gu.user_id = auth.uid()
  ));

-- Group users: users can see their own mappings; insert themselves
drop policy if exists group_users_self_select on group_users;
create policy group_users_self_select on group_users
  for select using (auth.uid() = user_id);

drop policy if exists group_users_self_insert on group_users;
create policy group_users_self_insert on group_users
  for insert with check (auth.uid() = user_id);

-- Group members: any user in the group can read/write
drop policy if exists group_members_rw on group_members;
create policy group_members_rw on group_members
  for all using (exists (
    select 1 from group_users gu where gu.group_id = group_members.group_id and gu.user_id = auth.uid()
  )) with check (exists (
    select 1 from group_users gu where gu.group_id = group_members.group_id and gu.user_id = auth.uid()
  ));

-- Expenses: group collaborators can read/write
drop policy if exists expenses_rw on expenses;
create policy expenses_rw on expenses
  for all using (exists (
    select 1 from group_users gu where gu.group_id = expenses.group_id and gu.user_id = auth.uid()
  )) with check (exists (
    select 1 from group_users gu where gu.group_id = expenses.group_id and gu.user_id = auth.uid()
  ));

-- Settlements: group collaborators can read/write
drop policy if exists settlements_rw on settlements;
create policy settlements_rw on settlements
  for all using (exists (
    select 1 from group_users gu where gu.group_id = settlements.group_id and gu.user_id = auth.uid()
  )) with check (exists (
    select 1 from group_users gu where gu.group_id = settlements.group_id and gu.user_id = auth.uid()
  ));

-- Payment requests: group collaborators can read/write
drop policy if exists payment_requests_rw on payment_requests;
create policy payment_requests_rw on payment_requests
  for all using (exists (
    select 1 from group_users gu where gu.group_id = payment_requests.group_id and gu.user_id = auth.uid()
  )) with check (exists (
    select 1 from group_users gu where gu.group_id = payment_requests.group_id and gu.user_id = auth.uid()
  ));

-- Join tokens: group collaborators can read; create within their groups; updates limited
drop policy if exists group_join_tokens_rw on group_join_tokens;
create policy group_join_tokens_rw on group_join_tokens
  for all using (exists (
    select 1 from group_users gu where gu.group_id = group_join_tokens.group_id and gu.user_id = auth.uid()
  )) with check (exists (
    select 1 from group_users gu where gu.group_id = group_join_tokens.group_id and gu.user_id = auth.uid()
  ));

-- Optional: ensure member display names are unique per group (prevents duplicates when auto-creating labels)
create unique index if not exists uniq_group_members_name on group_members(group_id, display_name);

-- Optional helper: limit group size to 20 (enforced in client minimally);
-- to enforce in DB, you could add a constraint via trigger (out of MVP scope).
```
