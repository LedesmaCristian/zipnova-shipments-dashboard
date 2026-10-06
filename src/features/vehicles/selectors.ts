import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { formatWeight } from '@/lib/format'
import { vehiclesAdapter } from './vehiclesSlice'

const vehicleSelectors = vehiclesAdapter.getSelectors((state: RootState) => state.vehicles)

export const selectVehicleEntities = vehicleSelectors.selectEntities

/** Opciones memoizadas, con la capacidad a la vista para elegir sin adivinar. */
export const selectVehicleOptions = createSelector([vehicleSelectors.selectAll], (vehicles) =>
  vehicles.map((vehicle) => ({
    value: vehicle.id,
    label: `${vehicle.model} · ${vehicle.plate} (hasta ${formatWeight(vehicle.capacityKg)})`,
  })),
)
