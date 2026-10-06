import { THEME_COLORS } from '@/lib/themeColors'
import { buildShipment } from '@/test/factories'
import { areBoundsEqual, getMarkerStyle, getShipmentsBounds } from './mapView'

describe('getMarkerStyle', () => {
  it('colors markers by priority', () => {
    expect(getMarkerStyle({ priority: 'high', status: 'pending' }, false).fillColor).toBe(
      THEME_COLORS.danger,
    )
  })

  it('makes the selected marker bigger and highlighted', () => {
    const normal = getMarkerStyle({ priority: 'low', status: 'pending' }, false)
    const selected = getMarkerStyle({ priority: 'low', status: 'pending' }, true)

    expect(selected.radius).toBeGreaterThan(normal.radius)
    expect(selected.weight).toBeGreaterThan(normal.weight)
    expect(selected.color).not.toBe(normal.color)
  })

  it('dims delivered and cancelled shipments', () => {
    const active = getMarkerStyle({ priority: 'low', status: 'in_transit' }, false)
    const delivered = getMarkerStyle({ priority: 'low', status: 'delivered' }, false)
    const cancelled = getMarkerStyle({ priority: 'low', status: 'cancelled' }, false)

    expect(delivered.fillOpacity).toBeLessThan(active.fillOpacity)
    expect(cancelled.fillOpacity).toBe(delivered.fillOpacity)
  })
})

describe('getShipmentsBounds', () => {
  it('returns null when there is nothing to show', () => {
    expect(getShipmentsBounds([])).toBeNull()
  })

  it('returns the south-west and north-east corners', () => {
    const shipments = [
      buildShipment({ destination: { lat: -34.5, lng: -58.6, address: 'A' } }),
      buildShipment({ destination: { lat: -34.7, lng: -58.3, address: 'B' } }),
    ]

    expect(getShipmentsBounds(shipments)).toEqual([
      [-34.7, -58.6],
      [-34.5, -58.3],
    ])
  })
})

describe('areBoundsEqual', () => {
  it('compares bounds by value', () => {
    const bounds = getShipmentsBounds([buildShipment()])

    expect(areBoundsEqual(bounds, structuredClone(bounds))).toBe(true)
    expect(areBoundsEqual(bounds, null)).toBe(false)
    expect(areBoundsEqual(null, null)).toBe(true)
  })
})
