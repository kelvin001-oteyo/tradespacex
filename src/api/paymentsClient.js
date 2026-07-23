/**
 * Mock backend for Payments. Same pattern as the others — localStorage
 * stands in for the DB. No real card processing happens here; this only
 * simulates the flow so the frontend is ready to wire to a real gateway
 * (Stripe, Flutterwave, M-Pesa, etc.) later.
 */

const METHODS_KEY = 'tsx_mock_payment_methods_db'
const TRANSACTIONS_KEY = 'tsx_mock_transactions_db'
const NETWORK_DELAY_MS = 500

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readMethods() {
  const raw = localStorage.getItem(METHODS_KEY)
  return raw ? JSON.parse(raw) : []
}
function writeMethods(methods) {
  localStorage.setItem(METHODS_KEY, JSON.stringify(methods))
}
function readTransactions() {
  const raw = localStorage.getItem(TRANSACTIONS_KEY)
  return raw ? JSON.parse(raw) : []
}
function writeTransactions(txns) {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns))
}

export const paymentsBackend = { delay, readMethods, writeMethods, readTransactions, writeTransactions }