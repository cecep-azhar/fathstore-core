'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useAuth } from '@/providers/AuthProvider'

export interface CartItem {
  cartId: string // unique identifier (productId + variantId)
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

const MEMBER_URL = process.env.NEXT_PUBLIC_MEMBER_URL || 'http://localhost:3002'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { user, isLoading: authLoading } = useAuth()

  // Load from Cookies when user logs in
  useEffect(() => {
    if (authLoading) return

    if (!user) {
        setItems([])
        setIsInitialized(true)
        return
    }

    // Migrate from localStorage if exists (only once)
    if (typeof window !== 'undefined') {
        const local = localStorage.getItem('cart')
        if (local) {
            try {
                const parsed = JSON.parse(local)
                setItems(parsed)
                Cookies.set('cart', JSON.stringify(parsed), { expires: 7 })
                localStorage.removeItem('cart') // Clear after migration
                setIsInitialized(true)
                return
            } catch (e) {
                console.error('Failed to migrate local cart', e)
                localStorage.removeItem('cart')
            }
        }
    }

    const saved = Cookies.get('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
    setIsInitialized(true)
  }, [user, authLoading])

  // Save to Cookies on change (only if logged in)
  useEffect(() => {
    if (isInitialized && user) {
      Cookies.set('cart', JSON.stringify(items), { expires: 7 })
    }
  }, [items, isInitialized, user])

  const addToCart = (newItem: Omit<CartItem, 'cartId'>) => {
    if (!user) {
        // Redirect to login if not logged in
        window.location.href = `${MEMBER_URL}/login`
        return
    }

    const cartId = `${newItem.productId}-${newItem.variant?.id || 'base'}`
    
    setItems((prev) => {
      // Check if item exists
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
