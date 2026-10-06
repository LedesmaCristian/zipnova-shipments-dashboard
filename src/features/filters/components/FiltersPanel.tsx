import { Controller, useWatch } from 'react-hook-form'
import { useAppSelector } from '@/app/hooks'
import { Chip } from '@/components/ui/Chip'
import { MultiSelect } from '@/components/ui/multi-select/MultiSelect'
import { SearchInput } from '@/components/ui/SearchInput'
import { selectDriverOptions } from '@/features/drivers/selectors'
import {
  PRIORITY_LABELS,
  SHIPMENT_PRIORITIES,
  SHIPMENT_STATUSES,
  STATUS_LABELS,
} from '@/features/shipments/constants'
import { formatDate } from '@/lib/format'
import { useFiltersForm } from '../hooks/useFiltersForm'
import { selectActiveFiltersCount } from '../selectors'
import { FilterMenu } from './FilterMenu'

const STATUS_OPTIONS = SHIPMENT_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }))
const PRIORITY_OPTIONS = SHIPMENT_PRIORITIES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}))

/** Panel de búsqueda y filtros. La sincronización con el store vive en `useFiltersForm`. */
export function FiltersPanel() {
  const { control, register, setValue, clearAll } = useFiltersForm()
  const activeCount = useAppSelector(selectActiveFiltersCount)
  const driverOptions = useAppSelector(selectDriverOptions)
  const [address, deliveryDate] = useWatch({ control, name: ['address', 'deliveryDate'] })

  return (
    <form
      aria-label="Filtros de envíos"
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <SearchInput
          aria-label="Buscar por número de envío o cliente"
          placeholder="Buscar envío o cliente"
          containerClassName="flex-1"
          {...register('search')}
        />
        <FilterMenu
          selectedDate={deliveryDate}
          hasActiveFilters={Boolean(address) || deliveryDate !== null}
          onAddressSelect={(value) => setValue('address', value)}
          onDateSelect={(date) => setValue('deliveryDate', date)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="statuses"
          render={({ field }) => (
            <MultiSelect
              label="Estado"
              options={STATUS_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              placeholder="Todos"
            />
          )}
        />
        <Controller
          control={control}
          name="priorities"
          render={({ field }) => (
            <MultiSelect
              label="Prioridad"
              options={PRIORITY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              placeholder="Todos"
            />
          )}
        />
        <Controller
          control={control}
          name="driverIds"
          render={({ field }) => (
            <MultiSelect
              className="col-span-2"
              label="Conductor"
              options={driverOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder="Todos"
            />
          )}
        />
      </div>

      {(address || deliveryDate || activeCount > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {address && (
            <Chip label={`Dirección: ${address}`} onRemove={() => setValue('address', '')} />
          )}
          {deliveryDate && (
            <Chip
              label={`Fecha: ${formatDate(deliveryDate)}`}
              onRemove={() => setValue('deliveryDate', null)}
            />
          )}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto text-tiny text-brand underline-offset-2 focus-ring hover:underline"
            >
              Limpiar filtros ({activeCount})
            </button>
          )}
        </div>
      )}
    </form>
  )
}
