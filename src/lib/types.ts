export type Group = { id: string; name: string; owner_user_id: string }
export type GroupUser = { id: string; group_id: string; user_id: string; role: 'owner'|'member' }
export type GroupMember = { id: string; group_id: string; display_name: string }
export type Expense = {
  id: string; group_id: string; title: string; amount_cents: number; currency: 'USD';
  date: string; payer_member_id: string; participant_member_ids: string[]; split_type: 'equal'|'custom'; custom_shares?: Record<string, number>
}
export type Settlement = { id: string; group_id: string; from_member_id: string; to_member_id: string; amount_cents: number; date: string; note?: string }
export type PaymentRequest = { id: string; group_id: string; from_member_id: string; to_member_id: string; amount_cents: number; note?: string; token: string; expires_at: string; created_by: string; used_at?: string|null }

