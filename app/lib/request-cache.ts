/**
 * Simple in-memory promise cache with TTL.
 * Deduplicates concurrent requests for the same key.
 */

interface CacheEntry<T> {
  promise: Promise<T>
  expiry: number
}

const cache = new Map<string, CacheEntry<any>>()

const DEFAULT_TTL = 60_000 // 60 seconds

/**
 * Get or create a cached promise. If another caller already started
 * fetching the same key, they share the same promise (dedup).
 * When the promise resolves, the result stays cached for `ttl` ms.
 *
 * If the promise rejects, the entry is removed so the next caller retries.
 */
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const existing = cache.get(key)
  if (existing && existing.expiry > Date.now()) {
    return existing.promise
  }

  const promise = fetcher().catch((err) => {
    // Remove on error so next caller retries
    cache.delete(key)
    throw err
  })

  cache.set(key, { promise, expiry: Date.now() + ttl })
  return promise
}

/**
 * Clear all cached entries (useful for testing or forced refresh).
 */
export function clearCache() {
  cache.clear()
}
