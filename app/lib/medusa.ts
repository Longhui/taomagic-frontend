import { useState, useEffect, useCallback } from "react"
import Medusa from "@medusajs/js-sdk"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

// 全局单例 SDK 实例
let sdk: Medusa

function getSDK() {
  if (!sdk) {
    sdk = new Medusa({
      baseUrl: BACKEND_URL,
      auth: {
        type: "session",
      },
    })
  }
  return sdk
}

// 获取商品列表
export function useProducts(collectionId?: string) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const query: any = collectionId
          ? { collection_id: [collectionId] }
          : {}
        const { products } = await getSDK().store.product.list(query)
        setProducts(products)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [collectionId])

  return { products, loading, error }
}

// 获取产品详情（通过 handle）
export function useProduct(handle: string) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!handle) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { products } = await getSDK().store.product.list({
          handle,
        })
        setProduct(products?.[0] || null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [handle])

  return { product, loading }
}

// 获取分类列表
export function useCollections() {
  const [collections, setCollections] = useState<any[]>([])

  useEffect(() => {
    getSDK()
      .store.collection.list()
      .then(({ collections }: any) => setCollections(collections))
  }, [])

  return { collections }
}

// 购物车管理
export function useCart() {
  const [cart, setCart] = useState<any>(null)

  const createCart = useCallback(async () => {
    const { cart } = await getSDK().store.cart.create({})
    localStorage.setItem("cart_id", cart.id)
    setCart(cart)
    return cart
  }, [])

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      const cartId = cart?.id || localStorage.getItem("cart_id")
      let currentCart = cart

      if (!cartId) {
        currentCart = await createCart()
      }

      const { cart: updatedCart } = await getSDK().store.cart.createLineItem(
        currentCart!.id,
        { variant_id: variantId, quantity }
      )
      setCart(updatedCart)
      return updatedCart
    },
    [cart, createCart]
  )

  // 初始化时恢复已有购物车
  useEffect(() => {
    const existingCartId = localStorage.getItem("cart_id")
    if (existingCartId) {
      getSDK()
        .store.cart.retrieve(existingCartId)
        .then(({ cart }: any) => setCart(cart))
        .catch(() => localStorage.removeItem("cart_id"))
    }
  }, [])

  return { cart, addToCart, createCart }
}

// 结账
export function useCheckout() {
  const initiatePayment = useCallback(async (cartId: string) => {
    const { cart } = await getSDK().store.cart.create({})
    return cart
  }, [])

  const completeCart = useCallback(async (cartId: string) => {
    const result = await getSDK().store.cart.complete(cartId)
    return result
  }, [])

  return { initiatePayment, completeCart }
}
