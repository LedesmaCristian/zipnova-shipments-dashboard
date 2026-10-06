import { buildShipment } from '@/test/factories'
import {
  createShipmentsState,
  shipmentAssigned,
  shipmentCancelled,
  shipmentLocated,
  shipmentSelected,
  shipmentStatusChanged,
  shipmentsReducer,
  shipmentUnassigned,
} from './shipmentsSlice'
import type { Shipment } from './types'

const pending = buildShipment({ id: 'p1', status: 'pending' })
const assigned = buildShipment({ id: 'a1', status: 'assigned', driverId: 'd1', vehicleId: 'v1' })
const inTransit = buildShipment({ id: 't1', status: 'in_transit', driverId: 'd1', vehicleId: 'v1' })
const delivered = buildShipment({ id: 'x1', status: 'delivered', driverId: 'd1', vehicleId: 'v1' })

const initialState = createShipmentsState([pending, assigned, inTransit, delivered])

function getShipment(state: typeof initialState, id: string): Shipment | undefined {
  return state.entities[id]
}

describe('shipmentsSlice', () => {
  it('selects and deselects a shipment', () => {
    const selected = shipmentsReducer(initialState, shipmentSelected('p1'))
    expect(selected.selectedId).toBe('p1')

    const cleared = shipmentsReducer(selected, shipmentSelected(null))
    expect(cleared.selectedId).toBeNull()
  })

  it('selects and requests map focus on every locate, even if already selected', () => {
    const first = shipmentsReducer(initialState, shipmentLocated('p1'))
    const second = shipmentsReducer(first, shipmentLocated('p1'))

    expect(second.selectedId).toBe('p1')
    expect(second.locateRequest).toBe(initialState.locateRequest + 2)
  })

  describe('shipmentAssigned', () => {
    it('assigns driver and vehicle to a pending shipment and marks it as assigned', () => {
      const state = shipmentsReducer(
        initialState,
        shipmentAssigned({ shipmentId: 'p1', driverId: 'd2', vehicleId: 'v2' }),
      )

      expect(getShipment(state, 'p1')).toMatchObject({
        status: 'assigned',
        driverId: 'd2',
        vehicleId: 'v2',
      })
    })

    it('reassigns an already assigned shipment', () => {
      const state = shipmentsReducer(
        initialState,
        shipmentAssigned({ shipmentId: 'a1', driverId: 'd3', vehicleId: 'v3' }),
      )

      expect(getShipment(state, 'a1')).toMatchObject({ driverId: 'd3', vehicleId: 'v3' })
    })

    it('ignores the assignment when the shipment is already in transit', () => {
      const state = shipmentsReducer(
        initialState,
        shipmentAssigned({ shipmentId: 't1', driverId: 'd9', vehicleId: 'v9' }),
      )

      expect(state).toBe(initialState)
    })

    it('ignores unknown shipments', () => {
      const state = shipmentsReducer(
        initialState,
        shipmentAssigned({ shipmentId: 'nope', driverId: 'd1', vehicleId: 'v1' }),
      )

      expect(state).toBe(initialState)
    })

    it('does not mutate the previous state', () => {
      shipmentsReducer(
        initialState,
        shipmentAssigned({ shipmentId: 'p1', driverId: 'd2', vehicleId: 'v2' }),
      )

      expect(getShipment(initialState, 'p1')?.status).toBe('pending')
    })
  })

  describe('shipmentUnassigned', () => {
    it('clears the assignment and returns the shipment to pending', () => {
      const shipment = getShipment(shipmentsReducer(initialState, shipmentUnassigned('a1')), 'a1')

      expect(shipment?.status).toBe('pending')
      expect(shipment?.driverId).toBeUndefined()
      expect(shipment?.vehicleId).toBeUndefined()
    })

    it('ignores shipments that are not in assigned status', () => {
      expect(shipmentsReducer(initialState, shipmentUnassigned('t1'))).toBe(initialState)
    })
  })

  describe('shipmentStatusChanged', () => {
    it('applies an allowed transition', () => {
      const state = shipmentsReducer(
        initialState,
        shipmentStatusChanged({ shipmentId: 'a1', status: 'in_transit' }),
      )

      expect(getShipment(state, 'a1')?.status).toBe('in_transit')
    })

    it('rejects a transition outside the state machine', () => {
      const state = shipmentsReducer(
        initialState,
        shipmentStatusChanged({ shipmentId: 'p1', status: 'delivered' }),
      )

      expect(state).toBe(initialState)
    })

    it('rejects delivering a shipment that never started', () => {
      const state = shipmentsReducer(
        initialState,
        shipmentStatusChanged({ shipmentId: 'a1', status: 'delivered' }),
      )

      expect(state).toBe(initialState)
    })
  })

  describe('shipmentCancelled', () => {
    it.each(['p1', 'a1', 't1'])('cancels an active shipment (%s)', (id) => {
      const state = shipmentsReducer(initialState, shipmentCancelled(id))

      expect(getShipment(state, id)?.status).toBe('cancelled')
    })

    it('does not cancel a delivered shipment', () => {
      expect(shipmentsReducer(initialState, shipmentCancelled('x1'))).toBe(initialState)
    })
  })
})
