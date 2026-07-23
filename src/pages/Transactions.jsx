import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import * as paymentsApi from '../api/paymentsApi'

export default function Transactions() {
  const { user } = useAuth()
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      paymentsApi.getTransactions(user.email).then((t) => {
        setTxns(t)
        setLoading(false)
      })
    }
  }, [user])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p className="doc-number" style={{ marginBottom: 4 }}>PAYMENT HISTORY</p>
            <h1 className="font-display" style={{ fontSize: 28, margin: 0 }}>Transactions</h1>
          </div>
          <Link to="/payments/methods" className="btn-ghost">Manage payment methods</Link>
        </div>

        {loading ? (
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        ) : txns.length === 0 ? (
          <div className="ledger-card" style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--slate)' }}>No transactions yet.</p>
          </div>
        ) : (
          <div className="ledger-card" style={{ padding: 0 }}>
            {txns.map((t) => (
              <Link key={t.id} to={`/payments/transactions/${t.id}`} className="transaction-row">
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{t.listingTitle}</p>
                  <p className="font-mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>
                    {new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {t.counterparty}
                  </p>
                </div>
                <span className="font-mono" style={{ fontSize: 15, fontWeight: 600 }}>${t.amount.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}