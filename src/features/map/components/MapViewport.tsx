import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useAppSelector } from '@/app/hooks'
import { selectLocateRequest } from '@/features/shipments/selectors'
import { selectFocusedDestination, selectVisibleBounds } from '../selectors'
import { FOCUS_ZOOM } from '../utils/mapView'

const FIT_PADDING: [number, number] = [48, 48]

/**
 * Mueve el mapa solo cuando hace falta: los selectores devuelven la misma referencia mientras
 * el valor no cambie, así una acción sobre un envío no pisa el zoom del operador.
 */
export function MapViewport() {
  const map = useMap()
  const destination = useAppSelector(selectFocusedDestination)
  const bounds = useAppSelector(selectVisibleBounds)
  const locateRequest = useAppSelector(selectLocateRequest)
  const hasFocus = destination !== null

  // Envío seleccionado (o "Ubicar" otra vez, aunque ya lo estuviera): volar hasta él.
  // `locateRequest` no se lee: es el disparador de "Ubicar" sobre el envío ya seleccionado.
  useEffect(() => {
    if (!destination) return
    map.flyTo([destination.lat, destination.lng], Math.max(map.getZoom(), FOCUS_ZOOM))
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [map, destination, locateRequest])

  // Sin selección: encuadrar los visibles. Con selección, filtrar no saca al operador del envío.
  useEffect(() => {
    if (!hasFocus && bounds) map.fitBounds(bounds, { padding: FIT_PADDING })
  }, [map, bounds, hasFocus])

  return null
}
