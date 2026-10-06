import { useAppSelector } from '@/app/hooks'
import { DatePicker } from '@/components/ui/DatePicker'
import { selectDeliveryDateKeys } from '@/features/shipments/selectors'
import type { DateKey } from '@/lib/date'

interface DeliveryDateSubmenuProps {
  value: DateKey | null
  onSelect: (date: DateKey) => void
}

/** Submenú "Fecha": date picker que marca los días con entregas. */
export function DeliveryDateSubmenu({ value, onSelect }: DeliveryDateSubmenuProps) {
  const deliveryDates = useAppSelector(selectDeliveryDateKeys)

  return (
    <DatePicker
      value={value}
      markedDates={deliveryDates}
      className="shadow-popover"
      onChange={onSelect}
    />
  )
}
