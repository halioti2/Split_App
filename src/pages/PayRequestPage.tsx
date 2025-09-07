import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PayRequestPage() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    void (async () => {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) {
        // Not signed in; rely on global auth guard in app in real build
      }
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()
      if (error) { setError(error.message) }
      setData(data)
      setLoading(false)
    })()
  }, [token])

  if (loading) return <div>Loading…</div>
  if (error) return <div className="card" style={{ borderColor: 'tomato' }}>{error}</div>
  if (!data) return <div className="card">This payment request is invalid or expired.</div>

  const amount = (data.amount_cents / 100).toFixed(2)

  return (
    <div className="stack">
      <h2>Payment Request</h2>
      <div className="card">
        <div className="stack">
          <div><strong>Amount:</strong> ${amount}</div>
          {data.note && <div><strong>Note:</strong> {data.note}</div>}
          <div className="row">
            <button onClick={() => navigator.clipboard.writeText(`$${amount} ${data.note ?? ''}`.trim())}>Copy amount + note</button>
          </div>
          <div className="muted">Use your preferred app (Venmo/Cash App/PayPal) to pay, then the requester will record the settlement.</div>
        </div>
      </div>
    </div>
  )
}

