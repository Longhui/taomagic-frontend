'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ChevronRight } from 'lucide-react'
import type { ProductItem } from '../lib/medusa-types'
import { trackClick } from '@/app/lib/analytics'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fields = ['id','title','handle','description','thumbnail','collection.handle','variants.id','variants.calculated_price','tags.value','metadata'].join(',')
    fetch(`${BACKEND_URL}/store/products?limit=4&fields=${fields}`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
      .then(r => r.json())
      .then(data => {
        if (data.products) {
          const mapped: ProductItem[] = data.products.map((p: any) => ({
            id: p.id,
            name: p.title,
            price: p.variants?.[0]?.calculated_price?.calculated_amount || 0,
            currencyCode: p.variants?.[0]?.calculated_price?.currency_code || 'usd',
            category: p.collection?.handle || 'all',
            description: p.description || '',
            thumbnail: p.thumbnail
              ? (p.thumbnail.startsWith('http') ? p.thumbnail : BACKEND_URL + p.thumbnail)
              : undefined,
            handle: p.handle,
            bestseller: !!(p.metadata && p.metadata.bestseller),
            tags: (p.tags || []).map((t: any) => t.value),
            material: '',
            size: '',
            rating: 0,
            reviews: 0,
            images: [],
            variantId: p.variants?.[0]?.id,
          }))
          setProducts(mapped)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-24 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-rice mb-2">Curated Feng Shui Objects</h2>
            <p className="text-rice/60">Each item selected for authentic energy and purpose</p>
          </div>
          <Link href="/shop" onClick={() => trackClick('cta', 'Featured - View All')} className="hidden md:inline-flex items-center gap-2 text-gold hover:text-rice transition-colors">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-ink border border-rice/10 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-rice/5" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-rice/10 rounded-sm" />
                  <div className="h-5 w-3/4 bg-rice/10 rounded-sm" />
                  <div className="h-4 w-full bg-rice/10 rounded-sm" />
                  <div className="h-4 w-1/2 bg-rice/10 rounded-sm" />
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <Link key={product.id} href={`/shop/${product.handle}`} onClick={() => trackClick('shop', `Featured Product - ${product.name}`)} className="group bg-ink border border-rice/10 rounded-lg overflow-hidden hover:border-gold/50 transition-all">
                <div className="aspect-square bg-gradient-to-br from-ink to-ink/80 flex items-center justify-center relative overflow-hidden">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-rice/5 border border-rice/20 flex items-center justify-center">
                      <Sparkles size={32} className="text-gold/60" />
                    </div>
                  )}
                  {product.bestseller && (
                    <span className="absolute top-3 right-3 bg-cinnabar text-rice text-xs px-2 py-1 rounded-sm">Best Seller</span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-bronze uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="text-rice font-serif text-lg mb-2">{product.name}</h3>
                  <p className="text-rice/50 text-sm mb-4 line-clamp-2">{product.description.replace(/[#*`\[\]()>|~\-_]/g, '').slice(0, 120)}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gold text-xl font-serif">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
