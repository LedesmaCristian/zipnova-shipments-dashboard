import type { Vehicle } from '@/features/vehicles/types'
import { ASSIGNABLE_STATUSES, STATUS_TRANSITIONS } from '../constants'
import type { Shipment, ShipmentStatus } from '../types'

export function canTransition(from: ShipmentStatus, to: ShipmentStatus): boolean {
  return STATUS_TRANSITIONS[from].includes(to)
}

export function canAssign(shipment: Pick<Shipment, 'status'>): boolean {
  return ASSIGNABLE_STATUSES.includes(shipment.status)
}

/** Desasignar = volver a pendiente: solo antes de que el viaje empiece. */
export function canUnassign(shipment: Pick<Shipment, 'status'>): boolean {
  return canTransition(shipment.status, 'pending')
}

export function canCancel(shipment: Pick<Shipment, 'status'>): boolean {
  return canTransition(shipment.status, 'cancelled')
}

export function hasAssignment(shipment: Pick<Shipment, 'driverId' | 'vehicleId'>): boolean {
  return Boolean(shipment.driverId && shipment.vehicleId)
}

/** Indica si el vehículo soporta el peso total del envío. */
export function fitsVehicleCapacity(
  totalWeightKg: number,
  vehicle: Pick<Vehicle, 'capacityKg'>,
): boolean {
  return totalWeightKg <= vehicle.capacityKg
}
