import { paymentsBackend } from './paymentsClient'

const { delay, readMethods, writeMethods, readTransactions, writeTransactions } = paymentsBackend

/**
 * POST /api/v1/payments/methods/
 * In production this would tokenize via the real gateway's SDK — never
 * store raw card numbers. Here we just keep a masked display value.
 */
export async function addPaymentMethod(userEmail, { type, label, last4 }) {
  await delay(400)
  const methods = readMethods()
  const method = {
    id: `pm-${Date.now()}`,
    userEmail,
    type, // 'card' | 'bank' | 'mobile_money'
    label,
    last4,
    addedAt: new Date().toISOString(),
  }
  methods.push(method)
  writeMethods(methods)
  return method
}

/**
 * GET /api/v1/payments/methods/
 */
export async function getPaymentMethods(userEmail) {
  await delay(250)
  return readMethods().filter((m) => m.userEmail === userEmail)
}

/**
 * DELETE /api/v1/payments/methods/:id/ (not in original sketch, added for completeness)
 */
export async function removePaymentMethod(id) {
  await delay(200)
  writeMethods(readMethods().filter((m) => m.id !== id))
  return { detail: 'Removed.' }
}

/**
 * POST /api/v1/payments/checkout/
 * Simulates charging the method and generates a receipt/transaction record.
 */
export async function checkout({ userEmail, methodId, order }) {
  await delay(900) // longer delay to simulate a real payment round-trip
  const methods = readMethods()
  const method = methods.find((m) => m.id === methodId)

  const txns = readTransactions()
  const transaction = {
    id: `txn-${Date.now()}`,
    userEmail,
    orderId: order.id,
    listingTitle: order.listingTitle,
    counterparty: order.sellerName,
    amount: order.total,
    methodLabel: method ? `${method.label} •••• ${method.last4}` : 'Unknown method',
    status: 'succeeded',
    createdAt: new Date().toISOString(),
  }
  txns.push(transaction)
  writeTransactions(txns)
  return transaction
}

/**
 * GET /api/v1/payments/transactions/
 */
export async function getTransactions(userEmail) {
  await delay(300)
  return readTransactions()
    .filter((t) => t.userEmail === userEmail)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * GET /api/v1/payments/transactions/:id/
 */
export async function getTransaction(id) {
  await delay(250)
  const txn = readTransactions().find((t) => t.id === id)
  if (!txn) throw new Error('Transaction not found')
  return txn
}