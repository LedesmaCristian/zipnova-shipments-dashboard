import { memo, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectIsShipmentSelected, selectShipmentDetails } from '../selectors'
import { shipmentLocated, shipmentSelected } from '../shipmentsSlice'
import { getShipmentActions, type ShipmentAction } from '../utils/shipmentActions'
import { canAssign } from '../utils/shipmentRules'
import { ShipmentCard } from './ShipmentCard'

interface ShipmentListItemProps {
  shipmentId: string
  onAction: (shipmentId: string, action: ShipmentAction) => void
  onAssign: (shipmentId: string) => void
}

/**
 * Conecta una card con el store. Memoizado y suscripto a un booleano de selección:
 * cambiar la selección re-renderiza solo los 2 items afectados.
 */
export const ShipmentListItem = memo(function ShipmentListItem({
  shipmentId,
  onAction,
  onAssign,
}: ShipmentListItemProps) {
  const dispatch = useAppDispatch()
  const details = useAppSelector((state) => selectShipmentDetails(state, shipmentId))
  const isSelected = useAppSelector((state) => selectIsShipmentSelected(state, shipmentId))
  const itemRef = useRef<HTMLLIElement>(null)
  const wasSelected = useRef(isSelected)

  // Al seleccionarse (ej. desde el mapa) la card se trae a la vista. Solo en la transición:
  // si reaparece ya seleccionada al cambiar un filtro, no mueve el scroll.
  useEffect(() => {
    if (isSelected && !wasSelected.current) {
      itemRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
    }
    wasSelected.current = isSelected
  }, [isSelected])

  if (!details) return null

  return (
    <li ref={itemRef}>
      <ShipmentCard
        details={details}
        isExpanded={isSelected}
        onToggle={() => dispatch(shipmentSelected(isSelected ? null : shipmentId))}
        onLocate={() => dispatch(shipmentLocated(shipmentId))}
        onAssign={canAssign(details.shipment) ? () => onAssign(shipmentId) : undefined}
        actions={getShipmentActions(details.shipment)}
        onAction={(action) => onAction(shipmentId, action)}
      />
    </li>
  )
})
