import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createDriversState, driversReducer } from '@/features/drivers/driversSlice'
import { filtersReducer } from '@/features/filters/filtersSlice'
import { createShipmentsState, shipmentsReducer } from '@/features/shipments/shipmentsSlice'
import { createVehiclesState, vehiclesReducer } from '@/features/vehicles/vehiclesSlice'
import { MOCK_DRIVERS } from '@/mocks/drivers'
import { createMockShipments } from '@/mocks/shipments'
import { MOCK_VEHICLES } from '@/mocks/vehicles'

const rootReducer = combineReducers({
  shipments: shipmentsReducer,
  drivers: driversReducer,
  vehicles: vehiclesReducer,
  filters: filtersReducer,
})

export type RootState = ReturnType<typeof rootReducer>

/** Estado inicial con el dataset mock (reemplaza a la carga desde un backend). */
export function createMockState(baseDate: Date = new Date()): Partial<RootState> {
  return {
    shipments: createShipmentsState(createMockShipments(baseDate)),
    drivers: createDriversState(MOCK_DRIVERS),
    vehicles: createVehiclesState(MOCK_VEHICLES),
  }
}

/** Factory para poder crear stores aislados en los tests. */
export function makeStore(preloadedState: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState })
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
