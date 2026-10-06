import type { Shipment, ShipmentPriority, ShipmentStatus } from '@/features/shipments/types'
import { THEME_COLORS } from '@/lib/themeColors'

export type LatLngTuple = [lat: number, lng: number]
export type Bounds = [southWest: LatLngTuple, northEast: LatLngTuple]

/** Centro de CABA: vista inicial y fallback cuando no hay envíos visibles. */
export const DEFAULT_CENTER: LatLngTuple = [-34.61, -58.44]
export const DEFAULT_ZOOM = 11
export const FOCUS_ZOOM = 15

/** Mismos colores que el punto de prioridad de la card (tokens del tema). */
const PRIORITY_MARKER_COLORS: Record<ShipmentPriority, string> = {
  high: THEME_COLORS.danger,
  medium: THEME_COLORS.warning,
  low: THEME_COLORS.brand,
}

const MARKER = {
  default: { radius: 7, weight: 2, color: THEME_COLORS.bgAccent },
  selected: { radius: 11, weight: 3, color: THEME_COLORS.textPrimary },
}

const FILL_OPACITY = { active: 0.95, closed: 0.35 }

/** Envíos cerrados: se muestran atenuados para no competir con la operación activa. */
const CLOSED_STATUSES: readonly ShipmentStatus[] = ['delivered', 'cancelled']

export interface MarkerStyle {
  radius: number
  color: string
  weight: number
  fillColor: string
  fillOpacity: number
}

export function getMarkerStyle(
  shipment: Pick<Shipment, 'priority' | 'status'>,
  isSelected: boolean,
): MarkerStyle {
  const isClosed = CLOSED_STATUSES.includes(shipment.status)
  return {
    ...(isSelected ? MARKER.selected : MARKER.default),
    fillColor: PRIORITY_MARKER_COLORS[shipment.priority],
    fillOpacity: isClosed ? FILL_OPACITY.closed : FILL_OPACITY.active,
  }
}

/** Esquinas [sur-oeste, nor-este] que contienen todos los envíos, o null si no hay ninguno. */
export function getShipmentsBounds(
  shipments: readonly Pick<Shipment, 'destination'>[],
): Bounds | null {
  if (shipments.length === 0) return null
  let [south, west, north, east] = [Infinity, Infinity, -Infinity, -Infinity]
  for (const { destination } of shipments) {
    south = Math.min(south, destination.lat)
    north = Math.max(north, destination.lat)
    west = Math.min(west, destination.lng)
    east = Math.max(east, destination.lng)
  }
  return [
    [south, west],
    [north, east],
  ]
}

export function areBoundsEqual(a: Bounds | null, b: Bounds | null): boolean {
  return a?.flat().join() === b?.flat().join()
}
