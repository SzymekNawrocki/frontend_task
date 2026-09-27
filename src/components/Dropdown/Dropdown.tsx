import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import styles from './Dropdown.module.css'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  label: string
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function Dropdown({ label, options, value, onChange, isOpen, onOpenChange }: DropdownProps) {
  const id = useId()
  const labelId = `${id}-label`
  const buttonId = `${id}-button`
  const listId = `${id}-list`

  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const [activeIndex, setActiveIndex] = useState(selectedIndex)

  const closeSilently = useCallback(() => onOpenChange(false), [onOpenChange])
  useClickOutside(rootRef, closeSilently, isOpen)

  useEffect(() => {
    if (isOpen) listRef.current?.focus()
  }, [isOpen])

  function open() {
    setActiveIndex(selectedIndex)
    onOpenChange(true)
  }

  function close() {
    onOpenChange(false)
    buttonRef.current?.focus()
  }

  function select(index: number) {
    const option = options[index]
    if (option) onChange(option.value)
    close()
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      open()
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const lastIndex = options.length - 1
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((index) => Math.min(index + 1, lastIndex))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((index) => Math.max(index - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(lastIndex)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        select(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Tab':
        onOpenChange(false)
        break
    }
  }

  return (
    <div className={styles.dropdown} ref={rootRef}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <button
        id={buttonId}
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-labelledby={`${labelId} ${buttonId}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
      >
        <span className={styles.value}>{options[selectedIndex]?.label}</span>
        <span className={styles.arrow} aria-hidden="true" />
      </button>
      {isOpen && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className={styles.list}
          aria-labelledby={labelId}
          aria-activedescendant={`${listId}-${activeIndex}`}
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={[
                styles.option,
                index === activeIndex && styles.active,
                option.value === value && styles.selected,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => select(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
