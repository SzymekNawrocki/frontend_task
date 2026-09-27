import type { Product } from '../types/product'

const integerFormat = new Intl.NumberFormat('pl-PL', { useGrouping: 'always' })
const decimalFormat = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 1 })
const moneyFormat = new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPrice(grosze: number): { whole: string; fraction: string } {
  const whole = Math.floor(grosze / 100)
  const fraction = String(grosze % 100).padStart(2, '0')
  return { whole: integerFormat.format(whole), fraction }
}

export function formatInstallment(amountGrosze: number, count: number): string {
  return `${moneyFormat.format(amountGrosze / 100)} zł x ${count} rat`
}

export function formatCapacity(kg: number): string {
  return decimalFormat.format(kg)
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}

export function productTitle(product: Product): string {
  return `${product.code}, ${product.name}, ${formatCapacity(product.capacityKg)} kg, ${product.color}`
}
