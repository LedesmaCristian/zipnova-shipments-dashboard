import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { useTransientMessage } from '@/hooks/useTransientMessage'
import {
  shipmentAssigned,
  shipmentCancelled,
  shipmentStatusChanged,
  shipmentUnassigned,
} from '../shipmentsSlice'
import type { AssignmentPayload } from '../types'
import { SHIPMENT_FEEDBACK, type ShipmentAction } from '../utils/shipmentActions'

export interface OpenDialog {
  kind: 'assign' | 'cancel'
  shipmentId: string
}

/**
 * Flujo de acciones sobre envíos: despacha al store, abre los diálogos que piden datos o
 * confirmación y arma el mensaje de feedback. Los handlers son estables (items memoizados).
 */
export function useShipmentActions() {
  const dispatch = useAppDispatch()
  const [dialog, setDialog] = useState<OpenDialog | null>(null)
  const [feedback, showFeedback] = useTransientMessage()

  const runAction = useCallback(
    (shipmentId: string, action: ShipmentAction) => {
      switch (action) {
        case 'start':
          dispatch(shipmentStatusChanged({ shipmentId, status: 'in_transit' }))
          break
        case 'deliver':
          dispatch(shipmentStatusChanged({ shipmentId, status: 'delivered' }))
          break
        case 'unassign':
          dispatch(shipmentUnassigned(shipmentId))
          break
        case 'cancel':
          // Es irreversible: primero se confirma.
          return setDialog({ kind: 'cancel', shipmentId })
      }
      showFeedback(SHIPMENT_FEEDBACK[action](shipmentId))
    },
    [dispatch, showFeedback],
  )

  const openAssignDialog = useCallback(
    (shipmentId: string) => setDialog({ kind: 'assign', shipmentId }),
    [],
  )

  const closeDialog = useCallback(() => setDialog(null), [])

  const assign = useCallback(
    (assignment: AssignmentPayload) => {
      dispatch(shipmentAssigned(assignment))
      showFeedback(SHIPMENT_FEEDBACK.assign(assignment.shipmentId))
    },
    [dispatch, showFeedback],
  )

  const confirmCancel = useCallback(
    (shipmentId: string) => {
      dispatch(shipmentCancelled(shipmentId))
      showFeedback(SHIPMENT_FEEDBACK.cancel(shipmentId))
    },
    [dispatch, showFeedback],
  )

  return { dialog, feedback, runAction, openAssignDialog, closeDialog, assign, confirmCancel }
}
