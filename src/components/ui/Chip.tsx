import clearIcon from '@/assets/icons/x.svg'
import { IconButton } from './IconButton'

interface ChipProps {
  label: string
  onRemove: () => void
}

/** Filtro aplicado que se puede quitar con un click. */
export function Chip({ label, onRemove }: ChipProps) {
  return (
    <span className="flex max-w-full items-center gap-1 rounded-4xl border border-border bg-input py-1 pr-1 pl-3 text-tiny">
      <span className="truncate">{label}</span>
      <IconButton
        icon={clearIcon}
        iconSize={12}
        label={`Quitar filtro: ${label}`}
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-row-hover"
      />
    </span>
  )
}
