import { PRIORITY_WEIGHT } from '../constants'
import type { Shipment } from '../types'

/** Orden operativo: primero mayor prioridad, luego la entrega más próxima. Devuelve una copia. */
export function sortShipments(shipments: readonly Shipment[]): Shipment[] {
  return shipments.toSorted(
    (a, b) =>
      PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority] ||
      a.estimatedDelivery.localeCompare(b.estimatedDelivery),
  )
}
