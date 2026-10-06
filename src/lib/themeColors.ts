/**
 * Espejo en TS de tokens de `src/index.css` para Leaflet, que pinta los marcadores con
 * atributos SVG (no resuelven `var()`). Un test verifica que coincidan con el CSS.
 */
export const THEME_COLORS = {
  brand: '#14efb6',
  danger: '#ff6b6b',
  warning: '#f5b84c',
  bgAccent: '#172937',
  textPrimary: '#ffffff',
} as const
