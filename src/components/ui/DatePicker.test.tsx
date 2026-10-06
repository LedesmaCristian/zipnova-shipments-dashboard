import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './DatePicker'

const TODAY = new Date(2026, 6, 6) // 6 de julio de 2026

function getDayButton(day: number) {
  // Las celdas de otros meses repiten números: tomamos la del mes visible.
  const matches = screen.getAllByRole('button', { name: new RegExp(`\\b${day} de julio`) })
  return matches[0]!
}

describe('DatePicker', () => {
  it('shows the selected date in the header and marks it as selected', () => {
    render(<DatePicker value="2026-07-06" onChange={vi.fn()} today={TODAY} />)

    expect(screen.getByText('06')).toBeInTheDocument()
    expect(screen.getByText('2026')).toBeInTheDocument()
    expect(getDayButton(6)).toHaveAttribute('aria-pressed', 'true')
    expect(getDayButton(7)).toHaveAttribute('aria-pressed', 'false')
    expect(getDayButton(6)).toHaveAttribute('aria-current', 'date')
  })

  it('emits the date key of the clicked day', async () => {
    const onChange = vi.fn()
    render(<DatePicker value={null} onChange={onChange} today={TODAY} />)

    await userEvent.click(getDayButton(15))

    expect(onChange).toHaveBeenCalledWith('2026-07-15')
  })

  it('navigates between months', async () => {
    const user = userEvent.setup()
    render(<DatePicker value={null} onChange={vi.fn()} today={TODAY} />)

    await user.click(screen.getByRole('button', { name: 'Mes siguiente' }))
    expect(screen.getByLabelText('Mes visible: 08/2026')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Mes anterior' }))
    await user.click(screen.getByRole('button', { name: 'Mes anterior' }))
    expect(screen.getByLabelText('Mes visible: 06/2026')).toBeInTheDocument()
  })

  it('renders a dot on marked days', () => {
    render(
      <DatePicker
        value={null}
        onChange={vi.fn()}
        today={TODAY}
        markedDates={new Set(['2026-07-03'])}
      />,
    )

    const grid = screen.getByRole('table', { name: 'Calendario' })
    expect(within(getDayButton(3)).getByRole('presentation', { hidden: true })).toBeInTheDocument()
    expect(within(grid).getAllByRole('presentation', { hidden: true })).toHaveLength(1)
  })
})
