export const FEATURES = ['addwash', 'ai-control', 'inverter', 'display'] as const

export type Feature = (typeof FEATURES)[number]

export const ENERGY_CLASSES = ['A', 'B', 'C', 'D', 'E', 'F'] as const

export type EnergyClass = (typeof ENERGY_CLASSES)[number]

export interface Product {
  id: string
  code: string
  name: string
  color: string
  capacityKg: number
  dimensionsCm: { w: number; d: number; h: number }
  features: Feature[]
  energyClass: EnergyClass
  priceGrosze: number
  installments: { count: number; amountGrosze: number }
  priceValidFrom: string
  priceValidTo: string
  popularity: number
  image: string
}
