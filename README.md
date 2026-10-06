# Envíos en operación

Dashboard para que un operador logístico siga los envíos del día: listado, mapa, filtros, detalle y acciones, construido sobre el UI Kit de Figma.

![Dashboard](docs/screenshots/dashboard.webp)

## Cómo correrlo

Requiere Node 24 y pnpm 10.

```bash
pnpm install
pnpm dev     # http://localhost:5173
pnpm check   # lint, formato, tipos, código sin usar y tests con coverage
```

No hay backend: el store arranca con datos mock (20 envíos, 5 conductores y 5 vehículos en AMBA), con fechas relativas al día actual.

## Qué hace

- **Listado** ordenado por prioridad y ETA, con un resumen (total, pendientes, prioridad alta). Cada card se expande con métricas, paquetes y asignación.
- **Mapa** sincronizado con el listado: seleccionar en uno selecciona en el otro, "Ubicar" centra el envío y el mapa se reencuadra al filtrar.
- **Búsqueda y filtros** combinables por estado, prioridad, conductor, dirección y fecha, con chips para quitarlos.
- **Acciones** según el estado del envío: asignar conductor y vehículo (valida capacidad), iniciar viaje, marcar entregado, desasignar y cancelar (con confirmación).

## Stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS 4 · Redux Toolkit · React Hook Form · react-leaflet + OpenStreetMap · Vitest + Testing Library.

Calidad: oxlint, Prettier, knip, Husky (lint-staged, Conventional Commits, pre-push) y CI en GitHub Actions.

## Arquitectura

```text
src/
├── app/            store y hooks tipados
├── features/       cada una con slice, selectores, utils puras, hooks y componentes
│   ├── shipments/  máquina de estados, acciones, card y listado
│   ├── filters/    formulario de filtros y submenús
│   ├── map/        mapa, marcadores, leyenda y viewport
│   ├── drivers/    catálogo de conductores
│   └── vehicles/   catálogo de vehículos
├── components/ui/  componentes del kit, sin conocimiento del dominio
├── hooks/          hooks genéricos
├── lib/            utilidades puras (formato, fechas, texto)
└── mocks/          datos iniciales
```

- **Organizada por feature.** `components/ui` no importa nada del dominio y `app/` solo arma el store.
- **Lógica separada de la UI.** La lógica vive en hooks (`useShipmentActions`, `useFiltersForm`, `useAssignShipmentForm`) y en selectores; los componentes presentacionales solo reciben datos y callbacks.
- **Reglas de negocio puras.** Una máquina de estados define qué transiciones son válidas. La UI la usa para decidir qué acciones mostrar, y los reducers la vuelven a validar.
- **Estado derivado con selectores.** Lo filtrado, lo ordenado, las métricas y el resumen se calculan con `createSelector`; el store solo guarda entidades, filtros y selección.
- **Renders mínimos.** Cada card y cada marcador se suscriben solo a su envío: seleccionar uno re-renderiza dos, no veinte. Los selectores devuelven la misma referencia si el resultado no cambió, así que una búsqueda que no cambia el resultado no re-renderiza el listado ni mueve el mapa.
- **React Hook Form** maneja el formulario de filtros (sincronizado con Redux vía `subscribe`, sin re-renderizar) y el de asignación (validación de capacidad).
- **Mapa en carga diferida** (`React.lazy`) y aislado con un error boundary: Leaflet no bloquea el listado y, si falla, el listado sigue funcionando.
- **Design tokens** del kit en `src/index.css` (`@theme`), con los nombres de Figma.

## Diferencias con el UI Kit

- La card suma prioridad, estado y ETA, y en el detalle cliente y dirección: sin eso no se responde de un vistazo qué envío es urgente ni dónde va.
- Textos en español.
- Botones, diálogos y el select del formulario no están en el kit; están hechos con sus tokens.

## Con más tiempo

- Backend o persistencia, y deshacer la última acción.
- Clustering de marcadores y virtualización del listado para volúmenes grandes.
- Tests end-to-end con Playwright.
