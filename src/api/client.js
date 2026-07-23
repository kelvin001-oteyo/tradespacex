/**
 * Mock API client for TradespaceX — Accounts.
 *
 * Simulates the real Django/DRF backend so the frontend can be built and
 * demoed before the backend is live. Every function in authApi.js mirrors
 * one real endpoint (path noted in its comment). When the backend is ready,
 * swap the body of each function in authApi.js for a real fetch() call to
 * that same path — the pages don't need to change, since they only talk
 * to authApi.js.
 */

const DB_KEY = 'tsx_mock_users_db'
const SESSION_KEY = 'tsx_mock_session'
const NETWORK_DELAY_MS = 550

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readDb() {
  const raw = localStorage.getItem(DB_KEY)
  return raw ? JSON.parse(raw) : { users: [] }
}

function writeDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

function makeToken(prefix, email) {
  const rand = Math.random().toString(36).slice(2, 10)
  return `${prefix}.${btoa(email)}.${rand}`
}

// Mimics DRF-style validation error shape: { field: ["message"] }
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.detail || 'Request failed')
    this.status = status
    this.body = body
  }
}

export const mockBackend = { delay, readDb, writeDb, makeToken, SESSION_KEY }