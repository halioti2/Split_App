import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import QRButton from '../shared/QRButton'
import { Routes, Route } from 'react-router-dom'
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
          {/* Placeholder QR to group route for quick sharing */}
          {groupId && <QRButton url={`${location.origin}/groups/${groupId}`} label="Show group QR" />}
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
