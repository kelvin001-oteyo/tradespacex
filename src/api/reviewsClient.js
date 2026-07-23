/**
 * Mock backend for TradeSpace Verified (reviews/ratings). Same pattern as
 * the others — localStorage stands in for the DB. Delete once wired to the
 * real backend.
 */

const REVIEWS_KEY = 'tsx_mock_reviews_db'
const NETWORK_DELAY_MS = 400

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readReviews() {
  const raw = localStorage.getItem(REVIEWS_KEY)
  return raw ? JSON.parse(raw) : []
}
function writeReviews(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

export const reviewsBackend = { delay, readReviews, writeReviews }