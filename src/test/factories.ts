import type { Shipment, ShipmentPackage } from '@/features/shipments/types'

export function buildPackage(overrides: Partial<ShipmentPackage> = {}): ShipmentPackage {
  return {
    id: 'pkg-1',
    description: 'Caja',
    quantity: 1,
    weightKg: 10,
    dimensionsCm: { length: 100, width: 50, height: 20 },
    unitValue: 1000,
    ...overrides,
  }
}

export function buildShipment(overrides: Partial<Shipment> = {}): Shipment {
  return {
    id: 'shp-1',
    trackingCode: 'D999-0000000001',
    customer: 'Cliente de prueba',
    destination: { lat: -34.6, lng: -58.4, address: 'Av. Corrientes 1000, CABA' },
    status: 'pending',
    priority: 'medium',
    estimatedDelivery: '2026-10-06T15:00:00.000Z',
    packages: [buildPackage()],
    ...overrides,
  }
}
