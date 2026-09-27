import styles from './ShowMore.module.css'

export function ShowMore({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      Pokaż więcej
      <span className={styles.arrow} aria-hidden="true" />
    </button>
  )
}
