import type { ShipmentFilters } from './types'

export const EMPTY_FILTERS: ShipmentFilters = {
  search: '',
  statuses: [],
  priorities: [],
  driverIds: [],
  address: '',
  deliveryDate: null,
}
