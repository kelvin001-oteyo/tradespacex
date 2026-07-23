import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import * as ordersApi from '../api/ordersApi'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      ordersApi.getOrders(user.email).then((o) => {
        setOrders(o)
        setLoading(false)
      })
    }
  }, [user])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <p className="doc-number" style={{ marginBottom: 4 }}>ORDER LEDGER</p>
        <h1 className="font-display" style={{ fontSize: 28, margin: '0 0 24px' }}>Orders</h1>

        {loading ? (
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        ) : orders.length === 0 ? (
          <div className="ledger-card" style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--slate)' }}>No orders yet.</p>
            <Link to="/marketplace" className="btn-ghost" style={{ marginTop: 12, display: 'inline-block' }}>Browse the marketplace</Link>
          </div>
        ) : (
          orders.map((o) => {
            const isSeller = o.sellerEmail === user.email
            return (
              <Link key={o.id} to={`/orders/${o.id}`} className="ledger-card order-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span className="doc-number">{o.id.toUpperCase()}</span>
                    <h3 className="font-display" style={{ fontSize: 17, margin: '4px 0 0' }}>{o.listingTitle}</h3>
                  </div>
                  <span className={`status-badge ${o.status}`}>{o.status}</span>
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--slate)', marginBottom: 4 }}>
                  {isSeller ? `Buyer: ${o.buyerName}` : `Seller: ${o.sellerName}`}
                </p>
                <p style={{ fontSize: 13.5 }}>
                  {o.quantity.toLocaleString()} {o.unit} · <span className="font-mono">${o.total.toLocaleString()}</span> total
                </p>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}