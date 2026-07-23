import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import * as communicationApi from '../api/communicationApi'
import * as ordersApi from '../api/ordersApi'

export default function Quotes() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState(null)
  const [form, setForm] = useState({ price: '', terms: '' })

  async function load() {
    setLoading(true)
    const q = await communicationApi.getQuotes(user.email)
    setQuotes(q)
    setLoading(false)
  }

  useEffect(() => {
    if (user?.email) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleRespond(quoteId, decline = false) {
    await communicationApi.respondToQuote(quoteId, { ...form, decline })
    setResponding(null)
    setForm({ price: '', terms: '' })
    load()
  }

  async function handleAccept(quote) {
    const order = await ordersApi.createOrder({
      buyerEmail: quote.buyerEmail,
      buyerName: quote.buyerName,
      sellerEmail: quote.sellerEmail,
      sellerName: quote.sellerName,
      listingId: quote.listingId,
      listingTitle: quote.listingTitle,
      quantity: quote.quantity,
      unit: 'unit',
      price: quote.response.price,
    })
    navigate(`/orders/${order.id}`)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <p className="doc-number" style={{ marginBottom: 4 }}>QUOTATION REGISTER</p>
        <h1 className="font-display" style={{ fontSize: 28, margin: '0 0 24px' }}>Quote requests</h1>

        {loading ? (
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        ) : quotes.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--slate)' }}>No quote requests yet.</p>
        ) : (
          quotes.map((q) => {
            const isSeller = q.sellerEmail === user.email
            return (
              <div key={q.id} className="ledger-card quote-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span className="doc-number">{q.id.toUpperCase()}</span>
                    <h3 className="font-display" style={{ fontSize: 17, margin: '4px 0 0' }}>{q.listingTitle}</h3>
                  </div>
                  <span className={`status-pill ${q.status}`}>{q.status}</span>
                </div>

                <p style={{ fontSize: 13.5, color: 'var(--slate)', marginBottom: 4 }}>
                  {isSeller ? `From: ${q.buyerName}` : `To: ${q.sellerName}`}
                </p>
                <p style={{ fontSize: 13.5, marginBottom: 4 }}>
                  Quantity: <span className="font-mono">{q.quantity}</span>
                  {q.targetPrice && <> · Target price: <span className="font-mono">${q.targetPrice}</span></>}
                </p>
                {q.notes && <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 8 }}>"{q.notes}"</p>}

                {q.status === 'responded' && q.response && (
                  <div style={{ background: 'var(--parchment)', padding: 12, marginTop: 8, border: '1px solid rgba(18,33,63,0.1)' }}>
                    <p className="field-label">Supplier's offer</p>
                    <p style={{ fontSize: 14, marginBottom: q.buyerEmail === user.email ? 10 : 0 }}>
                      ${q.response.price} per unit {q.response.terms && `· ${q.response.terms}`}
                    </p>
                    {q.buyerEmail === user.email && (
                      <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => handleAccept(q)}>
                        Accept & place order
                      </button>
                    )}
                  </div>
                )}

                {isSeller && q.status === 'pending' && (
                  responding === q.id ? (
                    <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        className="field-input"
                        style={{ maxWidth: 120 }}
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      />
                      <input
                        className="field-input"
                        style={{ maxWidth: 200 }}
                        placeholder="Terms (optional)"
                        value={form.terms}
                        onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))}
                      />
                      <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => handleRespond(q.id)}>
                        Send offer
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
                      <button className="btn-ghost" onClick={() => setResponding(q.id)}>Respond with a price</button>
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, color: 'var(--rust)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 4 }}
                        onClick={() => handleRespond(q.id, true)}
                      >
                        Decline
                      </button>
                    </div>
                  )
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}