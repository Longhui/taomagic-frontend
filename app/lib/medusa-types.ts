// ========== Medusa v2 Storefront API Types ==========

// ---- Product Types ----

export interface MedusaCalculatedPrice {
  id: string
  is_calculated_price_price_list: boolean
  is_calculated_price_tax_inclusive: boolean
  calculated_amount: number
  raw_calculated_amount: { value: string; precision: number }
  is_original_price_price_list: boolean
  is_original_price_tax_inclusive: boolean
  original_amount: number
  raw_original_amount: { value: string; precision: number }
  currency_code: string
  calculated_price: {
    id: string
    price_list_id: string | null
    price_list_type: string | null
    min_quantity: number | null
    max_quantity: number | null
  }
  original_price: {
    id: string
    price_list_id: string | null
    price_list_type: string | null
    min_quantity: number | null
    max_quantity: number | null
  }
}

export interface MedusaProductVariant {
  id: string
  title: string
  sku?: string | null
  barcode?: string | null
  ean?: string | null
  upc?: string | null
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  prices?: MedusaPrice[]
  calculated_price?: MedusaCalculatedPrice
  options?: MedusaProductOptionValue[]
  created_at: string
  updated_at: string
}

export interface MedusaPrice {
  id: string
  currency_code: string
  amount: number
  raw_amount?: number
  min_quantity?: number | null
  max_quantity?: number | null
}

export interface MedusaProductImage {
  id: string
  url: string
  rank?: number
  width?: number | null
  height?: number | null
  file_key?: string | null
}

export interface MedusaProductOption {
  id: string
  title: string
  product_id: string
  values: MedusaProductOptionValue[]
}

export interface MedusaProductOptionValue {
  id: string
  value: string
  option_id: string
}

export interface MedusaProductCategory {
  id: string
  name: string
  handle: string
  description?: string | null
  parent_category_id?: string | null
  rank: number
}

export interface MedusaProductCollection {
  id: string
  title: string
  handle: string
}

export interface MedusaProductTag {
  id: string
  value: string
}

export interface MedusaProduct {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  thumbnail?: string | null
  images: MedusaProductImage[]
  variants: MedusaProductVariant[]
  options: MedusaProductOption[]
  categories?: MedusaProductCategory[]
  collection?: MedusaProductCollection | null
  collection_id?: string | null
  tags: MedusaProductTag[]
  metadata: Record<string, unknown>
  handle: string
  status: string
  created_at: string
  updated_at: string
}

// ---- Cart Types ----

export interface MedusaCart {
  id: string
  currency_code: string
  email?: string | null
  region_id: string
  items: MedusaLineItem[]
  shipping_methods?: MedusaShippingMethod[]
  payment_collection?: MedusaPaymentCollection | null
  total?: number
  subtotal?: number
  tax_total?: number
  discount_total?: number
  discount_tax_total?: number
  gift_card_total?: number
  gift_card_tax_total?: number
  shipping_total?: number
  shipping_tax_total?: number
  original_total?: number
  original_subtotal?: number
  original_tax_total?: number
  created_at: string
  updated_at: string
}

export interface MedusaLineItem {
  id: string
  title: string
  subtitle?: string | null
  thumbnail?: string | null
  variant_id: string
  product_id?: string
  quantity: number
  unit_price: number
  total?: number
  subtotal?: number
  tax_total?: number
  discount_total?: number
  metadata?: Record<string, unknown>
  variant_title?: string | null
  variant?: MedusaProductVariant
  product?: MedusaProduct
}

export interface MedusaShippingMethod {
  id: string
  name: string
  amount: number
  data?: Record<string, unknown>
  shipping_option_id?: string
}

export interface MedusaPaymentCollection {
  id: string
  amount: number
  status: string
  payment_sessions?: MedusaPaymentSession[]
}

export interface MedusaPaymentSession {
  id: string
  amount: number
  status: string
  data: Record<string, unknown>
}

// ---- Collection Types ----

export interface MedusaCollection {
  id: string
  title: string
  handle: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

// ---- API Response Wrappers ----

export interface MedusaListResponse<T> {
  products?: T[]
  collections?: T[]
  carts?: T[]
  count?: number
  offset?: number
  limit?: number
}

export interface MedusaSingleResponse<T> {
  product?: T
  cart?: T
  collection?: T
}

// ---- UI Product Type (mapped from Medusa API) ----

export interface ProductItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  currencyCode?: string
  category: string
  collectionHandle?: string
  rating: number
  reviews: number
  description: string
  material: string
  size: string
  weight?: string
  tags: string[]
  bestseller: boolean
  thumbnail?: string
  images: string[]
  handle: string
  variantId?: string
  inventoryQuantity?: number
  metaKeywords?: string
}

// ---- Review Types ----

export interface ReviewItem {
  id: string
  productId: string
  rating: number
  title: string
  content: string
  author: string
  isVerifiedPurchase: boolean
  date: string
  helpfulCount: number
}

export interface RatingDistribution {
  [star: number]: number // 1-5 star counts
}
