import type { Shipment } from '@/features/shipments/types'
import { toDateKey } from '@/lib/date'
import { createTextMatcher } from '@/lib/text'
import type { ShipmentFilters } from '../types'

/** Un filtro de selección múltiple vacío no restringe resultados. */
function matchesSelection<T>(selected: readonly T[], value: T | undefined): boolean {
  if (selected.length === 0) return true
  return value !== undefined && selected.includes(value)
}

export function applyFilters(shipments: readonly Shipment[], filters: ShipmentFilters): Shipment[] {
  const { statuses, priorities, driverIds, deliveryDate } = filters
  // Las búsquedas se normalizan una vez por filtrado, no una vez por envío.
  const matchesSearch = createTextMatcher(filters.search)
  const matchesAddress = createTextMatcher(filters.address)

  return shipments.filter(
    (shipment) =>
      matchesSearch([shipment.id, shipment.customer]) &&
      matchesAddress([shipment.destination.address]) &&
      matchesSelection(statuses, shipment.status) &&
      matchesSelection(priorities, shipment.priority) &&
      matchesSelection(driverIds, shipment.driverId) &&
      (deliveryDate === null || toDateKey(shipment.estimatedDelivery) === deliveryDate),
  )
}

/** Cantidad de filtros activos, para mostrar en "Limpiar filtros (n)". */
export function countActiveFilters(filters: ShipmentFilters): number {
  const { search, statuses, priorities, driverIds, address, deliveryDate } = filters
  return [
    search.trim() !== '',
    statuses.length > 0,
    priorities.length > 0,
    driverIds.length > 0,
    address.trim() !== '',
    deliveryDate !== null,
  ].filter(Boolean).length
}
