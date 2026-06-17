'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navigation from '@/app/components/Navigation'
import { useProduct, useRelatedProducts, mapProduct, useDefaultRegion } from '@/app/lib/medusa'
import { useCartContext } from '@/app/lib/CartContext'
import { getDemoProduct } from '@/app/lib/demo-data'
import { trackEvent, trackClick } from '@/app/lib/analytics'
import type { ProductItem } from '@/app/lib/medusa-types'
import ImageGallery from './_components/ImageGallery'
import ProductInfo from './_components/ProductInfo'
import AddToCartSection from './_components/AddToCartSection'
import ReviewSection from './_components/ReviewSection'
import RelatedProducts from './_components/RelatedProducts'

// Yin Yang SVG
const YinYangSVG = ({ size = 200, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={`yin-yang-rotate ${className}`}>
    <circle cx="100" cy="100" r="98" fill="#1a1a1a" stroke="#c9a227" strokeWidth="2"/>
    <path d="M100,2 A49,49 0 0,1 100,98 A49,49 0 0,0 100,198 A98,98 0 0,1 100,2" fill="#f5f0e8"/>
    <circle cx="100" cy="50" r="15" fill="#1a1a1a"/>
    <circle cx="100" cy="150" r="15" fill="#f5f0e8"/>
  </svg>
)

// ========== Tab Data ==========
const DETAIL_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'shipping', label: 'Shipping & Returns' },
  { id: 'care', label: 'Care Instructions' },
] as const

type TabId = typeof DETAIL_TABS[number]['id']

const TAB_CONTENT: Record<TabId, string[]> = {
  details: [
    'Handcrafted by skilled artisans using traditional techniques passed down through generations.',
    'Each piece is individually inspected for quality and energetic integrity before shipping.',
    'All materials are ethically sourced and sustainably harvested where applicable.',
    'Every item is energetically cleansed and blessed with intention before leaving our studio.',
  ],
  shipping: [
    'Orders are processed within 1-2 business days.',
    'Free standard shipping on all orders over $50 USD.',
    'International shipping available to most countries (7-14 business days).',
    '30-Day Harmony Guarantee: Not feeling the energy? Return within 30 days for a full refund.',
    'All shipments are discreetly packaged to protect your privacy.',
  ],
  care: [
    'Keep away from direct sunlight and excessive moisture to preserve material integrity.',
    'Gently clean with a soft, dry cloth. Avoid harsh chemicals or abrasive materials.',
    'For crystals and stones: recharge under moonlight or on a selenite plate monthly.',
    'For wood items: occasionally treat with natural wood oil to maintain luster.',
    'Handle with respect and intention — your belief amplifies the object\'s energy.',
  ],
}

// ========== Skeleton Loader ==========
const ProductSkeleton = () => (
  <div className="min-h-screen bg-rice">
    <Navigation solid />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-48 bg-ink/5 rounded-sm animate-pulse mb-8" />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image skeleton */}
        <div className="aspect-square bg-ink/5 rounded-lg animate-pulse" />

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-20 bg-ink/5 rounded-sm animate-pulse" />
          <div className="h-10 w-3/4 bg-ink/5 rounded-sm animate-pulse" />
          <div className="h-4 w-40 bg-ink/5 rounded-sm animate-pulse" />
          <div className="h-8 w-24 bg-ink/5 rounded-sm animate-pulse" />
          <div className="h-24 bg-ink/5 rounded-sm animate-pulse" />
          <div className="h-32 bg-ink/5 rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  </div>
)

// ========== Main Page ==========
export default function ProductDetailPage() {
  const params = useParams()
  const handle = params.handle as string

  const [product, setProduct] = useState<ProductItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('details')
  const [stickyBar, setStickyBar] = useState(false)
  const [addingSticky, setAddingSticky] = useState(false)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)

  const reviewsRef = useRef<HTMLDivElement>(null)
  const addToCartRef = useRef<HTMLDivElement>(null)

  // Cart hooks
  const { addToCart, cartCount } = useCartContext()

  // Related products — fetch limited set (no dependency on product)
  const { products: allProducts, loading: relatedLoading } = useRelatedProducts()
  const relatedProducts = React.useMemo(() => {
    if (!product) return []
    return allProducts.filter(p => p.id !== product.id).slice(0, 6)
  }, [allProducts, product])

  // Fetch product
  const { regionId } = useDefaultRegion()
  const { product: medusaProduct, loading: apiLoading } = useProduct(handle, regionId)

  useEffect(() => {
    if (apiLoading) {
      setLoading(true)
      return
    }

    setLoading(false)

    if (medusaProduct) {
      setProduct(mapProduct(medusaProduct))
      setError(null)
    } else {
      // Fall back to demo data
      const demo = getDemoProduct(handle)
      if (demo) {
        setProduct(demo)
        setError(null)
      } else {
        setError('not-found')
      }
    }
  }, [medusaProduct, apiLoading, handle])

  // Reset variant selection when product changes
  useEffect(() => {
    setSelectedVariantIndex(0)
  }, [product?.id])

  // Derive currently selected variant
  const selectedVariant = product?.variants[selectedVariantIndex] || product?.variants[0]
  const currentVariantId = selectedVariant?.id || product?.variantId
  const currentPrice = selectedVariant?.price ?? product?.price ?? 0
  const currentInventory = selectedVariant?.inventoryQuantity ?? product?.inventoryQuantity

  // Sticky add-to-cart bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!addToCartRef.current) return
      const rect = addToCartRef.current.getBoundingClientRect()
      setStickyBar(rect.bottom < 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToReviews = useCallback(() => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleAddToCart = async (variantId: string, quantity: number) => {
    try {
      await addToCart(variantId, quantity)
      trackEvent('shop', 'add_to_cart', product?.name, currentPrice)
    } catch (err: any) {
      alert(err?.message || 'Failed to add item to cart. Check that the Medusa backend is running.')
      throw err
    }
  }

  const handleStickyAddToCart = async () => {
    if (!currentVariantId) return
    setAddingSticky(true)
    try {
      await addToCart(currentVariantId, 1)
      trackEvent('shop', 'add_to_cart_sticky', product?.name, currentPrice)
    } catch {
      // handled
    } finally {
      setAddingSticky(false)
    }
  }


  // Loading state
  if (loading) return <ProductSkeleton />

  // Not found / error state
  if (error === 'not-found' || !product) {
    return (
      <div className="min-h-screen bg-rice">
        <Navigation solid />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <div className="py-24">
            <YinYangSVG size={80} className="mx-auto mb-6 opacity-30" />
            <h1 className="font-serif text-3xl text-ink mb-4">Product Not Found</h1>
            <p className="text-ink/50 mb-8 max-w-md mx-auto">
              This product may have been removed or the link might be incorrect.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-ink text-rice px-6 py-3 rounded-sm text-sm hover:bg-ink/80 transition-colors"
            >
              <ArrowLeft size={16} />
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rice">
      <Navigation solid />

      {/* ===== Main Content ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-ink/40 mb-6">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery — sync image with variant selection when counts match */}
          <ImageGallery
            images={product.images}
            productName={product.name}
            category={product.category}
            externalIndex={product.images.length === product.variants.length ? selectedVariantIndex : -1}
          />

          {/* Right: Product Info + Add to Cart */}
          <div>
            <ProductInfo
              product={product}
              selectedVariantIndex={selectedVariantIndex}
              onSelectVariant={setSelectedVariantIndex}
              onScrollToReviews={scrollToReviews}
            />

            <div ref={addToCartRef}>
              <AddToCartSection
                productName={product.name}
                price={currentPrice}
                inventoryQuantity={currentInventory}
                variantId={currentVariantId}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>

        {/* ===== Detail Tabs ===== */}
        <div className="mt-12 lg:mt-16">
          <div className="border-b border-ink/10">
            <div className="flex gap-6">
              {DETAIL_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); trackClick('shop', `PDP Tab - ${tab.label}`) }}
                  className={`pb-3 text-sm transition-all ${
                    activeTab === tab.id
                      ? 'text-ink font-medium border-b-2 border-gold'
                      : 'text-ink/40 hover:text-ink/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6 min-h-[200px]">
            {activeTab === 'details' && product.description ? (
              <div className="prose prose-sm prose-ink max-w-none
                [&_h3]:text-ink [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:uppercase [&_h3]:tracking-wider
                [&_strong]:text-ink
                [&_ul]:mt-1 [&_ul]:space-y-1
                [&_li]:text-ink/70 [&_li]:text-sm
                [&_hr]:border-ink/10 [&_hr]:my-5
                [&_p]:text-ink/70 [&_p]:text-sm [&_p]:leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {product.description}
                </ReactMarkdown>
              </div>
            ) : (
              <ul className="space-y-3">
                {TAB_CONTENT[activeTab].map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink/70 leading-relaxed">
                    <span className="text-gold mt-1 flex-shrink-0">✦</span>
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ===== Reviews ===== */}
        <div ref={reviewsRef}>
          <ReviewSection
            productId={product.id}
            productRating={product.rating}
            totalReviews={product.reviews}
          />
        </div>

        {/* ===== Related Products ===== */}
        {!relatedLoading && relatedProducts.length > 0 && (
          <RelatedProducts
            products={relatedProducts}
            currentProductId={product.id}
          />
        )}
      </div>

      {/* ===== Sticky Mobile Add-to-Cart Bar ===== */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-ink/10 p-4 z-40 transition-transform duration-300 md:hidden ${
          stickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <p className="text-sm text-ink font-medium truncate">{product.name}</p>
            <p className="text-lg font-serif text-gold">${currentPrice.toFixed(2)}</p>
          </div>
          <button
            onClick={handleStickyAddToCart}
            disabled={!currentVariantId || (currentInventory !== undefined && currentInventory <= 0) || addingSticky}
            className="bg-cinnabar text-rice px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-cinnabar/90 transition-colors disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
          >
            {addingSticky ? (
              <span className="w-4 h-4 border-2 border-rice/30 border-t-rice rounded-full animate-spin" />
            ) : (
              <ShoppingCart size={16} />
            )}
            {addingSticky ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

    </div>
  )
}
