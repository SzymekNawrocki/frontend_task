import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import products from '../../../public/data/products.json'
import type { Product } from '../../types/product'
import { ProductCard } from './ProductCard'

const product = (products as Product[])[0]!

describe('ProductCard', () => {
  it('renders the data shown on the design', () => {
    render(<ProductCard product={product} selected={false} onToggle={() => {}} />)
    expect(
      screen.getByRole('heading', { name: 'WW90T754ABT, Pralka QuickDrive™, 9 kg, biała' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Klasa energetyczna A' })).toBeInTheDocument()
    expect(screen.getByText('3 199')).toBeInTheDocument()
    expect(screen.getByText('55 x 60 x 85 cm')).toBeInTheDocument()
    expect(screen.getByText('53,31 zł x 60 rat')).toBeInTheDocument()
    expect(screen.getByText('Cena obowiązuje: 15.09.2022 - 21.09.2022')).toBeInTheDocument()
  })

  it('reports the toggle with the product id', async () => {
    const onToggle = vi.fn()
    render(<ProductCard product={product} selected={false} onToggle={onToggle} />)
    const button = screen.getByRole('button', { name: /Wybierz/ })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(button)
    expect(onToggle).toHaveBeenCalledWith('ww90t754abt')
  })

  it('shows the selected state', () => {
    render(<ProductCard product={product} selected onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: /Wybrane/ })).toHaveAttribute('aria-pressed', 'true')
  })
})
