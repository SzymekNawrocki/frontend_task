import products from '../../public/data/products.json'
import type { Product } from '../types/product'
import {
  DEFAULT_FILTERS,
  applyFilters,
  buildOptions,
  matchesQuery,
  normalizeText,
  type FilterState,
} from './filters'

const catalog = products as Product[]

function run(overrides: Partial<FilterState>) {
  return applyFilters(catalog, { ...DEFAULT_FILTERS, ...overrides })
}

describe('normalizeText', () => {
  it('ignores case and Polish diacritics', () => {
    expect(normalizeText('  BIAŁA Pralka Żółta ')).toBe('biala pralka zolta')
  })
})

describe('matchesQuery', () => {
  const product = catalog[0]!

  it('matches by code regardless of case', () => {
    expect(matchesQuery(product, 'ww90t754')).toBe(true)
  })

  it('matches by name', () => {
    expect(matchesQuery(product, 'quickdrive')).toBe(true)
  })

  it('treats a blank query as a match', () => {
    expect(matchesQuery(product, '   ')).toBe(true)
  })

  it('rejects unrelated text', () => {
    expect(matchesQuery(product, 'lodówka')).toBe(false)
  })
})

describe('applyFilters', () => {
  it('returns every product with default filters', () => {
    expect(run({})).toHaveLength(23)
  })

  it('filters by a single feature', () => {
    const result = run({ feature: 'ai-control' })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((p) => p.features.includes('ai-control'))).toBe(true)
  })

  it('combines every criterion with AND', () => {
    const result = run({ feature: 'addwash', energy: 'A', capacity: 10.5 })
    expect(result.map((p) => p.code).sort()).toEqual(['WW10T654DLH', 'WW10T654DLX', 'WW10T754ABH'])
  })

  it('combines search with dropdown filters', () => {
    const result = run({ query: 'addwash', capacity: 8 })
    expect(result.map((p) => p.code).sort()).toEqual(['WW80T534DAW', 'WW80T534DAX'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(run({ energy: 'F', feature: 'ai-control' })).toEqual([])
  })

  it('sorts by popularity descending by default', () => {
    const scores = run({}).map((p) => p.popularity)
    expect(scores).toEqual([...scores].sort((a, b) => b - a))
  })

  it('sorts by price ascending', () => {
    const prices = run({ sort: 'price' }).map((p) => p.priceGrosze)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('sorts by capacity descending', () => {
    const capacities = run({ sort: 'capacity' }).map((p) => p.capacityKg)
    expect(capacities).toEqual([...capacities].sort((a, b) => b - a))
  })

  it('does not mutate the source array', () => {
    const before = catalog.map((p) => p.id)
    run({ sort: 'price' })
    expect(catalog.map((p) => p.id)).toEqual(before)
  })
})

describe('buildOptions', () => {
  it('derives sorted unique options from data', () => {
    expect(buildOptions(catalog)).toEqual({
      energyClasses: ['A', 'B', 'C', 'D', 'E', 'F'],
      capacities: [8, 9, 10.5],
    })
  })
})
