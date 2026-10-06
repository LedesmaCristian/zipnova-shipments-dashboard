import { buildShipment } from '@/test/factories'
import { EMPTY_FILTERS } from './constants'
import { filtersReducer, filtersReplaced } from './filtersSlice'
import type { ShipmentFilters } from './types'
import { applyFilters, countActiveFilters } from './utils/applyFilters'
import { searchAddresses } from './utils/searchAddresses'

const shipments = [
  buildShipment({
    id: '100',
    customer: 'Óptica Recoleta',
    status: 'pending',
    priority: 'high',
    destination: { lat: 0, lng: 0, address: 'Av. Callao 1234, Recoleta' },
    estimatedDelivery: '2026-10-06T12:00:00',
  }),
  buildShipment({
    id: '200',
    customer: 'Ferretería Lanús',
    status: 'in_transit',
    priority: 'low',
    driverId: 'd1',
    vehicleId: 'v1',
    destination: { lat: 0, lng: 0, address: 'Av. Hipólito Yrigoyen 4200, Lanús' },
    estimatedDelivery: '2026-10-08T12:00:00',
  }),
]

function withFilters(overrides: Partial<ShipmentFilters>): ShipmentFilters {
  return { ...EMPTY_FILTERS, ...overrides }
}

function filteredIds(filters: ShipmentFilters): string[] {
  return applyFilters(shipments, filters).map((s) => s.id)
}

describe('applyFilters', () => {
  it('returns every shipment when no filter is active', () => {
    expect(filteredIds(EMPTY_FILTERS)).toEqual(['100', '200'])
  })

  it('searches by id or customer ignoring case and accents', () => {
    expect(filteredIds(withFilters({ search: 'optica' }))).toEqual(['100'])
    expect(filteredIds(withFilters({ search: '200' }))).toEqual(['200'])
  })

  it('filters by destination address', () => {
    expect(filteredIds(withFilters({ address: 'yrigoyen' }))).toEqual(['200'])
  })

  it('filters by multiple statuses and priorities', () => {
    expect(filteredIds(withFilters({ statuses: ['pending', 'delivered'] }))).toEqual(['100'])
    expect(filteredIds(withFilters({ priorities: ['low'] }))).toEqual(['200'])
  })

  it('excludes unassigned shipments when filtering by driver', () => {
    expect(filteredIds(withFilters({ driverIds: ['d1'] }))).toEqual(['200'])
  })

  it('filters by delivery day', () => {
    expect(filteredIds(withFilters({ deliveryDate: '2026-10-08' }))).toEqual(['200'])
    expect(filteredIds(withFilters({ deliveryDate: '2026-10-07' }))).toEqual([])
  })

  it('combines filters with AND semantics', () => {
    expect(filteredIds(withFilters({ statuses: ['pending'], priorities: ['low'] }))).toEqual([])
  })
})

describe('countActiveFilters', () => {
  it('counts each non-empty filter once and ignores whitespace-only text', () => {
    expect(countActiveFilters(EMPTY_FILTERS)).toBe(0)
    expect(countActiveFilters(withFilters({ search: '   ' }))).toBe(0)
    expect(
      countActiveFilters(
        withFilters({
          search: 'x',
          statuses: ['pending', 'assigned'],
          deliveryDate: '2026-10-06',
        }),
      ),
    ).toBe(3)
  })
})

describe('filtersSlice', () => {
  it('replaces the filters with the form values', () => {
    const next = withFilters({ search: 'abc', priorities: ['high'] })

    expect(filtersReducer(EMPTY_FILTERS, filtersReplaced(next))).toBe(next)
  })
})

describe('searchAddresses', () => {
  const addresses = Array.from({ length: 10 }, (_, index) => `Av. Corrientes ${index + 1}00`)

  it('suggests nothing until the user types', () => {
    expect(searchAddresses(addresses, '  ')).toEqual([])
  })

  it('matches ignoring accents and caps the number of results', () => {
    expect(searchAddresses(['Av. Hipólito Yrigoyen 4200'], 'hipolito')).toHaveLength(1)
    expect(searchAddresses(addresses, 'corrientes')).toHaveLength(6)
  })
})
