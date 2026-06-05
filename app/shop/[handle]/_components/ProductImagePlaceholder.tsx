'use client'

import React from 'react'

const CATEGORY_THEMES: Record<string, { bg: string; icon: string }> = {
  wealth: { bg: 'from-amber-800/20 to-yellow-600/10', icon: '💰' },
  protection: { bg: 'from-indigo-800/20 to-blue-600/10', icon: '🛡️' },
  harmony: { bg: 'from-emerald-800/20 to-green-600/10', icon: '☯️' },
  health: { bg: 'from-teal-800/20 to-cyan-600/10', icon: '🌿' },
  love: { bg: 'from-rose-800/20 to-pink-600/10', icon: '💕' },
}

interface ProductImagePlaceholderProps {
  productName: string
  category?: string
}

/** Generate a visually appealing SVG placeholder for products without images */
export default function ProductImagePlaceholder({
  productName,
  category,
}: ProductImagePlaceholderProps) {
  const theme = CATEGORY_THEMES[category || ''] || { bg: 'from-stone-800/20 to-stone-600/10', icon: '✦' }

  // Extract initials (up to 2 characters)
  const initials = productName
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`bg-${productName.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f0e8" />
          <stop offset="100%" stopColor="#e8e0d0" />
        </linearGradient>
        <pattern id="dots" patternUnits="userSpaceOnUse" width="40" height="40">
          <circle cx="20" cy="20" r="1" fill="#c9a227" opacity="0.15" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="400" height="400" fill={`url(#bg-${productName.replace(/\s/g, '')})`} rx="8" />
      <rect width="400" height="400" fill="url(#dots)" rx="8" />

      {/* Decorative circle */}
      <circle cx="200" cy="180" r="90" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.25" />

      {/* Inner circle */}
      <circle cx="200" cy="180" r="60" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.15" />

      {/* Initials */}
      <text
        x="200"
        y="190"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#c9a227"
        fontSize={initials.length > 1 ? "64" : "72"}
        fontWeight="300"
        fontFamily="Georgia, serif"
        opacity="0.8"
      >
        {initials}
      </text>

      {/* Category icon */}
      <text
        x="200"
        y="280"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="28"
      >
        {theme.icon}
      </text>

      {/* Title text */}
      <text
        x="200"
        y="340"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#1a1a1a"
        fontSize="12"
        fontWeight="400"
        fontFamily="system-ui, sans-serif"
        opacity="0.5"
      >
        {productName}
      </text>
    </svg>
  )
}
