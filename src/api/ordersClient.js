/**
 * Mock backend for Order Management. Same pattern as the others —
 * localStorage stands in for the DB. Delete once wired to the real backend.
 */

const ORDERS_KEY = 'tsx_mock_orders_db'
const NETWORK_DELAY_MS = 400

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readOrders() {
  const raw = localStorage.getItem(ORDERS_KEY)
  return raw ? JSON.parse(raw) : []
}
function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export const ordersBackend = { delay, readOrders, writeOrders }