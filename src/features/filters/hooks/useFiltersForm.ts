import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppStore } from '@/app/hooks'
import { EMPTY_FILTERS } from '../constants'
import { filtersReplaced } from '../filtersSlice'
import type { ShipmentFilters } from '../types'

/**
 * Puente React Hook Form → Redux. El formulario es dueño de los inputs y empuja cada
 * cambio al store, que es lo que leen el listado y el mapa.
 */
export function useFiltersForm() {
  const dispatch = useAppDispatch()
  const store = useAppStore()
  // Redux solo aporta el valor inicial: leerlo sin suscribirse evita re-renderizar en cada tecla.
  const form = useForm<ShipmentFilters>({ defaultValues: store.getState().filters })
  const { subscribe, reset } = form

  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        // structuredClone: Redux congela su estado y RHF muta sus propios valores.
        callback: ({ values }) => dispatch(filtersReplaced(structuredClone(values))),
      }),
    [subscribe, dispatch],
  )

  // `reset` también notifica a la suscripción: un solo dispatch.
  const clearAll = useCallback(() => reset(EMPTY_FILTERS), [reset])

  return { ...form, clearAll }
}
