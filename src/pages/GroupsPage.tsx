import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createGroup as apiCreateGroup, getAccessibleGroups, joinGroupById } from '../lib/api'
import type { Group } from '../lib/types'

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [name, setName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => { void load() }, [])

  async function load() {
    try {
      const gs = await getAccessibleGroups()
      setGroups(gs)
    } catch (e: any) {
      setMessage(e.message)
    }
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    try {
      const gid = await apiCreateGroup(name)
      if (!gid) { setMessage('Please sign in.'); navigate('/'); return }
      setName(''); await load(); navigate(`/groups/${gid}`)
    } catch (err: any) {
      setMessage(err?.message ?? 'Failed to create group. Did you run the Supabase schema/RLS?')
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    try {
      const gid = joinCode.trim()
      await joinGroupById(gid)
      setJoinCode(''); await load(); navigate(`/groups/${gid}`)
    } catch (err: any) {
      setMessage(err?.message ?? 'Failed to join group. Check the code and your permissions.')
    }
  }

  return (
    <div className="stack">
      <h2>Your Groups</h2>
      <div className="row" style={{ gap: 16, alignItems: 'flex-start' }}>
        <form onSubmit={handleCreateGroup} className="card" style={{ flex: 1 }}>
          <div className="stack">
            <div>
              <label htmlFor="gname">Create group</label>
              <input id="gname" value={name} onChange={e => setName(e.target.value)} placeholder="NYC Friends" required />
            </div>
            <button type="submit">Create</button>
          </div>
        </form>
        <form onSubmit={handleJoin} className="card" style={{ flex: 1 }}>
          <div className="stack">
            <div>
              <label htmlFor="jcode">Join with code</label>
              <input id="jcode" value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Paste join code" required />
            </div>
            <button type="submit">Join</button>
          </div>
        </form>
      </div>
      {message && <div className="card" style={{ borderColor: 'tomato' }}>{message}</div>}
      <div className="stack" style={{ marginTop: 12 }}>
        {groups.map(g => (
          <Link key={g.id} to={`/groups/${g.id}`} className="card">{g.name} <span className="muted">({g.id.slice(0,8)}…)</span></Link>
        ))}
        {groups.length === 0 && <div className="card">No groups yet. Create or join one above.</div>}
      </div>
    </div>
  )
}
