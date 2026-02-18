'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Read cookie 'cart'
    const saved = Cookies.get('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      Cookies.set('cart', JSON.stringify(items), { expires: 7 })
    }
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
