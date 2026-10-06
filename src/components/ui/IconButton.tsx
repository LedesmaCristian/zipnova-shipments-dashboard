import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: string
  /** Nombre accesible y tooltip: el botón no tiene texto visible. */
  label: string
  iconSize: number
  iconClassName?: string
}

/** Botón de solo ícono del kit (ubicar, expandir, cerrar, quitar filtro, cambiar de mes). */
export function IconButton({
  icon,
  label,
  iconSize,
  iconClassName,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn('shrink-0 rounded-s focus-ring', className)}
      {...props}
    >
      <img src={icon} alt="" width={iconSize} height={iconSize} className={iconClassName} />
    </button>
  )
}
