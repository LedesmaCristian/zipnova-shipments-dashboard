import type { Driver } from '@/features/drivers/types'
import type { Vehicle } from '@/features/vehicles/types'
import { PRIORITY_LABELS, STATUS_LABELS } from '../constants'
import type { Shipment } from '../types'

/** "Prioridad alta · Pendiente": mismo texto en la card y en el tooltip del mapa. */
export function formatPriorityAndStatus(shipment: Pick<Shipment, 'priority' | 'status'>): string {
  return `Prioridad ${PRIORITY_LABELS[shipment.priority].toLowerCase()} · ${STATUS_LABELS[shipment.status]}`
}

/** "Lucía Fernández · AE 123 KD", o "Sin asignar". */
export function formatAssignment(
  driver: Pick<Driver, 'name'> | undefined,
  vehicle: Pick<Vehicle, 'plate'> | undefined,
): string {
  return driver && vehicle ? `${driver.name} · ${vehicle.plate}` : 'Sin asignar'
}
