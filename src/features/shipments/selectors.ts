import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { selectDriverEntities } from '@/features/drivers/selectors'
import { selectFilters } from '@/features/filters/selectors'
import { applyFilters } from '@/features/filters/utils/applyFilters'
import { selectVehicleEntities } from '@/features/vehicles/selectors'
import { toDateKey, type DateKey } from '@/lib/date'
import { areArraysShallowEqual, areSetsEqual } from '@/lib/equality'
import { shipmentsAdapter } from './shipmentsSlice'
import type { ShipmentDetails, ShipmentStats } from './types'
import { getShipmentMetrics } from './utils/shipmentMetrics'
import { sortShipments } from './utils/sortShipments'

const shipmentSelectors = shipmentsAdapter.getSelectors((state: RootState) => state.shipments)
const selectAllShipments = shipmentSelectors.selectAll

export const selectSelectedShipmentId = (state: RootState) => state.shipments.selectedId

/** Devuelve un booleano: cada item del listado solo se re-renderiza si cambia *su* selección. */
export const selectIsShipmentSelected = (state: RootState, shipmentId: string) =>
  state.shipments.selectedId === shipmentId

export const selectLocateRequest = (state: RootState) => state.shipments.locateRequest

/**
 * Envíos que pasan los filtros, en orden operativo (prioridad y ETA).
 * `resultEqualityCheck`: si el resultado no cambió (ej. una tecla más que matchea lo mismo),
 * devuelve la referencia anterior y ni el listado ni el mapa se re-renderizan.
 */
export const selectVisibleShipments = createSelector(
  [selectAllShipments, selectFilters],
  (shipments, filters) => sortShipments(applyFilters(shipments, filters)),
  { memoizeOptions: { resultEqualityCheck: areArraysShallowEqual } },
)

/** Resumen de lo visible: responde de un vistazo "¿qué está pendiente?" y "¿qué es urgente?". */
export const selectVisibleStats = createSelector(
  [selectVisibleShipments],
  (shipments): ShipmentStats => ({
    total: shipments.length,
    pending: shipments.filter((shipment) => shipment.status === 'pending').length,
    highPriority: shipments.filter((shipment) => shipment.priority === 'high').length,
  }),
)

/** Envío con sus relaciones resueltas y métricas calculadas, listo para la vista de detalle. */
export const selectShipmentDetails = createSelector(
  [shipmentSelectors.selectById, selectDriverEntities, selectVehicleEntities],
  (shipment, drivers, vehicles): ShipmentDetails | undefined => {
    if (!shipment) return undefined
    return {
      shipment,
      driver: shipment.driverId ? drivers[shipment.driverId] : undefined,
      vehicle: shipment.vehicleId ? vehicles[shipment.vehicleId] : undefined,
      metrics: getShipmentMetrics(shipment.packages),
    }
  },
)

/**
 * Direcciones de destino únicas y ordenadas, para el buscador del submenú "Dirección".
 * Las acciones sobre envíos no cambian direcciones: la igualdad de resultado evita re-renders.
 */
export const selectDestinationAddresses = createSelector(
  [selectAllShipments],
  (shipments) =>
    [...new Set(shipments.map((shipment) => shipment.destination.address))].toSorted((a, b) =>
      a.localeCompare(b),
    ),
  { memoizeOptions: { resultEqualityCheck: areArraysShallowEqual } },
)

/** Días con entregas estimadas, para marcarlos en el date picker. */
export const selectDeliveryDateKeys = createSelector(
  [selectAllShipments],
  (shipments): ReadonlySet<DateKey> =>
    new Set(shipments.map((shipment) => toDateKey(shipment.estimatedDelivery))),
  { memoizeOptions: { resultEqualityCheck: areSetsEqual } },
)
