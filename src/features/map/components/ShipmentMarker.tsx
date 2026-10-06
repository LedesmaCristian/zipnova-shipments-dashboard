import type { CircleMarker as LeafletCircleMarker } from 'leaflet'
import { memo, useEffect, useMemo, useRef } from 'react'
import { CircleMarker, Tooltip } from 'react-leaflet'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectIsShipmentSelected, selectShipmentDetails } from '@/features/shipments/selectors'
import { shipmentSelected } from '@/features/shipments/shipmentsSlice'
import {
  formatAssignment,
  formatPriorityAndStatus,
} from '@/features/shipments/utils/shipmentLabels'
import { getMarkerStyle, type LatLngTuple } from '../utils/mapView'

/**
 * Marcador conectado al store, como los items del listado: se suscribe a su envío y a un
 * booleano de selección, así un cambio de selección solo re-renderiza los 2 afectados.
 */
export const ShipmentMarker = memo(function ShipmentMarker({ shipmentId }: { shipmentId: string }) {
  const dispatch = useAppDispatch()
  const details = useAppSelector((state) => selectShipmentDetails(state, shipmentId))
  const isSelected = useAppSelector((state) => selectIsShipmentSelected(state, shipmentId))
  const markerRef = useRef<LeafletCircleMarker>(null)

  const shipment = details?.shipment
  const destination = shipment?.destination
  // react-leaflet llama a setStyle/setLatLng cuando cambian estas referencias: las estabilizamos.
  const center = useMemo<LatLngTuple | null>(
    () => (destination ? [destination.lat, destination.lng] : null),
    [destination],
  )
  const style = useMemo(
    () => (shipment ? getMarkerStyle(shipment, isSelected) : null),
    [shipment, isSelected],
  )
  const eventHandlers = useMemo(
    () => ({ click: () => dispatch(shipmentSelected(shipmentId)) }),
    [dispatch, shipmentId],
  )

  // react-leaflet no reordena capas SVG al reordenar hijos: lo subimos explícitamente.
  useEffect(() => {
    if (isSelected) markerRef.current?.bringToFront()
  }, [isSelected])

  if (!details || !center || !style) return null

  return (
    <CircleMarker
      ref={markerRef}
      center={center}
      radius={style.radius}
      pathOptions={style}
      eventHandlers={eventHandlers}
    >
      <Tooltip direction="top" offset={[0, -style.radius]}>
        <strong>Entrega {details.shipment.id}</strong> · {details.shipment.customer}
        <br />
        {formatPriorityAndStatus(details.shipment)}
        <br />
        {formatAssignment(details.driver, details.vehicle)}
      </Tooltip>
    </CircleMarker>
  )
})
