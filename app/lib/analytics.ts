/**
 * Analytics — GA4 + Hotjar 统一埋点工具
 *
 * 用法:
 *   trackEvent('shop', 'add_to_cart', 'Product Name')
 *   trackPageView('/shop')
 *   trackClick('cta_button', { page: 'home', label: 'Get I Ching Reading' })
 *
 * 开关控制:
 *   NEXT_PUBLIC_ENABLE_ANALYTICS=false  → 完全关闭所有跟踪（本地开发用）
 *   NEXT_PUBLIC_ENABLE_ANALYTICS=true   → 强制开启
 *   不设置 → 生产环境 (NODE_ENV=production) 自动开启，开发环境关闭
 */

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    hj: (...args: any[]) => void
  }
}

// ========== 开关 ==========

const ENABLE_ANALYTICS = (() => {
  const flag = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS
  if (flag === 'true') return true
  if (flag === 'false') return false
  // 未设置时：生产环境默认开启，开发环境关闭
  return process.env.NODE_ENV === 'production'
})()

/** 判断埋点是否全局开启 */
export function isAnalyticsEnabled(): boolean {
  return ENABLE_ANALYTICS
}

// ========== GA4 ==========

/** 推送到 GA4 dataLayer */
export function gtag(...args: any[]) {
  if (!ENABLE_ANALYTICS) return
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(arguments)
  }
}

/** GA4 自定义事件 */
export function gtagEvent(action: string, params?: Record<string, any>) {
  gtag('event', action, params)
}

// ========== Hotjar ==========

/** 触发 Hotjar 事件（需要在 Hotjar 后台配置后才生效） */
export function hjEvent(eventName: string, params?: Record<string, any>) {
  if (!ENABLE_ANALYTICS) return
  if (typeof window !== 'undefined' && typeof window.hj === 'function') {
    window.hj('event', eventName, params)
  }
}

// ========== 统一事件跟踪 ==========

type EventCategory = 'navigation' | 'cta' | 'shop' | 'iching' | 'fengshui' | 'wisdom' | 'engagement'

/**
 * 统一事件埋点 —— 同时推送 GA4 和 Hotjar
 *
 * @param category  事件分类（如 shop, cta, navigation）
 * @param action    动作（如 click, add_to_cart, submit）
 * @param label     额外标识（如商品名、按钮文本）
 * @param value     数值（如价格、数量）
 */
export function trackEvent(
  category: EventCategory,
  action: string,
  label?: string,
  value?: number,
) {
  if (!ENABLE_ANALYTICS) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] 🚫 已关闭 (NEXT_PUBLIC_ENABLE_ANALYTICS=false)`, { category, action, label, value })
    }
    return
  }

  const eventName = `${category}_${action}`

  // GA4
  gtagEvent(eventName, {
    event_category: category,
    event_label: label,
    value,
  })

  // Hotjar
  hjEvent(eventName, { label, value })

  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Analytics] ${eventName}`, { category, action, label, value })
  }
}

/** 按钮点击快捷方法 */
export function trackClick(category: EventCategory, label: string) {
  trackEvent(category, 'click', label)
}

/** 链接跳转快捷方法 */
export function trackLink(category: EventCategory, label: string, url: string) {
  trackEvent(category, 'link_click', `${label} → ${url}`)
}

/** 表单提交快捷方法 */
export function trackSubmit(category: EventCategory, label: string) {
  trackEvent(category, 'submit', label)
}

// ========== 页面浏览跟踪 ==========

let _pageViewStart = 0

/** 记录页面浏览 —— 在路由切换时调用 */
export function trackPageView(pathname: string) {
  if (!ENABLE_ANALYTICS) return
  _pageViewStart = Date.now()
  gtagEvent('page_view', { page_path: pathname, page_title: document.title })
  hjEvent('page_view', { page_path: pathname })
}

/** 获取当前页面停留时长（毫秒），用于页面离开时上报 */
export function getTimeOnPage(): number {
  if (!_pageViewStart) return 0
  return Date.now() - _pageViewStart
}

/** 页面离开 / 隐藏时上报停留时长 */
export function trackTimeOnPage(pathname: string) {
  if (!ENABLE_ANALYTICS) return
  const ms = getTimeOnPage()
  if (ms > 1000) {
    const seconds = Math.round(ms / 1000)
    trackEvent('engagement', 'time_on_page', pathname, seconds)
  }
}

// ========== 滚动深度跟踪 ==========

let _scrollDepthTracked = new Set<number>()

/** 上报滚动深度百分比（25%, 50%, 75%, 100%） */
export function trackScrollDepth(pathname: string) {
  if (!ENABLE_ANALYTICS) return
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) return

  const percent = Math.round((scrollTop / docHeight) * 100)
  const thresholds = [25, 50, 75, 100]

  for (const t of thresholds) {
    if (percent >= t && !_scrollDepthTracked.has(t)) {
      _scrollDepthTracked.add(t)
      trackEvent('engagement', 'scroll_depth', `${pathname} ${t}%`, t)
    }
  }
}

/** 重置滚动深度记录（页面切换时调用） */
export function resetScrollDepth() {
  _scrollDepthTracked = new Set()
}
