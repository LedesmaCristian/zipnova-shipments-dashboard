import { fireEvent, screen, within } from '@testing-library/react'
import { renderWithStore } from '@/test/renderWithStore'
import { ShipmentList } from './ShipmentList'

function getCard(shipmentId: string) {
  return screen.getByRole('article', { name: `Entrega ${shipmentId}` })
}

async function setup(shipmentId: string) {
  const result = renderWithStore(<ShipmentList />)
  await result.user.click(
    within(getCard(shipmentId)).getByRole('button', { name: 'Ubicar en el mapa' }),
  )
  const getStatus = () => result.store.getState().shipments.entities[shipmentId]?.status
  return { ...result, card: getCard(shipmentId), getStatus }
}

describe('ShipmentList actions', () => {
  it('validates and assigns driver and vehicle to a pending shipment', async () => {
    // 123445: pendiente, 90 kg en total
    const { user, card, getStatus } = await setup('123445')

    await user.click(within(card).getByRole('button', { name: 'Asignar conductor y vehículo' }))
    const dialog = screen.getByRole('dialog', { name: 'Asignar entrega 123445' })

    await user.click(within(dialog).getByRole('button', { name: 'Asignar' }))
    expect(
      within(dialog)
        .getAllByRole('alert')
        .map((alert) => alert.textContent),
    ).toEqual(['Elegí un conductor', 'Elegí un vehículo'])

    await user.selectOptions(within(dialog).getByLabelText('Conductor'), 'Martín Gómez')
    await user.selectOptions(within(dialog).getByLabelText('Vehículo'), 'veh-1') // moto, 30 kg
    await user.click(within(dialog).getByRole('button', { name: 'Asignar' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent(
      'El envío pesa 90 kg y el vehículo soporta 30 kg.',
    )

    await user.selectOptions(within(dialog).getByLabelText('Vehículo'), 'veh-3')
    await user.click(within(dialog).getByRole('button', { name: 'Asignar' }))

    expect(getStatus()).toBe('assigned')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(within(card).getByText('Martín Gómez · AD 789 NP')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Entrega 123445 asignada')
  })

  it('moves a shipment through the delivery flow', async () => {
    // 123446: asignado
    const { user, card, getStatus } = await setup('123446')

    await user.click(within(card).getByRole('button', { name: 'Iniciar viaje' }))
    expect(getStatus()).toBe('in_transit')

    await user.click(within(card).getByRole('button', { name: 'Marcar entregado' }))
    expect(getStatus()).toBe('delivered')
    expect(within(card).queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
    expect(within(card).queryByRole('button', { name: /Asignar/ })).not.toBeInTheDocument()
  })

  it('returns an assigned shipment to pending', async () => {
    const { user, card, getStatus } = await setup('123446')

    await user.click(within(card).getByRole('button', { name: 'Desasignar' }))

    expect(getStatus()).toBe('pending')
    expect(within(card).getByText('Sin asignar')).toBeInTheDocument()
  })

  it('asks for confirmation before cancelling', async () => {
    const { user, card, getStatus } = await setup('123447')

    await user.click(within(card).getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByRole('button', { name: 'Volver' }))
    expect(getStatus()).toBe('in_transit')

    await user.click(within(card).getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar envío' }))

    expect(getStatus()).toBe('cancelled')
    expect(screen.getByRole('status')).toHaveTextContent('Entrega 123447 cancelada')
  })

  it('returns focus to the button that opened the dialog', async () => {
    const { user, card } = await setup('123445')
    const trigger = within(card).getByRole('button', { name: 'Asignar conductor y vehículo' })

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Volver' }))

    expect(trigger).toHaveFocus()
  })

  it('closes dialogs with Escape and with the close button', async () => {
    const { user, card } = await setup('123445')

    await user.click(within(card).getByRole('button', { name: 'Asignar conductor y vehículo' }))
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(within(card).getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
