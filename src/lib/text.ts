/** Pasa a minúsculas y quita acentos para comparar texto sin importar tildes. */
function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

/**
 * Predicado de búsqueda insensible a mayúsculas y tildes: indica si alguno de los campos
 * contiene la búsqueda. La búsqueda se normaliza una sola vez, no por cada elemento.
 */
export function createTextMatcher(query: string): (fields: readonly string[]) => boolean {
  const normalizedQuery = normalizeText(query)
  if (!normalizedQuery) return () => true
  return (fields) => fields.some((field) => normalizeText(field).includes(normalizedQuery))
}
