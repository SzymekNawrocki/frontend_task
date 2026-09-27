import products from '../../public/data/products.json'
import type { Product } from '../types/product'
import { formatCapacity, formatDate, formatInstallment, formatPrice, productTitle } from './format'

describe('formatPrice', () => {
  it('splits zloty and grosze with Polish thousands grouping', () => {
    expect(formatPrice(319900)).toEqual({ whole: '3\u00a0199', fraction: '00' })
  })

  it('keeps a leading zero in grosze', () => {
    expect(formatPrice(179905).fraction).toBe('05')
  })
})

describe('formatInstallment', () => {
  it('renders the monthly amount with a decimal comma', () => {
    expect(formatInstallment(5331, 60)).toBe('53,31 zł x 60 rat')
  })
})

describe('formatCapacity', () => {
  it('uses a decimal comma only when needed', () => {
    expect(formatCapacity(10.5)).toBe('10,5')
    expect(formatCapacity(9)).toBe('9')
  })
})

describe('formatDate', () => {
  it('converts an ISO date to Polish notation', () => {
    expect(formatDate('2022-09-15')).toBe('15.09.2022')
  })
})

describe('productTitle', () => {
  it('builds the card title from product fields', () => {
    const product = (products as Product[])[0]!
    expect(productTitle(product)).toBe('WW90T754ABT, Pralka QuickDrive™, 9 kg, biała')
  })
})
