import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ListingCard from '../components/ListingCard'
import { useAuth } from '../context/AuthContext'
import * as marketplaceApi from '../api/marketplaceApi'

export default function Favorites() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const favs = await marketplaceApi.getFavorites(user.email)
    setListings(favs)
    setLoading(false)
  }

  useEffect(() => {
    if (user?.email) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleToggle(listingId) {
    await marketplaceApi.removeFavorite(user.email, listingId)
    load()
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <p className="doc-number" style={{ marginBottom: 4 }}>SAVED FOR REVIEW</p>
        <h1 className="font-display" style={{ fontSize: 28, margin: '0 0 24px' }}>Saved listings</h1>

        {loading ? (
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        ) : listings.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--slate)' }}>You haven't saved any listings yet.</p>
        ) : (
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} isFavorite onToggleFavorite={handleToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}