import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatCents } from '../lib/money'

type Member = { id: string; display_name: string }
type Expense = { id: string; title: string; amount_cents: number; date: string; payer_member_id: string; participant_member_ids: string[] }

export default function GroupExpenses() {
  const { groupId } = useParams()
  const [members, setMembers] = useState<Member[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [payerId, setPayerId] = useState('')
  const [partIds, setPartIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => { void load() }, [groupId])
  async function load() {
    if (!groupId) return
    const { data: ms } = await supabase.from('group_members').select('id,display_name').eq('group_id', groupId).order('created_at')
    setMembers(ms ?? [])
    const { data: es } = await supabase.from('expenses').select('*').eq('group_id', groupId).order('date', { ascending: false })
    setExpenses((es ?? []) as any)
  }

  useEffect(() => {
    if (members.length) {
      setPayerId(members[0].id)
      setPartIds(members.map(m => m.id))
    }
  }, [members.length])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!groupId) return
    setMsg(null)
    const cents = Math.round((parseFloat(amount) || 0) * 100)
    if (cents <= 0) { setMsg('Amount must be positive.'); return }
    if (!payerId) { setMsg('Select a payer.'); return }
    if (partIds.length === 0) { setMsg('Select at least one participant.'); return }
    if (!partIds.includes(payerId)) { setMsg('Payer must be included among participants.'); return }
    setSaving(true)
    try {
      const { error } = await supabase.from('expenses').insert({
        group_id: groupId,
        title,
        amount_cents: cents,
        currency: 'USD',
        date: new Date().toISOString(),
        payer_member_id: payerId,
        participant_member_ids: partIds,
        split_type: 'equal'
      })
      if (error) throw error
      setTitle(''); setAmount(''); setMsg('Expense added.'); await load()
    } catch (err: any) {
      setMsg(err?.message ?? 'Failed to add expense.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="stack">
      <form onSubmit={add} className="card">
        <div className="stack">
          <div>
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Dinner" required />
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Amount (USD)</label>
              <input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Payer</label>
              <select value={payerId} onChange={e => setPayerId(e.target.value)}>
                {members.map(m => <option key={m.id} value={m.id}>{m.display_name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label>Participants</label>
            <div className="row" style={{ flexWrap: 'wrap' }}>
              {members.map(m => (
                <label key={m.id} className="row" style={{ gap: 6 }}>
                  <input type="checkbox" checked={partIds.includes(m.id)} onChange={(e) => setPartIds(p => e.target.checked ? [...p, m.id] : p.filter(x => x !== m.id))} />
                  {m.display_name}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving}>Add expense</button>
          {msg && <div className={`card ${msg.includes('Failed') || msg.includes('must') ? 'error' : ''}`}>{msg}</div>}
        </div>
      </form>

      <div className="stack">
        {expenses.map(ex => (
          <div key={ex.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong>{ex.title}</strong>
              <span>{formatCents(ex.amount_cents)}</span>
            </div>
            <div className="muted">Participants: {ex.participant_member_ids.length}</div>
          </div>
        ))}
        {expenses.length === 0 && <div className="card">No expenses yet.</div>}
      </div>
    </div>
  )
}
