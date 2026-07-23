import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ListingCard from '../components/ListingCard'
import { useAuth } from '../context/AuthContext'
import * as marketplaceApi from '../api/marketplaceApi'

export default function Marketplace() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [keyword, setKeyword] = useState('')
  const [data, setData] = useState({ results: [], total: 0, page: 1, totalPages: 1 })
  const [favIds, setFavIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    marketplaceApi.getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    marketplaceApi.getListings({ category, keyword, page }).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [category, keyword, page])

  useEffect(() => {
    if (user?.email) setFavIds(marketplaceApi.getFavoriteIds(user.email))
  }, [user])

  async function toggleFavorite(listingId) {
    if (favIds.has(listingId)) await marketplaceApi.removeFavorite(user.email, listingId)
    else await marketplaceApi.addFavorite(user.email, listingId)
    setFavIds(marketplaceApi.getFavoriteIds(user.email))
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <p className="doc-number" style={{ marginBottom: 4 }}>MANIFEST — OPEN LISTINGS</p>
        <h1 className="font-display" style={{ fontSize: 28, margin: '0 0 24px' }}>Marketplace</h1>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            className="field-input"
            style={{ maxWidth: 260 }}
            placeholder="Search listings…"
            value={keyword}
            onChange={(e) => { setPage(1); setKeyword(e.target.value) }}
          />
          <select
            className="field-input"
            style={{ maxWidth: 220 }}
            value={category}
            onChange={(e) => { setPage(1); setCategory(e.target.value) }}
          >
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        ) : data.results.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--slate)' }}>No listings match your search.</p>
        ) : (
          <>
            <div className="listing-grid">
              {data.results.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isFavorite={favIds.has(listing.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {data.totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 32 }}>
                <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                <span className="font-mono" style={{ fontSize: 12, color: 'var(--slate)' }}>
                  Page {data.page} of {data.totalPages}
                </span>
                <button className="btn-ghost" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}