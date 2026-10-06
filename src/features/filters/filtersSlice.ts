import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { EMPTY_FILTERS } from './constants'
import type { ShipmentFilters } from './types'

const filtersSlice = createSlice({
  name: 'filters',
  initialState: EMPTY_FILTERS,
  reducers: {
    /** El formulario de filtros (RHF) es dueño de los valores: cada cambio reemplaza el estado. */
    filtersReplaced(_state, action: PayloadAction<ShipmentFilters>) {
      return action.payload
    },
  },
})

export const { filtersReplaced } = filtersSlice.actions

export const filtersReducer = filtersSlice.reducer
