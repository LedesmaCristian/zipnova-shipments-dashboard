import { createTextMatcher } from '@/lib/text'

const MAX_ADDRESS_RESULTS = 6

/** Direcciones que contienen la búsqueda, como mucho 6. Sin búsqueda no sugiere nada. */
export function searchAddresses(addresses: readonly string[], query: string): string[] {
  if (!query.trim()) return []
  const matches = createTextMatcher(query)
  return addresses.filter((address) => matches([address])).slice(0, MAX_ADDRESS_RESULTS)
}
