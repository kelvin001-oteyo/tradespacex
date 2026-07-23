import { communicationBackend } from './communicationClient'

const { delay, readThreads, writeThreads, readQuotes, writeQuotes } = communicationBackend

/**
 * GET /api/v1/communication/threads/
 * Returns threads the current user (by email) is part of, newest first,
 * with a computed unread count and last message preview.
 */
export async function getThreads(userEmail) {
  await delay()
  return readThreads()
    .filter((t) => t.participants.includes(userEmail))
    .map((t) => ({
      ...t,
      lastMessage: t.messages[t.messages.length - 1] || null,
      unreadCount: t.messages.filter((m) => m.sender !== userEmail && !m.read).length,
    }))
    .sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.sentAt) : new Date(a.createdAt)
      const bTime = b.lastMessage ? new Date(b.lastMessage.sentAt) : new Date(b.createdAt)
      return bTime - aTime
    })
}

/**
 * POST /api/v1/communication/threads/
 * Starts a thread with a supplier, optionally linked to a listing. If a
 * thread already exists between these two people about this listing, reuse it.
 */
export async function createThread({ userEmail, userName, supplierEmail, supplierName, listingId, listingTitle }) {
  await delay()
  const threads = readThreads()
  const existing = threads.find(
    (t) => t.participants.includes(userEmail) && t.participants.includes(supplierEmail) && t.listingId === listingId
  )
  if (existing) return existing

  const thread = {
    id: `thr-${Date.now()}`,
    participants: [userEmail, supplierEmail],
    participantNames: { [userEmail]: userName, [supplierEmail]: supplierName },
    listingId: listingId || null,
    listingTitle: listingTitle || null,
    messages: [],
    createdAt: new Date().toISOString(),
  }
  threads.push(thread)
  writeThreads(threads)
  return thread
}

/**
 * GET /api/v1/communication/threads/:id/
 */
export async function getThread(id) {
  await delay(250)
  const thread = readThreads().find((t) => t.id === id)
  if (!thread) throw new Error('Thread not found')
  return thread
}

/**
 * POST /api/v1/communication/threads/:id/messages/
 */
export async function sendMessage(threadId, { sender, body }) {
  await delay(250)
  const threads = readThreads()
  const idx = threads.findIndex((t) => t.id === threadId)
  if (idx === -1) throw new Error('Thread not found')
  const message = { id: `msg-${Date.now()}`, sender, body, sentAt: new Date().toISOString(), read: false }
  threads[idx].messages.push(message)
  writeThreads(threads)
  return message
}

/**
 * PUT /api/v1/communication/threads/:id/read/
 */
export async function markThreadRead(threadId, userEmail) {
  await delay(150)
  const threads = readThreads()
  const idx = threads.findIndex((t) => t.id === threadId)
  if (idx === -1) return
  threads[idx].messages = threads[idx].messages.map((m) =>
    m.sender !== userEmail ? { ...m, read: true } : m
  )
  writeThreads(threads)
}

/**
 * POST /api/v1/communication/quotes/
 */
export async function requestQuote({ buyerEmail, buyerName, sellerEmail, sellerName, listingId, listingTitle, quantity, targetPrice, notes }) {
  await delay()
  const quotes = readQuotes()
  const quote = {
    id: `qte-${Date.now()}`,
    buyerEmail,
    buyerName,
    sellerEmail,
    sellerName,
    listingId,
    listingTitle,
    quantity: Number(quantity),
    targetPrice: targetPrice ? Number(targetPrice) : null,
    notes: notes || '',
    status: 'pending', // pending | responded | declined
    response: null,
    createdAt: new Date().toISOString(),
  }
  quotes.push(quote)
  writeQuotes(quotes)
  return quote
}

/**
 * GET /api/v1/communication/quotes/
 * Returns quotes where the user is either buyer or seller.
 */
export async function getQuotes(userEmail) {
  await delay()
  return readQuotes()
    .filter((q) => q.buyerEmail === userEmail || q.sellerEmail === userEmail)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * PUT /api/v1/communication/quotes/:id/respond/
 */
export async function respondToQuote(quoteId, { price, terms, decline }) {
  await delay()
  const quotes = readQuotes()
  const idx = quotes.findIndex((q) => q.id === quoteId)
  if (idx === -1) throw new Error('Quote not found')
  quotes[idx].status = decline ? 'declined' : 'responded'
  quotes[idx].response = decline ? null : { price: Number(price), terms: terms || '', respondedAt: new Date().toISOString() }
  writeQuotes(quotes)
  return quotes[idx]
}