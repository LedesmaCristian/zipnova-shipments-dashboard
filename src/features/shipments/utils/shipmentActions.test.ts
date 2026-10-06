import { getShipmentActions } from './shipmentActions'

const ASSIGNMENT = { driverId: 'd1', vehicleId: 'v1' }

describe('getShipmentActions', () => {
  it.each([
    [{ status: 'pending' as const }, ['cancel']],
    [{ status: 'assigned' as const, ...ASSIGNMENT }, ['start', 'unassign', 'cancel']],
    [{ status: 'in_transit' as const, ...ASSIGNMENT }, ['deliver', 'cancel']],
    [{ status: 'delivered' as const, ...ASSIGNMENT }, []],
    [{ status: 'cancelled' as const }, []],
  ])('derives the actions for %o', (shipment, expected) => {
    expect(getShipmentActions(shipment)).toEqual(expected)
  })

  it('does not offer starting the trip without driver and vehicle', () => {
    expect(getShipmentActions({ status: 'assigned' })).not.toContain('start')
  })
})
