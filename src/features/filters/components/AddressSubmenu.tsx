import { useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import { MenuSurface } from '@/components/ui/Menu'
import { SearchInput } from '@/components/ui/SearchInput'
import { selectDestinationAddresses } from '@/features/shipments/selectors'
import { searchAddresses } from '../utils/searchAddresses'

interface AddressSubmenuProps {
  onSelect: (address: string) => void
}

/** Submenú "Dirección": buscador sobre las direcciones de destino. */
export function AddressSubmenu({ onSelect }: AddressSubmenuProps) {
  const addresses = useAppSelector(selectDestinationAddresses)
  const [query, setQuery] = useState('')
  const hasQuery = query.trim() !== ''
  const matches = searchAddresses(addresses, query)

  return (
    <MenuSurface className="w-[254px]">
      <SearchInput
        // oxlint-disable-next-line jsx-a11y/no-autofocus -- el submenú se abre para escribir
        autoFocus
        aria-label="Buscar dirección"
        placeholder="Buscar..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        containerClassName="rounded-none rounded-t-l border-0 border-b"
      />
      <div className="p-1">
        {!hasQuery && (
          <p className="p-2 text-small text-text-secondary">Escribí y seleccioná una dirección</p>
        )}
        {hasQuery && matches.length === 0 && (
          <p className="p-2 text-small text-text-secondary">Sin resultados</p>
        )}
        {matches.length > 0 && (
          <ul aria-label="Direcciones">
            {matches.map((address) => (
              <li key={address}>
                <button
                  type="button"
                  onClick={() => onSelect(address)}
                  className="w-full rounded-m p-2 text-left text-small text-text-secondary hover:bg-row-hover focus-visible:bg-row-hover focus-visible:outline-none"
                >
                  {address}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MenuSurface>
  )
}
