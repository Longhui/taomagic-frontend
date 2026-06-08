'use client'

import React from 'react'
import { Star, Ruler, Weight, Gem } from 'lucide-react'
import type { ProductItem, ProductVariant, RatingDistribution } from '@/app/lib/medusa-types'

interface ProductInfoProps {
  product: ProductItem
  selectedVariantIndex: number
  onSelectVariant: (index: number) => void
  onScrollToReviews: () => void
}

export default function ProductInfo({
  product,
  selectedVariantIndex,
  onSelectVariant,
  onScrollToReviews,
}: ProductInfoProps) {
  const filledStars = Math.floor(product.rating)
  const hasFraction = product.rating - filledStars >= 0.5
  const hasVariants = product.variants.length > 1
  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0]

  return (
    <div>
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.bestseller && (
          <span className="bg-cinnabar text-rice text-xs px-2 py-1 rounded-sm font-medium">
            Best Seller
          </span>
        )}
        {selectedVariant.inventoryQuantity !== undefined && selectedVariant.inventoryQuantity <= 5 && selectedVariant.inventoryQuantity > 0 && (
          <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded-sm font-medium">
            Low Stock
          </span>
        )}
        {selectedVariant.inventoryQuantity !== undefined && selectedVariant.inventoryQuantity === 0 && (
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

      {/* ─── Variant Selector ─── */}
      {hasVariants && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-ink/50 uppercase tracking-wider">
              {product.optionName || 'Option'}:
              {' '}
              <span className="text-ink font-medium normal-case">
                {selectedVariant.title}
              </span>
            </span>
            <span className="text-sm text-ink/60">
              {selectedVariant.inventoryQuantity !== undefined
                ? `(${selectedVariant.inventoryQuantity} available)`
                : ''}
            </span>
          </div>

          <div className="flex gap-2.5">
            {product.variants.map((v: ProductVariant, idx: number) => (
              <button
                key={v.id}
                onClick={() => onSelectVariant(idx)}
                className={`group relative flex flex-col items-center gap-1.5 transition-all ${
                  idx === selectedVariantIndex ? 'scale-105' : 'opacity-60 hover:opacity-90'
                }`}
                title={v.title}
              >
                {/* Color swatch circle */}
                <div
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    idx === selectedVariantIndex
                      ? 'border-gold shadow-[0_0_0_2px_#C9A227]'
                      : 'border-ink/20 hover:border-ink/40'
                  }`}
                  style={{ backgroundColor: v.color || '#ccc' }}
                />
                {/* Label below swatch */}
                <span
                  className={`text-[10px] leading-tight transition-colors ${
                    idx === selectedVariantIndex
                      ? 'text-ink font-medium'
                      : 'text-ink/40'
                  }`}
                >
                  {v.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-serif text-gold">
          ${(selectedVariant.price || product.price).toFixed(2)}
        </span>
        {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
          <span className="text-lg text-ink/30 line-through">
            ${selectedVariant.originalPrice.toFixed(2)}
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

      {/* Description — shown as excerpt on mobile; full content in Details tab */}
      {product.description && (
        <div className="mb-6 lg:hidden">
          <h2 className="text-sm font-medium text-ink mb-3 uppercase tracking-wider">Description</h2>
          <p className="text-ink/70 leading-relaxed text-sm line-clamp-3">
            {product.description.replace(/[#*`\[\]()>|~\-_]/g, '').slice(0, 200)}
          </p>
          <p className="text-xs text-gold mt-1">See full details in the Details tab below</p>
        </div>
      )}

      {/* SEO Keywords — visually hidden, present for search engines */}
      <div className="sr-only" aria-hidden="true">
        {product.metaKeywords || product.tags.join(', ')}
      </div>

      {/* Decorative divider */}
      <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mb-6" />
    </div>
  )
}
