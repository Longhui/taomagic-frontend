'use client'

import React from 'react'
import { Star, Ruler, Weight, Gem } from 'lucide-react'
import type { ProductItem, RatingDistribution } from '@/app/lib/medusa-types'

interface ProductInfoProps {
  product: ProductItem
  onScrollToReviews: () => void
}

export default function ProductInfo({ product, onScrollToReviews }: ProductInfoProps) {
  const filledStars = Math.floor(product.rating)
  const hasFraction = product.rating - filledStars >= 0.5

  return (
    <div>
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.bestseller && (
          <span className="bg-cinnabar text-rice text-xs px-2 py-1 rounded-sm font-medium">
            Best Seller
          </span>
        )}
        {product.inventoryQuantity !== undefined && product.inventoryQuantity <= 5 && product.inventoryQuantity > 0 && (
          <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded-sm font-medium">
            Low Stock
          </span>
        )}
        {product.inventoryQuantity !== undefined && product.inventoryQuantity === 0 && (
          <span className="bg-ink/10 text-ink/50 text-xs px-2 py-1 rounded-sm font-medium">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product name */}
      <h1 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4">
        {product.name}
      </h1>

      {/* Rating */}
      <button
        onClick={onScrollToReviews}
        className="flex items-center gap-2 mb-5 group"
      >
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={16}
              className={`transition-colors ${
                star <= filledStars
                  ? 'text-gold fill-gold'
                  : star === filledStars + 1 && hasFraction
                    ? 'text-gold/40 fill-gold/40'
                    : 'text-ink/20'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-ink/50 group-hover:text-gold transition-colors">
          {product.rating} ({product.reviews} reviews)
        </span>
      </button>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-serif text-gold">
          ${product.price.toFixed(2)}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-lg text-ink/30 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Attributes grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-white/60 rounded-sm border border-ink/5">
        {product.material && (
          <div className="flex items-center gap-2">
            <Gem size={14} className="text-ink/40 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-ink/40 uppercase tracking-wider">Material</p>
              <p className="text-sm text-ink">{product.material}</p>
            </div>
          </div>
        )}
        {product.size && (
          <div className="flex items-center gap-2">
            <Ruler size={14} className="text-ink/40 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-ink/40 uppercase tracking-wider">Size</p>
              <p className="text-sm text-ink">{product.size}</p>
            </div>
          </div>
        )}
        {product.weight && (
          <div className="flex items-center gap-2">
            <Weight size={14} className="text-ink/40 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-ink/40 uppercase tracking-wider">Weight</p>
              <p className="text-sm text-ink">{product.weight}</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-ink mb-2 uppercase tracking-wider">Description</h2>
        <p className="text-ink/70 leading-relaxed text-sm">
          {product.description}
        </p>
      </div>

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {product.tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-bronze/10 text-bronze px-2.5 py-1 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Decorative divider */}
      <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mb-6" />
    </div>
  )
}
