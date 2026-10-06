import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'
import chevronRightIcon from '@/assets/icons/chevron-right.svg'
import { cn } from '@/lib/cn'

/** Superficie flotante de menús y submenús del kit. */
export function MenuSurface({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-l border border-border bg-input shadow-popover', className)}
      {...props}
    />
  )
}

interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  label: string
  /** Submenú abierto o ítem con foco/hover. */
  isActive?: boolean
}

/** Ítem de menú con ícono y chevron que abre un submenú (Dirección, Fecha). */
export function MenuItem({ icon, label, isActive = false, className, ...props }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-expanded={isActive}
      className={cn(
        'flex w-full items-center justify-between rounded-m p-2 text-left',
        'transition-colors hover:bg-row-hover focus-visible:bg-row-hover focus-visible:outline-none',
        isActive && 'bg-row-hover',
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-2 text-small text-text-secondary">
        <img src={icon} alt="" width={14} height={14} />
        {label}
      </span>
      <img src={chevronRightIcon} alt="" width={12} height={12} />
    </button>
  )
}
