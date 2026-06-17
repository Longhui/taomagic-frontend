'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  trackPageView,
  trackTimeOnPage,
  resetScrollDepth,
  trackScrollDepth,
  isAnalyticsEnabled,
} from '@/app/lib/analytics'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-GTPK6CYY9S'
const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID || ''
const ENABLED = isAnalyticsEnabled()

/**
 * Analytics 组件 —— 在根布局中引入一次即可。
 *
 * 开关由 NEXT_PUBLIC_ENABLE_ANALYTICS 控制：
 *   - false（.env.local）→ 本地开发关闭，不加载任何脚本
 *   - true / 未设置且 NODE_ENV=production → 加载 GA4 + Hotjar
 *
 * 功能:
 * - 注入 GA4 gtag 脚本
 * - 可选注入 Hotjar 脚本（设置 NEXT_PUBLIC_HOTJAR_ID 后生效）
 * - 路由切换时自动上报 page_view
 * - 自动跟踪滚动深度
 * - 页面离开时上报停留时长
 */
export default function Analytics() {
  const pathname = usePathname()
  const prevPath = useRef(pathname)

  // ====== 初始化脚本（仅一次） ======
  useEffect(() => {
    if (!ENABLED) return

    // GA4
    if (typeof window !== 'undefined' && !document.querySelector('#ga-gtag')) {
      const script = document.createElement('script')
      script.id = 'ga-gtag'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = function () { window.dataLayer.push(arguments) }
      window.gtag('js', new Date())
      window.gtag('config', GA_ID, {
        send_page_view: false, // 我们手动控制 page_view
      })
    }

    // Hotjar（如果配置了 ID）
    if (HOTJAR_ID && typeof window !== 'undefined' && !document.querySelector('#hotjar-script')) {
      const script = document.createElement('script')
      script.id = 'hotjar-script'
      script.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `
      document.head.appendChild(script)
    }
  }, [])

  // ====== 路由变化时上报 ======
  useEffect(() => {
    if (!ENABLED) return
    if (pathname === prevPath.current) return

    // 先上报上一页的停留时长
    trackTimeOnPage(prevPath.current)
    resetScrollDepth()

    // 上报新页面浏览
    trackPageView(pathname)
    prevPath.current = pathname
  }, [pathname])

  // 初始页面浏览
  useEffect(() => {
    if (!ENABLED) return
    trackPageView(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ====== 滚动深度跟踪 ======
  useEffect(() => {
    if (!ENABLED) return
    const handleScroll = () => trackScrollDepth(pathname)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // ====== 页面关闭 / 隐藏时上报停留时长 ======
  useEffect(() => {
    if (!ENABLED) return
    const handleBeforeUnload = () => {
      trackTimeOnPage(pathname)
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackTimeOnPage(pathname)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname])

  return null
}
