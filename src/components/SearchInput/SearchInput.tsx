import styles from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className={styles.wrapper} role="search">
      <label htmlFor="product-search" className="visually-hidden">
        Szukaj po nazwie lub kodzie produktu
      </label>
      <input
        id="product-search"
        className={styles.input}
        type="search"
        placeholder="Search…"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
      </svg>
    </div>
  )
}
