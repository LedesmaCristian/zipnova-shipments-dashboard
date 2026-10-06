/*
 * Patrón "combobox + listbox" de WAI-ARIA APG: el foco queda en el input y el teclado
 * se maneja ahí con `aria-activedescendant`, por eso las opciones (`li`) no tienen
 * handlers de teclado propios. Un `<select>` nativo no admite el diseño del kit.
 */
/* oxlint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/click-events-have-key-events */
import { useEffect, useId, useRef } from 'react'
import chevronDownIcon from '@/assets/icons/chevron-down.svg'
import chevronUpIcon from '@/assets/icons/chevron-up.svg'
import clearIcon from '@/assets/icons/x.svg'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/cn'
import { Checkbox } from '../Checkbox'
import { IconButton } from '../IconButton'
import {
  getSelectionSummary,
  SELECT_ALL_INDEX,
  useMultiSelect,
  type SelectOption,
} from './useMultiSelect'

const getOptionId = (baseId: string, index: number) => `${baseId}-option-${index}`

const SUBTITLE = 'Seleccioná una o más opciones'

export interface MultiSelectProps<T extends string> {
  label: string
  options: readonly SelectOption<T>[]
  value: readonly T[]
  onChange: (value: T[]) => void
  /** Texto del input cerrado sin selección. Abierto, siempre muestra "Buscar". */
  placeholder?: string
  className?: string
}

/** Selección múltiple con búsqueda del UI Kit (combobox accesible + listbox multiselect). */
export function MultiSelect<T extends string>({
  label,
  options,
  value,
  onChange,
  placeholder = 'Buscar',
  className,
}: MultiSelectProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const baseId = useId()
  const listboxId = `${baseId}-listbox`
  const optionId = (index: number) => getOptionId(baseId, index)

  const select = useMultiSelect({ options, value, onChange })
  const { isOpen, query, activeIndex, filteredOptions, selected } = select

  useClickOutside(containerRef, select.close, isOpen)

  // Con navegación por teclado, la opción activa siempre queda a la vista.
  useEffect(() => {
    if (activeIndex < 0) return
    document
      .getElementById(getOptionId(baseId, activeIndex))
      ?.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex, baseId])

  const summary = getSelectionSummary(options, value)

  const toggleOpen = () => {
    if (isOpen) select.close()
    else {
      select.open()
      inputRef.current?.focus()
    }
  }

  return (
    <div ref={containerRef} className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={`${baseId}-input`} className="text-small">
        {label}
      </label>

      <div className="relative">
        <div
          className={cn(
            'flex items-center gap-3 border border-border bg-input px-4 py-2',
            isOpen ? 'rounded-t-xl' : 'rounded-4xl',
          )}
        >
          <input
            ref={inputRef}
            id={`${baseId}-input`}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={isOpen ? listboxId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            autoComplete="off"
            value={isOpen ? query : summary}
            placeholder={isOpen ? 'Buscar' : placeholder}
            onClick={select.open}
            onChange={(event) => select.updateQuery(event.target.value)}
            onKeyDown={select.handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-field font-normal text-text-primary outline-none placeholder:text-placeholder"
          />
          {isOpen && query && (
            <IconButton
              icon={clearIcon}
              iconSize={16}
              label="Limpiar búsqueda"
              onClick={() => {
                select.updateQuery('')
                inputRef.current?.focus()
              }}
            />
          )}
          {/* Fuera del orden de tabulación: con teclado se abre desde el input (flecha abajo). */}
          <IconButton
            icon={isOpen ? chevronUpIcon : chevronDownIcon}
            iconSize={16}
            label={isOpen ? 'Cerrar opciones' : 'Abrir opciones'}
            tabIndex={-1}
            onClick={toggleOpen}
          />
        </div>

        {isOpen && (
          <div className="absolute inset-x-0 top-full z-20 rounded-b-xl border border-t-0 border-border bg-input shadow-popover">
            <ul
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
              aria-label={label}
              className="max-h-[234px] overflow-y-auto"
            >
              {filteredOptions.length === 0 ? (
                <li role="presentation" className="px-4 py-3 text-center text-small">
                  Sin opciones
                </li>
              ) : (
                <>
                  <OptionRow
                    id={optionId(SELECT_ALL_INDEX)}
                    label="Seleccionar todo"
                    isChecked={select.isAllSelected}
                    isActive={activeIndex === SELECT_ALL_INDEX}
                    onSelect={() => select.activateItem(SELECT_ALL_INDEX)}
                    onHover={() => select.setActiveIndex(SELECT_ALL_INDEX)}
                    className="m-1 rounded-m"
                  />
                  <li role="presentation" className="border-t border-border" />
                  <li role="presentation" className="px-2 py-1 text-tiny text-text-secondary">
                    {SUBTITLE}
                  </li>
                  <li role="presentation" className="p-1 pr-2">
                    <ul role="group" aria-label={SUBTITLE}>
                      {filteredOptions.map((option, index) => (
                        <OptionRow
                          key={option.value}
                          id={optionId(index + 1)}
                          label={option.label}
                          isChecked={selected.has(option.value)}
                          isActive={activeIndex === index + 1}
                          onSelect={() => select.activateItem(index + 1)}
                          onHover={() => select.setActiveIndex(index + 1)}
                        />
                      ))}
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

interface OptionRowProps {
  id: string
  label: string
  isChecked: boolean
  isActive: boolean
  onSelect: () => void
  onHover: () => void
  className?: string
}

function OptionRow({
  id,
  label,
  isChecked,
  isActive,
  onSelect,
  onHover,
  className,
}: OptionRowProps) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={isChecked}
      // mousedown evita que el input pierda el foco al hacer click en una opción
      onMouseDown={(event) => event.preventDefault()}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        'group flex cursor-pointer items-center gap-2 rounded-l p-2 text-small hover:bg-row-hover',
        isActive && 'bg-row-hover',
        className,
      )}
    >
      <Checkbox checked={isChecked} isHighlighted={isActive} />
      {label}
    </li>
  )
}
