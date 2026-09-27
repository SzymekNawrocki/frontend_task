import { DEFAULT_FILTERS } from '../lib/filters'
import { PAGE_SIZE, catalogReducer, type CatalogState } from './catalogReducer'

const initial: CatalogState = { filters: DEFAULT_FILTERS, visibleCount: PAGE_SIZE }

describe('catalogReducer', () => {
  it('adds a page on showMore', () => {
    expect(catalogReducer(initial, { type: 'showMore' }).visibleCount).toBe(PAGE_SIZE * 2)
  })

  it('resets pagination when a filter changes', () => {
    const expanded = catalogReducer(initial, { type: 'showMore' })
    const next = catalogReducer(expanded, { type: 'setFilter', patch: { energy: 'A' } })
    expect(next.visibleCount).toBe(PAGE_SIZE)
    expect(next.filters.energy).toBe('A')
  })

  it('restores defaults on reset', () => {
    const filtered = catalogReducer(initial, {
      type: 'setFilter',
      patch: { query: 'x', capacity: 8 },
    })
    expect(catalogReducer(filtered, { type: 'reset' })).toEqual(initial)
  })
})
