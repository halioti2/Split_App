import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  const loc = useLocation()
  const search = new URLSearchParams(loc.search)
  const returnTo = search.get('redirect') || ''

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data.session) navigate(returnTo && returnTo.startsWith('/') ? returnTo : '/groups', { replace: true })
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return
      if (session) navigate(returnTo && returnTo.startsWith('/') ? returnTo : '/groups', { replace: true })
    })
    // If arriving from a magic link, the URL may contain tokens; show brief pending state
    if (location.hash.includes('access_token') || location.href.includes('type=magiclink') || location.href.includes('token_hash=')) {
      setPending(true)
      // The supabase client auto-detects and stores the session; the onAuthStateChange above will navigate.
      setTimeout(() => setPending(false), 3000)
    }
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [navigate])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const redirectTo = window.location.origin + (returnTo && returnTo.startsWith('/') ? returnTo : '')
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })
    if (error) { setError(error.message); return }
    setSent(true)
  }

  return (
    <div className="stack">
      <h2>Welcome</h2>
      <p className="muted">Sign in with a magic link to continue.</p>
      {pending && <div className="card">Signing you in…</div>}
      <form onSubmit={send} className="stack" style={{ maxWidth: 420 }}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <button type="submit">Send magic link</button>
      </form>
      {sent && <div className="card">Check your email for the sign‑in link.</div>}
      {error && <div className="card" style={{ borderColor: 'tomato' }}>{error}</div>}
    </div>
  )
}
