import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Stamp from '../components/Stamp'
import { useAuth } from '../context/AuthContext'
import * as marketplaceApi from '../api/marketplaceApi'
import * as communicationApi from '../api/communicationApi'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [contacting, setContacting] = useState(false)

  useEffect(() => {
    marketplaceApi.getListing(id).then(setListing).catch(() => setNotFound(true))
  }, [id])

  useEffect(() => {
    if (user?.email) setIsFavorite(marketplaceApi.getFavoriteIds(user.email).has(id))
  }, [user, id])

  async function toggleFavorite() {
    if (isFavorite) await marketplaceApi.removeFavorite(user.email, id)
    else await marketplaceApi.addFavorite(user.email, id)
    setIsFavorite(!isFavorite)
  }

  async function handleContact() {
    setContacting(true)
    const thread = await communicationApi.createThread({
      userEmail: user.email,
      userName: user.fullName,
      supplierEmail: listing.sellerId,
      supplierName: listing.sellerName,
      listingId: listing.id,
      listingTitle: listing.title,
    })
    setContacting(false)
    navigate(`/messages/${thread.id}`)
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container-md" style={{ paddingTop: 40 }}>
          <p style={{ fontSize: 14, color: 'var(--slate)' }}>That listing doesn't exist or was removed.</p>
          <Link to="/marketplace" className="btn-ghost" style={{ marginTop: 12, display: 'inline-block' }}>Back to marketplace</Link>
        </div>
      </div>
    )
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

  const isOwner = user?.email && listing.sellerId === user.email

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <Link to="/marketplace" className="btn-ghost" style={{ marginBottom: 24, display: 'inline-block' }}>← Back to marketplace</Link>

        <div className="ledger-card" style={{ padding: 30 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="doc-number">{listing.id.toUpperCase()}</span>
            <button onClick={toggleFavorite} className={`favorite-btn ${isFavorite ? 'active' : ''}`}>
              {isFavorite ? '★ Saved' : '☆ Save'}
            </button>
          </div>

          <span className="category-pill">{listing.category}</span>

          <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 12px' }}>{listing.title}</h1>
          <p style={{ fontSize: 14.5, color: 'var(--slate)', marginBottom: 24, lineHeight: 1.6 }}>{listing.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <p className="field-label">Price</p>
              <p className="font-mono" style={{ fontSize: 18 }}>${listing.price.toLocaleString()} / {listing.unit}</p>
            </div>
            <div>
              <p className="field-label">Minimum order</p>
              <p className="font-mono" style={{ fontSize: 18 }}>{listing.minOrderQty.toLocaleString()} {listing.unit}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(18,33,63,0.1)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="field-label">Supplier</p>
              <Link to={`/marketplace/supplier/${listing.sellerId}`} style={{ fontSize: 15, textDecoration: 'none', color: 'var(--ink)' }}>
                {listing.sellerName}
              </Link>
              <p style={{ fontSize: 12.5, color: 'var(--slate)', marginTop: 2 }}>{listing.location}</p>
            </div>
            <Stamp label="VERIFIED" active size={64} />
          </div>

          {isOwner ? (
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => navigate(`/marketplace/edit/${listing.id}`)}>
              Edit this listing
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '11px 22px', flex: 1 }} onClick={handleContact} disabled={contacting}>
                {contacting ? 'Opening…' : 'Contact supplier'}
              </button>
              <Link
                to={`/marketplace/listing/${listing.id}/quote`}
                className="btn-primary"
                style={{ width: 'auto', padding: '11px 22px', flex: 1, background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--ink)', textAlign: 'center', textDecoration: 'none' }}
              >
                Request a quote
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}