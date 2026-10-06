import type { ShipmentPriority, ShipmentStatus } from '@/features/shipments/types'
import type { DateKey } from '@/lib/date'

export interface ShipmentFilters {
  /** Búsqueda libre por número de envío o cliente. */
  search: string
  statuses: ShipmentStatus[]
  priorities: ShipmentPriority[]
  driverIds: string[]
  /** Búsqueda por dirección de destino. */
  address: string
  /** Día de entrega estimada. */
  deliveryDate: DateKey | null
}
