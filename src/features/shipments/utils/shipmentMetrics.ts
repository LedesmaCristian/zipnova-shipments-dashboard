import type { PackageDimensions, ShipmentMetrics, ShipmentPackage } from '../types'

const CM3_PER_M3 = 1_000_000

function getUnitVolumeM3({ length, width, height }: PackageDimensions): number {
  return (length * width * height) / CM3_PER_M3
}

/** Agrega bultos, peso, volumen y valor a partir de los paquetes de un envío. */
export function getShipmentMetrics(packages: readonly ShipmentPackage[]): ShipmentMetrics {
  return packages.reduce<ShipmentMetrics>(
    (metrics, pkg) => ({
      totalPackages: metrics.totalPackages + pkg.quantity,
      totalWeightKg: metrics.totalWeightKg + pkg.quantity * pkg.weightKg,
      totalVolumeM3: metrics.totalVolumeM3 + pkg.quantity * getUnitVolumeM3(pkg.dimensionsCm),
      totalValue: metrics.totalValue + pkg.quantity * pkg.unitValue,
    }),
    { totalPackages: 0, totalWeightKg: 0, totalVolumeM3: 0, totalValue: 0 },
  )
}
