import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import * as ordersApi from '../api/ordersApi'
import * as paymentsApi from '../api/paymentsApi'

export default function Checkout() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [methods, setMethods] = useState([])
  const [selected, setSelected] = useState('')
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    ordersApi.getOrder(id).then(setOrder)
    paymentsApi.getPaymentMethods(user.email).then((m) => {
      setMethods(m)
      if (m.length > 0) setSelected(m[0].id)
    })
  }, [id, user])

  async function handlePay() {
    if (!selected) {
      setError('Add or select a payment method first.')
      return
    }
    setError('')
    setPaying(true)
    const txn = await paymentsApi.checkout({ userEmail: user.email, methodId: selected, order })
    setPaying(false)
    navigate(`/payments/transactions/${txn.id}`)
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container-md" style={{ paddingTop: 40 }}>
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px' }}>
        <Link to={`/orders/${id}`} className="btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>← Back to order</Link>

        <p className="doc-number" style={{ marginBottom: 4 }}>FORM 11 — CHECKOUT</p>
        <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 24px' }}>Pay for order</h1>

        <div className="ledger-card" style={{ padding: 24, marginBottom: 20 }}>
          <p className="field-label">Order</p>
          <p style={{ fontSize: 15, marginBottom: 12 }}>{order.listingTitle}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: 'var(--slate)' }}>{order.quantity.toLocaleString()} {order.unit} × ${order.price}</span>
            <span className="font-mono" style={{ fontWeight: 600 }}>${order.total.toLocaleString()}</span>
          </div>
        </div>

        {methods.length === 0 ? (
          <div className="ledger-card" style={{ padding: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 12 }}>No payment methods saved yet.</p>
            <Link to="/payments/methods" className="btn-ghost">Add a payment method</Link>
          </div>
        ) : (
          <div className="ledger-card" style={{ padding: 24 }}>
            <p className="field-label" style={{ marginBottom: 12 }}>Pay with</p>
            {methods.map((m) => (
              <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(18,33,63,0.08)', cursor: 'pointer' }}>
                <input type="radio" name="method" checked={selected === m.id} onChange={() => setSelected(m.id)} />
                <span style={{ fontSize: 14 }}>{m.label} •••• {m.last4}</span>
              </label>
            ))}

            {error && <p className="text-error" style={{ marginTop: 12 }}>{error}</p>}

            <button className="btn-primary" style={{ marginTop: 20 }} onClick={handlePay} disabled={paying}>
              {paying ? 'Processing payment…' : `Pay $${order.total.toLocaleString()}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}