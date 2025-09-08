import { Link, NavLink, Outlet, useNavigate, useParams, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import QRButton from '../shared/QRButton'
import GroupMembers from './GroupMembers'
import GroupExpenses from './GroupExpenses'
import GroupBalances from './GroupBalances'
import GroupSettlements from './GroupSettlements'

export default function GroupDashboard() {
  const { groupId } = useParams()
  const [groupName, setGroupName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!groupId) return
    void (async () => {
      const { data } = await supabase.from('groups').select('name').eq('id', groupId).single()
      if (!data) { navigate('/groups'); return }
      setGroupName(data.name)
    })()
  }, [groupId, navigate])

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>{groupName || 'Group'}</h2>
        <div className="row" style={{ gap: 8 }}>
          {/* Invite via QR: multi‑use for 2 minutes */}
          {groupId && <InviteQR groupId={groupId} />}
          <Link to="/groups" className="muted">Back to groups</Link>
        </div>
      </div>
      <div className="nav">
        <NavLink to="members" className={({isActive}) => isActive ? 'active' : ''}>Members</NavLink>
        <NavLink to="expenses" className={({isActive}) => isActive ? 'active' : ''}>Expenses</NavLink>
        <NavLink to="balances" className={({isActive}) => isActive ? 'active' : ''}>Balances</NavLink>
        <NavLink to="settlements" className={({isActive}) => isActive ? 'active' : ''}>Settlements</NavLink>
      </div>
      <Routes>
        <Route path="members" element={<GroupMembers />} />
        <Route path="expenses" element={<GroupExpenses />} />
        <Route path="balances" element={<GroupBalances />} />
        <Route path="settlements" element={<GroupSettlements />} />
      </Routes>
    </div>
  )
}

// Nested routes
export function GroupRoutes() {
  return null
}

function InviteQR({ groupId }: { groupId: string }) {
  async function createToken() {
    const token = crypto.getRandomValues(new Uint32Array(4)).join('')
    const expires = new Date(Date.now() + 2 * 60 * 1000).toISOString() // 2 minutes
    // Optional: clean up expired tokens client-side
    await supabase.from('group_join_tokens').insert({ group_id: groupId, token, expires_at: expires })
    return `${location.origin}/join/${token}`
  }
  return <QRTrigger createUrl={createToken} label="Invite via QR" />
}

function QRTrigger({ createUrl, label }: { createUrl: () => Promise<string | void>, label?: string }) {
  const [url, setUrl] = useState<string | null>(null)
  return url ? (
    <QRButton url={url} label={label ?? 'Show QR'} />
  ) : (
    <button type="button" onClick={async () => {
      const u = await createUrl(); if (u) setUrl(u as string)
    }}>{label ?? 'Show QR'}</button>
  )
}
