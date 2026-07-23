import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import * as ordersApi from '../api/ordersApi'
import { NEXT_STATUS } from '../api/ordersApi'
import { Link, useParams } from 'react-router-dom'

import ReviewForm from '../components/ReviewForm'
import * as reviewsApi from '../api/reviewsApi'

const STEP_LABELS = {
  pending: 'Order placed',
  confirmed: 'Confirmed by supplier',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function OrderDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    const o = await ordersApi.getOrder(id)
    setOrder(o)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleAdvance() {
    setBusy(true)
    await ordersApi.updateOrderStatus(id, NEXT_STATUS[order.status])
    await load()
    setBusy(false)
  }

  async function handleCancel() {
    if (!confirm('Cancel this order?')) return
    setBusy(true)
    await ordersApi.cancelOrder(id)
    await load()
    setBusy(false)
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

  const isSeller = order.sellerEmail === user.email
  const isBuyer = order.buyerEmail === user.email
  const canAdvance = isSeller && NEXT_STATUS[order.status]
  const canCancel = isBuyer && ['pending', 'confirmed'].includes(order.status)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <Link to="/orders" className="btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>← Back to orders</Link>

        <div className="ledger-card" style={{ padding: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <span className="doc-number">{order.id.toUpperCase()}</span>
              <h1 className="font-display" style={{ fontSize: 24, margin: '6px 0 0' }}>{order.listingTitle}</h1>
            </div>
            <span className={`status-badge ${order.status}`}>{order.status}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
            <div>
              <p className="field-label">{isSeller ? 'Buyer' : 'Supplier'}</p>
              <p style={{ fontSize: 14 }}>{isSeller ? order.buyerName : order.sellerName}</p>
            </div>
            <div>
              <p className="field-label">Quantity</p>
              <p className="font-mono" style={{ fontSize: 14 }}>{order.quantity.toLocaleString()} {order.unit}</p>
            </div>
            <div>
              <p className="field-label">Price per unit</p>
              <p className="font-mono" style={{ fontSize: 14 }}>${order.price.toLocaleString()}</p>
            </div>
            <div>
              <p className="field-label">Order total</p>
              <p className="font-mono" style={{ fontSize: 14 }}>${order.total.toLocaleString()}</p>
            </div>
            {['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) && (
            <div style={{ marginTop: 8 }}>
             <Link to={`/orders/${order.id}/shipment`} className="btn-ghost">
                {isSeller ? 'Manage shipment' : 'Track shipment'}
            </Link>
              </div>
                )}

                {isBuyer && order.status === 'delivered' && !reviewed && (
              <ReviewForm order={order} user={user} onSubmitted={() => setReviewed(true)} />
             )}
               {isBuyer && order.status === 'delivered' && reviewed && (
               <p style={{ marginTop: 20, fontSize: 13.5, color: 'var(--moss)' }}>You've reviewed this order. Thank you.</p>
          ) }
          </div>

          <div className="timeline">
            {order.timeline.map((step, i) => (
              <div key={i} className="timeline-step">
                <div className="timeline-dot filled" />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{STEP_LABELS[step.status]}</p>
                  <p className="font-mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>
                    {new Date(step.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {isBuyer && ['pending', 'confirmed', 'processing'].includes(order.status) && (
            <div style={{ marginTop: 8 }}>
              <Link
                to={`/orders/${order.id}/checkout`}
                className="btn-primary"
                style={{ display: 'inline-block', width: 'auto', padding: '10px 20px', textAlign: 'center', textDecoration: 'none' }}
              >
                Pay ${order.total.toLocaleString()}
              </Link>
            </div>
          )}

          {(canAdvance || canCancel) && (
            <div style={{ display: 'flex', gap: 16, marginTop: 8, borderTop: '1px solid rgba(18,33,63,0.1)', paddingTop: 20 }}>
              {canAdvance && (
                <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleAdvance} disabled={busy}>
                  {busy ? 'Updating…' : `Mark as ${NEXT_STATUS[order.status]}`}
                </button>
              )}
              {canCancel && (
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, color: 'var(--rust)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 4 }}
                  onClick={handleCancel}
                  disabled={busy}
                >
                  Cancel order
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}