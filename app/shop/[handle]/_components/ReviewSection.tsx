'use client'

import React, { useState, useMemo } from 'react'
import { Star, ThumbsUp, ChevronDown, MessageSquare } from 'lucide-react'
import type { ReviewItem, RatingDistribution } from '@/app/lib/medusa-types'
import { DEMO_REVIEWS } from '@/app/lib/demo-data'

interface ReviewSectionProps {
  productId: string
  productRating: number
  totalReviews: number
}

const REVIEWS_PER_PAGE = 5

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))

  if (diffMonths === 0) {
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }
  if (diffMonths < 12) return `${diffMonths} months ago`
  const years = Math.floor(diffMonths / 12)
  return `${years} year${years > 1 ? 's' : ''} ago`
}

export default function ReviewSection({ productId, productRating, totalReviews }: ReviewSectionProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent')
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE)
  const [helpfulVotes, setHelpfulVotes] = useState<Set<string>>(new Set())

  // Fetch demo reviews — in production this would be an API call
  const reviewData = useMemo(() => {
    return DEMO_REVIEWS.find(r => r.productId === productId) || null
  }, [productId])

  const distribution = reviewData?.distribution ?? {}
  const reviews = reviewData?.reviews ?? [] as ReviewItem[]
  const hasReviews = reviews.length > 0

  // Calculate distribution percentages
  const totalDist = Object.values(distribution).reduce((a, b) => a + b, 0) || 1

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews]
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating)
      default:
        return sorted
    }
  }, [reviews, sortBy])

  const visibleReviews = sortedReviews.slice(0, visibleCount)
  const hasMore = visibleCount < sortedReviews.length

  const handleHelpful = (reviewId: string) => {
    setHelpfulVotes(prev => {
      const next = new Set(prev)
      if (next.has(reviewId)) {
        next.delete(reviewId)
      } else {
        next.add(reviewId)
      }
      return next
    })
  }

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + REVIEWS_PER_PAGE)
  }

  return (
    <section className="py-12 lg:py-16">
      <h2 className="font-serif text-2xl md:text-3xl text-ink mb-8">
        Customer Reviews
      </h2>

      {!hasReviews ? (
        /* Empty state */
        <div className="text-center py-12 bg-white rounded-lg border border-ink/10">
          <MessageSquare size={40} className="text-ink/20 mx-auto mb-4" />
          <p className="text-ink/60 mb-2">No reviews yet</p>
          <p className="text-sm text-ink/40 mb-6">
            Be the first to share your experience with this product.
          </p>
          <button className="bg-ink text-rice px-6 py-2.5 rounded-sm text-sm hover:bg-ink/80 transition-colors">
            Write a Review
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Rating summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm border border-ink/10 p-6 sticky top-24">
              {/* Overall rating */}
              <div className="text-center mb-6">
                <div className="text-5xl font-serif text-ink mb-2">{productRating.toFixed(1)}</div>
                <div className="flex items-center justify-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={18}
                      className={star <= Math.floor(productRating) ? 'text-gold fill-gold' : 'text-ink/20'}
                    />
                  ))}
                </div>
                <p className="text-sm text-ink/50">{totalReviews} reviews</p>
              </div>

              {/* Rating bars */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = distribution[star] || 0
                  const percentage = (count / totalDist) * 100
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="text-ink/50 w-3 text-right">{star}</span>
                      <Star size={12} className="text-gold fill-gold" />
                      <div className="flex-1 h-2 bg-ink/5 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-sm transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-ink/40 w-8 text-right">{Math.round(percentage)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: Review list */}
          <div className="lg:col-span-2">
            {/* Sort */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-ink/10">
              <span className="text-sm text-ink/50">
                {sortedReviews.length} review{sortedReviews.length !== 1 ? 's' : ''}
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as typeof sortBy)
                    setVisibleCount(REVIEWS_PER_PAGE)
                  }}
                  className="appearance-none bg-white border border-ink/10 rounded-sm text-sm text-ink px-3 py-1.5 pr-8 focus:outline-none focus:border-gold"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
              </div>
            </div>

            {/* Review cards */}
            <div className="space-y-6">
              {visibleReviews.map((review) => {
                const isHelpful = helpfulVotes.has(review.id)
                const reviewHelpfulCount = review.helpfulCount + (isHelpful ? 1 : 0) -
                  (helpfulVotes.has(review.id) ? 0 : 0)
                // Simplified: just show base count +1 if user voted
                const displayHelpful = isHelpful ? review.helpfulCount + 1 : review.helpfulCount

                return (
                  <div key={review.id} className="bg-white rounded-sm border border-ink/10 p-5">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= review.rating ? 'text-gold fill-gold' : 'text-ink/15'}
                        />
                      ))}
                    </div>

                    <h3 className="font-medium text-ink text-sm mb-1">{review.title}</h3>
                    <p className="text-sm text-ink/70 leading-relaxed mb-3">
                      {review.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-ink/40">
                      <div className="flex items-center gap-3">
                        <span>{review.author}</span>
                        {review.isVerifiedPurchase && (
                          <span className="text-bronze bg-bronze/5 px-1.5 py-0.5 rounded-sm">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{formatDate(review.date)}</span>
                        <button
                          onClick={() => handleHelpful(review.id)}
                          className={`flex items-center gap-1 transition-colors ${
                            isHelpful ? 'text-bronze' : 'hover:text-ink/60'
                          }`}
                        >
                          <ThumbsUp size={12} />
                          <span>{displayHelpful}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="border border-ink/10 text-ink/60 px-6 py-2.5 rounded-sm text-sm hover:border-ink/30 hover:text-ink transition-colors"
                >
                  Load More Reviews ({sortedReviews.length - visibleCount} remaining)
                </button>
              </div>
            )}

            {/* Write a review */}
            <div className="mt-8 pt-6 border-t border-ink/10 text-center">
              <button className="bg-ink text-rice px-6 py-2.5 rounded-sm text-sm hover:bg-ink/80 transition-colors">
                Write a Review
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
