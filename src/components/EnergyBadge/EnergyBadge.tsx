import type { EnergyClass } from '../../types/product'
import styles from './EnergyBadge.module.css'

export function EnergyBadge({ energyClass }: { energyClass: EnergyClass }) {
  return (
    <span className={styles.badge} role="img" aria-label={`Klasa energetyczna ${energyClass}`}>
      {energyClass}
    </span>
  )
}
