'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface WishlistItem {
  productId: string
  variantId?: string
  variantTitle?: string
  title: string
  slug: string
  price: number
  thumbnailUrl?: string | null
  addedAt: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeFromWishlist: (productId: string, variantId?: string) => void
  isInWishlist: (productId: string, variantId?: string) => boolean
  clearWishlist: () => void
  wishlistCount: number
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_KEY = 'fathstore-wishlist'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
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
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
    } catch {}
  }, [items, isInitialized])

  const addToWishlist = useCallback((newItem: Omit<WishlistItem, 'addedAt'>) => {
    const key = `${newItem.productId}-${newItem.variantId || 'base'}`

    setItems((prev) => {
      // Check if already exists
      const exists = prev.some(item => `${item.productId}-${item.variantId || 'base'}` === key)
      if (exists) return prev

      return [...prev, {
        ...newItem,
        addedAt: new Date().toISOString(),
      }]
    })
    setIsOpen(true)
  }, [])

  const removeFromWishlist = useCallback((productId: string, variantId?: string) => {
    const key = `${productId}-${variantId || 'base'}`
    setItems((prev) => prev.filter(item => `${item.productId}-${item.variantId || 'base'}` !== key))
  }, [])

  const isInWishlist = useCallback((productId: string, variantId?: string): boolean => {
    const key = `${productId}-${variantId || 'base'}`
    return items.some(item => `${item.productId}-${item.variantId || 'base'}` === key)
  }, [items])

  const clearWishlist = useCallback(() => setItems([]), [])

  const wishlistCount = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}