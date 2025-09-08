import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type TokenRow = { id: string; group_id: string; token: string; expires_at: string; active: boolean }

export default function JoinConfirmPage() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groupName, setGroupName] = useState<string>('')
  const [groupId, setGroupId] = useState<string>('')
  const navigate = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    void (async () => {
      try {
        // Require login to proceed
        const { data: session } = await supabase.auth.getSession()
        if (!session.session) {
          // Store intended return path as a fallback for auth
          try { sessionStorage.setItem('postLoginRedirect', loc.pathname + loc.search) } catch {}
          // Redirect to auth with return path to this join link
          const redirect = encodeURIComponent(loc.pathname + loc.search)
          navigate(`/?redirect=${redirect}`, { replace: true })
          return
        }
        // Load token
        const now = new Date().toISOString()
        // Read the token row only; do not join to groups (blocked by RLS for non-members)
        const { data, error } = await supabase
          .from('group_join_tokens')
          .select('id, group_id, token, expires_at, active')
          .eq('token', token)
          .gt('expires_at', now)
          .eq('active', true)
          .maybeSingle()
        if (error) throw error
        if (!data) { setError('This invite has expired or is invalid.'); setLoading(false); return }
        const row = data as any as TokenRow
        setGroupId(row.group_id)
        setGroupName('Group')
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load invite.')
      } finally {
        setLoading(false)
      }
    })()
  }, [token, navigate, loc.pathname, loc.search])

  async function confirmJoin() {
    setError(null)
    try {
      // Cap: 20 users
      const { data: rows } = await supabase.from('group_users').select('id').eq('group_id', groupId)
      const size = rows?.length ?? 0
      if (size >= 20) { setError('This group is full (20 members).'); return }

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) { setError('Please sign in.'); return }
      // Try to insert membership; ignore unique error
      const ins = await supabase.from('group_users').insert({ group_id: groupId, user_id: user.user.id, role: 'member' })
      if (ins.error && String(ins.error.code) !== '23505') throw ins.error

      // Auto-create a member label (display name) if group has none resembling this user
      const email = user.user.email || ''
      const base = email.split('@')[0] || 'Member'
      const display = toTitleCase(base.replace(/[._-]+/g, ' ').trim()).slice(0, 40)
      if (groupId && display) {
        const { data: existing } = await supabase
          .from('group_members')
          .select('id')
          .eq('group_id', groupId)
          .ilike('display_name', display)
        if (!existing || existing.length === 0) {
          await supabase.from('group_members').insert({ group_id: groupId, display_name: display })
        }
      }

      navigate(`/groups/${groupId}`)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to join group.')
    }
  }

  if (loading) return <div className="card">Loading…</div>
  return (
    <div className="stack">
      <h2>Join Group</h2>
      {error && <div className="card" style={{ borderColor: 'tomato' }}>{error}</div>}
      {!error && (
        <div className="card">
          <div className="stack">
            <div>Do you want to join <strong>{groupName}</strong>?</div>
            <button onClick={confirmJoin}>Join group</button>
          </div>
        </div>
      )}
    </div>
  )
}

function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
}
