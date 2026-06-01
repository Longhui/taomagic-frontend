import { useState, useEffect, useCallback } from "react"
import Medusa from "@medusajs/js-sdk"
import type {
  MedusaProduct,
  MedusaCart,
  MedusaLineItem,
  MedusaCollection,
  ProductItem,
} from "./medusa-types"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

// Global singleton SDK instance
let sdk: Medusa

function getSDK() {
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

/** Fetch default region (first available) */
export function useDefaultRegion() {
  const [regionId, setRegionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getSDK()
      .store.region.list()
      .then(({ regions }: any) => {
        if (!cancelled && regions?.length > 0) {
          setRegionId(regions[0].id)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { regionId, loading }
}

/** Fetch product list from Medusa */
export function useProducts(collectionId?: string, regionId?: string | null) {
  const [products, setProducts] = useState<MedusaProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const query: any = { ...(collectionId ? { collection_id: [collectionId] } : {}) }
        if (regionId) {
          query.region_id = regionId
        }
        const { products } = await getSDK().store.product.list(query)
        if (!cancelled) setProducts(products || [])
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
        const { products } = await getSDK().store.product.list({ handle })
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
    getSDK()
      .store.collection.list()
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
export function useCart() {
  const [cart, setCart] = useState<MedusaCart | null>(null)
  const [loading, setLoading] = useState(false)

  const createCart = useCallback(async () => {
    const { cart } = await getSDK().store.cart.create({})
    localStorage.setItem("cart_id", cart.id)
    setCart(cart)
    return cart as MedusaCart
  }, [])

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
      getSDK()
        .store.cart.retrieve(existingCartId)
        .then(({ cart }: any) => setCart(cart as MedusaCart))
        .catch(() => localStorage.removeItem("cart_id"))
    }
  }, [])

  return { cart, loading, addToCart, updateItemQuantity, removeFromCart, createCart, getCartCount }
}

/** Map Medusa API products to UI items (for component use) */
export function useMappedProducts(collectionId?: string) {
  const { regionId, loading: regionLoading } = useDefaultRegion()
  const regionReady = !!regionId || !regionLoading
  const { products, loading, error } = useProducts(collectionId, regionId)
  const mapped = products.map(mapProduct)
  return { products: mapped, rawProducts: products, loading: loading || !regionReady, error }
}

export { mapProduct, resolveImageUrl }
