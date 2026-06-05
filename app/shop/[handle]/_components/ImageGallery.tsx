'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductImagePlaceholder from './ProductImagePlaceholder'

interface ImageGalleryProps {
  images: string[]
  productName: string
  category?: string
}

export default function ImageGallery({ images, productName, category }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set())
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })

  const hasImages = images.length > 0
  const currentImage = hasImages ? images[selectedIndex] : null
  const showThumbnails = hasImages && images.length > 1

  const handleImageError = (index: number) => {
    setImgErrors(prev => new Set(prev).add(index))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const prevImage = () => {
    setSelectedIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setSelectedIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const isCurrentImageError = !currentImage || imgErrors.has(selectedIndex)

  return (
    <div className="sticky top-24">
      {/* Main image */}
      <div
        className="aspect-square bg-gradient-to-br from-rice to-rice/80 rounded-lg border border-ink/10 overflow-hidden relative group cursor-crosshair"
        onMouseEnter={() => hasImages && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {hasImages && !isCurrentImageError ? (
          <Image
            src={currentImage!}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover transition-transform duration-200 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                : undefined
            }
            onError={() => handleImageError(selectedIndex)}
          />
        ) : (
          <div className="absolute inset-0">
            <ProductImagePlaceholder
              productName={productName}
              category={category}
            />
          </div>
        )}

        {/* Zoom hint */}
        {hasImages && !isCurrentImageError && (
          <div className="absolute bottom-3 left-3 bg-ink/60 text-rice text-[10px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Hover to zoom
          </div>
        )}

        {/* Arrow nav for multi-image */}
        {showThumbnails && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} className="text-ink" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={18} className="text-ink" />
            </button>
          </>
        )}

        {/* Image counter */}
        {showThumbnails && (
          <div className="absolute top-3 right-3 bg-ink/70 text-rice text-xs px-2 py-1 rounded-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {showThumbnails && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {images.map((img, index) => {
            const hasError = imgErrors.has(index)
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-sm border-2 overflow-hidden relative transition-all ${
                  index === selectedIndex
                    ? 'border-gold shadow-sm'
                    : 'border-ink/10 hover:border-ink/30'
                }`}
              >
                {!hasError ? (
                  <Image
                    src={img}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="w-full h-full bg-rice flex items-center justify-center">
                    <Star size={14} className="text-ink/20" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* No images at all — single thumb placeholder */}
      {!hasImages && (
        // Empty state — just a small hidden spacer, no redundant second placeholder
        null
      )}
    </div>
  )
}
