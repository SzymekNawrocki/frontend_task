import { formatCapacity, formatDate, formatInstallment, productTitle } from '../../lib/format'
import { FEATURE_LABELS } from '../../lib/labels'
import type { Product } from '../../types/product'
import { SelectButton } from '../Button/Button'
import { EnergyBadge } from '../EnergyBadge/EnergyBadge'
import { Price } from '../Price/Price'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  selected: boolean
  onToggle: (id: string) => void
}

export function ProductCard({ product, selected, onToggle }: ProductCardProps) {
  const title = productTitle(product)
  const { w, d, h } = product.dimensionsCm

  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={`${import.meta.env.BASE_URL}${product.image}`}
        alt={title}
        width={200}
        height={200}
        loading="lazy"
        decoding="async"
      />
      <h2 className={styles.title}>{title}</h2>
      <dl className={styles.specs}>
        <div className={styles.spec}>
          <dt>Pojemność (kg):</dt>
          <dd>{formatCapacity(product.capacityKg)}</dd>
        </div>
        <div className={styles.spec}>
          <dt>Wymiary (GxSxW):</dt>
          <dd>
            {d} x {w} x {h} cm
          </dd>
        </div>
        <div className={styles.spec}>
          <dt>Funkcje:</dt>
          <dd>{product.features.map((feature) => FEATURE_LABELS[feature]).join(', ')}</dd>
        </div>
        <div className={`${styles.spec} ${styles.energy}`}>
          <dt>Klasa energetyczna</dt>
          <dd>
            <EnergyBadge energyClass={product.energyClass} />
          </dd>
        </div>
      </dl>
      <p className={styles.validity}>
        Cena obowiązuje: {formatDate(product.priceValidFrom)} - {formatDate(product.priceValidTo)}
      </p>
      <Price grosze={product.priceGrosze} />
      <p className={styles.installment}>
        {formatInstallment(product.installments.amountGrosze, product.installments.count)}
      </p>
      <SelectButton selected={selected} productName={title} onToggle={() => onToggle(product.id)} />
    </article>
  )
}
