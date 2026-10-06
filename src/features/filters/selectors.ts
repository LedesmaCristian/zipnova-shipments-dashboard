import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { countActiveFilters } from './utils/applyFilters'

export const selectFilters = (state: RootState) => state.filters

export const selectActiveFiltersCount = createSelector([selectFilters], countActiveFilters)
