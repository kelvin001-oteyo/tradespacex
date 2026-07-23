import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import * as ordersApi from '../api/ordersApi'
import * as tseApi from '../api/tseApi'
import { CHECKPOINT_STAGES } from '../api/tseApi'

export default function Shipment() {
  const { orderId } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ carrier: '', trackingNumber: '', origin: '', destination: '' })
  const [noteForm, setNoteForm] = useState({ stage: '', note: '' })

  async function load() {
    setLoading(true)
    const o = await ordersApi.getOrder(orderId)
    setOrder(o)
    const s = await tseApi.getShipmentByOrder(orderId)
    setShipment(s)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  async function handleCreateShipment(e) {
    e.preventDefault()
    setBusy(true)
    await tseApi.createShipment({ orderId, ...form })
    await load()
    setBusy(false)
  }

  async function handleAddCheckpoint(e) {
    e.preventDefault()
    if (!noteForm.stage) return
    setBusy(true)
    await tseApi.addCheckpoint(shipment.id, noteForm)
    setNoteForm({ stage: '', note: '' })
    await load()
    setBusy(false)
  }

  if (loading || !order) {
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
  const lastStage = shipment?.checkpoints[shipment.checkpoints.length - 1]?.stage
  const nextStageIndex = lastStage ? CHECKPOINT_STAGES.indexOf(lastStage) + 1 : 0
  const availableStages = CHECKPOINT_STAGES.slice(nextStageIndex)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <Link to={`/orders/${orderId}`} className="btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>← Back to order</Link>

        <p className="doc-number" style={{ marginBottom: 4 }}>SHIPMENT — {order.id.toUpperCase()}</p>
        <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 24px' }}>{order.listingTitle}</h1>

        {!shipment ? (
          isSeller ? (
            <form onSubmit={handleCreateShipment} className="ledger-card" style={{ padding: 30 }}>
              <p style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 20 }}>
                No shipment created yet. Fill this in once the order is packed and ready to send.
              </p>
              <Field label="Carrier">
                <input className="field-input" required value={form.carrier} onChange={(e) => setForm((f) => ({ ...f, carrier: e.target.value }))} placeholder="e.g. DHL, Maersk, G4S Courier" />
              </Field>
              <Field label="Tracking number">
                <input className="field-input" required value={form.trackingNumber} onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))} placeholder="e.g. TSX-2026-00417" />
              </Field>
              <div className="shipment-meta-row">
                <Field label="Origin">
                  <input className="field-input" required value={form.origin} onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))} placeholder="City, Country" />
                </Field>
                <Field label="Destination">
                  <input className="field-input" required value={form.destination} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} placeholder="City, Country" />
                </Field>
              </div>
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? 'Creating…' : 'Create shipment'}
              </button>
            </form>
          ) : (
            <div className="ledger-card" style={{ padding: 32, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--slate)' }}>The supplier hasn't created a shipment for this order yet.</p>
            </div>
          )
        ) : (
          <div className="ledger-card" style={{ padding: 30 }}>
            <div className="shipment-meta-row">
              <div>
                <p className="field-label">Carrier</p>
                <p style={{ fontSize: 14 }}>{shipment.carrier}</p>
              </div>
              <div>
                <p className="field-label">Tracking number</p>
                <span className="tracking-number">{shipment.trackingNumber}</span>
              </div>
              <div>
                <p className="field-label">Origin</p>
                <p style={{ fontSize: 14 }}>{shipment.origin}</p>
              </div>
              <div>
                <p className="field-label">Destination</p>
                <p style={{ fontSize: 14 }}>{shipment.destination}</p>
              </div>
            </div>

            <div className="timeline">
              {shipment.checkpoints.map((c, i) => (
                <div key={i} className="checkpoint-step">
                  <div className="checkpoint-dot" />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{c.stage}</p>
                    {c.note && <p style={{ fontSize: 13, color: 'var(--slate)', margin: '2px 0' }}>{c.note}</p>}
                    <p className="font-mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>
                      {new Date(c.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {isSeller && availableStages.length > 0 && (
              <form onSubmit={handleAddCheckpoint} style={{ borderTop: '1px solid rgba(18,33,63,0.1)', paddingTop: 20, marginTop: 8 }}>
                <p className="field-label" style={{ marginBottom: 10 }}>Add tracking update</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <select className="field-input" style={{ maxWidth: 220 }} value={noteForm.stage} onChange={(e) => setNoteForm((f) => ({ ...f, stage: e.target.value }))}>
                    <option value="">Select stage</option>
                    {availableStages.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    className="field-input"
                    style={{ maxWidth: 220 }}
                    placeholder="Note (optional)"
                    value={noteForm.note}
                    onChange={(e) => setNoteForm((f) => ({ ...f, note: e.target.value }))}
                  />
                  <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 18px' }} disabled={busy}>
                    Add update
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}