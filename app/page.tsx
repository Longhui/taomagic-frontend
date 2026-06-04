'use client'

import Link from 'next/link'
import { BookOpen, Sparkles, HomeIcon, ChevronRight, Star, Mail } from 'lucide-react'
import Navigation from '@/app/components/Navigation'

// Yin Yang SVG Component
const YinYangSVG = ({ size = 200, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={`yin-yang-rotate ${className}`}>
    <circle cx="100" cy="100" r="98" fill="#1a1a1a" stroke="#c9a227" strokeWidth="2"/>
    <path d="M100,2 A49,49 0 0,1 100,98 A49,49 0 0,0 100,198 A98,98 0 0,1 100,2" fill="#f5f0e8"/>
    <circle cx="100" cy="50" r="15" fill="#1a1a1a"/>
    <circle cx="100" cy="150" r="15" fill="#f5f0e8"/>
  </svg>
)


// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cinnabar rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 flex justify-center">
          <YinYangSVG size={120} />
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-rice mb-6 leading-tight">
          Unlock Ancient Chinese<br />
          <span className="text-gold">Wisdom</span> for Modern Life
        </h1>

        <p className="text-lg md:text-xl text-rice/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover the I Ching, master Feng Shui, and transform your space with 
          5,000 years of Taoist philosophy. Your journey to harmony begins here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/iching" className="bg-cinnabar text-rice px-8 py-4 rounded-sm text-lg hover:bg-cinnabar/80 transition-all flex items-center justify-center gap-2">
            <Sparkles size={20} />
            Get Free I Ching Reading
          </Link>
          <Link href="/wisdom" className="border border-rice/30 text-rice px-8 py-4 rounded-sm text-lg hover:bg-rice/10 transition-all">
            Explore Wisdom
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { num: '5,000+', label: 'Years of Wisdom' },
            { num: '64', label: 'Hexagrams' },
            { num: '8', label: 'Trigrams' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-serif text-gold">{stat.num}</div>
              <div className="text-sm text-rice/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Three Pillars Section
const ThreePillars = () => {
  const pillars = [
    {
      id: 'wisdom',
      title: 'Yi Jing Wisdom',
      subtitle: 'Eastern Philosophy · Self-Reflection',
      description: 'Explore the Tao, Yin-Yang, Five Elements, and the 64 Hexagrams. Understand the ancient framework that has guided decisions for millennia.',
      icon: BookOpen,
      color: 'bronze',
      features: ['Tao Origin & Philosophy', 'Yin-Yang Dynamics', 'Five Elements Theory', 'Heavenly Stems & Earthly Branches', '64 Hexagrams Guide'],
      cta: 'Start Learning',
      href: '/wisdom'
    },
    {
      id: 'iching',
      title: 'I Ching Guidance',
      subtitle: 'Personalized Insights · Daily Reflection',
      description: "Experience authentic I Ching tradition. Explore your hexagram, receive structured interpretation, and unlock personalized guidance for life's important questions.",
      icon: Sparkles,
      color: 'cinnabar',
      features: ['Free AI-Powered Reading', 'Authentic Coin Method', 'Detailed Hexagram Analysis', '1-on-1 Energy Session', 'Reading History'],
      cta: 'Explore Your Hexagram',
      href: '/iching'
    },
    {
      id: 'fengshui',
      title: 'Feng Shui Store',
      subtitle: 'Intentional Objects · Mindful Spaces',
      description: 'Transform your living space with intentionally crafted objects. From wealth corners to guardian pieces, curated items designed with purpose.',
      icon: HomeIcon,
      color: 'gold',
      features: ['Wealth & Abundance Items', 'Guardian Objects', 'Five Elements Decor', 'Bagua Mirrors', 'Personal Intention Objects'],
      cta: 'Shop Collection',
      href: '/shop'
    }
  ]

  return (
    <section className="py-24 bg-rice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-ink mb-4">Three Paths to Harmony</h2>
          <p className="text-ink/60 max-w-2xl mx-auto">Whether you seek knowledge, guidance, or transformation — your journey begins with one of these three gates.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            const colorClasses = {
              bronze: 'bg-bronze/10 border-bronze/30 text-bronze',
              cinnabar: 'bg-cinnabar/10 border-cinnabar/30 text-cinnabar',
              gold: 'bg-gold/10 border-gold/30 text-gold',
            }

            return (
              <div key={pillar.id} id={pillar.id} className="group relative bg-white rounded-lg border border-ink/10 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex p-3 rounded-lg mb-6 ${colorClasses[pillar.color as keyof typeof colorClasses]}`}>
                  <Icon size={28} />
                </div>

                <h3 className="text-2xl font-serif text-ink mb-1">{pillar.title}</h3>
                <p className="text-sm text-ink/40 mb-4 font-serif italic">{pillar.subtitle}</p>
                <p className="text-ink/70 mb-6 leading-relaxed">{pillar.description}</p>

                <ul className="space-y-2 mb-8">
                  {pillar.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-ink/60">
                      <span className="text-gold shrink-0">✦</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={pillar.href} className="inline-flex items-center gap-2 text-ink font-medium hover:text-cinnabar transition-colors group-hover:gap-3">
                  {pillar.cta} <ChevronRight size={16} />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Featured Products Preview
const FeaturedProducts = () => {
  const products = [
    {
      name: 'Brass Wu Lou (Calabash)',
      price: '$48',
      category: 'Health & Protection',
      description: 'Traditional Feng Shui cure for illness and negative energy.',
      tag: 'Best Seller'
    },
    {
      name: 'Obsidian Pixiu Bracelet',
      price: '$36',
      category: 'Wealth Attraction',
      description: 'Legendary wealth beast paired with protective black obsidian.',
      tag: 'Popular'
    },
    {
      name: 'Bagua Mirror Set',
      price: '$62',
      category: 'Space Protection',
      description: 'Complete set of flat, convex, and concave mirrors.',
      tag: 'Essential'
    },
    {
      name: 'Five Elements Crystal Grid',
      price: '$89',
      category: 'Energy Balance',
      description: 'Curated crystals representing Wood, Fire, Earth, Metal, Water.',
      tag: 'New'
    }
  ]

  return (
    <section className="py-24 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-rice mb-2">Curated Feng Shui Objects</h2>
            <p className="text-rice/60">Each item selected for authentic energy and purpose</p>
          </div>
          <a href="/shop" className="hidden md:inline-flex items-center gap-2 text-gold hover:text-rice transition-colors">
            View All <ChevronRight size={16} />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.name} className="group bg-ink border border-rice/10 rounded-lg overflow-hidden hover:border-gold/50 transition-all">
              <div className="aspect-square bg-gradient-to-br from-ink to-ink/80 flex items-center justify-center relative">
                <div className="w-24 h-24 rounded-full bg-rice/5 border border-rice/20 flex items-center justify-center">
                  <Sparkles size={32} className="text-gold/60" />
                </div>
                <span className="absolute top-3 right-3 bg-cinnabar text-rice text-xs px-2 py-1 rounded-sm">{product.tag}</span>
              </div>
              <div className="p-5">
                <p className="text-xs text-bronze uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-rice font-serif text-lg mb-2">{product.name}</h3>
                <p className="text-rice/50 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gold text-xl font-serif">{product.price}</span>
                  <button className="text-sm text-rice/70 hover:text-gold transition-colors border border-rice/20 px-3 py-1 rounded-sm hover:border-gold">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials
const Testimonials = () => {
  const reviews = [
    {
      text: "The I Ching reading gave me clarity during a major career decision. The hexagram interpretation was surprisingly precise and actionable.",
      author: "Sarah M.",
      location: "California",
      rating: 5
    },
    {
      text: "After placing the wealth corner items as recommended, I received an unexpected promotion within two months. Coincidence? Maybe. But I'm not moving them.",
      author: "James K.",
      location: "New York",
      rating: 5
    },
    {
      text: "The knowledge section helped me understand Feng Shui beyond superstition. It's actually a sophisticated system of environmental psychology.",
      author: "Dr. Emily Chen",
      location: "Texas",
      rating: 5
    }
  ]

  return (
    <section className="py-24 bg-rice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif text-ink text-center mb-16">Voices from the Community</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-8 rounded-lg border border-ink/10 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="text-ink/80 mb-6 leading-relaxed italic">"{review.text}"</p>
              <div>
                <p className="font-medium text-ink">{review.author}</p>
                <p className="text-sm text-ink/50">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Newsletter
const Newsletter = () => {
  return (
    <section className="py-24 bg-bronze/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail size={32} className="text-bronze mx-auto mb-4" />
        <h2 className="text-3xl font-serif text-ink mb-4">Join 10,000+ Seekers</h2>
        <p className="text-ink/70 mb-8">Receive weekly Tao wisdom, moon phase insights, and exclusive Feng Shui tips directly to your inbox.</p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 px-4 py-3 rounded-sm border border-ink/20 bg-white focus:outline-none focus:border-bronze"
          />
          <button className="bg-ink text-rice px-6 py-3 rounded-sm hover:bg-ink/80 transition-colors">
            Subscribe
          </button>
        </div>
        <p className="text-xs text-ink/40 mt-4">No spam. Unsubscribe anytime. Your privacy is sacred.</p>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="bg-ink text-rice/60 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
          <YinYangSVG size={28} className="!animation-none" />
          <span className="text-rice font-serif text-xl font-bold">TaoInsight</span>
        </div>
        <p className="text-sm leading-relaxed max-w-xl mb-12 text-center md:text-left">
          Bridging 5,000 years of Chinese wisdom with modern seekers worldwide.
        </p>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-rice font-medium mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-gold transition-colors">All Products</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-rice font-medium mb-4 text-sm uppercase tracking-wider">I Ching</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/iching" className="hover:text-gold transition-colors">Free Reading</Link></li>
              <li><Link href="/iching/analysis" className="hover:text-gold transition-colors">History</Link></li>
              <li><Link href="/wisdom" className="hover:text-gold transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-rice font-medium mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shipping-info" className="hover:text-gold transition-colors">Shipping</Link></li>
              <li><Link href="/shop" className="hover:text-gold transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-rice font-medium mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-gold transition-colors">Return Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-gold transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rice/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; 2026 TaoInsight. All rights reserved.</p>
          <a href="mailto:support@taoinsight.com" className="text-sm text-rice/50 hover:text-gold transition-colors">
            support@taoinsight.com
          </a>
        </div>
      </div>
    </footer>
  )
}

// Main Page
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ThreePillars />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  )
}
