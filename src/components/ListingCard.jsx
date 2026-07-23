import { Link } from 'react-router-dom'

export default function ListingCard({ listing, isFavorite, onToggleFavorite, actions }) {
  return (
    <div className="ledger-card listing-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="doc-number">{listing.id.toUpperCase()}</span>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(listing.id)}
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          >
            {isFavorite ? '★ Saved' : '☆ Save'}
          </button>
        )}
      </div>

      <span className="category-pill">{listing.category}</span>

      <Link to={`/marketplace/listing/${listing.id}`} style={{ textDecoration: 'none', marginBottom: 8 }}>
        <h3 className="font-display" style={{ fontSize: 18, margin: 0, lineHeight: 1.3 }}>
          {listing.title}
        </h3>
      </Link>

      <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 8, marginBottom: 16 }}>
        {listing.description.length > 110 ? listing.description.slice(0, 110) + '…' : listing.description}
      </p>

      <div className="listing-price-row">
        <div>
          <p className="font-mono" style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
            ${listing.price.toLocaleString()}
            <span style={{ fontSize: 12, color: 'var(--slate)' }}> / {listing.unit}</span>
          </p>
          <p style={{ fontSize: 11.5, color: 'var(--slate)', marginTop: 2 }}>
            MOQ {listing.minOrderQty.toLocaleString()} {listing.unit}
          </p>
        </div>
        <p style={{ fontSize: 12, color: 'var(--slate)', textAlign: 'right' }}>{listing.location}</p>
      </div>

      {actions && <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>{actions}</div>}
    </div>
  )
}