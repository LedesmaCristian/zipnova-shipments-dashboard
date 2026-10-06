/** Fecha local en formato `YYYY-MM-DD`, útil para comparar días sin hora. */
export type DateKey = string

export function toDateKey(date: Date | string): DateKey {
  const value = typeof date === 'string' ? new Date(date) : date
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Convierte una `DateKey` a fecha local, sin corrimientos de zona horaria. */
export function fromDateKey(key: DateKey): Date {
  const [year = 0, month = 1, day = 1] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}
