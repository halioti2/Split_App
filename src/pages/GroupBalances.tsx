import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { minimalCashFlow, Transfer } from '../lib/settle'
import { formatCents } from '../lib/money'

type Member = { id: string; display_name: string }
type Expense = { id: string; amount_cents: number; payer_member_id: string; participant_member_ids: string[] }
type Settlement = { id: string; amount_cents: number; from_member_id: string; to_member_id: string }

export default function GroupBalances() {
  const { groupId } = useParams()
  const [members, setMembers] = useState<Member[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [settlements, setSettlements] = useState<Settlement[]>([])

  useEffect(() => { void load() }, [groupId])
  async function load() {
    if (!groupId) return
    const [ms, es, ss] = await Promise.all([
      supabase.from('group_members').select('id,display_name').eq('group_id', groupId),
      supabase.from('expenses').select('*').eq('group_id', groupId),
      supabase.from('settlements').select('*').eq('group_id', groupId),
    ])
    setMembers(ms.data ?? [])
    setExpenses((es.data ?? []) as any)
    setSettlements((ss.data ?? []) as any)
  }

  const nets = useMemo(() => {
    const map: Record<string, number> = {}
    members.forEach(m => { map[m.id] = 0 })
    // expenses
    for (const e of expenses) {
      const share = Math.floor(e.amount_cents / e.participant_member_ids.length)
      const remainder = e.amount_cents - share * e.participant_member_ids.length
      // distribute remainder to first N participants
      e.participant_member_ids.forEach((pid, idx) => {
        map[pid] = (map[pid] ?? 0) - share - (idx < remainder ? 1 : 0)
      })
      map[e.payer_member_id] = (map[e.payer_member_id] ?? 0) + e.amount_cents
    }
    // settlements: from pays to -> reduce from's net, increase to's net
    for (const s of settlements) {
      map[s.from_member_id] = (map[s.from_member_id] ?? 0) + s.amount_cents
      map[s.to_member_id] = (map[s.to_member_id] ?? 0) - s.amount_cents
    }
    return map
  }, [members, expenses, settlements])

  const suggestions: Transfer[] = useMemo(() => minimalCashFlow(nets), [nets])

  function name(id: string) { return members.find(m => m.id === id)?.display_name ?? id }

  return (
    <div className="stack">
      <h3>Balances</h3>
      <div className="stack">
        {members.map(m => (
          <div key={m.id} className="row" style={{ justifyContent: 'space-between' }}>
            <div>{m.display_name}</div>
            <div>{formatCents(nets[m.id] ?? 0)}</div>
          </div>
        ))}
      </div>
      <h3>Suggested transfers</h3>
      <div className="stack">
        {suggestions.length === 0 && <div className="card">All settled up.</div>}
        {suggestions.map((t, i) => (
          <div key={i} className="card row" style={{ justifyContent: 'space-between' }}>
            <div>{name(t.from)} → {name(t.to)}</div>
            <div>{formatCents(t.amount_cents)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

