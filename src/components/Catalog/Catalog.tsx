import { useCallback, useMemo, useState } from 'react'
import { useCatalog } from '../../hooks/useCatalog'
import { buildOptions, type FilterState } from '../../lib/filters'
import type { Product } from '../../types/product'
import { FilterBar } from '../FilterBar/FilterBar'
import { ProductGrid } from '../ProductGrid/ProductGrid'
import { SearchInput } from '../SearchInput/SearchInput'
import { ShowMore } from '../ShowMore/ShowMore'
import { StatusMessage } from '../StatusMessage/StatusMessage'
import styles from './Catalog.module.css'

export function Catalog({ products }: { products: Product[] }) {
  const { filters, results, visible, hasMore, dispatch } = useCatalog(products)
  const { energyClasses, capacities } = useMemo(() => buildOptions(products), [products])
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set())

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const setFilter = (patch: Partial<FilterState>) => dispatch({ type: 'setFilter', patch })

  return (
    <>
      <section className={styles.controls} aria-label="Wyszukiwanie i filtry">
        <SearchInput value={filters.query} onChange={(query) => setFilter({ query })} />
        <FilterBar
          filters={filters}
          energyClasses={energyClasses}
          capacities={capacities}
          onChange={setFilter}
        />
      </section>

      <section className={styles.results} aria-labelledby="results-count">
        <p id="results-count" className={styles.count} aria-live="polite">
          Liczba wyników: {results.length}
        </p>

        {results.length === 0 ? (
          <StatusMessage
            message="Brak produktów spełniających kryteria"
            action={{ label: 'Wyczyść filtry', onClick: () => dispatch({ type: 'reset' }) }}
          />
        ) : (
          <ProductGrid products={visible} selectedIds={selectedIds} onToggle={toggleSelected} />
        )}

        {hasMore && (
          <div className={styles.more}>
            <ShowMore onClick={() => dispatch({ type: 'showMore' })} />
          </div>
        )}
      </section>
    </>
  )
}
