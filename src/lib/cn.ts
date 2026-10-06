import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge necesita conocer los tokens custom de `index.css`; si no,
 * confunde `text-small` (tamaño) con un color y lo descarta al combinarlo
 * con `text-text-primary`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['tiny', 'small', 'field', 'regular'],
      radius: ['s', 'm', 'l'],
      shadow: ['popover'],
    },
  },
})

/** Combina clases condicionales y resuelve conflictos de Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
