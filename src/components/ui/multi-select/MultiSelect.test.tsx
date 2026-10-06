import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { MultiSelect } from './MultiSelect'

type Status = 'pending' | 'assigned' | 'in_transit'

const OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'assigned', label: 'Asignado' },
  { value: 'in_transit', label: 'En tránsito' },
] as const

function setup(initial: Status[] = []) {
  const onChange = vi.fn()

  function Harness() {
    const [value, setValue] = useState<Status[]>(initial)
    return (
      <MultiSelect
        label="Estado"
        options={OPTIONS}
        value={value}
        onChange={(next) => {
          onChange(next)
          setValue(next)
        }}
      />
    )
  }

  render(<Harness />)
  return {
    user: userEvent.setup(),
    onChange,
    input: screen.getByRole('combobox', { name: 'Estado' }),
  }
}

describe('MultiSelect', () => {
  it('does not open just by tabbing through it', async () => {
    const { user, input } = setup()

    await user.tab()

    expect(input).toHaveFocus()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input).not.toHaveAttribute('aria-controls')
  })

  it('opens the listbox on click and closes it with Escape', async () => {
    const { user, input } = setup()

    await user.click(input)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('toggles options and keeps them in the original order', async () => {
    const { user, input, onChange } = setup()

    await user.click(input)
    await user.click(screen.getByRole('option', { name: 'En tránsito' }))
    await user.click(screen.getByRole('option', { name: 'Pendiente' }))

    expect(onChange).toHaveBeenLastCalledWith(['pending', 'in_transit'])
    expect(screen.getByRole('option', { name: 'Pendiente' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await user.click(screen.getByRole('option', { name: 'Pendiente' }))
    expect(onChange).toHaveBeenLastCalledWith(['in_transit'])
  })

  it('filters options ignoring accents and shows an empty state', async () => {
    const { user, input } = setup()

    await user.type(input, 'transito')
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Seleccionar todo',
      'En tránsito',
    ])

    await user.clear(input)
    await user.type(input, 'xyz')
    expect(screen.getByText('Sin opciones')).toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('clears the search with the clear button', async () => {
    const { user, input } = setup()

    await user.type(input, 'asig')
    await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))

    expect(input).toHaveValue('')
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length + 1)
  })

  it('selects and deselects all visible options', async () => {
    const { user, input, onChange } = setup(['assigned'])

    await user.click(input)
    await user.click(screen.getByRole('option', { name: 'Seleccionar todo' }))
    expect(onChange).toHaveBeenLastCalledWith(['pending', 'assigned', 'in_transit'])

    await user.click(screen.getByRole('option', { name: 'Seleccionar todo' }))
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  it('applies "select all" only to the filtered options', async () => {
    const { user, input, onChange } = setup(['assigned'])

    await user.type(input, 'pend')
    await user.click(screen.getByRole('option', { name: 'Seleccionar todo' }))

    expect(onChange).toHaveBeenLastCalledWith(['pending', 'assigned'])
  })

  it('supports keyboard navigation', async () => {
    const { user, input, onChange } = setup()

    await user.click(input)
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    expect(onChange).toHaveBeenLastCalledWith(['pending'])
    expect(input).toHaveAttribute('aria-activedescendant')
  })

  it('summarizes the selection when closed', async () => {
    const { user, input } = setup(['pending', 'assigned'])
    expect(input).toHaveValue('Pendiente, Asignado')

    await user.click(input)
    await user.click(screen.getByRole('option', { name: 'En tránsito' }))
    await user.click(document.body)

    expect(input).toHaveValue('3 seleccionados')
  })
})
