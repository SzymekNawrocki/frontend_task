import { ENERGY_CLASSES, FEATURES, type EnergyClass, type Feature } from '../types/product'
import { DEFAULT_FILTERS, type FilterState, type SortKey } from './filters'

const SORT_KEYS: SortKey[] = ['popularity', 'price', 'capacity']

function isOneOf<T extends string>(list: readonly T[], value: string | null): value is T {
  return value !== null && (list as readonly string[]).includes(value)
}

export function parseFilters(search: string): FilterState {
  const params = new URLSearchParams(search)
  const feature = params.get('feature')
  const energy = params.get('energy')
  const sort = params.get('sort')
  const capacity = Number(params.get('capacity'))

  return {
    query: params.get('q') ?? DEFAULT_FILTERS.query,
    feature: isOneOf<Feature>(FEATURES, feature) ? feature : null,
    energy: isOneOf<EnergyClass>(ENERGY_CLASSES, energy) ? energy : null,
    capacity: Number.isFinite(capacity) && capacity > 0 ? capacity : null,
    sort: isOneOf(SORT_KEYS, sort) ? sort : DEFAULT_FILTERS.sort,
  }
}

export function serializeFilters(filters: FilterState): string {
  const params = new URLSearchParams()
  const query = filters.query.trim()
  if (query) params.set('q', query)
  if (filters.feature) params.set('feature', filters.feature)
  if (filters.energy) params.set('energy', filters.energy)
  if (filters.capacity !== null) params.set('capacity', String(filters.capacity))
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set('sort', filters.sort)
  const result = params.toString()
  return result ? `?${result}` : ''
}
