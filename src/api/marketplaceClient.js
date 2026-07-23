/**
 * Mock backend for Marketplace. Same pattern as api/client.js — localStorage
 * stands in for the DB. Delete this file (and its seed data) once the real
 * backend is wired up; marketplaceApi.js is the only file pages talk to.
 */

const LISTINGS_KEY = 'tsx_mock_listings_db'
const FAVORITES_KEY = 'tsx_mock_favorites_db'
const NETWORK_DELAY_MS = 450

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const CATEGORIES = [
  'Agriculture & Food',
  'Textiles & Apparel',
  'Electronics',
  'Machinery & Industrial',
  'Construction Materials',
  'Packaging & Paper',
]

const SEED_LISTINGS = [
  {
    id: 'lst-1001',
    title: 'Grade A Arabica Coffee Beans, Green',
    category: 'Agriculture & Food',
    price: 4.2,
    unit: 'kg',
    minOrderQty: 500,
    location: 'Nyeri, Kenya',
    sellerId: 'seller-001',
    sellerName: 'Highland Coffee Cooperative',
    description: 'Washed Arabica beans grown at 1,700m altitude. Consistent moisture content, sorted and graded before export. Available for FOB or CIF shipping terms.',
    createdAt: '2026-06-02T09:00:00.000Z',
  },
  {
    id: 'lst-1002',
    title: '100% Cotton Woven Fabric, 220gsm',
    category: 'Textiles & Apparel',
    price: 2.85,
    unit: 'meter',
    minOrderQty: 2000,
    location: 'Nairobi, Kenya',
    sellerId: 'seller-002',
    sellerName: 'Rift Valley Textiles Ltd',
    description: 'Plain-weave cotton fabric suitable for garment manufacturing. Custom widths and dyeing available on request for bulk orders.',
    createdAt: '2026-06-10T09:00:00.000Z',
  },
  {
    id: 'lst-1003',
    title: 'Solar-Powered LED Street Lights, 60W',
    category: 'Electronics',
    price: 68,
    unit: 'unit',
    minOrderQty: 50,
    location: 'Mombasa, Kenya',
    sellerId: 'seller-003',
    sellerName: 'Sunbeam Energy Solutions',
    description: 'All-in-one solar street lights with integrated lithium battery and motion sensor. 2-year warranty, CE certified.',
    createdAt: '2026-06-14T09:00:00.000Z',
  },
  {
    id: 'lst-1004',
    title: 'Industrial Rice Milling Machine',
    category: 'Machinery & Industrial',
    price: 4200,
    unit: 'unit',
    minOrderQty: 1,
    location: 'Kisumu, Kenya',
    sellerId: 'seller-004',
    sellerName: 'Lakeside Agro Machinery',
    description: 'Complete rice milling line, 1-2 tons/hour capacity. Includes destoner, husker, and polisher. Installation support available.',
    createdAt: '2026-06-18T09:00:00.000Z',
  },
  {
    id: 'lst-1005',
    title: 'Portland Cement, 42.5N Grade',
    category: 'Construction Materials',
    price: 6.5,
    unit: '50kg bag',
    minOrderQty: 1000,
    location: 'Athi River, Kenya',
    sellerId: 'seller-005',
    sellerName: 'Savannah Cement Distributors',
    description: 'Bulk cement supply for construction contractors. Consistent quality, tested to KEBS standards, bulk delivery arranged.',
    createdAt: '2026-06-20T09:00:00.000Z',
  },
  {
    id: 'lst-1006',
    title: 'Corrugated Export Cartons, Custom Sizes',
    category: 'Packaging & Paper',
    price: 0.95,
    unit: 'piece',
    minOrderQty: 5000,
    location: 'Nairobi, Kenya',
    sellerId: 'seller-006',
    sellerName: 'Equator Packaging Co.',
    description: 'Heavy-duty triple-wall cartons for export packaging. Custom branding and sizing available for large orders.',
    createdAt: '2026-06-22T09:00:00.000Z',
  },
  {
    id: 'lst-1007',
    title: 'Dried Macadamia Nuts, Shelled',
    category: 'Agriculture & Food',
    price: 9.4,
    unit: 'kg',
    minOrderQty: 200,
    location: "Murang'a, Kenya",
    sellerId: 'seller-001',
    sellerName: 'Highland Coffee Cooperative',
    description: 'Premium shelled macadamia, sorted by size, vacuum packed. Suitable for food processing and confectionery export.',
    createdAt: '2026-06-25T09:00:00.000Z',
  },
  {
    id: 'lst-1008',
    title: 'PPE Cotton-Blend Work Uniforms',
    category: 'Textiles & Apparel',
    price: 11.2,
    unit: 'piece',
    minOrderQty: 300,
    location: 'Thika, Kenya',
    sellerId: 'seller-002',
    sellerName: 'Rift Valley Textiles Ltd',
    description: 'Durable work uniforms for industrial and agricultural use. Custom logo embroidery available for bulk contracts.',
    createdAt: '2026-06-28T09:00:00.000Z',
  },
]

function readListings() {
  const raw = localStorage.getItem(LISTINGS_KEY)
  if (raw) return JSON.parse(raw)
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(SEED_LISTINGS))
  return SEED_LISTINGS
}

function writeListings(listings) {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))
}

function readFavorites() {
  const raw = localStorage.getItem(FAVORITES_KEY)
  return raw ? JSON.parse(raw) : {}
}

function writeFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
}

export const marketplaceBackend = { delay, readListings, writeListings, readFavorites, writeFavorites }