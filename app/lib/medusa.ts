import { useState, useEffect, useCallback } from "react"
import Medusa from "@medusajs/js-sdk"
import type {
  MedusaProduct,
  MedusaCart,
  MedusaLineItem,
  MedusaCollection,
  ProductItem,
} from "./medusa-types"
import { withCache } from "./request-cache"
import { setLocalCache, getLocalCache } from "./local-cache"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

// ========== Field definitions for Medusa API ==========
// Only request what each page needs — avoids loading deep relations (options.values,
// variants.options) that are only needed on PDP and slow down the query 10x.
const LISTING_FIELDS = [
  'id', 'title', 'handle', 'description', 'thumbnail',
  'images.url',
  'collection.handle',
  'variants.id',
  'variants.calculated_price',
  'variants.inventory_quantity',
  'tags.value',
  'metadata',
]

const DETAIL_FIELDS = [
  ...LISTING_FIELDS,
  // PDP-level fields (not needed on listing)
  'variants.prices',
  'options.id',
  'options.title',
  'options.values.value',
  'variants.options',
]

// Global singleton SDK instance
let sdk: Medusa

export function getSDK() {
  if (!sdk) {
    sdk = new Medusa({
      baseUrl: BACKEND_URL,
      publishableKey: PUBLISHABLE_KEY,
    })
  }
  return sdk
}

const BACKEND_URL_ORIGIN = (() => {
  try {
    return new URL(BACKEND_URL).origin
  } catch {
    return "http://localhost:9000"
  }
})()

/** Resolve image URL — handle both relative and absolute paths from Medusa */
function resolveImageUrl(url: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  if (url.startsWith("/")) return `${BACKEND_URL_ORIGIN}${url}`
  return `${BACKEND_URL_ORIGIN}/uploads/${url}`
}

/** Map Medusa API product to UI ProductItem */
function mapProduct(p: MedusaProduct): ProductItem {
  const variant = p.variants?.[0]

  // Medusa v2: calculated_price.calculated_amount is in main currency unit (e.g., 26 = $26)
  // Legacy: variant.prices[].amount is in cents (e.g., 3200 = $32.00), need /100
  let amount = 0
  let currencyCode = "usd"
  if (variant?.calculated_price) {
    amount = variant.calculated_price.calculated_amount
    currencyCode = variant.calculated_price.currency_code || "usd"
  } else {
    const price = variant?.prices?.find(pr => pr.currency_code === "usd") || variant?.prices?.[0]
    amount = price ? price.amount / 100 : 0
    currencyCode = price?.currency_code || "usd"
  }

  const meta = (p.metadata || {}) as Record<string, unknown>

  // Resolve thumbnail
  const thumbnail = p.thumbnail
    ? resolveImageUrl(p.thumbnail)
    : p.images?.[0]
      ? resolveImageUrl(p.images[0].url)
      : undefined

  // All images
  const images = (p.images || []).map(img => resolveImageUrl(img.url))

  return {
    id: p.id,
    name: p.title,
    price: amount,
    currencyCode,
    category: p.collection?.handle || (p.categories?.[0]?.handle) || "all",
    collectionHandle: p.collection?.handle || "",
    rating: (meta.rating as number) || 4.5,
    reviews: (meta.reviews as number) || 0,
    description: p.description || meta.short_description as string || "",
    material: (meta.material as string) || "",
    size: (meta.size as string) || "",
    tags: p.tags?.map(t => t.value) || [],
    bestseller: (meta.bestseller as boolean) || false,
    thumbnail,
    images,
    handle: p.handle,
    variantId: variant?.id,
    inventoryQuantity: variant?.inventory_quantity ?? 0,
  }
}

// ========== Hooks ==========

// ========== Shared region singleton ==========
// Module-level state so all components share the same region fetch
let _regionId: string | null = null
let _regionLoading = true
let _regionPromise: Promise<void> | null = null
let _regionListeners: Array<() => void> = []

function notifyRegionListeners() {
  _regionListeners.forEach(fn => fn())
}

/** Fetch default region once, shared across all callers */
function fetchDefaultRegion(): Promise<void> {
  if (_regionPromise) return _regionPromise
  _regionPromise = withCache("default-region", async () => {
    const { regions }: any = await getSDK().store.region.list()
    if (regions?.length > 0) {
      _regionId = regions[0].id
    }
    _regionLoading = false
    notifyRegionListeners()
  })
  return _regionPromise
}

// ========== Eager product + collection pre-fetch ==========
// Start fetching immediately on module load.
// Products WAIT for region so we only fetch once with the correct key.
let _eagerProductsPromise: Promise<any> | null = null
let _eagerCollectionsPromise: Promise<any> | null = null

function eagerFetchProducts() {
  if (!_eagerProductsPromise) {
    _eagerProductsPromise = (async () => {
      // Wait for region first so we fetch with correct key (no refetch needed)
      await _regionPromise
      if (!_regionId) return null
      const query: any = { region_id: _regionId, fields: LISTING_FIELDS }
      return withCache(`products:${JSON.stringify(query)}`, () =>
        getSDK().store.product.list(query) as Promise<any>
      )
    })().then((result) => {
      // On success, cache in localStorage for instant repeat views
      if (result?.products?.length) {
        setLocalCache('products', result.products, 5 * 60 * 1000)
      }
      return result
    }).catch(() => null)
  }
  return _eagerProductsPromise
}

function eagerFetchCollections() {
  if (!_eagerCollectionsPromise) {
    _eagerCollectionsPromise = withCache('collections', () =>
      getSDK().store.collection.list() as Promise<any>
    ).catch(() => null)
  }
  return _eagerCollectionsPromise
}

// Kick off all fetches immediately on module load (client-side only)
if (typeof window !== "undefined") {
  fetchDefaultRegion().catch(() => {
    _regionLoading = false
    notifyRegionListeners()
  })
  eagerFetchCollections()
  // Products starts immediately too but internally awaits region
  eagerFetchProducts()
}

/** Fetch default region (first available) — singleton, shared state */
export function useDefaultRegion() {
  const [, setTick] = useState(0)

  useEffect(() => {
    // If already resolved, no need to listen
    if (!_regionLoading) return
    const listener = () => setTick(n => n + 1)
    _regionListeners.push(listener)
    return () => {
      _regionListeners = _regionListeners.filter(l => l !== listener)
    }
  }, [])

  return { regionId: _regionId, loading: _regionLoading }
}

/** Fetch product list from Medusa */
export function useProducts(collectionId?: string, regionId?: string | null) {
  const [products, setProducts] = useState<MedusaProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Hydrate from localStorage cache after first render (avoid hydration mismatch)
  useEffect(() => {
    const cached = getLocalCache<MedusaProduct[]>('products')
    if (cached?.length) {
      setProducts(cached)
      setLoading(false)  // Show cached data immediately
    }
  }, [])

  useEffect(() => {
    // Don't fetch without a region — prevents wasteful region-less fetch
    // that would be discarded when region arrives (eager fetch handles it)
    if (!regionId) return

    let cancelled = false
    const fetchProducts = async () => {
      try {
        // Only show spinner if we have no data at all (not even cached)
        if (products.length === 0 && !getLocalCache<MedusaProduct[]>('products')?.length) {
          setLoading(true)
        }
        setError(null)
        const query: any = {
          ...(collectionId ? { collection_id: [collectionId] } : {}),
          region_id: regionId,
          fields: LISTING_FIELDS,
        }
        const cacheKey = `products:${JSON.stringify(query)}`
        const result = await withCache(cacheKey, () =>
          getSDK().store.product.list(query) as Promise<{ products: MedusaProduct[] }>
        )
        const fetched = result.products
        if (!cancelled) {
          setProducts(fetched || [])
          // Cache in localStorage for repeat visits
          if (fetched?.length) {
            setLocalCache('products', fetched, 5 * 60 * 1000)
          }
        }
      } catch (err) {
        console.warn("Medusa products fetch failed:", err)
        if (!cancelled) setError(err as Error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProducts()
    return () => { cancelled = true }
  }, [collectionId, regionId])

  return { products, loading, error }
}

/** Fetch a single product by handle */
export function useProduct(handle: string) {
  const [product, setProduct] = useState<MedusaProduct | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!handle) return
    let cancelled = false
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { products } = await withCache(`product:${handle}`, () =>
          getSDK().store.product.list({ handle, fields: DETAIL_FIELDS }) as Promise<any>
        )
        if (!cancelled) setProduct(products?.[0] || null)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProduct()
    return () => { cancelled = true }
  }, [handle])

  return { product, loading }
}

/** Fetch collections */
export function useCollections() {
  const [collections, setCollections] = useState<MedusaCollection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    withCache("collections", () =>
      getSDK().store.collection.list() as Promise<any>
    )
      .then(({ collections }: any) => {
        if (!cancelled) setCollections(collections || [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { collections, loading }
}

/** Cart management */
export function useCart(regionId?: string | null) {
  const [cart, setCart] = useState<MedusaCart | null>(null)
  const [loading, setLoading] = useState(false)

  const createCart = useCallback(async () => {
    const body: any = {}
    if (regionId) {
      body.region_id = regionId
    }
    const { cart } = await getSDK().store.cart.create(body)
    localStorage.setItem("cart_id", cart.id)
    setCart(cart)
    return cart as MedusaCart
  }, [regionId])

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      setLoading(true)
      try {
        const cartId = cart?.id || localStorage.getItem("cart_id")
        let currentCart = cart

        if (!cartId) {
          currentCart = await createCart()
        }

        const { cart: updatedCart } = await getSDK().store.cart.createLineItem(
          currentCart!.id,
          { variant_id: variantId, quantity }
        )
        setCart(updatedCart as MedusaCart)
        return updatedCart as MedusaCart
      } catch (err: any) {
        console.error('addToCart error:', err)
        throw new Error(err?.message || JSON.stringify(err) || 'Failed to add item to cart')
      } finally {
        setLoading(false)
      }
    },
    [cart, createCart]
  )

  const updateItemQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return
      setLoading(true)
      try {
        const { cart: updatedCart } = await getSDK().store.cart.updateLineItem(
          cart.id,
          lineItemId,
          { quantity }
        )
        setCart(updatedCart as MedusaCart)
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      if (!cart) return
      setLoading(true)
      try {
        const { cart: updatedCart } = await getSDK().store.cart.deleteLineItem(
          cart.id,
          lineItemId
        )
        setCart(updatedCart as MedusaCart)
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  const getCartCount = useCallback((): number => {
    if (!cart?.items) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  // Restore existing cart on mount
  useEffect(() => {
    const existingCartId = localStorage.getItem("cart_id")
    if (existingCartId) {
      withCache(`cart:${existingCartId}`, () =>
        getSDK().store.cart.retrieve(existingCartId) as Promise<any>
      )
        .then(({ cart }: any) => setCart(cart as MedusaCart))
        .catch(() => localStorage.removeItem("cart_id"))
    }
  }, [])

  return { cart, loading, addToCart, updateItemQuantity, removeFromCart, createCart, getCartCount, setCart }
}

/** Update cart with shipping address */
export async function updateCartAddress(
  cartId: string,
  data: {
    email?: string
    shipping_address?: Record<string, any>
  }
): Promise<MedusaCart> {
  const { cart } = await getSDK().store.cart.update(cartId, data)
  return cart as MedusaCart
}

/** Get shipping options for cart */
export async function getShippingOptions(cartId: string) {
  const response = await getSDK().store.fulfillment.listCartOptions({ cart_id: cartId })
  return (response as any).shipping_options || []
}

/** Add shipping method to cart */
export async function addShippingMethodToCart(cartId: string, optionId: string, data?: Record<string, any>) {
  const { cart } = await getSDK().store.cart.addShippingMethod(cartId, { option_id: optionId, data })
  return cart as MedusaCart
}

/** List payment providers for a region */
export async function listPaymentProviders(regionId: string) {
  const response = await getSDK().store.payment.listPaymentProviders({ region_id: regionId })
  return (response as any).payment_providers || []
}

/** Initiate payment session */
export async function initiatePaymentSession(cart: MedusaCart, providerId: string) {
  const { payment_collection } = await getSDK().store.payment.initiatePaymentSession(
    cart as any,
    { provider_id: providerId }
  )
  return payment_collection
}

/** Complete cart / place order */
export async function completeCart(cartId: string) {
  const data = await getSDK().store.cart.complete(cartId)
  return data as any
}

/** Map Medusa API products to UI items (for component use) */
export function useMappedProducts(collectionId?: string) {
  const { regionId, loading: regionLoading } = useDefaultRegion()
  const { products, loading, error } = useProducts(collectionId, regionId)
  const mapped = products.map(mapProduct)
  // Use the products hook's own loading state — it starts as true
  // and only becomes false after data arrives
  return { products: mapped, rawProducts: products, loading, error }
}

/** Fetch a limited set of related products (for detail page) */
export function useRelatedProducts(collectionHandle?: string, excludeId?: string, limit: number = 6) {
  const { regionId, loading: regionLoading } = useDefaultRegion()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchRelated = async () => {
      try {
        setLoading(true)
        const query: any = {
          limit: limit + 6, // fetch extra to filter out current
          region_id: regionId,
          fields: LISTING_FIELDS,
        }

        const { products: raw } = await withCache(`related:${collectionHandle || 'all'}:${limit}`, () =>
          getSDK().store.product.list(query) as Promise<any>
        )
        if (cancelled) return

        let result = (raw || []).map(mapProduct)
        if (excludeId) {
          result = result.filter((p: ProductItem) => p.id !== excludeId)
        }
        setProducts(result.slice(0, limit))
      } catch (err) {
        console.warn("Related products fetch failed:", err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchRelated()
    return () => { cancelled = true }
  }, [collectionHandle, excludeId, limit, regionId])

  return { products, loading }
}

export { mapProduct, resolveImageUrl }
