import { tseBackend, CHECKPOINT_STAGES } from './tseClient'

const { delay, readShipments, writeShipments } = tseBackend

/**
 * POST /api/v1/tse/shipments/
 */
export async function createShipment({ orderId, carrier, trackingNumber, origin, destination }) {
  await delay()
  const shipments = readShipments()
  const shipment = {
    id: `shp-${Date.now()}`,
    orderId,
    carrier,
    trackingNumber,
    origin,
    destination,
    checkpoints: [{ stage: CHECKPOINT_STAGES[0], at: new Date().toISOString(), note: '' }],
    createdAt: new Date().toISOString(),
  }
  shipments.push(shipment)
  writeShipments(shipments)
  return shipment
}

/**
 * GET /api/v1/tse/shipments/:orderId/
 */
export async function getShipmentByOrder(orderId) {
  await delay(300)
  const shipment = readShipments().find((s) => s.orderId === orderId)
  return shipment || null
}

/**
 * PUT /api/v1/tse/shipments/:id/checkpoint/
 */
export async function addCheckpoint(shipmentId, { stage, note }) {
  await delay()
  const shipments = readShipments()
  const idx = shipments.findIndex((s) => s.id === shipmentId)
  if (idx === -1) throw new Error('Shipment not found')
  shipments[idx].checkpoints.push({ stage, at: new Date().toISOString(), note: note || '' })
  writeShipments(shipments)
  return shipments[idx]
}

/**
 * GET /api/v1/tse/shipments/
 */
export async function getMyShipments(userEmail, orders) {
  await delay()
  const myOrderIds = new Set(
    orders.filter((o) => o.buyerEmail === userEmail || o.sellerEmail === userEmail).map((o) => o.id)
  )
  return readShipments().filter((s) => myOrderIds.has(s.orderId))
}

export { CHECKPOINT_STAGES }