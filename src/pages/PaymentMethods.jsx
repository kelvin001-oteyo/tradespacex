import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import * as paymentsApi from '../api/paymentsApi'

const TYPES = [
  { key: 'card', label: 'Card' },
  { key: 'bank', label: 'Bank' },
  { key: 'mobile_money', label: 'Mobile Money' },
]

export default function PaymentMethods() {
  const { user } = useAuth()
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('card')
  const [form, setForm] = useState({ label: '', number: '' })
  const [busy, setBusy] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    setLoading(true)
    const m = await paymentsApi.getPaymentMethods(user.email)
    setMethods(m)
    setLoading(false)
  }

  useEffect(() => {
    if (user?.email) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.label || !form.number) return
    setBusy(true)
    await paymentsApi.addPaymentMethod(user.email, {
      type,
      label: form.label,
      last4: form.number.slice(-4),
    })
    setForm({ label: '', number: '' })
    setShowForm(false)
    setBusy(false)
    load()
  }

  async function handleRemove(id) {
    if (!confirm('Remove this payment method?')) return
    await paymentsApi.removePaymentMethod(id)
    load()
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p className="doc-number" style={{ marginBottom: 4 }}>PAYMENT REGISTER</p>
            <h1 className="font-display" style={{ fontSize: 28, margin: 0 }}>Payment methods</h1>
          </div>
          {!showForm && (
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => setShowForm(true)}>
              + Add method
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="ledger-card" style={{ padding: 24, marginBottom: 20 }}>
            <div className="method-type-tabs">
              {TYPES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`method-type-tab ${type === t.key ? 'active' : ''}`}
                  onClick={() => setType(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <Field label={type === 'card' ? 'Cardholder name' : type === 'bank' ? 'Account name' : 'Registered name'}>
              <input className="field-input" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Jane Doe" />
            </Field>
            <Field label={type === 'card' ? 'Card number' : type === 'bank' ? 'Account number' : 'Phone number'}>
              <input className="field-input" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} placeholder="•••• •••• •••• 4242" />
            </Field>

            <p style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 16 }}>
              This is a mock form — no real card data is processed or stored, only the last 4 digits for display.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} disabled={busy}>
                {busy ? 'Saving…' : 'Save method'}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        ) : methods.length === 0 ? (
          <div className="ledger-card" style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--slate)' }}>No payment methods saved yet.</p>
          </div>
        ) : (
          <div className="ledger-card" style={{ padding: 0 }}>
            {methods.map((m) => (
              <div key={m.id} className="method-card" style={{ borderBottom: '1px solid rgba(18,33,63,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="method-icon">
                    {m.type === 'card' ? 'CARD' : m.type === 'bank' ? 'BANK' : 'M-PESA'}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{m.label}</p>
                    <p className="font-mono" style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>•••• {m.last4}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(m.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: 'var(--rust)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 4 }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}