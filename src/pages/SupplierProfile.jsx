import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Stamp from '../components/Stamp'
import ListingCard from '../components/ListingCard'
import * as marketplaceApi from '../api/marketplaceApi'
import * as reviewsApi from '../api/reviewsApi'

export default function SupplierProfile() {
  const { id } = useParams()
  const [supplier, setSupplier] = useState(null)
  const [reviewData, setReviewData] = useState({ reviews: [], average: null, count: 0 })
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    marketplaceApi.getSupplier(id).then(setSupplier).catch(() => setNotFound(true))
    reviewsApi.getSupplierReviews(id).then(setReviewData)
  }, [id])

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container-md" style={{ paddingTop: 40 }}>
          <p style={{ fontSize: 14, color: 'var(--slate)' }}>Supplier not found.</p>
          <Link to="/marketplace" className="btn-ghost" style={{ marginTop: 12, display: 'inline-block' }}>Back to marketplace</Link>
        </div>
      </div>
    )
  }

  if (!supplier) {
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
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p className="doc-number" style={{ marginBottom: 4 }}>SUPPLIER PROFILE</p>
            <h1 className="font-display" style={{ fontSize: 28, margin: 0 }}>{supplier.name}</h1>
            <p style={{ fontSize: 13.5, color: 'var(--slate)', marginTop: 4 }}>{supplier.location}</p>
            <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 8 }}>
              {reviewData.average !== null ? (
                <><span className="star-display">★</span> {reviewData.average} ({reviewData.count} review{reviewData.count !== 1 ? 's' : ''})</>
              ) : (
                'No reviews yet'
              )}
              {' · '}{supplier.listingCount} active listing{supplier.listingCount !== 1 ? 's' : ''}
            </p>
          </div>
          <Stamp label={supplier.verified ? 'VERIFIED' : 'UNVERIFIED'} active={supplier.verified} />
        </div>

        {reviewData.reviews.length > 0 && (
          <div className="ledger-card" style={{ padding: 24, marginBottom: 28 }}>
            <p className="field-label" style={{ marginBottom: 4 }}>Reviews</p>
            {reviewData.reviews.map((r) => (
              <div key={r.id} className="review-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{r.buyerName}</span>
                  <span className="star-display">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p style={{ fontSize: 13.5, color: 'var(--slate)', marginTop: 4 }}>{r.comment}</p>}
                <p className="font-mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>
                  {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}

        <h2 className="font-display" style={{ fontSize: 19, margin: '0 0 16px' }}>Listings from this supplier</h2>
        <div className="listing-grid">
          {supplier.listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  )
}