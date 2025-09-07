import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Member = { id: string; display_name: string }

export default function GroupMembers() {
  const { groupId } = useParams()
  const [members, setMembers] = useState<Member[]>([])
  const [name, setName] = useState('')

  useEffect(() => { void load() }, [groupId])
  async function load() {
    if (!groupId) return
    const { data } = await supabase.from('group_members').select('id,display_name').eq('group_id', groupId).order('created_at')
    setMembers(data ?? [])
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!groupId) return
    if (!name.trim()) return
    await supabase.from('group_members').insert({ group_id: groupId, display_name: name.trim() })
    setName(''); await load()
  }

  return (
    <div className="stack">
      <form onSubmit={add} className="row" style={{ alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="mname">Add member</label>
          <input id="mname" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Alice" required />
        </div>
        <button type="submit">Add</button>
      </form>
      <div className="stack">
        {members.map(m => (
          <div key={m.id} className="card">{m.display_name}</div>
        ))}
        {members.length === 0 && <div className="card">No members yet. Add a few names.</div>}
      </div>
    </div>
  )
}
