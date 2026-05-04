import { useState, useEffect } from 'react'
import type { Collection } from '@/lib/types'
import { getCollections, getCollection } from '@/lib/shopify'

export function useCollections(first = 20) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getCollections(first)
      .then(setCollections)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [first])

  return { collections, loading, error }
}

export function useCollection(handle: string) {
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!handle) { setLoading(false); return }
    setLoading(true)
    getCollection(handle)
      .then(setCollection)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [handle])

  return { collection, loading, error }
}
