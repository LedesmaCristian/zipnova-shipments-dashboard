import {
  PRIORITY_BG_CLASSES,
  PRIORITY_LABELS,
  SHIPMENT_PRIORITIES,
} from '@/features/shipments/constants'
import { cn } from '@/lib/cn'

/** Referencia de colores de los marcadores. */
export function MapLegend() {
  return (
    <section
      aria-label="Referencias del mapa"
      className="absolute bottom-6 left-3 z-[1000] flex flex-col gap-1.5 rounded-m border border-border bg-input/90 px-3 py-2 text-tiny text-text-secondary shadow-popover"
    >
      <p className="font-normal text-text-primary">Prioridad</p>
      <ul className="flex flex-col gap-1">
        {SHIPMENT_PRIORITIES.map((priority) => (
          <li key={priority} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn('size-2 rounded-full', PRIORITY_BG_CLASSES[priority])}
            />
            {PRIORITY_LABELS[priority]}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-brand opacity-35" />
          Entregado o cancelado (atenuado)
        </li>
      </ul>
    </section>
  )
}
