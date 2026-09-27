import { useState } from 'react'
import type { FilterState, SortKey } from '../../lib/filters'
import { formatCapacity } from '../../lib/format'
import { FEATURE_LABELS, SORT_LABELS } from '../../lib/labels'
import { FEATURES, type EnergyClass, type Feature } from '../../types/product'
import { Dropdown, type DropdownOption } from '../Dropdown/Dropdown'
import styles from './FilterBar.module.css'

const SHOW_ALL: DropdownOption = { value: '', label: 'Pokaż wszystkie' }

type FilterKey = 'sort' | 'feature' | 'energy' | 'capacity'

interface FilterBarProps {
  filters: FilterState
  energyClasses: EnergyClass[]
  capacities: number[]
  onChange: (patch: Partial<FilterState>) => void
}

export function FilterBar({ filters, energyClasses, capacities, onChange }: FilterBarProps) {
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null)

  function openState(key: FilterKey) {
    return {
      isOpen: openFilter === key,
      onOpenChange: (open: boolean) =>
        setOpenFilter((current) => (open ? key : current === key ? null : current)),
    }
  }

  return (
    <div className={styles.bar}>
      <Dropdown
        label="Sortuj po:"
        options={Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label }))}
        value={filters.sort}
        onChange={(value) => onChange({ sort: value as SortKey })}
        {...openState('sort')}
      />
      <Dropdown
        label="Funkcje:"
        options={[SHOW_ALL, ...FEATURES.map((value) => ({ value, label: FEATURE_LABELS[value] }))]}
        value={filters.feature ?? ''}
        onChange={(value) => onChange({ feature: (value || null) as Feature | null })}
        {...openState('feature')}
      />
      <Dropdown
        label="Klasa energetyczna:"
        options={[SHOW_ALL, ...energyClasses.map((value) => ({ value, label: value }))]}
        value={filters.energy ?? ''}
        onChange={(value) => onChange({ energy: (value || null) as EnergyClass | null })}
        {...openState('energy')}
      />
      <Dropdown
        label="Pojemność:"
        options={[
          SHOW_ALL,
          ...capacities.map((value) => ({
            value: String(value),
            label: `${formatCapacity(value)} kg`,
          })),
        ]}
        value={filters.capacity === null ? '' : String(filters.capacity)}
        onChange={(value) => onChange({ capacity: value ? Number(value) : null })}
        {...openState('capacity')}
      />
    </div>
  )
}
