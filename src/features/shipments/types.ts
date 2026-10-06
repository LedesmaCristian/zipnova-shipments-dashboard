import type { Driver } from '@/features/drivers/types'
import type { Vehicle } from '@/features/vehicles/types'
import type { Location } from '@/types/geo'

export type ShipmentStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled'

export type ShipmentPriority = 'low' | 'medium' | 'high'

export interface PackageDimensions {
  length: number
  width: number
  height: number
}

export interface ShipmentPackage {
  id: string
  description: string
  quantity: number
  /** Peso unitario en kg. */
  weightKg: number
  /** Dimensiones unitarias en cm. */
  dimensionsCm: PackageDimensions
  /** Valor declarado unitario en ARS. */
  unitValue: number
}

export interface Shipment {
  id: string
  /** Código de seguimiento externo, visible bajo el número de envío. */
  trackingCode: string
  customer: string
  destination: Location
  status: ShipmentStatus
  priority: ShipmentPriority
  driverId?: string
  vehicleId?: string
  /** Fecha estimada de entrega en ISO 8601. */
  estimatedDelivery: string
  packages: ShipmentPackage[]
}

/** Métricas agregadas derivadas de los paquetes de un envío. */
export interface ShipmentMetrics {
  totalPackages: number
  totalWeightKg: number
  totalVolumeM3: number
  totalValue: number
}

export interface AssignmentPayload {
  shipmentId: string
  driverId: string
  vehicleId: string
}

/**
 * Transiciones de la operación en curso. Volver a pendiente (`shipmentUnassigned`) y cancelar
 * (`shipmentCancelled`) tienen acciones propias: así cada transición tiene un único camino.
 */
export interface StatusChangePayload {
  shipmentId: string
  status: Extract<ShipmentStatus, 'in_transit' | 'delivered'>
}

/** Envío con sus relaciones resueltas y métricas calculadas, listo para la vista de detalle. */
export interface ShipmentDetails {
  shipment: Shipment
  driver?: Driver
  vehicle?: Vehicle
  metrics: ShipmentMetrics
}

/** Resumen de los envíos visibles. */
export interface ShipmentStats {
  total: number
  pending: number
  highPriority: number
}
