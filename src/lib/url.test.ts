import { DEFAULT_FILTERS } from './filters'
import { parseFilters, serializeFilters } from './url'

describe('parseFilters', () => {
  it('returns defaults for an empty query string', () => {
    expect(parseFilters('')).toEqual(DEFAULT_FILTERS)
  })

  it('reads every supported parameter', () => {
    expect(parseFilters('?q=addwash&feature=inverter&energy=B&capacity=10.5&sort=price')).toEqual({
      query: 'addwash',
      feature: 'inverter',
      energy: 'B',
      capacity: 10.5,
      sort: 'price',
    })
  })

  it('ignores unknown or malformed values', () => {
    expect(parseFilters('?feature=turbo&energy=Z&capacity=abc&sort=random')).toEqual(
      DEFAULT_FILTERS,
    )
  })
})

describe('serializeFilters', () => {
  it('omits default values', () => {
    expect(serializeFilters(DEFAULT_FILTERS)).toBe('')
  })

  it('round-trips through parseFilters', () => {
    const filters = { ...DEFAULT_FILTERS, query: 'ai', energy: 'A' as const, capacity: 9 }
    expect(parseFilters(serializeFilters(filters))).toEqual(filters)
  })
})
