import { useState } from 'react'
import * as reviewsApi from '../api/reviewsApi'

export default function ReviewForm({ order, user, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await reviewsApi.submitReview({
        orderId: order.id,
        sellerId: order.sellerEmail,
        sellerName: order.sellerName,
        buyerEmail: user.email,
        buyerName: user.fullName,
        rating,
        comment,
      })
      onSubmitted()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ledger-card" style={{ padding: 24, marginTop: 20 }}>
      <p className="field-label" style={{ marginBottom: 10 }}>Rate this supplier</p>
      <div className="star-row" style={{ marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star-btn ${n <= (hovered || rating) ? 'filled' : ''}`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} star`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="field-input"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional — describe your experience with this supplier"
        style={{ marginBottom: 14 }}
      />

      {error && <p className="text-error" style={{ marginBottom: 14 }}>{error}</p>}

      <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} disabled={busy}>
        {busy ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  )
}