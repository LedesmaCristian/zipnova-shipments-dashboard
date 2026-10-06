import { lazy, Suspense } from 'react'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { FiltersPanel } from '@/features/filters/components/FiltersPanel'
import { ShipmentList } from '@/features/shipments/components/ShipmentList'

// Leaflet es la dependencia más pesada: el mapa va en su propio chunk y no bloquea el listado.
const ShipmentsMap = lazy(() =>
  import('@/features/map/components/ShipmentsMap').then((module) => ({
    default: module.ShipmentsMap,
  })),
)

function App() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-2 border-b border-border bg-bg-accent px-6 py-3">
        <span className="text-regular font-semibold">zipnova</span>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
        <h1 className="text-regular">Envíos en operación</h1>
      </header>

      <main className="grid min-h-0 flex-1 grid-rows-[auto_50vh] md:grid-cols-[420px_1fr] md:grid-rows-1">
        {/* z-index por encima del mapa: el menú de filtros se despliega sobre él */}
        <aside className="relative z-10 flex min-h-0 flex-col gap-4 border-border bg-surface-01 p-4 md:border-r">
          <FiltersPanel />
          <ShipmentList />
        </aside>
        {/* isolate contiene los z-index internos de Leaflet (hasta 1000) */}
        <section aria-label="Mapa" className="isolate min-h-0 bg-surface-01">
          {/* Si el mapa falla (ej. no carga su chunk), el listado sigue funcionando. */}
          <ErrorBoundary fallback={<MapMessage>No se pudo cargar el mapa.</MapMessage>}>
            <Suspense fallback={<MapMessage>Cargando mapa…</MapMessage>}>
              <ShipmentsMap />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </div>
  )
}

function MapMessage({ children }: { children: string }) {
  return (
    <p className="grid size-full place-items-center text-small text-text-secondary">{children}</p>
  )
}

export default App
