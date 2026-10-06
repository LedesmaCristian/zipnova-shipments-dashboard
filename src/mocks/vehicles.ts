import type { Vehicle } from '@/features/vehicles/types'

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'veh-1', plate: 'AE 123 KD', model: 'Honda CG 150', type: 'motorcycle', capacityKg: 30 },
  { id: 'veh-2', plate: 'AF 456 LM', model: 'Renault Kangoo', type: 'van', capacityKg: 650 },
  { id: 'veh-3', plate: 'AD 789 NP', model: 'Fiat Ducato', type: 'van', capacityKg: 1500 },
  { id: 'veh-4', plate: 'AG 012 QR', model: 'Mercedes Sprinter', type: 'van', capacityKg: 1800 },
  { id: 'veh-5', plate: 'AC 345 ST', model: 'Iveco Daily', type: 'truck', capacityKg: 3500 },
]
