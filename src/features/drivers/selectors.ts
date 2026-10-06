import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { driversAdapter } from './driversSlice'

const driverSelectors = driversAdapter.getSelectors((state: RootState) => state.drivers)

export const selectDriverEntities = driverSelectors.selectEntities

/** Opciones `{ value, label }` memoizadas: los selects reciben siempre la misma referencia. */
export const selectDriverOptions = createSelector([driverSelectors.selectAll], (drivers) =>
  drivers.map((driver) => ({ value: driver.id, label: driver.name })),
)
