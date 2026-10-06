import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { Driver } from './types'

export const driversAdapter = createEntityAdapter<Driver>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

export function createDriversState(drivers: readonly Driver[] = []) {
  return driversAdapter.setAll(driversAdapter.getInitialState(), drivers)
}

/** Catálogo de solo lectura: el desafío no requiere ABM de conductores. */
const driversSlice = createSlice({
  name: 'drivers',
  initialState: createDriversState(),
  reducers: {},
})

export const driversReducer = driversSlice.reducer
