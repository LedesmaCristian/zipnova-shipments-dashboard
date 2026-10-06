import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { buildPackage, buildShipment } from '@/test/factories'
import type { ShipmentDetails } from '../types'
import { getShipmentMetrics } from '../utils/shipmentMetrics'
import { ShipmentCard } from './ShipmentCard'

function buildDetails(overrides: Partial<ShipmentDetails> = {}): ShipmentDetails {
  const shipment = buildShipment({
    id: '123445',
    trackingCode: 'D999-2234908283',
    packages: [
      buildPackage({ id: '123445-1', description: 'Indumentaria', quantity: 2, weightKg: 30 }),
      buildPackage({ id: '123445-2', description: 'Calzado', quantity: 1, weightKg: 30 }),
    ],
  })
  return { shipment, metrics: getShipmentMetrics(shipment.packages), ...overrides }
}

function renderCard(props: Partial<Parameters<typeof ShipmentCard>[0]> = {}) {
  const handlers = { onToggle: vi.fn(), onLocate: vi.fn(), onAssign: vi.fn(), onAction: vi.fn() }
  render(
    <ShipmentCard
      details={buildDetails()}
      isExpanded={false}
      actions={[]}
      {...handlers}
      {...props}
    />,
  )
  return { user: userEvent.setup(), ...handlers }
}

describe('ShipmentCard', () => {
  it('shows only the shipment number and tracking code when collapsed', () => {
    renderCard()

    expect(screen.getByText('Entrega 123445')).toBeInTheDocument()
    expect(screen.getByText('D999-2234908283')).toBeInTheDocument()
    expect(screen.queryByText('Sin asignar')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Expandir detalle' })).toBeInTheDocument()
  })

  it('notifies toggle and locate actions', async () => {
    const { user, onToggle, onLocate } = renderCard()

    await user.click(screen.getByRole('button', { name: /Entrega 123445/ }))
    await user.click(screen.getByRole('button', { name: 'Ubicar en el mapa' }))

    expect(onToggle).toHaveBeenCalledOnce()
    expect(onLocate).toHaveBeenCalledOnce()
  })

  it('shows metrics, packages and the unassigned state when expanded', async () => {
    const { user, onAssign } = renderCard({ isExpanded: true })

    expect(screen.getByText('90 kg')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Paquete 1')).toBeInTheDocument()
    expect(screen.getByText('123445-2')).toBeInTheDocument()
    expect(screen.getByText('Sin asignar')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Asignar conductor y vehículo' }))
    expect(onAssign).toHaveBeenCalledOnce()
  })

  it('shows the assigned driver and vehicle', () => {
    const details = buildDetails({
      driver: { id: 'd1', name: 'Lucía Fernández', phone: '' },
      vehicle: { id: 'v1', plate: 'AE 123 KD', model: '', type: 'van', capacityKg: 100 },
    })
    renderCard({ details, isExpanded: true })

    expect(screen.getByText('Lucía Fernández · AE 123 KD')).toBeInTheDocument()
  })

  it('offers assignment only when the container passes onAssign', () => {
    renderCard({ isExpanded: true, onAssign: undefined })

    expect(screen.queryByRole('button', { name: /Asignar/ })).not.toBeInTheDocument()
  })

  it('renders the available actions and reports which one was used', async () => {
    const { user, onAction } = renderCard({ isExpanded: true, actions: ['start', 'cancel'] })

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByRole('button', { name: 'Iniciar viaje' })).toBeInTheDocument()
    expect(onAction).toHaveBeenCalledWith('cancel')
  })

  it('highlights the expanded card', () => {
    renderCard({ isExpanded: true })

    expect(screen.getByRole('article')).toHaveClass('ring-brand')
  })
})
