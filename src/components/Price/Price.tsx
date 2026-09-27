import { formatPrice } from '../../lib/format'
import styles from './Price.module.css'

export function Price({ grosze }: { grosze: number }) {
  const { whole, fraction } = formatPrice(grosze)
  return (
    <p className={styles.price}>
      <span className={styles.whole}>{whole}</span>
      <span className={styles.suffix}>
        <span>{fraction}</span>
        <span>zł</span>
      </span>
    </p>
  )
}
