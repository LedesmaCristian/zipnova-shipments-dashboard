import { toDateKey, type DateKey } from './date'

const DAYS_PER_WEEK = 7

export const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'] as const

/** Mes visible en el calendario. `month` es 0-based, como en `Date`. */
export interface CalendarMonth {
  year: number
  month: number
}

export interface CalendarDay {
  key: DateKey
  day: number
  isCurrentMonth: boolean
}

export function getCalendarMonth(date: Date): CalendarMonth {
  return { year: date.getFullYear(), month: date.getMonth() }
}

export function addMonths({ year, month }: CalendarMonth, amount: number): CalendarMonth {
  return getCalendarMonth(new Date(year, month + amount, 1))
}

/**
 * Semanas completas (domingo a sábado) que cubren el mes, incluyendo los días
 * del mes anterior y siguiente necesarios para completar la grilla.
 */
export function buildCalendarWeeks({ year, month }: CalendarMonth): CalendarDay[][] {
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / DAYS_PER_WEEK) * DAYS_PER_WEEK

  const days = Array.from({ length: totalCells }, (_, index): CalendarDay => {
    const date = new Date(year, month, index - firstWeekday + 1)
    return { key: toDateKey(date), day: date.getDate(), isCurrentMonth: date.getMonth() === month }
  })

  return Array.from({ length: totalCells / DAYS_PER_WEEK }, (_, week) =>
    days.slice(week * DAYS_PER_WEEK, (week + 1) * DAYS_PER_WEEK),
  )
}
