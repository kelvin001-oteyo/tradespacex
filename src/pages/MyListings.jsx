import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ListingCard from '../components/ListingCard'
import { useAuth } from '../context/AuthContext'
import * as marketplaceApi from '../api/marketplaceApi'

export default function MyListings() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const mine = await marketplaceApi.getMyListings(user.email)
    setListings(mine)
    setLoading(false)
  }

  useEffect(() => {
    if (user?.email) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleDelete(id) {
    if (!confirm('Remove this listing?')) return
    await marketplaceApi.deleteListing(id)
    load()
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p className="doc-number" style={{ marginBottom: 4 }}>SELLER PANEL</p>
            <h1 className="font-display" style={{ fontSize: 28, margin: 0 }}>My listings</h1>
          </div>
          <Link to="/marketplace/new" className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>
            + New listing
          </Link>
        </div>

        {loading ? (
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        ) : listings.length === 0 ? (
          <div className="ledger-card" style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 16 }}>You haven't listed anything yet.</p>
            <Link to="/marketplace/new" className="btn-ghost">Create your first listing</Link>
          </div>
        ) : (
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                actions={
                  <>
                    <Link to={`/marketplace/edit/${listing.id}`} className="btn-ghost" style={{ fontSize: 12.5 }}>Edit</Link>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: 'var(--rust)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 4 }}
                    >
                      Delete
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}