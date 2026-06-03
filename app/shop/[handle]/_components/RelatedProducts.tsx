'use client'

import React from 'react'
import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import type { ProductItem } from '@/app/lib/medusa-types'

interface RelatedProductsProps {
  products: ProductItem[]
  currentProductId: string
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  // Filter out current product and limit to 6
  const related = products
    .filter(p => p.id !== currentProductId)
    .slice(0, 6)

  if (related.length === 0) return null

  return (
    <section className="py-12 lg:py-16 border-t border-ink/10">
      <h2 className="font-serif text-2xl md:text-3xl text-ink mb-8">
        You May Also Like
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
        {related.map((product) => {
          const hasImage = product.thumbnail
          return (
            <Link
              key={product.id}
              href={`/shop/${product.handle}`}
              className="flex-shrink-0 w-[260px] sm:w-[280px] bg-white rounded-lg border border-ink/10 overflow-hidden hover:shadow-lg transition-all duration-300 group snap-start"
            >
              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-rice to-rice/80 relative overflow-hidden">
                {hasImage ? (
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-ink/5 border-2 border-ink/10 flex items-center justify-center">
                      <Star size={24} className="text-gold/40" />
                    </div>
                  </div>
                )}
                {product.bestseller && (
                  <span className="absolute top-2 left-2 bg-cinnabar text-rice text-[10px] px-1.5 py-0.5 rounded-sm">
                    Best Seller
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-0.5 mb-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={10}
                      className={i <= Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-ink/20'}
                    />
                  ))}
                  <span className="text-[10px] text-ink/40 ml-1">({product.reviews})</span>
                </div>

                <h3 className="font-serif text-ink text-sm mb-1 leading-tight">{product.name}</h3>

                <div className="flex items-baseline gap-1">
                  <span className="text-base font-serif text-gold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-[10px] text-ink/30 line-through">${product.originalPrice.toFixed(0)}</span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
