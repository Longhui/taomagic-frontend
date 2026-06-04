# TaoInsight - I Ching & Feng Shui E-Commerce Platform

A modern e-commerce platform bringing 5,000 years of Chinese wisdom (I Ching guidance, Feng Shui, Taoist philosophy) to the Western market.

## Project Files

| File | Description |
|------|-------------|
| `tao-insight-demo.html` | **Main website** - Complete single-page application with Home, I Ching, Shop, and Wisdom pages |
| `guide.html` | **Coin Casting Guide** - Interactive tutorial for I Ching coin casting with practice demo |
| `app/` | Next.js source code for production development |

## Pages

### 1. Home Page (`tao-insight-demo.html`)
- Hero section with rotating Yin-Yang animation
- Three core pillars: Wisdom, I Ching, Feng Shui Store
- Featured products showcase
- Customer testimonials
- Newsletter subscription

### 2. I Ching Guidance (`tao-insight-demo.html#iching`)
- Free AI-powered hexagram casting
- Authentic 3-coin method simulation
- 64 hexagram database with interpretations
- Master consultation upsell ($29)

### 3. Feng Shui Store (`tao-insight-demo.html#shop`)
- 12 curated products across 5 categories
- Category filtering and sorting
- Product ratings and reviews
- Shopping cart UI

### 4. Yi Jing Wisdom (`tao-insight-demo.html#wisdom`)
- 8 expandable knowledge sections:
  - The Tao (道)
  - Yin & Yang (阴阳)
  - Five Elements (五行)
  - Bagua Trigrams (八卦)
  - Heavenly Stems & Earthly Branches (天干地支)
  - I Ching Guidance (易经预测)
  - Feng Shui (风水)
  - Eight Mansions (八宅明镜)

### 5. Coin Casting Guide (`guide.html`) ⭐ NEW
- **Quick Reference Card**: Coin-to-line mapping with visual examples
- **6-Step Complete Tutorial**: Preparation → Question → Casting → Recording → Building → Reading
- **Interactive Practice Demo**: Digital coin shaking with real-time hexagram building
- **Video Guide Placeholder**: Ready for video integration
- **FAQ Section**: 6 common questions with detailed answers

## Design System

### Colors
- **Ink** `#1a1a1a` - Primary dark
- **Rice** `#f5f0e8` - Primary light/background
- **Cinnabar** `#c41e3a` - CTAs, accents
- **Bronze** `#4a6741` - Secondary accents
- **Gold** `#c9a227` - Highlights, stars

### Typography
- **Serif**: Playfair Display (headings, brand)
- **Sans**: Inter (body, UI)

## Tech Stack

### Current (Static Demo)
- HTML5 + Tailwind CSS (via CDN)
- Vanilla JavaScript
- SVG icons (inline symbols)

### Production (Next.js)
- Next.js 14 + React 18
- TypeScript
- Tailwind CSS
- Lucide React icons

## Revenue Model

| Service | Price | Type |
|---------|-------|------|
| Free AI Reading | $0 | Lead generation |
| Master Consultation | $29 | Service |
| Monthly Subscription | $9.90 | Recurring |
| Feng Shui Products | $18-$89 | Physical goods |

## Next Steps

1. Replace product placeholder images with real photos
2. Integrate AI API (OpenAI/DeepSeek) for hexagram interpretation
3. Add Stripe payment processing
4. Implement user accounts and reading history
5. Add video content to guide.html
6. SEO optimization for all pages
7. Mobile responsiveness testing

---

Built with intention. Powered by ancient wisdom.
