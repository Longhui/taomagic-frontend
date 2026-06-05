import type { Metadata } from 'next'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

async function getProductMetaKeywords(handle: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/store/products?handle=${handle}&fields=meta_keywords`,
      {
        headers: {
          'x-publishable-api-key': PUBLISHABLE_KEY,
        },
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.products?.[0]?.meta_keywords || null
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: { handle: string } }
): Promise<Metadata> {
  const keywords = await getProductMetaKeywords(params.handle)

  return {
    ...(keywords ? {
      keywords: keywords.split(',').map(k => k.trim()),
      other: {
        'product-keywords': keywords,
      },
    } : {}),
  }
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
