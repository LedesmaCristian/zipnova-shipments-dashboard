import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createMockState, makeStore } from '@/app/store'

/** Fecha fija para que el dataset mock (ETAs relativas) sea determinístico. */
export const TEST_BASE_DATE = new Date(2026, 9, 6, 8)

/** Renderiza con un store aislado cargado con el dataset mock. */
export function renderWithStore(
  ui: ReactElement,
  store = makeStore(createMockState(TEST_BASE_DATE)),
) {
  return { store, user: userEvent.setup(), ...render(<Provider store={store}>{ui}</Provider>) }
}
