'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useDefaultRegion, useCart } from './medusa'
import type { MedusaCart } from './medusa-types'

interface CartContextValue {
  cart: MedusaCart | null
  cartCount: number
  cartOpen: boolean
  loading: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (variantId: string, quantity?: number) => Promise<MedusaCart>
  updateItemQuantity: (lineItemId: string, quantity: number) => Promise<void>
  removeFromCart: (lineItemId: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const { regionId } = useDefaultRegion()
  const { cart, loading, addToCart, updateItemQuantity, removeFromCart, getCartCount } = useCart(regionId)

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  // Close on route change (Next.js doesn't need explicit route listener here)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: getCartCount(),
        cartOpen,
        loading,
        openCart,
        closeCart,
        addToCart,
        updateItemQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}
