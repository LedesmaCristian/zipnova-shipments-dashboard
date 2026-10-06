import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'
import { createTextMatcher } from '@/lib/text'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

interface UseMultiSelectParams<T extends string> {
  options: readonly SelectOption<T>[]
  value: readonly T[]
  onChange: (value: T[]) => void
}

/** Índice 0 = "Seleccionar todo"; las opciones filtradas arrancan en 1. */
export const SELECT_ALL_INDEX = 0

const MAX_LABELS_IN_SUMMARY = 2

/** Texto del input cerrado: hasta 2 etiquetas, o la cantidad seleccionada. */
export function getSelectionSummary<T extends string>(
  options: readonly SelectOption<T>[],
  value: readonly T[],
): string {
  if (value.length > MAX_LABELS_IN_SUMMARY) return `${value.length} seleccionados`
  return options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)
    .join(', ')
}

export function useMultiSelect<T extends string>({
  options,
  value,
  onChange,
}: UseMultiSelectParams<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  const filteredOptions = useMemo(() => {
    const matches = createTextMatcher(query)
    return options.filter((option) => matches([option.label]))
  }, [options, query])
  const selected = useMemo(() => new Set(value), [value])
  const isAllSelected =
    filteredOptions.length > 0 && filteredOptions.every((option) => selected.has(option.value))
  const itemCount = filteredOptions.length > 0 ? filteredOptions.length + 1 : 0

  /** Emite la selección respetando el orden de `options`. */
  const emit = (next: ReadonlySet<T>) =>
    onChange(options.filter((option) => next.has(option.value)).map((option) => option.value))

  const toggleOption = (optionValue: T) => {
    const next = new Set(selected)
    if (next.has(optionValue)) next.delete(optionValue)
    else next.add(optionValue)
    emit(next)
  }

  /** "Seleccionar todo" actúa solo sobre las opciones visibles (respeta la búsqueda). */
  const toggleAll = () => {
    const next = new Set(selected)
    for (const option of filteredOptions) {
      if (isAllSelected) next.delete(option.value)
      else next.add(option.value)
    }
    emit(next)
  }

  const activateItem = (index: number) => {
    if (index === SELECT_ALL_INDEX) return toggleAll()
    const option = filteredOptions[index - 1]
    if (option) toggleOption(option.value)
  }

  const open = () => setIsOpen(true)

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setActiveIndex(-1)
  }, [])

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery)
    setActiveIndex(-1)
    setIsOpen(true)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setIsOpen(true)
        setActiveIndex((index) => Math.min(index + 1, itemCount - 1))
        break
      case 'ArrowUp':
        if (!isOpen || itemCount === 0) break
        event.preventDefault()
        setActiveIndex((index) => Math.max(index - 1, 0))
        break
      case 'Enter':
        if (isOpen && activeIndex >= 0) {
          event.preventDefault()
          activateItem(activeIndex)
        }
        break
      case 'Escape':
      case 'Tab':
        close()
        break
    }
  }

  return {
    isOpen,
    query,
    activeIndex,
    filteredOptions,
    selected,
    isAllSelected,
    open,
    close,
    updateQuery,
    activateItem,
    setActiveIndex,
    handleKeyDown,
  }
}
