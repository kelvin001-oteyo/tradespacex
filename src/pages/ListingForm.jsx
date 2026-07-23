import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import * as marketplaceApi from '../api/marketplaceApi'

const EMPTY = { title: '', category: '', price: '', unit: '', minOrderQty: '', location: '', description: '' }

export default function ListingForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    marketplaceApi.getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (isEdit) {
      marketplaceApi.getListing(id).then((l) => {
        setForm({ ...l })
        setLoading(false)
      })
    }
  }, [id, isEdit])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title || !form.category || !form.price || !form.unit) {
      setError('Please fill in title, category, price, and unit.')
      return
    }
    setBusy(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        minOrderQty: Number(form.minOrderQty) || 1,
        sellerId: user.email,
        sellerName: user.fullName,
      }
      if (isEdit) {
        await marketplaceApi.updateListing(id, payload)
        navigate(`/marketplace/listing/${id}`)
      } else {
        const created = await marketplaceApi.createListing(payload)
        navigate(`/marketplace/listing/${created.id}`)
      }
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
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
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>
        <p className="doc-number" style={{ marginBottom: 4 }}>{isEdit ? 'FORM 09 — EDIT LISTING' : 'FORM 08 — NEW LISTING'}</p>
        <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 24px' }}>{isEdit ? 'Edit listing' : 'Create a listing'}</h1>

        <form onSubmit={handleSubmit} className="ledger-card" style={{ padding: 30 }}>
          <Field label="Title">
            <input className="field-input" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Grade A Arabica Coffee Beans" />
          </Field>

          <Field label="Category">
            <select className="field-input" value={form.category} onChange={(e) => update('category', e.target.value)}>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Price (USD)">
              <input type="number" step="0.01" className="field-input" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="0.00" />
            </Field>
            <Field label="Unit">
              <input className="field-input" value={form.unit} onChange={(e) => update('unit', e.target.value)} placeholder="kg, unit, meter…" />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Minimum order qty">
              <input type="number" className="field-input" value={form.minOrderQty} onChange={(e) => update('minOrderQty', e.target.value)} placeholder="1" />
            </Field>
            <Field label="Location">
              <input className="field-input" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="City, Country" />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              className="field-input"
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe quality, specs, shipping terms…"
            />
          </Field>

          {error && <p className="text-error" style={{ marginBottom: 14 }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Publish listing'}
          </button>
        </form>
      </div>
    </div>
  )
}