import { reviewsBackend } from './reviewsClient'

const { delay, readReviews, writeReviews } = reviewsBackend

/**
 * POST /api/v1/reviews/
 * In production, the backend would verify the order belongs to this buyer
 * and is 'delivered' before accepting the review, and reject a second
 * review for the same order.
 */
export async function submitReview({ orderId, sellerId, sellerName, buyerEmail, buyerName, rating, comment }) {
  await delay()
  const reviews = readReviews()
  if (reviews.find((r) => r.orderId === orderId)) {
    throw new Error('You already reviewed this order.')
  }
  const review = {
    id: `rev-${Date.now()}`,
    orderId,
    sellerId,
    sellerName,
    buyerEmail,
    buyerName,
    rating: Number(rating),
    comment: comment || '',
    createdAt: new Date().toISOString(),
  }
  reviews.push(review)
  writeReviews(reviews)
  return review
}

/**
 * GET /api/v1/reviews/supplier/:sellerId/
 */
export async function getSupplierReviews(sellerId) {
  await delay(300)
  const reviews = readReviews()
    .filter((r) => r.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const average = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : null
  return { reviews, average, count: reviews.length }
}

/**
 * GET /api/v1/reviews/mine/
 */
export async function getMyReviews(buyerEmail) {
  await delay(300)
  return readReviews().filter((r) => r.buyerEmail === buyerEmail)
}

export function hasReviewed(orderId) {
  return readReviews().some((r) => r.orderId === orderId)
}