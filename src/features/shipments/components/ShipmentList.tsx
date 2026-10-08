import { useAppSelector } from '@/app/hooks'
import { Toast } from '@/components/ui/Toast'
import { useShipmentActions } from '../hooks/useShipmentActions'
import { selectVisibleShipments, selectVisibleStats } from '../selectors'
import { ShipmentDialog } from './ShipmentDialog'
import { ShipmentListItem } from './ShipmentListItem'

export function ShipmentList() {
  const shipments = useAppSelector(selectVisibleShipments)
  const stats = useAppSelector(selectVisibleStats)
  const { dialog, feedback, runAction, openAssignDialog, closeDialog, assign, confirmCancel } =
    useShipmentActions()

  return (
    <section aria-labelledby="shipments-heading" className="flex min-h-0 flex-1 flex-col gap-3">
      <header className="flex items-baseline justify-between gap-2">
        <h2 id="shipments-heading" className="text-small font-semibold">
          {stats.total} {stats.total === 1 ? 'envío' : 'envíos'}
        </h2>
        <p className="text-tiny text-text-secondary">
          {stats.pending} pendientes · {stats.highPriority} con prioridad alta
        </p>
      </header>

      {shipments.length === 0 ? (
        <p className="rounded-m border border-dashed border-border p-6 text-center text-small text-text-secondary">
          No hay envíos que coincidan con los filtros.
        </p>
      ) : (
        <ul className="-mr-2 flex min-h-0 flex-col gap-2 overflow-y-auto pr-2">
          {shipments.map((shipment) => (
            <ShipmentListItem
              key={shipment.id}
              shipmentId={shipment.id}
              onAction={runAction}
              onAssign={openAssignDialog}
            />
          ))}
        </ul>
      )}

      {dialog && (
        <ShipmentDialog
          dialog={dialog}
          onClose={closeDialog}
          onAssign={assign}
          onConfirmCancel={confirmCancel}
        />
      )}
      <Toast message={feedback} />
    </section>
  )
}
