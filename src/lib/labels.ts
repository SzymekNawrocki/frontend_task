import type { Feature } from '../types/product'
import type { SortKey } from './filters'

export const FEATURE_LABELS: Record<Feature, string> = {
  addwash: 'Drzwi AddWash™',
  'ai-control': 'Panel AI Control',
  inverter: 'Silnik inwerterowy',
  display: 'Wyświetlacz elektroniczny',
}

export const SORT_LABELS: Record<SortKey, string> = {
  popularity: 'Popularność',
  price: 'Cena',
  capacity: 'Pojemność',
}
