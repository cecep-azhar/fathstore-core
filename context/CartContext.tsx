'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'

export interface CartItem {
  cartId: string
  productId: string
  title: string
  slug: string
  price: number
  quantity: number
  thumbnailUrl?: string | null
  variant?: {
    id: string
    name: string
  }
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'cartId'>) => void
  removeFromCart: (cartId: string) => void
  updateQuantity: (cartId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = 'fathstore-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { user, isLoading: authLoading } = useAuth()

  // Load from localStorage on mount
  useEffect(() => {
    if (authLoading) return
    
    try {
      const saved = localStorage.getItem(CART_KEY)
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
    setIsInitialized(true)
  }, [authLoading])

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {}
  }, [items, isInitialized])

  const addToCart = (newItem: Omit<CartItem, 'cartId'>) => {
    const cartId = `${newItem.productId}-${newItem.variant?.id || 'base'}`

    setItems((prev) => {
      const existing = prev.find((item) => item.cartId === cartId)
      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      }
      return [...prev, { ...newItem, cartId }]
    })
  }

  const removeFromCart = (cartId: string) => {
    setItems((prev) => prev.filter((item) => item.cartId !== cartId))
  }

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId)
      return
    }
    setItems((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)))
  }

  const clearCart = () => setItems([])

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
