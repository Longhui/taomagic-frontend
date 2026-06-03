/**
 * Persistent localStorage cache for product data.
 * Helps show content instantly on repeat visits.
 */

const CACHE_PREFIX = 'tao_cache_'
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  expiry: number
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/** Store data in localStorage with TTL */
export function setLocalCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (!isBrowser()) return
  try {
    const entry: CacheEntry<T> = { data, expiry: Date.now() + ttl }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // localStorage might be full, ignore
  }
}

/** Get data from localStorage if not expired */
export function getLocalCache<T>(key: string): T | null {
  if (!isBrowser()) return null
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (entry.expiry > Date.now()) {
      return entry.data
    }
    // Expired
    localStorage.removeItem(CACHE_PREFIX + key)
    return null
  } catch {
    return null
  }
}

/** Remove a cached entry */
export function removeLocalCache(key: string): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(CACHE_PREFIX + key)
  } catch { /* ignore */ }
}
