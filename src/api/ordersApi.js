import { ordersBackend, ORDER_STATUSES } from './ordersClient'

const { delay, readOrders, writeOrders } = ordersBackend

/**
 * POST /api/v1/orders/
 * Usually created from an accepted quote, but can also be created directly
 * against a listing at its list price.
 */
export async function createOrder({ buyerEmail, buyerName, sellerEmail, sellerName, listingId, listingTitle, quantity, unit, price }) {
  await delay()
  const orders = readOrders()
  const order = {
    id: `ord-${Date.now()}`,
    buyerEmail,
    buyerName,
    sellerEmail,
    sellerName,
    listingId,
    listingTitle,
    quantity: Number(quantity),
    unit,
    price: Number(price),
    total: Number(quantity) * Number(price),
    status: 'pending',
    timeline: [{ status: 'pending', at: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  }
  orders.push(order)
  writeOrders(orders)
  return order
}

/**
 * GET /api/v1/orders/
 * Returns orders where the user is either buyer or seller.
 */
export async function getOrders(userEmail) {
  await delay()
  return readOrders()
    .filter((o) => o.buyerEmail === userEmail || o.sellerEmail === userEmail)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * GET /api/v1/orders/:id/
 */
export async function getOrder(id) {
  await delay(300)
  const order = readOrders().find((o) => o.id === id)
  if (!order) throw new Error('Order not found')
  return order
}

/**
 * PUT /api/v1/orders/:id/status/
 * Seller advances the order through the pipeline.
 */
export async function updateOrderStatus(id, status) {
  await delay()
  if (!ORDER_STATUSES.includes(status)) throw new Error('Invalid status')
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) throw new Error('Order not found')
  orders[idx].status = status
  orders[idx].timeline.push({ status, at: new Date().toISOString() })
  writeOrders(orders)
  return orders[idx]
}

/**
 * POST /api/v1/orders/:id/cancel/
 * Buyer-initiated cancellation, only allowed before shipping.
 */
export async function cancelOrder(id) {
  return updateOrderStatus(id, 'cancelled')
}

export const NEXT_STATUS = {
  pending: 'confirmed',
  confirmed: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
}