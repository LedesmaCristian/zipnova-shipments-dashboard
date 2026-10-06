import type {
  Shipment,
  ShipmentPackage,
  ShipmentPriority,
  ShipmentStatus,
} from '@/features/shipments/types'
import type { Location } from '@/types/geo'

type PackageSeed = Pick<ShipmentPackage, 'description' | 'quantity' | 'weightKg' | 'unitValue'> & {
  /** Dimensiones unitarias en cm: [largo, ancho, alto]. */
  dims: [number, number, number]
}

interface ShipmentSeed {
  id: string
  customer: string
  destination: Location
  status: ShipmentStatus
  priority: ShipmentPriority
  assignment?: [driverId: string, vehicleId: string]
  /** Entrega estimada relativa a la fecha base: [días, hora, minuto]. */
  eta: [days: number, hour: number, minute?: number]
  packages: PackageSeed[]
}

/** ISO a `days` días de `base`, en la hora local indicada: las entregas siempre caen cerca de hoy. */
function isoAtDayOffset(base: Date, days: number, hour: number, minute = 0): string {
  const date = new Date(base)
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

const SEEDS: ShipmentSeed[] = [
  {
    id: '123445',
    customer: 'Tienda Palermo SRL',
    destination: { lat: -34.5889, lng: -58.4306, address: 'Av. Santa Fe 3253, Palermo, CABA' },
    status: 'pending',
    priority: 'high',
    eta: [0, 11],
    packages: [
      {
        description: 'Indumentaria',
        quantity: 2,
        weightKg: 30,
        unitValue: 115200,
        dims: [50, 40, 50],
      },
      { description: 'Calzado', quantity: 1, weightKg: 30, unitValue: 98000, dims: [40, 50, 50] },
    ],
  },
  {
    id: '123446',
    customer: 'Farmacia Belgrano',
    destination: { lat: -34.5627, lng: -58.4565, address: 'Av. Cabildo 2040, Belgrano, CABA' },
    status: 'assigned',
    priority: 'high',
    assignment: ['drv-1', 'veh-1'],
    eta: [0, 12, 30],
    packages: [
      {
        description: 'Medicamentos',
        quantity: 3,
        weightKg: 4,
        unitValue: 42000,
        dims: [30, 20, 20],
      },
    ],
  },
  {
    id: '123447',
    customer: 'Librería Caballito',
    destination: { lat: -34.6186, lng: -58.4378, address: 'Av. Rivadavia 5100, Caballito, CABA' },
    status: 'in_transit',
    priority: 'medium',
    assignment: ['drv-2', 'veh-2'],
    eta: [0, 14],
    packages: [
      { description: 'Libros', quantity: 6, weightKg: 12, unitValue: 36000, dims: [40, 30, 30] },
    ],
  },
  {
    id: '123448',
    customer: 'Electro Once',
    destination: { lat: -34.6092, lng: -58.4071, address: 'Av. Corrientes 2550, Balvanera, CABA' },
    status: 'pending',
    priority: 'medium',
    eta: [1, 10],
    packages: [
      {
        description: 'Televisor 55"',
        quantity: 1,
        weightKg: 22,
        unitValue: 780000,
        dims: [140, 20, 85],
      },
      {
        description: 'Soporte de pared',
        quantity: 1,
        weightKg: 3,
        unitValue: 45000,
        dims: [50, 30, 10],
      },
    ],
  },
  {
    id: '123449',
    customer: 'Café San Telmo',
    destination: { lat: -34.6211, lng: -58.3731, address: 'Defensa 1001, San Telmo, CABA' },
    status: 'delivered',
    priority: 'low',
    assignment: ['drv-3', 'veh-2'],
    eta: [-1, 16],
    packages: [
      {
        description: 'Café en grano',
        quantity: 4,
        weightKg: 10,
        unitValue: 52000,
        dims: [40, 30, 25],
      },
    ],
  },
  {
    id: '123450',
    customer: 'Distribuidora Avellaneda',
    destination: {
      lat: -34.6627,
      lng: -58.3654,
      address: 'Av. Mitre 750, Avellaneda, Buenos Aires',
    },
    status: 'pending',
    priority: 'high',
    eta: [0, 17],
    packages: [
      { description: 'Bebidas', quantity: 20, weightKg: 18, unitValue: 24000, dims: [40, 30, 30] },
    ],
  },
  {
    id: '123451',
    customer: 'Óptica Recoleta',
    destination: { lat: -34.5875, lng: -58.3974, address: 'Av. Callao 1234, Recoleta, CABA' },
    status: 'assigned',
    priority: 'low',
    assignment: ['drv-4', 'veh-1'],
    eta: [2, 11],
    packages: [
      { description: 'Anteojos', quantity: 5, weightKg: 0.5, unitValue: 85000, dims: [20, 15, 10] },
    ],
  },
  {
    id: '123452',
    customer: 'Ferretería Lanús',
    destination: {
      lat: -34.7062,
      lng: -58.3916,
      address: 'Av. Hipólito Yrigoyen 4200, Lanús, Buenos Aires',
    },
    status: 'in_transit',
    priority: 'high',
    assignment: ['drv-5', 'veh-5'],
    eta: [0, 13],
    packages: [
      {
        description: 'Herramientas',
        quantity: 8,
        weightKg: 25,
        unitValue: 64000,
        dims: [60, 40, 30],
      },
      {
        description: 'Pintura 20 L',
        quantity: 10,
        weightKg: 26,
        unitValue: 58000,
        dims: [30, 30, 40],
      },
    ],
  },
  {
    id: '123453',
    customer: 'Juguetería Flores',
    destination: { lat: -34.6286, lng: -58.4636, address: 'Av. Rivadavia 7000, Flores, CABA' },
    status: 'pending',
    priority: 'low',
    eta: [3, 15],
    packages: [
      { description: 'Juguetes', quantity: 3, weightKg: 6, unitValue: 33000, dims: [50, 40, 30] },
    ],
  },
  {
    id: '123454',
    customer: 'Deco Vicente López',
    destination: {
      lat: -34.5266,
      lng: -58.4747,
      address: 'Av. Maipú 1800, Vicente López, Buenos Aires',
    },
    status: 'assigned',
    priority: 'medium',
    assignment: ['drv-2', 'veh-3'],
    eta: [1, 9, 30],
    packages: [
      { description: 'Muebles', quantity: 2, weightKg: 45, unitValue: 210000, dims: [120, 60, 50] },
    ],
  },
  {
    id: '123455',
    customer: 'Almacén Villa Crespo',
    destination: {
      lat: -34.5995,
      lng: -58.4387,
      address: 'Av. Corrientes 5300, Villa Crespo, CABA',
    },
    status: 'cancelled',
    priority: 'medium',
    eta: [0, 10],
    packages: [
      {
        description: 'Comestibles',
        quantity: 5,
        weightKg: 8,
        unitValue: 18000,
        dims: [40, 30, 30],
      },
    ],
  },
  {
    id: '123456',
    customer: 'Tecno Núñez',
    destination: { lat: -34.5444, lng: -58.4621, address: 'Av. del Libertador 7600, Núñez, CABA' },
    status: 'in_transit',
    priority: 'medium',
    assignment: ['drv-3', 'veh-4'],
    eta: [0, 16, 30],
    packages: [
      {
        description: 'Notebooks',
        quantity: 4,
        weightKg: 3,
        unitValue: 1250000,
        dims: [45, 35, 10],
      },
      { description: 'Monitores', quantity: 4, weightKg: 6, unitValue: 320000, dims: [70, 20, 50] },
    ],
  },
  {
    id: '123457',
    customer: 'Vivero Quilmes',
    destination: { lat: -34.7206, lng: -58.2546, address: 'Rivadavia 300, Quilmes, Buenos Aires' },
    status: 'pending',
    priority: 'low',
    eta: [4, 10],
    packages: [
      { description: 'Macetas', quantity: 12, weightKg: 5, unitValue: 9000, dims: [35, 35, 30] },
    ],
  },
  {
    id: '123458',
    customer: 'Clínica Barracas',
    destination: { lat: -34.6447, lng: -58.3832, address: 'Av. Montes de Oca 900, Barracas, CABA' },
    status: 'assigned',
    priority: 'high',
    assignment: ['drv-1', 'veh-2'],
    eta: [0, 15],
    packages: [
      {
        description: 'Insumos médicos',
        quantity: 10,
        weightKg: 7,
        unitValue: 76000,
        dims: [40, 40, 30],
      },
    ],
  },
  {
    id: '123459',
    customer: 'Bazar Morón',
    destination: {
      lat: -34.6534,
      lng: -58.6198,
      address: 'Av. Rivadavia 18000, Morón, Buenos Aires',
    },
    status: 'pending',
    priority: 'medium',
    eta: [2, 14],
    packages: [
      { description: 'Vajilla', quantity: 6, weightKg: 9, unitValue: 27000, dims: [45, 35, 30] },
    ],
  },
  {
    id: '123460',
    customer: 'Deportes San Isidro',
    destination: {
      lat: -34.4708,
      lng: -58.5136,
      address: 'Av. Centenario 500, San Isidro, Buenos Aires',
    },
    status: 'delivered',
    priority: 'medium',
    assignment: ['drv-4', 'veh-3'],
    eta: [-1, 12],
    packages: [
      {
        description: 'Bicicleta',
        quantity: 1,
        weightKg: 15,
        unitValue: 540000,
        dims: [150, 25, 80],
      },
    ],
  },
  {
    id: '123461',
    customer: 'Panadería Almagro',
    destination: { lat: -34.6104, lng: -58.4207, address: 'Av. Medrano 400, Almagro, CABA' },
    status: 'in_transit',
    priority: 'low',
    assignment: ['drv-5', 'veh-1'],
    eta: [0, 18],
    packages: [
      { description: 'Harina', quantity: 1, weightKg: 25, unitValue: 15000, dims: [60, 40, 15] },
    ],
  },
  {
    id: '123462',
    customer: 'Estudio Puerto Madero',
    destination: { lat: -34.6118, lng: -58.3624, address: 'Juana Manso 1000, Puerto Madero, CABA' },
    status: 'pending',
    priority: 'high',
    eta: [1, 9],
    packages: [
      {
        description: 'Documentación',
        quantity: 2,
        weightKg: 2,
        unitValue: 5000,
        dims: [35, 25, 10],
      },
    ],
  },
  {
    id: '123463',
    customer: 'Colchones Tigre',
    destination: { lat: -34.4262, lng: -58.5796, address: 'Av. Cazón 1200, Tigre, Buenos Aires' },
    status: 'assigned',
    priority: 'low',
    assignment: ['drv-3', 'veh-5'],
    eta: [3, 11],
    packages: [
      {
        description: 'Colchón 2 plazas',
        quantity: 3,
        weightKg: 35,
        unitValue: 390000,
        dims: [190, 140, 25],
      },
    ],
  },
  {
    id: '123464',
    customer: 'Mercado Mataderos',
    destination: {
      lat: -34.6582,
      lng: -58.5025,
      address: 'Av. Lisandro de la Torre 2300, Mataderos, CABA',
    },
    status: 'in_transit',
    priority: 'high',
    assignment: ['drv-4', 'veh-4'],
    eta: [0, 12],
    packages: [
      {
        description: 'Frutas y verduras',
        quantity: 15,
        weightKg: 20,
        unitValue: 12000,
        dims: [50, 35, 30],
      },
    ],
  },
]

function buildPackages(shipmentId: string, seeds: readonly PackageSeed[]): ShipmentPackage[] {
  return seeds.map(({ dims: [length, width, height], ...rest }, index) => ({
    ...rest,
    id: `${shipmentId}-${index + 1}`,
    dimensionsCm: { length, width, height },
  }))
}

function buildShipment(seed: ShipmentSeed, baseDate: Date): Shipment {
  const [days, hour, minute] = seed.eta
  const [driverId, vehicleId] = seed.assignment ?? []
  return {
    id: seed.id,
    trackingCode: `D999-22349${seed.id.slice(-5)}`,
    customer: seed.customer,
    destination: seed.destination,
    status: seed.status,
    priority: seed.priority,
    ...(driverId && vehicleId ? { driverId, vehicleId } : {}),
    estimatedDelivery: isoAtDayOffset(baseDate, days, hour, minute),
    packages: buildPackages(seed.id, seed.packages),
  }
}

/** Genera el dataset con fechas relativas a `baseDate`, para que siempre haya envíos del día. */
export function createMockShipments(baseDate: Date = new Date()): Shipment[] {
  return SEEDS.map((seed) => buildShipment(seed, baseDate))
}
