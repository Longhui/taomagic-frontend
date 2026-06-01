'use client'

import React, { useState, useMemo } from 'react'
import { ArrowLeft, ShoppingCart, Star, Filter, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useMappedProducts, useCart, useCollections } from '../lib/medusa'
import CartDrawer from './cart-drawer'
import type { ProductItem } from '../lib/medusa-types'

// Fallback categories when Medusa backend is unreachable
const FALLBACK_CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '✦' },
  { id: 'wealth', name: 'Wealth & Abundance', icon: '💰' },
  { id: 'protection', name: 'Protection & Cleansing', icon: '🛡️' },
  { id: 'harmony', name: 'Harmony & Balance', icon: '☯️' },
  { id: 'health', name: 'Health & Vitality', icon: '🌿' },
  { id: 'love', name: 'Love & Relationships', icon: '💕' },
]

// Demo products used as fallback when Medusa is offline
const DEMO_PRODUCTS: ProductItem[] = [
  { id: 'demo-1', name: 'Brass Wu Lou (Calabash)', price: 48, category: 'health', rating: 4.9, reviews: 128, description: 'Traditional Feng Shui cure for illness and negative energy.', material: 'Solid Brass', size: '4.5 inches', tags: ['Health', 'Protection', 'Brass'], bestseller: true, images: [], handle: 'brass-wu-lou' },
  { id: 'demo-2', name: 'Obsidian Pixiu Bracelet', price: 36, category: 'wealth', rating: 4.8, reviews: 256, description: 'The legendary wealth beast Pixiu paired with protective black obsidian.', material: 'Black Obsidian', size: 'Adjustable 6-8 inches', tags: ['Wealth', 'Protection', 'Obsidian'], bestseller: true, images: [], handle: 'obsidian-pixiu' },
  { id: 'demo-3', name: 'Bagua Mirror Set (3pc)', price: 62, category: 'protection', rating: 4.7, reviews: 89, description: 'Complete set of flat, convex, and concave Bagua mirrors.', material: 'Wood, Glass Mirror', size: '6 inches each', tags: ['Protection', 'Bagua', 'Mirror'], bestseller: false, images: [], handle: 'bagua-mirror-set' },
  { id: 'demo-4', name: 'Five Elements Crystal Grid', price: 89, category: 'harmony', rating: 4.9, reviews: 67, description: 'Curated crystal set representing Wood, Fire, Earth, Metal, Water.', material: 'Natural Crystals', size: 'Grid 8x8 inches', tags: ['Five Elements', 'Crystals', 'Harmony'], bestseller: false, images: [], handle: 'five-elements-grid' },
  { id: 'demo-5', name: 'Rose Quartz Mandarin Ducks', price: 54, category: 'love', rating: 4.8, reviews: 143, description: 'Pair of mandarin ducks carved from rose quartz, the stone of unconditional love.', material: 'Rose Quartz', size: '3 inches each', tags: ['Love', 'Rose Quartz', 'Mandarin Ducks'], bestseller: true, images: [], handle: 'rose-quartz-ducks' },
  { id: 'demo-6', name: 'Brass Money Frog (Three-Legged Toad)', price: 42, category: 'wealth', rating: 4.6, reviews: 198, description: 'The legendary Jin Chan sits upon coins, holding one in its mouth.', material: 'Brass with Gold Finish', size: '3.5 inches', tags: ['Wealth', 'Brass', 'Money Frog'], bestseller: false, images: [], handle: 'brass-money-frog' },
  { id: 'demo-7', name: 'Bamboo Wind Chime (8 Rods)', price: 38, category: 'harmony', rating: 4.7, reviews: 112, description: 'Eight bamboo rods produce soothing tones that activate positive chi flow.', material: 'Natural Bamboo', size: '24 inches total', tags: ['Harmony', 'Bamboo', 'Sound'], bestseller: false, images: [], handle: 'bamboo-wind-chime' },
  { id: 'demo-8', name: 'Five Emperor Coins Set', price: 28, category: 'wealth', rating: 4.5, reviews: 234, description: 'Replica coins from five powerful Qing Dynasty emperors.', material: 'Brass Alloy', size: '1.2 inches each', tags: ['Wealth', 'Coins', 'History'], bestseller: false, images: [], handle: 'five-emperor-coins' },
  { id: 'demo-9', name: 'Selenite Wand Set', price: 45, category: 'protection', rating: 4.8, reviews: 156, description: 'High-vibration selenite wands for space cleansing and energy clearing.', material: 'Natural Selenite', size: '6 inches each (3pc)', tags: ['Protection', 'Cleansing', 'Selenite'], bestseller: false, images: [], handle: 'selenite-wand-set' },
  { id: 'demo-10', name: 'Ammonite Fossil Display', price: 78, category: 'wealth', rating: 4.9, reviews: 45, description: 'Ancient ammonite fossil with natural golden ratio spiral.', material: 'Natural Fossil', size: '5-6 inches', tags: ['Wealth', 'Fossil', 'Ancient'], bestseller: false, images: [], handle: 'ammonite-fossil' },
  { id: 'demo-11', name: 'Red String Protection Bracelet', price: 18, category: 'protection', rating: 4.4, reviews: 567, description: 'Simple yet powerful red string bracelet blessed with protective intention.', material: 'Silk Thread', size: 'Adjustable', tags: ['Protection', 'Simple', 'Red String'], bestseller: true, images: [], handle: 'red-string-bracelet' },
  { id: 'demo-12', name: 'Lucky Bamboo (3 Stalks)', price: 32, category: 'wealth', rating: 4.6, reviews: 389, description: 'Three stalks represent happiness, long life, and prosperity.', material: 'Live Plant + Ceramic', size: '12-16 inches', tags: ['Wealth', 'Plant', 'Bamboo'], bestseller: false, images: [], handle: 'lucky-bamboo' },
]

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
      className="group bg-white rounded-lg border border-ink/10 overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-rice to-rice/80 relative overflow-hidden">
        {hasImage ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
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

        {isHovered && (
          <div className="absolute inset-0 bg-ink/50 flex items-center justify-center transition-opacity">
            <button
              onClick={() => onAddToCart(product.id, product.variantId)}
              disabled={addingId === product.id || !product.variantId}
              className="bg-rice text-ink px-6 py-2 rounded-sm hover:bg-gold transition-colors text-sm font-medium disabled:opacity-50"
            >
              {!product.variantId ? 'Unavailable' : 'Quick Add'}
            </button>
          </div>
        )}
      </div>

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
            onClick={() => onAddToCart(product.id, product.variantId)}
            disabled={addingId === product.id || !product.variantId}
            className="bg-ink text-rice px-4 py-2 rounded-sm text-sm hover:bg-ink/80 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <ShoppingCart size={14} />
            {addingId === product.id ? '...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ========== Shop Page ==========
export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [cartOpen, setCartOpen] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)

  // Medusa data hooks
  const { products: mappedProducts, loading: productsLoading, error: productsError } = useMappedProducts()
  const { collections, loading: collectionsLoading } = useCollections()
  const { cart, loading: cartLoading, addToCart, updateItemQuantity, removeFromCart, getCartCount } = useCart()

  // Build categories: from Medusa collections if available, else fallback
  const categories = useMemo(() => {
    if (collections.length > 0) {
      const collectionCats = collections.map(c => ({
        id: c.handle,
        name: c.title,
        icon: '✦',
      }))
      return [{ id: 'all', name: 'All Items', icon: '✦' }, ...collectionCats]
    }
    return FALLBACK_CATEGORIES
  }, [collections])

  // Products: use API data if connected successfully, else fallback to demo
  const hasApiData = !productsError && !productsLoading && mappedProducts.length > 0
  const apiLoading = productsLoading || collectionsLoading
  const products = hasApiData ? mappedProducts : DEMO_PRODUCTS

  // Filter + Sort
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
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
  }, [products, activeCategory, searchQuery, sortBy])

  const cartCount = getCartCount()

  const handleAddToCart = async (productId: string, variantId?: string) => {
    if (!variantId) {
      // Try to find variant from API data if in Medusa mode
      return
    }
    setAddingId(productId)
    try {
      await addToCart(variantId, 1)
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-rice">
      {/* Header */}
      <div className="bg-ink text-rice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-rice/70 hover:text-gold transition-colors">
              <ArrowLeft size={20} />
              <span className="font-serif">TaoInsight</span>
            </Link>

            <div className="flex items-center gap-4">
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
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-rice/10 rounded-sm transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cinnabar text-rice text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-ink text-rice py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Feng Shui Store</h1>
          <p className="text-rice/60 max-w-2xl mx-auto">
            Authentic objects curated for energy, purpose, and transformation.
            Each item is selected based on traditional Feng Shui principles and blessed with intention.
          </p>
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
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
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

          <div className="flex items-center gap-2 ml-auto">
            <Filter size={16} className="text-ink/40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-ink/10 rounded-sm px-3 py-2 text-sm text-ink/70 focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Status indicator */}
        <div className="text-center py-2 mb-4">
          {productsLoading && (
            <p className="text-xs text-ink/40">Connecting to Medusa backend...</p>
          )}
        </div>

        {productsLoading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink/50">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!productsLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {!productsLoading && filteredProducts.length === 0 && (
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

      {/* Cart Drawer */}
      <CartDrawer
        cart={cart}
        loading={cartLoading}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateItemQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  )
}
