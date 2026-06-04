'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Sparkles, ShoppingCart, Menu, X } from 'lucide-react'
import { useCartContext } from '@/app/lib/CartContext'
import CartDrawer from '@/app/shop/cart-drawer'

// Yin Yang SVG
const YinYangSVG = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={`yin-yang-rotate ${className}`}>
    <circle cx="100" cy="100" r="98" fill="#1a1a1a" stroke="#c9a227" strokeWidth="2" />
    <path d="M100,2 A49,49 0 0,1 100,98 A49,49 0 0,0 100,198 A98,98 0 0,1 100,2" fill="#f5f0e8" />
    <circle cx="100" cy="50" r="15" fill="#1a1a1a" />
    <circle cx="100" cy="150" r="15" fill="#f5f0e8" />
  </svg>
)

interface NavigationProps {
  /** When true, navbar is always opaque (use for pages without a dark hero section) */
  solid?: boolean
  /** Optional content rendered on the far right of the navbar (e.g. cart button) */
  rightSlot?: React.ReactNode
}

export default function Navigation({ solid = false, rightSlot }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cart, cartCount, cartOpen, loading, openCart, closeCart, updateItemQuantity, removeFromCart } = useCartContext()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showOpaque = solid || scrolled

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'I Ching', href: '/iching' },
    { name: 'Wisdom', href: '/wisdom' },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        showOpaque ? 'bg-ink/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <YinYangSVG size={32} className="!animation-none" />
            <span className="text-rice font-serif text-xl font-bold tracking-wider">TaoInsight</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-rice/80 hover:text-gold transition-colors text-sm tracking-wide uppercase"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Cart icon — always visible */}
            <button
              onClick={(e) => { e.stopPropagation(); openCart() }}
              className="relative p-2 hover:bg-rice/10 rounded-sm transition-colors text-rice"
              aria-label="Open shopping cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-cinnabar text-rice text-[10px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center font-medium leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            {rightSlot}
            <button className="md:hidden text-rice" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-ink/95 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-3 text-rice/80 hover:text-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {/* Global cart drawer */}
      <CartDrawer
        cart={cart}
        loading={loading}
        isOpen={cartOpen}
        onClose={closeCart}
        onUpdateQuantity={updateItemQuantity}
        onRemoveItem={removeFromCart}
      />
    </nav>
  )
}
