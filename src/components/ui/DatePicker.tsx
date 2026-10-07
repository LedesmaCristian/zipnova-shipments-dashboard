import { useState } from 'react'
import chevronLeftIcon from '@/assets/icons/chevron-left.svg'
import eventDotIcon from '@/assets/icons/event-dot.svg'
import {
  addMonths,
  buildCalendarWeeks,
  getCalendarMonth,
  WEEKDAY_LABELS,
  type CalendarDay,
} from '@/lib/calendar'
import { cn } from '@/lib/cn'
import { fromDateKey, toDateKey, type DateKey } from '@/lib/date'
import { formatDate } from '@/lib/format'
import { IconButton } from './IconButton'

interface DatePickerProps {
  value: DateKey | null
  onChange: (value: DateKey) => void
  /** Días a destacar con un punto (ej. días con entregas). */
  markedDates?: ReadonlySet<DateKey>
  /** Fecha de referencia para "hoy"; inyectable para tests. */
  today?: Date
  className?: string
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Calendario mensual del UI Kit: navegación por mes y selección de un día. */
export function DatePicker({
  value,
  onChange,
  markedDates,
  today: todayProp,
  className,
}: DatePickerProps) {
  // `new Date()` se evalúa una sola vez: el render tiene que ser puro.
  const [fallbackToday] = useState(() => new Date())
  const today = todayProp ?? fallbackToday
  const [visibleMonth, setVisibleMonth] = useState(() =>
    getCalendarMonth(value ? fromDateKey(value) : today),
  )
  const todayKey = toDateKey(today)
  const weeks = buildCalendarWeeks(visibleMonth)
  const selectedDate = value ? fromDateKey(value) : null
  const selectedMonth = selectedDate ? getCalendarMonth(selectedDate) : null
  const isSelectedInView =
    selectedMonth?.year === visibleMonth.year && selectedMonth.month === visibleMonth.month

  // Elegir un día de un mes vecino lleva el calendario a ese mes.
  const handleSelect = (day: CalendarDay) => {
    if (!day.isCurrentMonth) setVisibleMonth(getCalendarMonth(fromDateKey(day.key)))
    onChange(day.key)
  }

  // Encabezado del kit: "DD / MM / AAAA" con el día seleccionado, o "MM / AAAA".
  const headerParts = [
    ...(isSelectedInView && selectedDate ? [pad(selectedDate.getDate())] : []),
    pad(visibleMonth.month + 1),
    String(visibleMonth.year),
  ]

  return (
    <div className={cn('w-73 rounded-l border border-border bg-input p-2', className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-md border border-border bg-surface-01 p-3.5">
          <MonthButton
            direction="previous"
            onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
          />
          <p
            aria-live="polite"
            className="flex gap-2 text-small text-text-secondary"
            aria-label={`Mes visible: ${pad(visibleMonth.month + 1)}/${visibleMonth.year}`}
          >
            {headerParts.map((part, index) => (
              <span key={index} className="flex gap-2">
                {index > 0 && <span aria-hidden="true">/</span>}
                {part}
              </span>
            ))}
          </p>
          <MonthButton direction="next" onClick={() => setVisibleMonth((m) => addMonths(m, 1))} />
        </div>

        {/* Celdas con p-1: 8px entre días como en el kit; -mx-1 compensa el borde exterior. */}
        <table aria-label="Calendario" className="-mx-1 w-[calc(100%+8px)] table-fixed">
          <thead>
            <tr className="border-b border-border">
              {WEEKDAY_LABELS.map((weekday) => (
                <th
                  key={weekday}
                  scope="col"
                  className="h-8 p-1 text-small font-light text-text-secondary"
                >
                  {weekday}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={week[0]?.key} className={cn(index === 0 && '[&>td]:pt-2')}>
                {week.map((day) => (
                  <DayCell
                    key={day.key}
                    day={day}
                    isSelected={day.key === value}
                    isToday={day.key === todayKey}
                    isMarked={markedDates?.has(day.key) ?? false}
                    onSelect={() => handleSelect(day)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MonthButton({
  direction,
  onClick,
}: {
  direction: 'previous' | 'next'
  onClick: () => void
}) {
  return (
    <IconButton
      icon={chevronLeftIcon}
      iconSize={16}
      label={direction === 'previous' ? 'Mes anterior' : 'Mes siguiente'}
      onClick={onClick}
      iconClassName={cn(direction === 'next' && 'rotate-180')}
    />
  )
}

interface DayCellProps {
  day: CalendarDay
  isSelected: boolean
  isToday: boolean
  isMarked: boolean
  onSelect: () => void
}

function DayCell({ day, isSelected, isToday, isMarked, onSelect }: DayCellProps) {
  return (
    <td className="p-1">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        aria-label={formatDate(day.key, 'full')}
        aria-current={isToday ? 'date' : undefined}
        className={cn(
          'relative flex h-8 w-full items-center justify-center rounded-md text-small transition-colors',
          'focus-ring hover:bg-row-hover',
          day.isCurrentMonth ? 'text-text-secondary' : 'text-disabled',
          isSelected && 'rounded-full bg-brand text-on-brand hover:bg-brand',
        )}
      >
        {day.day}
        {isMarked && !isSelected && (
          <img
            src={eventDotIcon}
            alt=""
            width={2}
            height={2}
            className="absolute bottom-1 left-1/2 -translate-x-1/2"
          />
        )}
      </button>
    </td>
  )
}
