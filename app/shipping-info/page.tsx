'use client'

import React from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import { Truck } from 'lucide-react'

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-rice pt-16">
      <Navigation solid />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-bronze/20 flex items-center justify-center">
            <Truck size={24} className="text-bronze" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-ink">Shipping &amp; Delivery</h1>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-lg p-8 space-y-6 text-ink/80 leading-relaxed">
          <p>
            We ship worldwide from our fulfillment centers in Hong Kong and Shenzhen.
          </p>

          <h2 className="text-xl font-serif text-ink pt-4">Standard Shipping (7-14 business days)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="text-left py-2 font-medium text-ink">Region</th>
                  <th className="text-right py-2 font-medium text-ink">Price</th>
                  <th className="text-right py-2 font-medium text-ink">Free Over</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                <tr>
                  <td className="py-2">North America</td>
                  <td className="text-right">$6.99</td>
                  <td className="text-right">$59</td>
                </tr>
                <tr>
                  <td className="py-2">Europe</td>
                  <td className="text-right">$7.99</td>
                  <td className="text-right">$69</td>
                </tr>
                <tr>
                  <td className="py-2">Asia-Pacific</td>
                  <td className="text-right">$4.99</td>
                  <td className="text-right">$39</td>
                </tr>
                <tr>
                  <td className="py-2">Rest of World</td>
                  <td className="text-right">$9.99</td>
                  <td className="text-right">$79</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-serif text-ink pt-4">Express Shipping (3-7 business days)</h2>
          <p>All regions: $19.99</p>

          <h2 className="text-xl font-serif text-ink pt-4">Tracking</h2>
          <p>
            All orders include tracking number. Check status in your account or via the tracking link in your confirmation email.
          </p>

          <h2 className="text-xl font-serif text-ink pt-4">Customs &amp; Duties</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>Prices shown do not include import taxes</li>
            <li>Customer is responsible for any customs fees in their country</li>
            <li>We declare items as &ldquo;Cultural Decorative Objects&rdquo; for customs</li>
          </ul>

          <h2 className="text-xl font-serif text-ink pt-4">Processing Time</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>In-stock items: 1-2 business days</li>
            <li>Made-to-order items: 3-5 business days</li>
          </ul>
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
