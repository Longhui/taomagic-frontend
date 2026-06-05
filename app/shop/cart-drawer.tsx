'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { MedusaCart, MedusaLineItem } from '../lib/medusa-types'

interface CartDrawerProps {
  cart: MedusaCart | null
  loading: boolean
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  onRemoveItem: (lineItemId: string) => Promise<void>
}

export default function CartDrawer({
  cart,
  loading,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const items = cart?.items || []
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart?.subtotal != null ? cart.subtotal : items.reduce((sum, item) => sum + (item.unit_price) * item.quantity, 0)
  const total = cart?.total != null ? cart.total : subtotal

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const drawer = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-rice shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10 bg-white">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-ink" />
              <h2 className="text-lg font-serif text-ink">Shopping Cart</h2>
              {itemCount > 0 && (
                <span className="bg-cinnabar text-rice text-xs px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-ink/5 rounded-sm transition-colors"
            >
              <X size={20} className="text-ink/60" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center mb-4">
                  <ShoppingCart size={28} className="text-ink/30" />
                </div>
                <h3 className="font-serif text-ink text-lg mb-1">Your cart is empty</h3>
                <p className="text-sm text-ink/50 mb-6">Browse our Feng Shui collection and add items you love.</p>
                <button
                  onClick={onClose}
                  className="bg-bronze text-rice px-6 py-2.5 rounded-sm text-sm hover:bg-bronze/80 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    loading={loading}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-ink/10 bg-white px-6 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <span className="text-ink font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {cart?.discount_total != null && cart.discount_total > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Discount</span>
                  <span className="text-green-600">-${(cart.discount_total).toFixed(2)}</span>
                </div>
              )}
              {cart?.shipping_total != null && cart.shipping_total >= 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">Shipping</span>
                  <span className="text-ink/70">
                    {cart.shipping_total === 0 ? 'Calculated at checkout' : `$${(cart.shipping_total).toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-medium border-t border-ink/10 pt-3">
                <span className="text-ink">Total</span>
                <span className="text-gold text-lg font-serif">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link
                href="/shop/checkout"
                className="block w-full bg-cinnabar text-rice text-center py-3 rounded-sm text-sm font-medium hover:bg-cinnabar/80 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={onClose}
                className="w-full text-center text-sm text-ink/50 hover:text-ink transition-colors py-1"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )

  if (!mounted) return null
  return createPortal(drawer, document.body)
}

function CartItem({
  item,
  loading,
  onUpdateQuantity,
  onRemoveItem,
}: {
  item: MedusaLineItem
  loading: boolean
  onUpdateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  onRemoveItem: (lineItemId: string) => Promise<void>
}) {
  const [qtyLoading, setQtyLoading] = React.useState(false)

  const handleIncrement = async () => {
    setQtyLoading(true)
    try {
      await onUpdateQuantity(item.id, item.quantity + 1)
    } finally {
      setQtyLoading(false)
    }
  }

  const handleDecrement = async () => {
    if (item.quantity <= 1) {
      await handleRemove()
      return
    }
    setQtyLoading(true)
    try {
      await onUpdateQuantity(item.id, item.quantity - 1)
    } finally {
      setQtyLoading(false)
    }
  }

  const handleRemove = async () => {
    setQtyLoading(true)
    try {
      await onRemoveItem(item.id)
    } finally {
      setQtyLoading(false)
    }
  }

  const lineTotal = item.unit_price * item.quantity
  const imageUrl = item.thumbnail

  return (
    <div className="flex gap-4 bg-white rounded-sm border border-ink/10 p-3">
      {/* Image */}
      <div className="w-20 h-20 rounded-sm bg-rice flex-shrink-0 overflow-hidden relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ink/5 to-ink/10 flex items-center justify-center">
            <span className="text-lg font-serif text-gold/40">
              {(item.product_title || item.title).split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-ink truncate">{item.title}</h4>
        {item.variant_title && item.variant_title !== 'Default' && (
          <p className="text-xs text-ink/40 mt-0.5">{item.variant_title}</p>
        )}
        <p className="text-sm text-gold font-serif mt-1">${(item.unit_price).toFixed(2)}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 border border-ink/10 rounded-sm">
            <button
              onClick={handleDecrement}
              disabled={qtyLoading || loading}
              className="p-1.5 hover:bg-ink/5 transition-colors disabled:opacity-30"
            >
              {item.quantity <= 1 ? <Trash2 size={12} /> : <Minus size={12} />}
            </button>
            <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={qtyLoading || loading}
              className="p-1.5 hover:bg-ink/5 transition-colors disabled:opacity-30"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink/60">${lineTotal.toFixed(2)}</span>
            <button
              onClick={handleRemove}
              disabled={qtyLoading || loading}
              className="p-1 hover:bg-cinnabar/10 rounded-sm transition-colors disabled:opacity-30"
            >
              <Trash2 size={12} className="text-cinnabar/60" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
