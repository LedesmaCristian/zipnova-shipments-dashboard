import type { ButtonHTMLAttributes } from 'react'
import slidersActiveIcon from '@/assets/icons/sliders-active.svg'
import slidersHoverIcon from '@/assets/icons/sliders-hover.svg'
import slidersIcon from '@/assets/icons/sliders.svg'
import { cn } from '@/lib/cn'

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Menú abierto o filtros aplicados: el ícono pasa al color de marca. */
  isActive?: boolean
}

const ICON_SIZE = 20

/** "Tools button / Filters" del kit: default (gris), hover (blanco) y activo (verde). */
export function FilterButton({ isActive = false, className, ...props }: FilterButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'group flex size-9 items-center justify-center rounded-m border border-border bg-bg-accent p-2',
        'focus-ring transition-colors hover:bg-row-hover',
        className,
      )}
      {...props}
    >
      {isActive ? (
        <img src={slidersActiveIcon} alt="" width={ICON_SIZE} height={ICON_SIZE} />
      ) : (
        <>
          <img
            src={slidersIcon}
            alt=""
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="group-hover:hidden"
          />
          <img
            src={slidersHoverIcon}
            alt=""
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="hidden group-hover:block"
          />
        </>
      )}
    </button>
  )
}
