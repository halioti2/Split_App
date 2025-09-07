import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatCents } from '../lib/money'
import QRButton from '../shared/QRButton'

type Member = { id: string; display_name: string }
type Settlement = { id: string; from_member_id: string; to_member_id: string; amount_cents: number; date: string; note?: string }

export default function GroupSettlements() {
  const { groupId } = useParams()
  const [members, setMembers] = useState<Member[]>([])
  const [items, setItems] = useState<Settlement[]>([])
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => { void load() }, [groupId])
  async function load() {
    if (!groupId) return
    const { data: ms } = await supabase.from('group_members').select('id,display_name').eq('group_id', groupId).order('created_at')
    setMembers(ms ?? [])
    const { data: it } = await supabase.from('settlements').select('*').eq('group_id', groupId).order('date', { ascending: false })
    setItems((it ?? []) as any)
    if (ms && ms.length >= 2) { setFromId(ms[0].id); setToId(ms[1].id) }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!groupId) return
    setMsg(null)
    const cents = Math.round((parseFloat(amount) || 0) * 100)
    if (cents <= 0) { setMsg('Amount must be positive.'); return }
    if (!fromId || !toId) { setMsg('Choose From and To.'); return }
    if (fromId === toId) { setMsg('From and To must be different.'); return }
    setSaving(true)
    try {
      const { error } = await supabase.from('settlements').insert({ group_id: groupId, from_member_id: fromId, to_member_id: toId, amount_cents: cents, date: new Date().toISOString(), note })
      if (error) throw error
      setAmount(''); setNote(''); setMsg('Payment recorded.'); await load()
    } catch (err: any) {
      setMsg(err?.message ?? 'Failed to record settlement.')
    } finally {
      setSaving(false)
    }
  }

  async function createPayRequest() {
    if (!groupId) return
    const cents = Math.round((parseFloat(amount) || 0) * 100)
    if (cents <= 0 || !fromId || !toId || fromId === toId) { setMsg('Enter a valid From/To and positive amount.'); return }
    const token = crypto.getRandomValues(new Uint32Array(4)).join('')
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    const { data: user } = await supabase.auth.getUser()
    await supabase.from('payment_requests').insert({
      group_id: groupId,
      from_member_id: fromId,
      to_member_id: toId,
      amount_cents: cents,
      note,
      token,
      expires_at: expires,
      created_by: user.user?.id,
    })
    return `${location.origin}/pay/${token}`
  }

  function name(id: string) { return members.find(m => m.id === id)?.display_name ?? id }

  return (
    <div className="stack">
      <form onSubmit={add} className="card">
        <div className="stack">
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>From</label>
              <select value={fromId} onChange={e => setFromId(e.target.value)}>
                {members.map(m => <option key={m.id} value={m.id}>{m.display_name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>To</label>
              <select value={toId} onChange={e => setToId(e.target.value)}>
                {members.map(m => <option key={m.id} value={m.id}>{m.display_name}</option>)}
              </select>
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label>Amount (USD)</label>
              <input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Note</label>
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g., Groceries" />
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button type="submit" disabled={saving}>Record payment</button>
            <QRTrigger createUrl={createPayRequest} />
          </div>
          {msg && <div className={`card ${msg.includes('Failed') || msg.includes('must') ? 'error' : ''}`}>{msg}</div>}
        </div>
      </form>
      <div className="stack">
        {items.map(it => (
          <div key={it.id} className="card row" style={{ justifyContent: 'space-between' }}>
            <div>{name(it.from_member_id)} → {name(it.to_member_id)}</div>
            <div>{formatCents(it.amount_cents)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QRTrigger({ createUrl }: { createUrl: () => Promise<string | void> }) {
  const [url, setUrl] = useState<string | null>(null)
  return url ? (
    <QRButton url={url} label="Show QR" />
  ) : (
    <button type="button" onClick={async () => {
      const u = await createUrl()
      if (u) setUrl(u)
    }}>Generate QR</button>
  )
}
