'use client'

import React, { useState, useMemo } from 'react'
import { ArrowLeft, ShoppingCart, Star, Filter, Search } from 'lucide-react'
import Link from 'next/link'
import { useProducts, useCart } from '../lib/medusa'

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '✦' },
  { id: 'wealth', name: 'Wealth & Abundance', icon: '💰' },
  { id: 'protection', name: 'Protection & Cleansing', icon: '🛡️' },
  { id: 'harmony', name: 'Harmony & Balance', icon: '☯️' },
  { id: 'health', name: 'Health & Vitality', icon: '🌿' },
  { id: 'love', name: 'Love & Relationships', icon: '💕' },
]

// 后端不可用时的演示数据
const DEMO_PRODUCTS: ProductItem[] = [
  { id: 'demo-1', name: 'Brass Wu Lou (Calabash)', price: 48, category: 'health', rating: 4.9, reviews: 128, description: 'Traditional Feng Shui cure for illness and negative energy.', material: 'Solid Brass', size: '4.5 inches', tags: ['Health', 'Protection', 'Brass'], bestseller: true },
  { id: 'demo-2', name: 'Obsidian Pixiu Bracelet', price: 36, category: 'wealth', rating: 4.8, reviews: 256, description: 'The legendary wealth beast Pixiu paired with protective black obsidian.', material: 'Black Obsidian', size: 'Adjustable 6-8 inches', tags: ['Wealth', 'Protection', 'Obsidian'], bestseller: true },
  { id: 'demo-3', name: 'Bagua Mirror Set (3pc)', price: 62, category: 'protection', rating: 4.7, reviews: 89, description: 'Complete set of flat, convex, and concave Bagua mirrors.', material: 'Wood, Glass Mirror', size: '6 inches each', tags: ['Protection', 'Bagua', 'Mirror'], bestseller: false },
  { id: 'demo-4', name: 'Five Elements Crystal Grid', price: 89, category: 'harmony', rating: 4.9, reviews: 67, description: 'Curated crystal set representing Wood, Fire, Earth, Metal, Water.', material: 'Natural Crystals', size: 'Grid 8x8 inches', tags: ['Five Elements', 'Crystals', 'Harmony'], bestseller: false },
  { id: 'demo-5', name: 'Rose Quartz Mandarin Ducks', price: 54, category: 'love', rating: 4.8, reviews: 143, description: 'Pair of mandarin ducks carved from rose quartz, the stone of unconditional love.', material: 'Rose Quartz', size: '3 inches each', tags: ['Love', 'Rose Quartz', 'Mandarin Ducks'], bestseller: true },
  { id: 'demo-6', name: 'Brass Money Frog (Three-Legged Toad)', price: 42, category: 'wealth', rating: 4.6, reviews: 198, description: 'The legendary Jin Chan sits upon coins, holding one in its mouth.', material: 'Brass with Gold Finish', size: '3.5 inches', tags: ['Wealth', 'Brass', 'Money Frog'], bestseller: false },
  { id: 'demo-7', name: 'Bamboo Wind Chime (8 Rods)', price: 38, category: 'harmony', rating: 4.7, reviews: 112, description: 'Eight bamboo rods produce soothing tones that activate positive chi flow.', material: 'Natural Bamboo', size: '24 inches total', tags: ['Harmony', 'Bamboo', 'Sound'], bestseller: false },
  { id: 'demo-8', name: 'Five Emperor Coins Set', price: 28, category: 'wealth', rating: 4.5, reviews: 234, description: 'Replica coins from five powerful Qing Dynasty emperors.', material: 'Brass Alloy', size: '1.2 inches each', tags: ['Wealth', 'Coins', 'History'], bestseller: false },
  { id: 'demo-9', name: 'Selenite Wand Set', price: 45, category: 'protection', rating: 4.8, reviews: 156, description: 'High-vibration selenite wands for space cleansing and energy clearing.', material: 'Natural Selenite', size: '6 inches each (3pc)', tags: ['Protection', 'Cleansing', 'Selenite'], bestseller: false },
  { id: 'demo-10', name: 'Ammonite Fossil Display', price: 78, category: 'wealth', rating: 4.9, reviews: 45, description: 'Ancient ammonite fossil with natural golden ratio spiral.', material: 'Natural Fossil', size: '5-6 inches', tags: ['Wealth', 'Fossil', 'Ancient'], bestseller: false },
  { id: 'demo-11', name: 'Red String Protection Bracelet', price: 18, category: 'protection', rating: 4.4, reviews: 567, description: 'Simple yet powerful red string bracelet blessed with protective intention.', material: 'Silk Thread', size: 'Adjustable', tags: ['Protection', 'Simple', 'Red String'], bestseller: true },
  { id: 'demo-12', name: 'Lucky Bamboo (3 Stalks)', price: 32, category: 'wealth', rating: 4.6, reviews: 389, description: 'Three stalks represent happiness, long life, and prosperity.', material: 'Live Plant + Ceramic', size: '12-16 inches', tags: ['Wealth', 'Plant', 'Bamboo'], bestseller: false },
]

interface ProductItem {
  id: string
  name: string
  price: number
  category: string
  rating: number
  reviews: number
  description: string
  material: string
  size: string
  tags: string[]
  bestseller: boolean
  thumbnail?: string
}

const ProductCard = ({ product, onAddToCart, addingId }: {
  product: ProductItem
  onAddToCart: (id: string) => void
  addingId: string | null
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="group bg-white rounded-lg border border-ink/10 overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-rice to-rice/80 relative overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover"
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

        {isHovered && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center transition-opacity">
            <button className="bg-rice text-ink px-6 py-2 rounded-sm hover:bg-gold transition-colors">
              Quick View
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
        <p className="text-xs text-ink/40 mb-3">{product.material} · {product.size}</p>

        <p className="text-sm text-ink/60 mb-4 line-clamp-2">{product.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.map(tag => (
            <span key={tag} className="text-xs bg-bronze/10 text-bronze px-2 py-0.5 rounded-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-serif text-gold">${product.price}</span>
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={addingId === product.id}
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

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const { products: apiProducts, loading } = useProducts()
  const { cart, addToCart } = useCart()
  const [addingId, setAddingId] = useState<string | null>(null)

  const cartCount = cart?.items?.length || 0

  const products = useMemo(() => {
    if (apiProducts.length > 0) {
      // Map API product data to UI shape
      return apiProducts.map((p) => {
        const variant = p.variants?.[0]
        const price = variant?.prices?.[0]?.amount || 0
        // Parse metadata for demo fields not in Medusa core schema
        const meta = (p.metadata || {}) as Record<string, unknown>
        return {
          id: p.id,
          name: p.title,
          price: price / 100, // cents → dollars
          category: p.categories?.[0]?.handle || p.collection?.handle || 'all',
          rating: (meta.rating as number) || 4.5,
          reviews: (meta.reviews as number) || 0,
          description: p.description || '',
          material: (meta.material as string) || '',
          size: (meta.size as string) || '',
          tags: p.tags?.map((t: any) => t.value) || [],
          bestseller: (meta.bestseller as boolean) || false,
          thumbnail: p.thumbnail || undefined,
        }
      })
    }
    return DEMO_PRODUCTS
  }, [apiProducts])

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    return b.reviews - a.reviews
  })

  const handleAddToCart = async (productId: string) => {
    setAddingId(productId)
    try {
      // Use the first variant's ID — in production add a variant picker
      const product = apiProducts.find(p => p.id === productId)
      const variantId = product?.variants?.[0]?.id
      if (variantId) {
        await addToCart(variantId, 1)
      }
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
              <button className="relative p-2 hover:bg-rice/10 rounded-sm transition-colors">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map(cat => (
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

        {/* Loading */}
        {loading && apiProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink/50">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} addingId={addingId} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
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
