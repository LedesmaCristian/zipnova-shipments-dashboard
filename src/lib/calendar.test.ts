import { addMonths, buildCalendarWeeks, getCalendarMonth } from './calendar'
import { fromDateKey, toDateKey } from './date'

describe('calendar', () => {
  it('builds full Sunday-first weeks padded with adjacent months (July 2026)', () => {
    const weeks = buildCalendarWeeks({ year: 2026, month: 6 })

    expect(weeks).toHaveLength(5)
    expect(weeks.every((week) => week.length === 7)).toBe(true)
    expect(weeks[0]?.slice(0, 4).map((d) => [d.day, d.isCurrentMonth])).toEqual([
      [28, false],
      [29, false],
      [30, false],
      [1, true],
    ])
    expect(weeks.at(-1)?.at(-1)).toEqual({ key: '2026-08-01', day: 1, isCurrentMonth: false })
  })

  it('uses six weeks when the month needs them (August 2026)', () => {
    expect(buildCalendarWeeks({ year: 2026, month: 7 })).toHaveLength(6)
  })

  it('moves across years when adding months', () => {
    expect(addMonths({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 })
    expect(addMonths({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 })
  })

  it('round-trips date keys in local time', () => {
    expect(toDateKey(fromDateKey('2026-10-06'))).toBe('2026-10-06')
    expect(getCalendarMonth(fromDateKey('2026-10-06'))).toEqual({ year: 2026, month: 9 })
  })
})
