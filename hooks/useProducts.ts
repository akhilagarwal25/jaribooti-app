import { useState, useEffect, useCallback } from 'react'
import type { Product } from '@/lib/types'
import { getProducts, getFeaturedProducts, getProduct, searchProducts } from '@/lib/shopify'

export function useProducts(first = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getProducts(first)
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [first])

  return { products, loading, error }
}

export function useFeaturedProducts(first = 10) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getFeaturedProducts(first)
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [first])

  return { products, loading, error }
}

export function useProduct(handle: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!handle) { setLoading(false); return }
    setLoading(true)
    getProduct(handle)
      .then(setProduct)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [handle])

  return { product, loading, error }
}

export function useSearchProducts(query: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback((q: string) => {
    if (!q.trim()) { setProducts([]); return }
    setLoading(true)
    searchProducts(q)
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error, search }
}
