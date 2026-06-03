'use client'

import React, { useState } from 'react'
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react'

interface AddToCartSectionProps {
  productName: string
  price: number
  inventoryQuantity: number
  variantId?: string
  onAddToCart: (variantId: string, quantity: number) => Promise<void>
}

export default function AddToCartSection({
  productName,
  price,
  inventoryQuantity,
  variantId,
  onAddToCart,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const inStock = (inventoryQuantity ?? 0) > 0
  const canAdd = inStock && !!variantId && !adding

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta
    if (next >= 1 && next <= (inventoryQuantity || 99)) {
      setQuantity(next)
    }
  }

  const handleAddToCart = async () => {
    if (!canAdd || !variantId) return
    setAdding(true)
    try {
      await onAddToCart(variantId, quantity)
      setAdded(true)
      setQuantity(1)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      // Error is handled upstream
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="mb-8">
      {/* Stock indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-bronze' : 'bg-cinnabar'}`} />
        <span className={`text-sm ${inStock ? 'text-bronze' : 'text-cinnabar'}`}>
          {inStock
            ? `In Stock (${inventoryQuantity} available)`
            : 'Out of Stock'}
        </span>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-ink/60 uppercase tracking-wider text-xs">Qty</span>
        <div className="flex items-center border border-ink/10 rounded-sm bg-white">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || adding}
            className="p-2.5 hover:bg-ink/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-medium tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= (inventoryQuantity || 99) || adding}
            className="p-2.5 hover:bg-ink/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={!canAdd || adding}
        className={`w-full py-3.5 rounded-sm font-medium text-sm transition-all flex items-center justify-center gap-2 ${
          added
            ? 'bg-bronze text-rice'
            : canAdd
              ? 'bg-cinnabar text-rice hover:bg-cinnabar/90'
              : 'bg-ink/10 text-ink/30 cursor-not-allowed'
        }`}
      >
        {added ? (
          <>
            <Check size={16} />
            Added to Cart
          </>
        ) : adding ? (
          <>
            <span className="w-4 h-4 border-2 border-rice/30 border-t-rice rounded-full animate-spin" />
            Adding...
          </>
        ) : !variantId ? (
          <>
            <ShoppingCart size={16} />
            Unavailable
          </>
        ) : !inStock ? (
          'Out of Stock'
        ) : (
          <>
            <ShoppingCart size={16} />
            Add to Cart — ${(price * quantity).toFixed(2)}
          </>
        )}
      </button>

      {/* Trust signals */}
      <div className="mt-4 text-center text-xs text-ink/40 space-y-1">
        <p>✨ Free shipping on orders over $50</p>
        <p>🔒 Secure checkout · 30-day returns</p>
      </div>
    </div>
  )
}
