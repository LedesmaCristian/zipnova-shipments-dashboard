import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import type { Shipment } from '../types'

interface CancelShipmentDialogProps {
  shipment: Shipment
  onClose: () => void
  onConfirm: () => void
}

/** Confirmación de cancelación: es una transición final, no se puede deshacer. */
export function CancelShipmentDialog({ shipment, onClose, onConfirm }: CancelShipmentDialogProps) {
  return (
    <Dialog
      onClose={onClose}
      title={`¿Cancelar la entrega ${shipment.id}?`}
      description={`${shipment.customer}. Un envío cancelado no se puede reactivar.`}
    >
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Volver</Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          Cancelar envío
        </Button>
      </div>
    </Dialog>
  )
}
