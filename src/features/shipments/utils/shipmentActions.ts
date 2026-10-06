import type { Shipment } from '../types'
import { canCancel, canTransition, canUnassign, hasAssignment } from './shipmentRules'

export type ShipmentAction = 'start' | 'deliver' | 'unassign' | 'cancel'

export const SHIPMENT_ACTION_LABELS: Record<ShipmentAction, string> = {
  start: 'Iniciar viaje',
  deliver: 'Marcar entregado',
  unassign: 'Desasignar',
  cancel: 'Cancelar',
}

/** Confirmación que se muestra después de aplicar cada acción. */
export const SHIPMENT_FEEDBACK = {
  start: (id: string) => `Entrega ${id} en tránsito`,
  deliver: (id: string) => `Entrega ${id} entregada`,
  unassign: (id: string) => `Entrega ${id} vuelve a pendiente`,
  cancel: (id: string) => `Entrega ${id} cancelada`,
  assign: (id: string) => `Entrega ${id} asignada`,
} satisfies Record<ShipmentAction | 'assign', (id: string) => string>

/**
 * Acciones de estado disponibles, derivadas de la máquina de estados.
 * La asignación no está acá: tiene su propio formulario (ícono de asignar en la card).
 */
export function getShipmentActions(
  shipment: Pick<Shipment, 'status' | 'driverId' | 'vehicleId'>,
): ShipmentAction[] {
  const { status } = shipment
  return [
    canTransition(status, 'in_transit') && hasAssignment(shipment) && 'start',
    canTransition(status, 'delivered') && 'deliver',
    canUnassign(shipment) && 'unassign',
    canCancel(shipment) && 'cancel',
  ].filter((action): action is ShipmentAction => Boolean(action))
}
