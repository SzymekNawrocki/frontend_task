import styles from './Button.module.css'

interface SelectButtonProps {
  selected: boolean
  productName: string
  onToggle: () => void
}

export function SelectButton({ selected, productName, onToggle }: SelectButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      aria-label={`${selected ? 'Wybrane' : 'Wybierz'}: ${productName}`}
      onClick={onToggle}
    >
      {selected ? 'Wybrane' : 'Wybierz'}
    </button>
  )
}
