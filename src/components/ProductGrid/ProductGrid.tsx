import type { Product } from '../../types/product'
import { ProductCard } from '../ProductCard/ProductCard'
import styles from './ProductGrid.module.css'

interface ProductGridProps {
  products: Product[]
  selectedIds: ReadonlySet<string>
  onToggle: (id: string) => void
}

export function ProductGrid({ products, selectedIds, onToggle }: ProductGridProps) {
  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            selected={selectedIds.has(product.id)}
            onToggle={onToggle}
          />
        </li>
      ))}
    </ul>
  )
}
