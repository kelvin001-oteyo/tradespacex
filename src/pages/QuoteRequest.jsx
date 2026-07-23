import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import * as marketplaceApi from '../api/marketplaceApi'
import * as communicationApi from '../api/communicationApi'

export default function QuoteRequest() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [form, setForm] = useState({ quantity: '', targetPrice: '', notes: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    marketplaceApi.getListing(id).then((l) => {
      setListing(l)
      setForm((f) => ({ ...f, quantity: l.minOrderQty }))
    })
  }, [id])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.quantity) {
      setError('Please enter a quantity.')
      return
    }
    setBusy(true)
    await communicationApi.requestQuote({
      buyerEmail: user.email,
      buyerName: user.fullName,
      sellerEmail: listing.sellerId,
      sellerName: listing.sellerName,
      listingId: listing.id,
      listingTitle: listing.title,
      quantity: form.quantity,
      targetPrice: form.targetPrice,
      notes: form.notes,
    })
    setBusy(false)
    navigate('/quotes')
  }

  if (!listing) {
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
        <Link to={`/marketplace/listing/${id}`} className="btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>← Back to listing</Link>

        <p className="doc-number" style={{ marginBottom: 4 }}>FORM 10 — QUOTATION REQUEST</p>
        <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 4px' }}>Request a quote</h1>
        <p style={{ fontSize: 13.5, color: 'var(--slate)', marginBottom: 24 }}>{listing.title}</p>

        <form onSubmit={handleSubmit} className="ledger-card" style={{ padding: 30 }}>
          <Field label={`Quantity (${listing.unit})`}>
            <input
              type="number"
              className="field-input"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
              placeholder={`Minimum ${listing.minOrderQty}`}
            />
          </Field>
          <Field label="Target price per unit (optional)">
            <input
              type="number"
              step="0.01"
              className="field-input"
              value={form.targetPrice}
              onChange={(e) => update('targetPrice', e.target.value)}
              placeholder={`Listed at $${listing.price}`}
            />
          </Field>
          <Field label="Notes (optional)">
            <textarea
              className="field-input"
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Delivery timeline, packaging preferences, etc."
            />
          </Field>

          {error && <p className="text-error" style={{ marginBottom: 14 }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Sending…' : 'Send quote request'}
          </button>
        </form>
      </div>
    </div>
  )
}