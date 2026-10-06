import { useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { SelectField } from '@/components/ui/SelectField'
import { selectDriverOptions } from '@/features/drivers/selectors'
import { selectVehicleOptions } from '@/features/vehicles/selectors'
import { formatWeight } from '@/lib/format'
import { useAssignShipmentForm } from '../hooks/useAssignShipmentForm'
import type { AssignmentPayload, ShipmentDetails } from '../types'

interface AssignShipmentDialogProps {
  details: ShipmentDetails
  onClose: () => void
  onAssign: (assignment: AssignmentPayload) => void
}

/** Asignación de conductor y vehículo. La validación vive en `useAssignShipmentForm`. */
export function AssignShipmentDialog({ details, onClose, onAssign }: AssignShipmentDialogProps) {
  const driverOptions = useAppSelector(selectDriverOptions)
  const vehicleOptions = useAppSelector(selectVehicleOptions)
  const { errors, driverField, vehicleField, submit } = useAssignShipmentForm(
    details,
    (assignment) => {
      onAssign(assignment)
      onClose()
    },
  )
  const { shipment, metrics } = details
  const verb = shipment.driverId ? 'Reasignar' : 'Asignar'

  return (
    <Dialog
      onClose={onClose}
      title={`${verb} entrega ${shipment.id}`}
      description={`${shipment.customer} · ${formatWeight(metrics.totalWeightKg)} en total`}
    >
      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <SelectField
          label="Conductor"
          placeholder="Elegí un conductor"
          options={driverOptions}
          error={errors.driverId?.message}
          {...driverField}
        />
        <SelectField
          label="Vehículo"
          placeholder="Elegí un vehículo"
          hint="Se muestra la capacidad máxima de cada vehículo."
          options={vehicleOptions}
          error={errors.vehicleId?.message}
          {...vehicleField}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Volver</Button>
          <Button type="submit" variant="primary">
            {verb}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
