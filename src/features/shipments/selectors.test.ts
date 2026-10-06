import { createMockState, makeStore } from '@/app/store'
import { EMPTY_FILTERS } from '@/features/filters/constants'
import { selectActiveFiltersCount } from '@/features/filters/selectors'
import { filtersReplaced } from '@/features/filters/filtersSlice'
import type { ShipmentFilters } from '@/features/filters/types'
import { MOCK_DRIVERS } from '@/mocks/drivers'
import { MOCK_VEHICLES } from '@/mocks/vehicles'
import { STATUSES_REQUIRING_ASSIGNMENT } from './constants'
import {
  selectDeliveryDateKeys,
  selectDestinationAddresses,
  selectIsShipmentSelected,
  selectShipmentDetails,
  selectVisibleShipments,
  selectVisibleStats,
} from './selectors'
import { shipmentAssigned, shipmentSelected, shipmentStatusChanged } from './shipmentsSlice'
import { getShipmentMetrics } from './utils/shipmentMetrics'
import { fitsVehicleCapacity, hasAssignment } from './utils/shipmentRules'

const BASE_DATE = new Date('2026-10-06T08:00:00')

function setup() {
  return makeStore(createMockState(BASE_DATE))
}

function filtersWith(overrides: Partial<ShipmentFilters>) {
  return filtersReplaced({ ...EMPTY_FILTERS, ...overrides })
}

describe('mock dataset', () => {
  it('has 20 shipments, 5 drivers and 5 vehicles', () => {
    const state = setup().getState()

    expect(state.shipments.ids).toHaveLength(20)
    expect(MOCK_DRIVERS).toHaveLength(5)
    expect(MOCK_VEHICLES).toHaveLength(5)
  })

  it('keeps every shipment consistent with the business rules', () => {
    const state = setup().getState()

    const violations = Object.values(state.shipments.entities).flatMap((shipment) => {
      const { id, status, driverId, vehicleId } = shipment
      const vehicle = vehicleId ? state.vehicles.entities[vehicleId] : undefined
      return [
        STATUSES_REQUIRING_ASSIGNMENT.includes(status) !== hasAssignment(shipment) &&
          `${id}: asignación inconsistente con el estado ${status}`,
        driverId && !state.drivers.entities[driverId] && `${id}: conductor inexistente`,
        vehicleId && !vehicle && `${id}: vehículo inexistente`,
        vehicle &&
          !fitsVehicleCapacity(getShipmentMetrics(shipment.packages).totalWeightKg, vehicle) &&
          `${id}: excede la capacidad`,
      ].filter(Boolean)
    })

    expect(violations).toEqual([])
  })
})

describe('selectors', () => {
  it('returns visible shipments sorted with high priority first', () => {
    const visible = selectVisibleShipments(setup().getState())

    expect(visible).toHaveLength(20)
    expect(visible[0]?.priority).toBe('high')
    expect(visible.at(-1)?.priority).toBe('low')
  })

  it('memoizes visible shipments while inputs do not change', () => {
    const state = setup().getState()

    expect(selectVisibleShipments(state)).toBe(selectVisibleShipments(state))
  })

  it('applies the active filters', () => {
    const store = setup()

    store.dispatch(filtersWith({ statuses: ['pending'], priorities: ['high'] }))
    const state = store.getState()

    expect(selectActiveFiltersCount(state)).toBe(2)
    expect(
      selectVisibleShipments(state).every((s) => s.status === 'pending' && s.priority === 'high'),
    ).toBe(true)
    expect(selectVisibleShipments(state).length).toBeGreaterThan(0)
  })

  it('keeps the same visible list when the result does not change', () => {
    const store = setup()
    const before = selectVisibleShipments(store.getState())

    store.dispatch(filtersWith({ search: '  ' }))

    expect(selectVisibleShipments(store.getState())).toBe(before)
  })

  it('keeps addresses and delivery days stable across shipment actions', () => {
    const store = setup()
    const addresses = selectDestinationAddresses(store.getState())
    const days = selectDeliveryDateKeys(store.getState())

    store.dispatch(shipmentStatusChanged({ shipmentId: '123446', status: 'in_transit' }))

    expect(selectDestinationAddresses(store.getState())).toBe(addresses)
    expect(selectDeliveryDateKeys(store.getState())).toBe(days)
  })

  it('tracks the selected shipment', () => {
    const store = setup()
    expect(selectIsShipmentSelected(store.getState(), '123445')).toBe(false)

    store.dispatch(shipmentSelected('123445'))

    expect(selectIsShipmentSelected(store.getState(), '123445')).toBe(true)
  })

  it('lists unique destination addresses sorted alphabetically', () => {
    const addresses = selectDestinationAddresses(setup().getState())

    expect(addresses).toHaveLength(20)
    expect(addresses).toEqual(addresses.toSorted((a, b) => a.localeCompare(b)))
  })

  it('collects the days that have deliveries', () => {
    const days = selectDeliveryDateKeys(setup().getState())

    expect(days.has('2026-10-06')).toBe(true)
    expect(days.has('2026-10-07')).toBe(true)
    expect(days.has('2026-11-01')).toBe(false)
  })

  it('summarizes the visible shipments', () => {
    const store = setup()
    store.dispatch(filtersWith({ priorities: ['high'] }))

    expect(selectVisibleStats(store.getState())).toEqual({
      total: 7,
      pending: 3,
      highPriority: 7,
    })
  })

  it('builds shipment details with driver, vehicle and metrics', () => {
    const store = setup()
    store.dispatch(
      shipmentAssigned({ shipmentId: '123445', driverId: 'drv-2', vehicleId: 'veh-3' }),
    )

    const details = selectShipmentDetails(store.getState(), '123445')

    expect(details?.driver?.name).toBe('Martín Gómez')
    expect(details?.vehicle?.plate).toBe('AD 789 NP')
    expect(details?.metrics).toMatchObject({ totalPackages: 3, totalWeightKg: 90 })
  })

  it('returns no details for unknown or unassigned relations', () => {
    const state = setup().getState()

    expect(selectShipmentDetails(state, 'nope')).toBeUndefined()
    expect(selectShipmentDetails(state, '123445')?.driver).toBeUndefined()
  })
})
