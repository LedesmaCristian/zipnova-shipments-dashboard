import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useAppSelector } from '@/app/hooks'
import { selectVisibleShipments } from '@/features/shipments/selectors'
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../utils/mapView'
import { MapLegend } from './MapLegend'
import { MapViewport } from './MapViewport'
import { ShipmentMarker } from './ShipmentMarker'

// Tiles de OpenStreetMap (sin API key). El tema oscuro se aplica con un filtro CSS (index.css).
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

/** Mapa de envíos visibles. Click en un marcador = seleccionar (expande su card en el listado). */
export function ShipmentsMap() {
  const shipments = useAppSelector(selectVisibleShipments)

  return (
    <div className="relative size-full">
      <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} className="size-full">
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        {shipments.map((shipment) => (
          <ShipmentMarker key={shipment.id} shipmentId={shipment.id} />
        ))}
        <MapViewport />
      </MapContainer>
      <MapLegend />
    </div>
  )
}
