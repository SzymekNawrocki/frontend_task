import { useEffect, useMemo, useReducer } from 'react'
import { applyFilters } from '../lib/filters'
import { parseFilters, serializeFilters } from '../lib/url'
import type { Product } from '../types/product'
import { PAGE_SIZE, catalogReducer } from './catalogReducer'
import { useDebounce } from './useDebounce'

const SEARCH_DEBOUNCE_MS = 200

export function useCatalog(products: Product[]) {
  const [state, dispatch] = useReducer(catalogReducer, undefined, () => ({
    filters: parseFilters(window.location.search),
    visibleCount: PAGE_SIZE,
  }))

  const debouncedQuery = useDebounce(state.filters.query, SEARCH_DEBOUNCE_MS)
  const activeFilters = useMemo(
    () => ({ ...state.filters, query: debouncedQuery }),
    [state.filters, debouncedQuery],
  )

  const results = useMemo(() => applyFilters(products, activeFilters), [products, activeFilters])

  useEffect(() => {
    const url = `${window.location.pathname}${serializeFilters(activeFilters)}${window.location.hash}`
    window.history.replaceState(null, '', url)
  }, [activeFilters])

  return {
    filters: state.filters,
    results,
    visible: results.slice(0, state.visibleCount),
    hasMore: results.length > state.visibleCount,
    dispatch,
  }
}
