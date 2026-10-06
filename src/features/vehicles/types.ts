type VehicleType = 'motorcycle' | 'van' | 'truck'

export interface Vehicle {
  id: string
  plate: string
  model: string
  type: VehicleType
  capacityKg: number
}
