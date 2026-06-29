'use client'

import React from 'react'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import { AlertTriangle } from 'lucide-react'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-rice pt-16">
      <Navigation solid />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-bronze/20 flex items-center justify-center">
            <AlertTriangle size={24} className="text-bronze" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-ink">Disclaimer</h1>
            <p className="text-sm text-ink/50">Entertainment &amp; Cultural Appreciation Policy</p>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-lg p-8 space-y-6 text-ink/80 leading-relaxed">
          <p>
            At TaoMagic, we celebrate the rich heritage of Chinese philosophy
            and traditional arts. Our offerings are designed for cultural
            exploration, personal reflection, and mindful living.
          </p>

          <div className="bg-bronze/5 border border-bronze/20 rounded-lg p-6">
            <h2 className="text-lg font-serif text-ink mb-4">Important Notice</h2>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-bronze mt-1 shrink-0">•</span>
                <span>All I Ching readings, Feng Shui guidance, and related content are provided for entertainment and educational purposes only.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-bronze mt-1 shrink-0">•</span>
                <span>Results should not be considered as professional advice for financial, medical, legal, or personal decisions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-bronze mt-1 shrink-0">•</span>
                <span>Individual experiences may vary. We encourage critical thinking and personal judgment in all matters.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-bronze mt-1 shrink-0">•</span>
                <span>Our Feng Shui objects are artisan-crafted decorative items. Their value lies in craftsmanship, materials, and cultural significance.</span>
              </li>
            </ul>
          </div>

          <p>
            By using our services, you acknowledge that TaoMagic is not
            liable for any actions taken based on the information provided.
          </p>

          <p>
            For questions, contact us at:{' '}
            <a href="mailto:support@taomagic.net" className="text-bronze hover:underline">support@taomagic.net</a>
          </p>
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
