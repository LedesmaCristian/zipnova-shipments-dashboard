# Shipments dashboard (Zipnova challenge)

Herramienta para que un operador logístico vea los envíos en operación: listado, mapa, filtros, detalle y acciones. Enunciado en `../Frontend_developer_challenge.md`.

## Stack

Vite 8 · React 19 · TypeScript 6 (strict, `noUncheckedIndexedAccess`) · Tailwind 4 · Redux Toolkit 2 · React Hook Form 7 · react-leaflet 5 (OpenStreetMap) · Vitest 5 + Testing Library · oxlint · Prettier · pnpm.

## Comandos

- `pnpm dev`: servidor de desarrollo.
- `pnpm check`: lint, chequeo de formato, typecheck, knip (normal y `--production`, que detecta código usado solo por tests) y tests con coverage. Es lo mismo que corre la CI.
- `pnpm test`: Vitest en modo watch.
- `pnpm lint:fix` / `pnpm format`: autofix.

## Calidad

- Husky: `pre-commit` corre lint-staged (oxlint, Prettier y los tests relacionados), `commit-msg` corre commitlint con Conventional Commits y `pre-push` corre typecheck y tests.
- Coverage mínimo del 80% (`vite.config.ts`); el comando `coverage` falla si se baja de ahí.
- `pnpm lint` corre con `--deny-warnings`: un warning hace fallar el lint.

## Estructura

```text
src/
  app/            store (makeStore, createMockState) y hooks tipados. Nada de dominio.
  components/ui/  kit sin conocimiento del dominio: IconButton, Button, Dialog, MultiSelect (+ useMultiSelect),
                  DatePicker, FilterButton, Menu, Checkbox, Chip, Toast, ErrorBoundary
  assets/icons/   SVG descargados del Figma (no redibujar ni reemplazar)
  hooks/          hooks genéricos (useClickOutside, useTransientMessage)
  features/<x>/   types, constants, slice, selectors, utils puras, hooks (lógica) y components
    shipments/    máquina de estados, reglas, acciones (useShipmentActions), card y listado
    filters/      applyFilters, useFiltersForm (RHF → Redux), panel y submenús
    map/          selectores de viewport, marcadores, leyenda (react-leaflet, carga lazy)
    drivers/ vehicles/  catálogos de solo lectura + selectores de opciones
  mocks/          20 envíos (AMBA, fechas relativas a hoy), 5 conductores, 5 vehículos
  lib/            cn, format (es-AR), date, text, equality, themeColors
  test/           setup y factories (buildShipment, buildPackage)
```

## Patrones y decisiones

- **El dominio es puro y está testeado.** Las reglas de negocio viven en `features/shipments/utils/shipmentRules.ts`. Los componentes no deciden si una acción es válida: usan esas reglas.
- **Los reducers validan.** Una acción inválida (una transición fuera de `STATUS_TRANSITIONS`, o asignar un envío en tránsito) se descarta y el estado no cambia.
- **La capacidad del vehículo se valida en el formulario** de asignación (RHF + `fitsVehicleCapacity`), porque el reducer de envíos no tiene acceso a los vehículos.
- **Estado derivado con selectores, por feature.** Lo filtrado, lo ordenado y las métricas se calculan con `createSelector` y no se guardan en el store. Si un selector puede devolver el mismo contenido con otra referencia, lleva `resultEqualityCheck` (`lib/equality`): así no re-renderiza nada.
- **Lógica en hooks, UI en componentes.** Los componentes de `features` conectan store y hooks (`useShipmentActions`, `useFiltersForm`, `useAssignShipmentForm`) con componentes presentacionales (`ShipmentCard`) y del kit. `components/ui` nunca importa de `features` ni de `app`.
- **Items conectados y memoizados.** `ShipmentListItem` y `ShipmentMarker` reciben solo el id y se suscriben a su envío y a un booleano de selección: seleccionar re-renderiza 2 items, no 20.
- **`makeStore(preloadedState)`** permite crear un store aislado en cada test. Para tener fechas estables, usar `createMockState(fechaFija)`.
- **Inmutabilidad.** Usar `toSorted` y spreads. Dentro de los reducers se puede mutar el draft, porque Immer devuelve un estado nuevo.
- **Filtros:** React Hook Form es dueño de los inputs y, con `subscribe`, empuja cada cambio a Redux (`filtersReplaced`). `reset` también notifica, así que "Limpiar filtros" es un solo dispatch. El listado y el mapa leen de Redux.
- **Selección = card expandida = foco del mapa.** `shipments.selectedId` sincroniza el listado y el mapa.
- **Acciones:** `getShipmentActions()` deriva de la máquina de estados qué botones mostrar. La asignación tiene su propio formulario (RHF) con validación de capacidad. La cancelación pide confirmación. Los diálogos usan `<dialog>` nativo; los tests polyfillean `showModal` en `src/test/setup.ts`.
- **Sin código muerto.** knip corre en el check y en la CI. No silenciar sus hallazgos: borrar el código o dejar de exportarlo.
- **Textos de UI en español rioplatense.** Los nombres de código y los tests van en inglés.

## Diseño

UI Kit en Figma (copia editable): <https://www.figma.com/design/AIj41T74qhJSy8oYwexACp/Challenge-UI--Copy-?node-id=6-1276>
Los tokens (colores, tipografía, radios) están en `src/index.css` con los nombres del kit. Los colores que necesita Leaflet (atributos SVG, sin `var()`) se espejan en `lib/themeColors.ts` y un test verifica que coincidan. El foco de teclado usa la utilidad `focus-ring`. Los tokens se escriben así: `bg-surface-02`, `text-small`, `rounded-xl`. Si sumás un token de tamaño de texto, radio o sombra, registralo también en `lib/cn.ts`: si no, tailwind-merge lo descarta. Tampoco repitas nombres entre namespaces: `--text-input` y `--color-input` generaban la misma clase `text-input` y Tailwind la resolvía como color. Por eso el tamaño de los inputs se llama `text-field`.
Tiene tema oscuro y tres componentes: multi-select con búsqueda (incluye "Select all"), filtro con submenús (dirección y date picker) y card de envío colapsable.
