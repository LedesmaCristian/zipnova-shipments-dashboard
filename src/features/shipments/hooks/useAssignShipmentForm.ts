import { useForm } from 'react-hook-form'
import { useAppSelector } from '@/app/hooks'
import { selectVehicleEntities } from '@/features/vehicles/selectors'
import { formatWeight } from '@/lib/format'
import type { AssignmentPayload, ShipmentDetails } from '../types'
import { fitsVehicleCapacity } from '../utils/shipmentRules'

interface AssignmentForm {
  driverId: string
  vehicleId: string
}

/** Formulario de asignación (React Hook Form): campos requeridos y capacidad del vehículo. */
export function useAssignShipmentForm(
  { shipment, metrics }: ShipmentDetails,
  onSubmit: (assignment: AssignmentPayload) => void,
) {
  const vehicles = useAppSelector(selectVehicleEntities)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentForm>({
    defaultValues: { driverId: shipment.driverId ?? '', vehicleId: shipment.vehicleId ?? '' },
  })

  const validateCapacity = (vehicleId: string) => {
    const vehicle = vehicles[vehicleId]
    if (!vehicle || fitsVehicleCapacity(metrics.totalWeightKg, vehicle)) return true
    return `El envío pesa ${formatWeight(metrics.totalWeightKg)} y el vehículo soporta ${formatWeight(vehicle.capacityKg)}.`
  }

  return {
    errors,
    driverField: register('driverId', { required: 'Elegí un conductor' }),
    vehicleField: register('vehicleId', {
      required: 'Elegí un vehículo',
      validate: validateCapacity,
    }),
    submit: handleSubmit(({ driverId, vehicleId }) =>
      onSubmit({ shipmentId: shipment.id, driverId, vehicleId }),
    ),
  }
}
