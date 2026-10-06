import { createMockState, makeStore } from '@/app/store'
import { EMPTY_FILTERS } from '@/features/filters/constants'
import { filtersReplaced } from '@/features/filters/filtersSlice'
import { shipmentSelected, shipmentStatusChanged } from '@/features/shipments/shipmentsSlice'
import { TEST_BASE_DATE } from '@/test/renderWithStore'
import { selectFocusedDestination, selectVisibleBounds } from './selectors'

function setup() {
  return makeStore(createMockState(TEST_BASE_DATE))
}

describe('map selectors', () => {
  it('keeps the same bounds while the visible area does not change', () => {
    const store = setup()
    const bounds = selectVisibleBounds(store.getState())

    store.dispatch(shipmentStatusChanged({ shipmentId: '123446', status: 'in_transit' }))

    expect(selectVisibleBounds(store.getState())).toBe(bounds)
  })

  it('has no bounds when nothing is visible', () => {
    const store = setup()

    store.dispatch(filtersReplaced({ ...EMPTY_FILTERS, search: 'sin resultados' }))

    expect(selectVisibleBounds(store.getState())).toBeNull()
  })

  it('focuses the selected shipment only while it is visible', () => {
    const store = setup()
    store.dispatch(shipmentSelected('123445'))
    const destination = selectFocusedDestination(store.getState())

    expect(destination?.address).toMatch(/Santa Fe/)

    store.dispatch(shipmentStatusChanged({ shipmentId: '123446', status: 'in_transit' }))
    expect(selectFocusedDestination(store.getState())).toBe(destination)

    store.dispatch(filtersReplaced({ ...EMPTY_FILTERS, priorities: ['low'] }))
    expect(selectFocusedDestination(store.getState())).toBeNull()
  })
})
