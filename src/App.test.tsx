import { screen, within } from '@testing-library/react'
import { renderWithStore, TEST_BASE_DATE } from '@/test/renderWithStore'
import App from './App'

// Leaflet no renderiza en jsdom; su lógica pura se testea en mapView.test.ts.
vi.mock('@/features/map/components/ShipmentsMap', () => ({
  ShipmentsMap: () => <div data-testid="map" />,
}))

function getShipmentCards() {
  return within(screen.getByRole('region', { name: /envíos?$/ })).getAllByRole('article')
}

describe('App', () => {
  // El date picker abre en el mes actual: fijamos "hoy" para que el test no dependa del calendario.
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(TEST_BASE_DATE)
  })
  afterEach(() => vi.useRealTimers())

  it('lists every shipment with high priority first and a summary', async () => {
    renderWithStore(<App />)

    expect(getShipmentCards()).toHaveLength(20)
    expect(screen.getByRole('heading', { name: '20 envíos' })).toBeInTheDocument()
    expect(screen.getByText('7 pendientes · 7 con prioridad alta')).toBeInTheDocument()
    expect(within(getShipmentCards()[0]!).getByText(/Prioridad alta/)).toBeInTheDocument()
    expect(await screen.findByTestId('map')).toBeInTheDocument()
  })

  it('filters by free-text search on shipment number or customer', async () => {
    const { user } = renderWithStore(<App />)

    await user.type(screen.getByRole('searchbox', { name: /Buscar por número/ }), 'optica')

    expect(getShipmentCards()).toHaveLength(1)
    expect(screen.getByText('Entrega 123451')).toBeInTheDocument()
  })

  it('combines multi-select filters and clears them all', async () => {
    const { user, store } = renderWithStore(<App />)

    await user.click(screen.getByRole('combobox', { name: 'Estado' }))
    await user.click(screen.getByRole('option', { name: 'Pendiente' }))
    await user.click(screen.getByRole('combobox', { name: 'Prioridad' }))
    await user.click(screen.getByRole('option', { name: 'Alta' }))

    expect(store.getState().filters).toMatchObject({ statuses: ['pending'], priorities: ['high'] })
    expect(getShipmentCards()).toHaveLength(3)

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros (2)' }))

    expect(getShipmentCards()).toHaveLength(20)
    expect(screen.getByRole('combobox', { name: 'Estado' })).toHaveValue('')
  })

  it('filters by address from the filter menu and removes it with the chip', async () => {
    const { user } = renderWithStore(<App />)

    await user.click(screen.getByRole('button', { name: 'Más filtros' }))
    await user.click(screen.getByRole('menuitem', { name: 'Dirección' }))
    expect(screen.getByText('Escribí y seleccioná una dirección')).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: 'Buscar dirección' }), 'cabildo')
    await user.click(screen.getByRole('button', { name: /Av\. Cabildo 2040/ }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(getShipmentCards()).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: /Quitar filtro: Dirección/ }))
    expect(getShipmentCards()).toHaveLength(20)
  })

  it('filters by delivery date from the date picker', async () => {
    const { user } = renderWithStore(<App />)

    await user.click(screen.getByRole('button', { name: 'Más filtros' }))
    await user.click(screen.getByRole('menuitem', { name: 'Fecha' }))
    await user.click(screen.getByRole('button', { name: /^miércoles, 7 de octubre/ }))

    expect(screen.getByText(/Fecha: 7 oct/)).toBeInTheDocument()
    expect(getShipmentCards()).toHaveLength(3)
  })

  it('shows an empty state when nothing matches', async () => {
    const { user } = renderWithStore(<App />)

    await user.type(screen.getByRole('searchbox', { name: /Buscar por número/ }), 'no-existe')

    expect(screen.getByText('No hay envíos que coincidan con los filtros.')).toBeInTheDocument()
  })

  it('expands a shipment when locating it and collapses it on toggle', async () => {
    const { user, store } = renderWithStore(<App />)
    const card = getShipmentCards()[0]!

    await user.click(within(card).getByRole('button', { name: 'Ubicar en el mapa' }))

    expect(store.getState().shipments.selectedId).toBe('123445')
    expect(within(card).getByText('Tienda Palermo SRL')).toBeInTheDocument()

    await user.click(within(card).getByRole('button', { name: 'Contraer detalle' }))
    expect(store.getState().shipments.selectedId).toBeNull()
  })

  it('closes the filter menu with Escape', async () => {
    const { user } = renderWithStore(<App />)

    await user.click(screen.getByRole('button', { name: 'Más filtros' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
