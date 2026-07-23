/**
 * Mock backend for TSE (logistics/tracking). Same pattern as the others —
 * localStorage stands in for the DB. Delete once wired to a real
 * carrier/logistics API.
 */

const SHIPMENTS_KEY = 'tsx_mock_shipments_db'
const NETWORK_DELAY_MS = 400

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readShipments() {
  const raw = localStorage.getItem(SHIPMENTS_KEY)
  return raw ? JSON.parse(raw) : []
}
function writeShipments(shipments) {
  localStorage.setItem(SHIPMENTS_KEY, JSON.stringify(shipments))
}

export const CHECKPOINT_STAGES = [
  'Order packed',
  'Picked up by carrier',
  'In transit',
  'Arrived at destination hub',
  'Out for delivery',
  'Delivered',
]

export const tseBackend = { delay, readShipments, writeShipments }