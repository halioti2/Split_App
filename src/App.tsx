import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [user, setUser] = useState<null | { id: string; email?: string | null }>(null)
  const loc = useLocation()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    init()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <div className="container">
      <header className="row" style={{ justifyContent: 'space-between' }}>
        <Link to="/" className="title">Split Pay</Link>
        <div className="row" style={{ gap: 12 }}>
          {user?.email && <span className="muted">{user.email}</span>}
          {user ? (
            <button onClick={() => supabase.auth.signOut()}>Sign out</button>
          ) : null}
        </div>
      </header>
      <nav className="nav" style={{ margin: '8px 0 16px' }}>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        {user && <NavLink to="/groups" className={({ isActive }) => isActive ? 'active' : ''}>Groups</NavLink>}
      </nav>
      <main>
        <Outlet />
      </main>
      <footer style={{ marginTop: 24 }}>
        <div className="muted">Path: {loc.pathname}</div>
      </footer>
    </div>
  )
}

