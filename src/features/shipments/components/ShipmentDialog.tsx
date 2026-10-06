import { useAppSelector } from '@/app/hooks'
import type { OpenDialog } from '../hooks/useShipmentActions'
import { selectShipmentDetails } from '../selectors'
import type { AssignmentPayload } from '../types'
import { AssignShipmentDialog } from './AssignShipmentDialog'
import { CancelShipmentDialog } from './CancelShipmentDialog'

interface ShipmentDialogProps {
  dialog: OpenDialog
  onClose: () => void
  onAssign: (assignment: AssignmentPayload) => void
  onConfirmCancel: (shipmentId: string) => void
}

/** Resuelve el envío del diálogo abierto y muestra el que corresponde. */
export function ShipmentDialog({
  dialog,
  onClose,
  onAssign,
  onConfirmCancel,
}: ShipmentDialogProps) {
  const details = useAppSelector((state) => selectShipmentDetails(state, dialog.shipmentId))
  if (!details) return null

  return dialog.kind === 'assign' ? (
    <AssignShipmentDialog details={details} onClose={onClose} onAssign={onAssign} />
  ) : (
    <CancelShipmentDialog
      shipment={details.shipment}
      onClose={onClose}
      onConfirm={() => onConfirmCancel(dialog.shipmentId)}
    />
  )
}
