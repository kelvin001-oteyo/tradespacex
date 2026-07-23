/**
 * Mock backend for Communication (threads/messages + quotation requests).
 * Same pattern as marketplaceClient.js — localStorage stands in for the DB.
 * Delete this file once the real backend is wired up.
 */

const THREADS_KEY = 'tsx_mock_threads_db'
const QUOTES_KEY = 'tsx_mock_quotes_db'
const NETWORK_DELAY_MS = 400

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readThreads() {
  const raw = localStorage.getItem(THREADS_KEY)
  return raw ? JSON.parse(raw) : []
}
function writeThreads(threads) {
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads))
}
function readQuotes() {
  const raw = localStorage.getItem(QUOTES_KEY)
  return raw ? JSON.parse(raw) : []
}
function writeQuotes(quotes) {
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes))
}

export const communicationBackend = { delay, readThreads, writeThreads, readQuotes, writeQuotes }