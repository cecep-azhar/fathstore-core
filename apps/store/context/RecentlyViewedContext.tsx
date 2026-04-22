'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface RecentlyViewedItem {
  productId: string
  title: string
  slug: string
  price: number
  thumbnailUrl?: string | null
  viewedAt: string
}

interface RecentlyViewedContextType {
  items: RecentlyViewedItem[]
  addView: (product: Omit<RecentlyViewedItem, 'viewedAt'>) => void
  clearViews: () => void
  viewCount: number
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

const STORAGE_KEY = 'fathstore-recently-viewed'
const MAX_ITEMS = 20

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, isInitialized])

  const addView = useCallback((product: Omit<RecentlyViewedItem, 'viewedAt'>) => {
    setItems((prev) => {
      // Remove existing entry for this product
      const filtered = prev.filter((item) => item.productId !== product.productId)

      // Add to the beginning with timestamp
      const newItem: RecentlyViewedItem = {
        ...product,
        viewedAt: new Date().toISOString(),
      }

      // Keep only the most recent MAX_ITEMS
      return [newItem, ...filtered].slice(0, MAX_ITEMS)
    })
  }, [])

  const clearViews = useCallback(() => setItems([]), [])

  const viewCount = items.length

  return (
    <RecentlyViewedContext.Provider
      value={{
        items,
        addView,
        clearViews,
        viewCount,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (!context) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return context
}