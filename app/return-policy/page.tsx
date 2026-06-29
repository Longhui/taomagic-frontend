'use client'

import React from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import { RotateCcw } from 'lucide-react'

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-rice pt-16">
      <Navigation solid />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-bronze/20 flex items-center justify-center">
            <RotateCcw size={24} className="text-bronze" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-ink">Return &amp; Exchange Policy</h1>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-lg p-8 space-y-6 text-ink/80 leading-relaxed">
          <p>
            We want you to love your purchase. If you&apos;re not satisfied,
            we offer hassle-free returns within 7 days of delivery.
          </p>

          <h2 className="text-xl font-serif text-ink pt-4">Eligibility</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>Items must be unused, in original packaging</li>
            <li>Personalized/custom items are non-returnable</li>
            <li>Digital content (guides, readings) are non-refundable once accessed</li>
          </ul>

          <h2 className="text-xl font-serif text-ink pt-4">Process</h2>
          <ol className="space-y-3 list-decimal pl-5">
            <li>Contact <a href="mailto:support@taomagic.net" className="text-bronze hover:underline">support@taomagic.net</a> with order number</li>
            <li>Receive return authorization and prepaid label (for defective items)</li>
            <li>Ship item back within 14 days of authorization</li>
            <li>Refund processed within 5-7 business days after receipt</li>
          </ol>

          <h2 className="text-xl font-serif text-ink pt-4">Shipping Costs</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li><strong>Defective/wrong item:</strong> We cover return shipping</li>
            <li><strong>Change of mind:</strong> Customer covers return shipping</li>
          </ul>

          <div className="bg-cinnabar/5 border border-cinnabar/20 rounded-lg p-5 mt-4">
            <p className="font-medium text-ink">
              Damaged in transit? Email photos within 48 hours of delivery for immediate replacement.
            </p>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-ink text-rice/60 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <Link href="/" className="hover:text-gold transition-colors">&larr; Back to TaoMagic</Link>
        </div>
      </footer>
    </div>
  )
}
