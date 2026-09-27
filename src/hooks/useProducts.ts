import { useCallback, useEffect, useState } from 'react'
import type { Product } from '../types/product'

type ProductsState =
  { status: 'loading' } | { status: 'error' } | { status: 'success'; products: Product[] }

const PRODUCTS_URL = `${import.meta.env.BASE_URL}data/products.json`

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL, { signal })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return (await response.json()) as Product[]
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchProducts(controller.signal)
      .then((products) => setState({ status: 'success', products }))
      .catch(() => {
        if (controller.signal.aborted) return
        setState({ status: 'error' })
      })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((value) => value + 1)
  }, [])

  return { ...state, retry }
}
