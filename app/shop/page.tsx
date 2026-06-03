'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { ShoppingCart, Star, Search } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import { useMappedProducts, useCollections } from '../lib/medusa'
import { useCartContext } from '../lib/CartContext'
import { FALLBACK_CATEGORIES, DEMO_PRODUCTS } from '../lib/demo-data'
import type { ProductItem } from '../lib/medusa-types'

// ========== Product Card ==========
const ProductCard = ({ product, onAddToCart, addingId }: {
  product: ProductItem
  onAddToCart: (id: string, variantId?: string) => void
  addingId: string | null
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  const hasImage = product.thumbnail && !imgError

  return (
    <div
      className="group bg-white rounded-lg border border-ink/10 overflow-hidden hover:shadow-lg transition-all duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image — wrapped in Link to product detail */}
      <Link href={`/shop/${product.handle}`}>
        <div className="aspect-square bg-gradient-to-br from-rice to-rice/80 relative overflow-hidden">
          {hasImage ? (
            <Image
              src={product.thumbnail!}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-ink/5 border-2 border-ink/10 flex items-center justify-center">
                <Star size={32} className="text-gold/40" />
              </div>
            </div>
          )}

          {product.bestseller && (
            <span className="absolute top-3 left-3 bg-cinnabar text-rice text-xs px-2 py-1 rounded-sm">
              Best Seller
            </span>
          )}

          {!product.variantId && (
            <span className="absolute top-3 right-3 bg-ink/70 text-rice text-[10px] px-2 py-0.5 rounded-sm">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      {/* Quick Add overlay — outside Link, positioned absolute over the image area */}
      {isHovered && (
        <div className="absolute top-0 left-0 right-0 aspect-square bg-ink/50 flex items-center justify-center z-10">
          <button
            onClick={(e) => {
              e.preventDefault()
              onAddToCart(product.id, product.variantId)
            }}
            disabled={addingId === product.id || !product.variantId}
            className="bg-rice text-ink px-6 py-2 rounded-sm hover:bg-gold transition-colors text-sm font-medium disabled:opacity-50"
          >
            {!product.variantId ? 'Unavailable' : 'Quick Add'}
          </button>
        </div>
      )}

      {/* Content area — Link to detail page */}
      <Link href={`/shop/${product.handle}`}>
        <div className="p-5">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-ink/20'} />
            ))}
            <span className="text-xs text-ink/50 ml-1">({product.reviews})</span>
          </div>

          <h3 className="font-serif text-ink text-lg mb-1">{product.name}</h3>
          <p className="text-xs text-ink/40 mb-3">
            {product.material && `${product.material} · `}
            {product.size}
          </p>

          <p className="text-sm text-ink/60 mb-4 line-clamp-2">{product.description}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-bronze/10 text-bronze px-2 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              {product.price > 0 ? (
                <>
                  <span className="text-xl font-serif text-gold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-ink/40 line-through">${product.originalPrice.toFixed(0)}</span>
                  )}
                </>
              ) : (
                <span className="text-sm text-ink/40 italic">Price TBD</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product.id, product.variantId)
              }}
              disabled={addingId === product.id || !product.variantId}
              className="bg-ink text-rice px-4 py-2 rounded-sm text-sm hover:bg-ink/80 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart size={14} />
              {addingId === product.id ? '...' : 'Add'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ========== Shop Page ==========
export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [addingId, setAddingId] = useState<string | null>(null)

  // Medusa data hooks
  const { products: mappedProducts, loading: productsLoading, error: productsError } = useMappedProducts()
  const { collections, loading: collectionsLoading } = useCollections()
  const { addToCart } = useCartContext()

  // Map of collection handle → emoji icon
  const COLLECTION_ICONS: Record<string, string> = {
    wealth: '💰',
    protection: '🛡️',
    harmony: '☯️',
    health: '🌿',
    love: '💕',
  }

  // Build categories: from Medusa collections if available, else fallback
  const categories = useMemo(() => {
    if (collections.length > 0) {
      const collectionCats = collections.map(c => ({
        id: c.handle,
        name: c.title,
        icon: COLLECTION_ICONS[c.handle] || '✦',
      }))
      return [{ id: 'all', name: 'All Items', icon: '✦' }, ...collectionCats]
    }
    return FALLBACK_CATEGORIES
  }, [collections])

  // Products: only show real API data or demo fallback when API has clearly failed
  const isLoading = productsLoading || collectionsLoading
  const apiConnected = !productsError && mappedProducts.length > 0
  const apiFailed = !!productsError
  const showDemoFallback = apiFailed && !isLoading

  // When loading: show empty array (spinner takes over UI)
  // When connected: show real products
  // When failed: show demo fallback
  const displayProducts = apiConnected
    ? mappedProducts
    : showDemoFallback ? DEMO_PRODUCTS : []

  // Filter + Sort
  const filteredProducts = useMemo(() => {
    return displayProducts.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory
      const matchesSearch = !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return b.reviews - a.reviews
    })
  }, [displayProducts, activeCategory, searchQuery, sortBy])

  const handleAddToCart = async (productId: string, variantId?: string) => {
    if (!variantId) {
      console.warn(`Cannot add "${productId}" to cart: no variantId available (using demo data?)`)
      alert('Demo products cannot be added to cart. Connect to a Medusa backend to enable purchases.')
      return
    }
    setAddingId(productId)
    try {
      await addToCart(variantId, 1)
    } catch (err) {
      console.error('Add to cart failed:', err)
      alert('Failed to add item to cart. Check that the Medusa backend is running on port 9000.')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-rice pt-16">
      <Navigation solid />

      {/* Hero Banner with Search */}
      <div className="bg-ink text-rice py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Feng Shui Store</h1>
          <p className="text-rice/60 max-w-2xl mx-auto">
            Authentic objects curated for energy, purpose, and transformation.
            Each item is selected based on traditional Feng Shui principles and blessed with intention.
          </p>

          {/* Search */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-sm bg-rice text-ink text-sm w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <Link
            href="/fengshui"
            className="mt-6 inline-flex items-center gap-2 bg-bronze text-rice px-6 py-3 rounded-sm text-sm hover:bg-bronze/80 transition-all"
          >
            <span>🎯</span>
            Take Your Feng Shui Evaluation
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-sm text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-ink text-rice'
                  : 'bg-white text-ink/70 hover:bg-ink/5 border border-ink/10'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
        {/* Decorative line */}
        <div className="h-0.5 bg-bronze/30 mb-6"></div>

        {/* Status indicator */}
        <div className="text-center py-2 mb-4">
          {productsLoading && (
            <p className="text-xs text-ink/40">Loading products from our collection...</p>
          )}
        </div>

        {productsLoading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink/50">Curating the finest Feng Shui items...</p>
          </div>
        )}

        {/* Products Grid */}
        {!productsLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                addingId={addingId}
              />
            ))}
          </div>
        )}

        {!productsLoading && !isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Star size={48} className="text-ink/20 mx-auto mb-4" />
            <p className="text-ink/50">No items found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Trust Section */}
      <div className="bg-ink text-rice py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { title: 'Authentic Sourcing', desc: 'All items sourced from traditional craftsmen and blessed with proper intention.' },
              { title: 'Energy Cleansed', desc: 'Every object is energetically cleansed with sage and sound before shipping.' },
              { title: '30-Day Harmony', desc: 'Not feeling the energy? Return within 30 days for full refund.' }
            ].map((item, i) => (
              <div key={i}>
                <h3 className="font-serif text-gold text-xl mb-2">{item.title}</h3>
                <p className="text-rice/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
