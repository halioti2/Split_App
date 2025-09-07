# Access Model — Accounts, Groups, and Members

## Concepts
- User: Authenticated person (Supabase Auth).
- Group: Container for expenses/members; owned by one user but shared with others.
- Group User: Mapping of `user_id` to `group_id` with a simple role (owner|member).
- Group Member: Display name labels used on expenses/settlements (e.g., “Alice”). Not tied to auth.

## Why This Split
- Keeps expense math simple (members are labels) while allowing multiple authenticated users to collaborate on the same group.

## Minimal Sharing (MVP)
- Owner creates a group, gets a short “join code” or share link.
- A friend signs in and enters the join code to become a `group_user` (role: member).
- RLS policies grant access to rows by presence in `group_users` for that `group_id`.

## Editing and Identity
- Any group user can add expenses and record settlements on behalf of any member label in the group.
- If needed later, we can link a user to a preferred member label (e.g., “when Bob signs in, default to Bob”). This is cosmetic and not required for correctness.

## Risks & Mitigations
- Join code leakage: codes should expire or be revocable; owner can remove `group_users` rows.
- Confusion between user and member: keep UI language clear (“members are names on expenses; users are people who can edit this group”).

