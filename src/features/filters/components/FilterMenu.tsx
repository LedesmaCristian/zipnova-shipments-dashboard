import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import calendarIcon from '@/assets/icons/calendar.svg'
import locateIcon from '@/assets/icons/locate.svg'
import { FilterButton } from '@/components/ui/FilterButton'
import { MenuItem, MenuSurface } from '@/components/ui/Menu'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/cn'
import type { DateKey } from '@/lib/date'
import { AddressSubmenu } from './AddressSubmenu'
import { DeliveryDateSubmenu } from './DeliveryDateSubmenu'

type Submenu = 'address' | 'date'

interface FilterMenuProps {
  selectedDate: DateKey | null
  onAddressSelect: (address: string) => void
  onDateSelect: (date: DateKey) => void
  /** Hay un filtro de dirección o fecha aplicado: el botón queda en estado activo. */
  hasActiveFilters: boolean
}

/** "Filter" del kit: botón que abre un menú con submenús de dirección y fecha. */
export function FilterMenu({
  selectedDate,
  onAddressSelect,
  onDateSelect,
  hasActiveFilters,
}: FilterMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [submenu, setSubmenu] = useState<Submenu | null>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setSubmenu(null)
  }, [])

  useClickOutside(containerRef, close, isOpen)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close()
  }

  return (
    // oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- solo captura Escape de los hijos
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <FilterButton
        aria-label="Más filtros"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        isActive={isOpen || hasActiveFilters}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
      />

      {isOpen && (
        <div className="absolute top-full right-0 z-30 mt-1 flex flex-col items-end md:left-0 md:flex-row md:items-start">
          <MenuSurface role="menu" aria-label="Más filtros" className="w-56 shrink-0 p-1">
            <MenuItem
              icon={locateIcon}
              label="Dirección"
              isActive={submenu === 'address'}
              onClick={() => setSubmenu('address')}
              onMouseEnter={() => setSubmenu('address')}
            />
            <MenuItem
              icon={calendarIcon}
              label="Fecha"
              isActive={submenu === 'date'}
              onClick={() => setSubmenu('date')}
              onMouseEnter={() => setSubmenu('date')}
            />
          </MenuSurface>
          {/* En pantallas angostas el submenú va debajo del menú. Desde md, como en el kit: pegado al menú, a la altura del ítem que lo abrió. */}
          <div className={cn('mt-1 md:mt-0 md:-ml-0.5', submenu === 'date' && 'md:mt-9')}>
            {submenu === 'address' && (
              <AddressSubmenu
                onSelect={(address) => {
                  onAddressSelect(address)
                  close()
                }}
              />
            )}
            {submenu === 'date' && (
              <DeliveryDateSubmenu
                value={selectedDate}
                onSelect={(date) => {
                  onDateSelect(date)
                  close()
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
