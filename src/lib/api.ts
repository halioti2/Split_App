import { supabase } from './supabase'
import type { Group, GroupMember, Expense, Settlement, PaymentRequest } from './types'

export async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

export async function getAccessibleGroups(): Promise<Group[]> {
  const { data: gu } = await supabase.from('group_users').select('group_id')
  const ids = gu?.map(g => g.group_id) ?? []
  if (!ids.length) return []
  const { data } = await supabase.from('groups').select('*').in('id', ids)
  return (data ?? []) as Group[]
}

export async function createGroup(name: string): Promise<string | null> {
  const uid = await currentUserId(); if (!uid) return null
  const { data, error } = await supabase.from('groups').insert({ name, owner_user_id: uid }).select('id').single()
  if (error) throw error
  const gid = data!.id
  await supabase.from('group_users').insert({ group_id: gid, user_id: uid, role: 'owner' })
  return gid
}

export async function joinGroupById(groupId: string) {
  const uid = await currentUserId(); if (!uid) return
  await supabase.from('group_users').insert({ group_id: groupId, user_id: uid, role: 'member' })
}

export async function listMembers(groupId: string): Promise<GroupMember[]> {
  const { data } = await supabase.from('group_members').select('*').eq('group_id', groupId).order('created_at')
  return (data ?? []) as GroupMember[]
}

export async function addMember(groupId: string, display_name: string) {
  await supabase.from('group_members').insert({ group_id: groupId, display_name })
}

export async function listExpenses(groupId: string): Promise<Expense[]> {
  const { data } = await supabase.from('expenses').select('*').eq('group_id', groupId).order('date', { ascending: false })
  return (data ?? []) as Expense[]
}

export async function addExpense(e: Omit<Expense, 'id'>) {
  await supabase.from('expenses').insert(e)
}

export async function listSettlements(groupId: string): Promise<Settlement[]> {
  const { data } = await supabase.from('settlements').select('*').eq('group_id', groupId).order('date', { ascending: false })
  return (data ?? []) as Settlement[]
}

export async function addSettlement(s: Omit<Settlement, 'id'>) {
  await supabase.from('settlements').insert(s)
}

export async function createPaymentRequest(pr: Omit<PaymentRequest, 'id'|'created_by'|'used_at'>) {
  const uid = await currentUserId(); if (!uid) return null
  const payload = { ...pr, created_by: uid }
  await supabase.from('payment_requests').insert(payload)
  return `${location.origin}/pay/${pr.token}`
}

export async function getPayRequestByToken(token: string) {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  if (error) throw error
  return data as PaymentRequest | null
}

