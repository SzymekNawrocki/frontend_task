import { DEFAULT_FILTERS, type FilterState } from '../lib/filters'

export const PAGE_SIZE = 6

export interface CatalogState {
  filters: FilterState
  visibleCount: number
}

export type CatalogAction =
  { type: 'setFilter'; patch: Partial<FilterState> } | { type: 'reset' } | { type: 'showMore' }

export function catalogReducer(state: CatalogState, action: CatalogAction): CatalogState {
  switch (action.type) {
    case 'setFilter':
      return { filters: { ...state.filters, ...action.patch }, visibleCount: PAGE_SIZE }
    case 'reset':
      return { filters: DEFAULT_FILTERS, visibleCount: PAGE_SIZE }
    case 'showMore':
      return { ...state, visibleCount: state.visibleCount + PAGE_SIZE }
  }
}
