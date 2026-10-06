import { createSelector } from '@reduxjs/toolkit'
import { selectSelectedShipmentId, selectVisibleShipments } from '@/features/shipments/selectors'
import { areBoundsEqual, getShipmentsBounds } from './utils/mapView'

/** Encuadre de los envíos visibles. Igualdad por valor: si no cambian las esquinas, no re-encuadra. */
export const selectVisibleBounds = createSelector([selectVisibleShipments], getShipmentsBounds, {
  memoizeOptions: { resultEqualityCheck: areBoundsEqual },
})

/**
 * Destino del envío seleccionado, si está entre los visibles. Immer conserva la referencia de
 * `destination` cuando cambia otra cosa del envío (ej. su estado), así el mapa no se mueve.
 */
export const selectFocusedDestination = createSelector(
  [selectVisibleShipments, selectSelectedShipmentId],
  (shipments, selectedId) =>
    shipments.find((shipment) => shipment.id === selectedId)?.destination ?? null,
)
