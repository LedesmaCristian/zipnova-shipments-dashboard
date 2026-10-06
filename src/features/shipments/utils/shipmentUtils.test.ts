import { buildPackage, buildShipment } from '@/test/factories'
import { getShipmentMetrics } from './shipmentMetrics'
import {
  canAssign,
  canCancel,
  canTransition,
  canUnassign,
  fitsVehicleCapacity,
  hasAssignment,
} from './shipmentRules'
import { sortShipments } from './sortShipments'

describe('getShipmentMetrics', () => {
  it('returns zeros for a shipment without packages', () => {
    expect(getShipmentMetrics([])).toEqual({
      totalPackages: 0,
      totalWeightKg: 0,
      totalVolumeM3: 0,
      totalValue: 0,
    })
  })

  it('aggregates quantity, weight, volume and value across packages', () => {
    const packages = [
      buildPackage({
        quantity: 2,
        weightKg: 30,
        unitValue: 100,
        dimensionsCm: { length: 50, width: 40, height: 50 },
      }),
      buildPackage({
        quantity: 1,
        weightKg: 5,
        unitValue: 30,
        dimensionsCm: { length: 100, width: 100, height: 100 },
      }),
    ]

    const metrics = getShipmentMetrics(packages)

    expect(metrics.totalPackages).toBe(3)
    expect(metrics.totalWeightKg).toBe(65)
    expect(metrics.totalVolumeM3).toBeCloseTo(1.2)
    expect(metrics.totalValue).toBe(230)
  })
})

describe('shipment rules', () => {
  it('follows the status state machine', () => {
    expect(canTransition('pending', 'assigned')).toBe(true)
    expect(canTransition('pending', 'in_transit')).toBe(false)
    expect(canTransition('delivered', 'cancelled')).toBe(false)
  })

  it('allows assignment only for pending or assigned shipments', () => {
    expect(canAssign({ status: 'pending' })).toBe(true)
    expect(canAssign({ status: 'assigned' })).toBe(true)
    expect(canAssign({ status: 'in_transit' })).toBe(false)
  })

  it('allows cancelling only non-final shipments', () => {
    expect(canCancel({ status: 'in_transit' })).toBe(true)
    expect(canCancel({ status: 'delivered' })).toBe(false)
    expect(canCancel({ status: 'cancelled' })).toBe(false)
  })

  it('requires both driver and vehicle to consider a shipment assigned', () => {
    expect(hasAssignment({ driverId: 'd1', vehicleId: 'v1' })).toBe(true)
    expect(hasAssignment({ driverId: 'd1' })).toBe(false)
    expect(hasAssignment({})).toBe(false)
  })

  it('checks total weight against vehicle capacity (inclusive)', () => {
    expect(fitsVehicleCapacity(30, { capacityKg: 30 })).toBe(true)
    expect(fitsVehicleCapacity(30, { capacityKg: 29 })).toBe(false)
  })

  it('allows unassigning only before the trip starts', () => {
    expect(canUnassign({ status: 'assigned' })).toBe(true)
    expect(canUnassign({ status: 'pending' })).toBe(false)
    expect(canUnassign({ status: 'in_transit' })).toBe(false)
  })
})

describe('sortShipments', () => {
  it('orders by priority first and then by closest delivery, without mutating the input', () => {
    const lowEarly = buildShipment({
      id: 'low',
      priority: 'low',
      estimatedDelivery: '2026-10-06T09:00:00Z',
    })
    const highLate = buildShipment({
      id: 'high-late',
      priority: 'high',
      estimatedDelivery: '2026-10-07T09:00:00Z',
    })
    const highEarly = buildShipment({
      id: 'high-early',
      priority: 'high',
      estimatedDelivery: '2026-10-06T10:00:00Z',
    })
    const input = [lowEarly, highLate, highEarly]

    const sorted = sortShipments(input)

    expect(sorted.map((s) => s.id)).toEqual(['high-early', 'high-late', 'low'])
    expect(input.map((s) => s.id)).toEqual(['low', 'high-late', 'high-early'])
  })
})
