import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from './ErrorBoundary'
import { FilterButton } from './FilterButton'
import { MenuItem, MenuSurface } from './Menu'
import { Toast } from './Toast'

describe('FilterButton', () => {
  it('is an accessible button that reports clicks', async () => {
    const onClick = vi.fn()
    render(<FilterButton aria-label="Filtros" onClick={onClick} />)

    await userEvent.click(screen.getByRole('button', { name: 'Filtros' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders a single brand icon when active', () => {
    const { container } = render(<FilterButton aria-label="Filtros" isActive />)

    expect(container.querySelectorAll('img')).toHaveLength(1)
  })
})

describe('MenuItem', () => {
  it('exposes its submenu state', () => {
    render(
      <MenuSurface role="menu">
        <MenuItem icon="icon.svg" label="Dirección" isActive />
        <MenuItem icon="icon.svg" label="Fecha" />
      </MenuSurface>,
    )

    expect(screen.getByRole('menuitem', { name: 'Dirección' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('menuitem', { name: 'Fecha' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})

function Broken(): never {
  throw new Error('chunk failed')
}

describe('ErrorBoundary', () => {
  it('renders the fallback instead of crashing the whole tree', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<p>No se pudo cargar el mapa.</p>}>
        <Broken />
      </ErrorBoundary>,
    )

    expect(screen.getByText('No se pudo cargar el mapa.')).toBeInTheDocument()
    vi.restoreAllMocks()
  })
})

describe('Toast', () => {
  it('announces a repeated message again', () => {
    const { rerender } = render(<Toast message={{ id: 1, text: 'Entrega 1 asignada' }} />)
    const first = screen.getByText('Entrega 1 asignada')

    rerender(<Toast message={{ id: 2, text: 'Entrega 1 asignada' }} />)

    expect(screen.getByText('Entrega 1 asignada')).not.toBe(first)
  })
})
