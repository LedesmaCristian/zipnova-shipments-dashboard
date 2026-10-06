import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { Vehicle } from './types'

export const vehiclesAdapter = createEntityAdapter<Vehicle>({
  sortComparer: (a, b) => a.capacityKg - b.capacityKg,
})

export function createVehiclesState(vehicles: readonly Vehicle[] = []) {
  return vehiclesAdapter.setAll(vehiclesAdapter.getInitialState(), vehicles)
}

/** Catálogo de solo lectura: el desafío no requiere ABM de vehículos. */
const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState: createVehiclesState(),
  reducers: {},
})

export const vehiclesReducer = vehiclesSlice.reducer
