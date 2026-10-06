import { fromDateKey, type DateKey } from './date'

const LOCALE = 'es-AR'

const compactCurrencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'ARS',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const decimalFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 })

/** El kit muestra el volumen con 3 decimales fijos (ej. "0,200 m³"). */
const volumeFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const dateFormatters = {
  medium: new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' }),
  full: new Intl.DateTimeFormat(LOCALE, { dateStyle: 'full' }),
}

/** Valor abreviado para espacios chicos, ej. "$230,4 k". */
export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value)
}

export function formatWeight(kg: number): string {
  return `${decimalFormatter.format(kg)} kg`
}

export function formatVolume(m3: number): string {
  return `${volumeFormatter.format(m3)} m³`
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso))
}

/** Día de una `DateKey`: "6 oct 2026" (`medium`) o "martes, 6 de octubre de 2026" (`full`). */
export function formatDate(key: DateKey, style: keyof typeof dateFormatters = 'medium'): string {
  return dateFormatters[style].format(fromDateKey(key))
}
