import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setAuthed(Boolean(data.session))
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return
      setAuthed(Boolean(session))
    })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  if (loading) return <div className="card">Loading…</div>
  if (!authed) {
    const params = new URLSearchParams({ redirect: loc.pathname + loc.search })
    return <Navigate to={`/${params.toString() ? `?${params.toString()}` : ''}`} replace />
  }
  return children
}

