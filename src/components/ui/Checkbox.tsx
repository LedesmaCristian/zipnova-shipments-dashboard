import { cn } from '@/lib/cn'
import { CheckIcon } from './CheckIcon'

interface CheckboxProps {
  checked: boolean
  /** Fuerza la visibilidad del checkbox vacío (fila activa por teclado). */
  isHighlighted?: boolean
}

/**
 * Checkbox visual del kit. El vacío solo aparece al pasar el mouse por la fila
 * (`group`), como en el diseño. La semántica la aporta la fila (`role="option"`).
 */
export function Checkbox({ checked, isHighlighted = false }: CheckboxProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded-s border border-border transition-opacity',
        checked ? 'bg-brand' : 'bg-bg-accent opacity-0 group-hover:opacity-100',
        isHighlighted && 'opacity-100',
      )}
    >
      {checked && <CheckIcon />}
    </span>
  )
}
