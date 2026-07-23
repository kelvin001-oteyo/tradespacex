import { marketplaceBackend, CATEGORIES } from './marketplaceClient'

const { delay, readListings, writeListings, readFavorites, writeFavorites } = marketplaceBackend

/** GET /api/v1/marketplace/categories/ */
export async function getCategories() {
  await delay(200)
  return CATEGORIES
}

/** GET /api/v1/marketplace/listings/ */
export async function getListings(params = {}) {
  await delay()
  const { category, keyword, minPrice, maxPrice, location, page = 1, pageSize = 8 } = params
  let results = readListings()

  if (category) results = results.filter((l) => l.category === category)
  if (keyword) {
    const k = keyword.toLowerCase()
    results = results.filter((l) => l.title.toLowerCase().includes(k) || l.description.toLowerCase().includes(k))
  }
  if (minPrice) results = results.filter((l) => l.price >= Number(minPrice))
  if (maxPrice) results = results.filter((l) => l.price <= Number(maxPrice))
  if (location) results = results.filter((l) => l.location.toLowerCase().includes(location.toLowerCase()))

  results = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total = results.length
  const start = (page - 1) * pageSize
  const paged = results.slice(start, start + pageSize)

  return { results: paged, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

/** GET /api/v1/marketplace/listings/:id/ */
export async function getListing(id) {
  await delay(300)
  const listing = readListings().find((l) => l.id === id)
  if (!listing) throw new Error('Listing not found')
  return listing
}

/** GET /api/v1/marketplace/listings/mine/ */
export async function getMyListings(sellerId) {
  await delay(300)
  return readListings()
    .filter((l) => l.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/** POST /api/v1/marketplace/listings/ */
export async function createListing(payload) {
  await delay()
  const listings = readListings()
  const listing = { id: `lst-${Date.now()}`, createdAt: new Date().toISOString(), ...payload }
  listings.push(listing)
  writeListings(listings)
  return listing
}

/** PUT /api/v1/marketplace/listings/:id/ */
export async function updateListing(id, updates) {
  await delay()
  const listings = readListings()
  const idx = listings.findIndex((l) => l.id === id)
  if (idx === -1) throw new Error('Listing not found')
  listings[idx] = { ...listings[idx], ...updates }
  writeListings(listings)
  return listings[idx]
}

/** DELETE /api/v1/marketplace/listings/:id/ */
export async function deleteListing(id) {
  await delay(300)
  writeListings(readListings().filter((l) => l.id !== id))
  return { detail: 'Listing removed.' }
}

/** GET /api/v1/marketplace/suppliers/:id/ */
export async function getSupplier(sellerId) {
  await delay(300)
  const listings = readListings().filter((l) => l.sellerId === sellerId)
  if (listings.length === 0) throw new Error('Supplier not found')
  return {
    id: sellerId,
    name: listings[0].sellerName,
    location: listings[0].location,
    listingCount: listings.length,
    rating: 4.6,
    reviewCount: 23,
    verified: true,
    listings,
  }
}

/** POST /api/v1/marketplace/favorites/:listingId/ */
export async function addFavorite(userEmail, listingId) {
  await delay(200)
  const favs = readFavorites()
  const set = new Set(favs[userEmail] || [])
  set.add(listingId)
  favs[userEmail] = [...set]
  writeFavorites(favs)
  return { detail: 'Saved.' }
}

/** DELETE /api/v1/marketplace/favorites/:listingId/ */
export async function removeFavorite(userEmail, listingId) {
  await delay(200)
  const favs = readFavorites()
  favs[userEmail] = (favs[userEmail] || []).filter((id) => id !== listingId)
  writeFavorites(favs)
  return { detail: 'Removed.' }
}

/** GET /api/v1/marketplace/favorites/ */
export async function getFavorites(userEmail) {
  await delay(300)
  const favs = readFavorites()
  const ids = new Set(favs[userEmail] || [])
  return readListings().filter((l) => ids.has(l.id))
}

export function getFavoriteIds(userEmail) {
  const favs = readFavorites()
  return new Set(favs[userEmail] || [])
}