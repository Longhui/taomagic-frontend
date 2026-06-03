'use client'

import React from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import { Shield } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-rice pt-16">
      <Navigation solid />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-bronze/20 flex items-center justify-center">
            <Shield size={24} className="text-bronze" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-ink">Privacy Policy</h1>
            <p className="text-sm text-ink/50">Last updated: June 2026</p>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-lg p-8 space-y-6 text-ink/80 leading-relaxed">
          <p>
            TaoInsight (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates taoinsight.com. This policy
            describes how we collect, use, and protect your information.
          </p>

          <h2 className="text-xl font-serif text-ink pt-4">Information We Collect</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li><strong>Order details:</strong> name, shipping address, email, phone</li>
            <li><strong>Payment information:</strong> processed securely via Stripe/PayPal. We do not store full card numbers.</li>
            <li><strong>Browsing data:</strong> cookies, IP address, pages visited (via Google Analytics)</li>
          </ul>

          <h2 className="text-xl font-serif text-ink pt-4">How We Use It</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>Process and ship orders</li>
            <li>Send order updates and support responses</li>
            <li>Improve website experience</li>
            <li>Marketing emails (opt-out anytime)</li>
          </ul>

          <div className="bg-bronze/5 border border-bronze/20 rounded-lg p-6">
            <h3 className="font-serif text-ink font-medium mb-3">We Do Not</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span>Sell your data to third parties</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span>Share information beyond necessary service providers (shipping carriers, payment processors, email service)</span>
              </li>
            </ul>
          </div>

          <h2 className="text-xl font-serif text-ink pt-4">Your Rights</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>Request data deletion: <a href="mailto:support@taoinsight.com" className="text-bronze hover:underline">support@taoinsight.com</a></li>
            <li>Unsubscribe from emails: link in every email</li>
            <li>Cookie preferences: adjust in browser settings</li>
          </ul>

          <h2 className="text-xl font-serif text-ink pt-4">Security</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>SSL encryption on all pages</li>
            <li>Payment processing PCI-DSS compliant</li>
            <li>Regular security audits</li>
          </ul>

          <p className="pt-4">
            Contact: <a href="mailto:support@taoinsight.com" className="text-bronze hover:underline">support@taoinsight.com</a>
          </p>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-ink text-rice/60 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <Link href="/" className="hover:text-gold transition-colors">&larr; Back to TaoInsight</Link>
        </div>
      </footer>
    </div>
  )
}
