import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Dropdown } from './Dropdown'

const options = [
  { value: '', label: 'Pokaż wszystkie' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
]

function Harness({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Dropdown
        label="Klasa energetyczna:"
        options={options}
        value={value}
        onChange={(next) => {
          setValue(next)
          onChange(next)
        }}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
      <p>outside</p>
    </>
  )
}

function setup() {
  const onChange = vi.fn()
  const user = userEvent.setup()
  render(<Harness onChange={onChange} />)
  const trigger = screen.getByRole('button', { name: /Klasa energetyczna/ })
  return { user, onChange, trigger }
}

describe('Dropdown', () => {
  it('opens on click and selects an option with the mouse', async () => {
    const { user, onChange, trigger } = setup()
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getByRole('option', { name: 'B' }))
    expect(onChange).toHaveBeenCalledWith('B')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveTextContent('B')
  })

  it('supports keyboard navigation', async () => {
    const { user, onChange, trigger } = setup()
    trigger.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('listbox')).toHaveFocus()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('A')
    expect(trigger).toHaveFocus()
  })

  it('closes on Escape without changing the value', async () => {
    const { user, onChange, trigger } = setup()
    await user.click(trigger)
    await user.keyboard('{ArrowDown}{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('closes when clicking outside', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await user.click(screen.getByText('outside'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
