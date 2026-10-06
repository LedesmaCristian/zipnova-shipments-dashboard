/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { cn } from './cn'
import { toDateKey } from './date'
import { formatCompactCurrency, formatDate, formatVolume, formatWeight } from './format'
import { createTextMatcher } from './text'
import { THEME_COLORS } from './themeColors'

describe('text', () => {
  it('normalizes case, accents and surrounding whitespace', () => {
    expect(createTextMatcher('  OPTICA lanus ')(['Óptica Lanús'])).toBe(true)
  })

  it('matches when any field contains the query; empty query matches everything', () => {
    expect(createTextMatcher('lanus')(['Ferretería', 'Lanús'])).toBe(true)
    expect(createTextMatcher('quilmes')(['Ferretería', 'Lanús'])).toBe(false)
    expect(createTextMatcher('  ')(['anything'])).toBe(true)
  })
})

describe('date', () => {
  it('builds local date keys', () => {
    expect(toDateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
  })
})

describe('format', () => {
  it('formats values with the es-AR locale', () => {
    expect(formatWeight(60)).toBe('60 kg')
    expect(formatVolume(0.2)).toBe('0,200 m³')
    expect(formatCompactCurrency(230400)).toMatch(/230,4\s?k/)
    expect(formatDate('2026-10-06')).toMatch(/6 oct.* 2026/)
    expect(formatDate('2026-10-06', 'full')).toMatch(/^martes, 6 de octubre/)
  })
})

describe('cn', () => {
  it('merges conditional classes resolving Tailwind conflicts', () => {
    expect(cn('px-2 text-sm', { hidden: false }, 'px-4')).toBe('text-sm px-4')
  })

  it('keeps custom font sizes alongside custom text colors', () => {
    expect(cn('text-small text-text-secondary')).toBe('text-small text-text-secondary')
    expect(cn('text-small', 'text-tiny')).toBe('text-tiny')
    expect(cn('rounded-m', 'rounded-full')).toBe('rounded-full')
  })
})

describe('themeColors', () => {
  it('mirrors the tokens declared in index.css', () => {
    // Vitest no procesa CSS (`css: false`): se lee el archivo tal cual (ruta relativa a la raíz del proyecto).
    const css = readFileSync('src/index.css', 'utf8')
    const tokens = {
      brand: '--color-brand',
      danger: '--color-danger',
      warning: '--color-warning',
      bgAccent: '--color-bg-accent',
      textPrimary: '--color-text-primary',
    } satisfies Record<keyof typeof THEME_COLORS, string>

    for (const [name, token] of Object.entries(tokens)) {
      expect(css).toContain(`${token}: ${THEME_COLORS[name as keyof typeof THEME_COLORS]};`)
    }
  })
})
