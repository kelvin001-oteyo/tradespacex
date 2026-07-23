import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Stamp from '../components/Stamp'
import * as paymentsApi from '../api/paymentsApi'

export default function Receipt() {
  const { id } = useParams()
  const [txn, setTxn] = useState(null)

  useEffect(() => {
    paymentsApi.getTransaction(id).then(setTxn)
  }, [id])

  if (!txn) {
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
        <Link to="/payments/transactions" className="btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>← Back to transactions</Link>

        <div className="ledger-card" style={{ padding: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <p className="doc-number" style={{ marginBottom: 4 }}>RECEIPT — {txn.id.toUpperCase()}</p>
              <h1 className="font-display" style={{ fontSize: 22, margin: 0 }}>Payment receipt</h1>
            </div>
            <Stamp label="PAID" active size={64} />
          </div>

          <div className="receipt-row">
            <span style={{ color: 'var(--slate)' }}>Order</span>
            <span style={{ fontWeight: 500 }}>{txn.listingTitle}</span>
          </div>
          <div className="receipt-row">
            <span style={{ color: 'var(--slate)' }}>Paid to</span>
            <span>{txn.counterparty}</span>
          </div>
          <div className="receipt-row">
            <span style={{ color: 'var(--slate)' }}>Payment method</span>
            <span className="font-mono">{txn.methodLabel}</span>
          </div>
          <div className="receipt-row">
            <span style={{ color: 'var(--slate)' }}>Date</span>
            <span className="font-mono">{new Date(txn.createdAt).toLocaleString()}</span>
          </div>
          <div className="receipt-row" style={{ fontSize: 17, fontWeight: 700, paddingTop: 16 }}>
            <span>Total paid</span>
            <span className="font-mono">${txn.amount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}