import type { EnergyClass, Feature, Product } from '../types/product'

export type SortKey = 'popularity' | 'price' | 'capacity'

export interface FilterState {
  query: string
  feature: Feature | null
  energy: EnergyClass | null
  capacity: number | null
  sort: SortKey
}

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  feature: null,
  energy: null,
  capacity: null,
  sort: 'popularity',
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ł/g, 'l')
    .trim()
}

export function matchesQuery(product: Product, query: string): boolean {
  const needle = normalizeText(query)
  if (!needle) return true
  return [product.code, product.name].some((field) => normalizeText(field).includes(needle))
}

export function filterProducts(products: Product[], state: FilterState): Product[] {
  return products.filter(
    (product) =>
      matchesQuery(product, state.query) &&
      (state.feature === null || product.features.includes(state.feature)) &&
      (state.energy === null || product.energyClass === state.energy) &&
      (state.capacity === null || product.capacityKg === state.capacity),
  )
}

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  popularity: (a, b) => b.popularity - a.popularity,
  price: (a, b) => a.priceGrosze - b.priceGrosze,
  capacity: (a, b) => b.capacityKg - a.capacityKg,
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const compare = comparators[sort]
  return [...products].sort((a, b) => compare(a, b) || b.popularity - a.popularity)
}

export function applyFilters(products: Product[], state: FilterState): Product[] {
  return sortProducts(filterProducts(products, state), state.sort)
}

export function buildOptions(products: Product[]) {
  const energyClasses = [...new Set(products.map((p) => p.energyClass))].sort()
  const capacities = [...new Set(products.map((p) => p.capacityKg))].sort((a, b) => a - b)
  return { energyClasses, capacities }
}
