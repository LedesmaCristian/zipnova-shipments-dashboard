import type { ShipmentPriority, ShipmentStatus } from './types'

export const SHIPMENT_STATUSES = [
  'pending',
  'assigned',
  'in_transit',
  'delivered',
  'cancelled',
] as const satisfies readonly ShipmentStatus[]

export const SHIPMENT_PRIORITIES = [
  'high',
  'medium',
  'low',
] as const satisfies readonly ShipmentPriority[]

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  pending: 'Pendiente',
  assigned: 'Asignado',
  in_transit: 'En tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export const PRIORITY_LABELS: Record<ShipmentPriority, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

/** Color por prioridad (tokens del tema): punto de la card y leyenda del mapa. */
export const PRIORITY_BG_CLASSES: Record<ShipmentPriority, string> = {
  high: 'bg-danger',
  medium: 'bg-warning',
  low: 'bg-brand',
}

/** Peso para ordenar: mayor valor = más urgente. */
export const PRIORITY_WEIGHT: Record<ShipmentPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

/** Transiciones de estado permitidas (máquina de estados del envío). */
export const STATUS_TRANSITIONS: Record<ShipmentStatus, readonly ShipmentStatus[]> = {
  pending: ['assigned', 'cancelled'],
  assigned: ['pending', 'in_transit', 'cancelled'],
  in_transit: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

/** Estados en los que se puede (re)asignar conductor y vehículo. */
export const ASSIGNABLE_STATUSES: readonly ShipmentStatus[] = ['pending', 'assigned']

/** Estados que requieren conductor y vehículo asignados. */
export const STATUSES_REQUIRING_ASSIGNMENT: readonly ShipmentStatus[] = [
  'assigned',
  'in_transit',
  'delivered',
]
