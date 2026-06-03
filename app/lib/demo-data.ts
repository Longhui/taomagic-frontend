// ========== Demo Product Data ==========
// Used as fallback when Medusa backend is unreachable

import type { ProductItem, ReviewItem, RatingDistribution } from './medusa-types'

export const FALLBACK_CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '✦' },
  { id: 'wealth', name: 'Wealth & Abundance', icon: '💰' },
  { id: 'protection', name: 'Protection & Cleansing', icon: '🛡️' },
  { id: 'harmony', name: 'Harmony & Balance', icon: '☯️' },
  { id: 'health', name: 'Health & Vitality', icon: '🌿' },
  { id: 'love', name: 'Love & Relationships', icon: '💕' },
]

export const DEMO_PRODUCTS: ProductItem[] = [
  {
    id: 'demo-1', name: 'Brass Wu Lou (Calabash)', price: 48, category: 'health',
    rating: 4.9, reviews: 128,
    description: 'Traditional Feng Shui cure for illness and negative energy. The Wu Lou (gourd) is one of the most powerful traditional Feng Shui cures, believed to absorb and transform negative energy while promoting health and longevity. This solid brass calabash is meticulously crafted by skilled artisans using traditional metalworking techniques passed down through generations.',
    material: 'Solid Brass', size: '4.5 inches', weight: '0.8 lbs',
    tags: ['Health', 'Protection', 'Brass'], bestseller: true,
    images: [], handle: 'brass-wu-lou', variantId: 'v1', inventoryQuantity: 15,
  },
  {
    id: 'demo-2', name: 'Obsidian Pixiu Bracelet', price: 36, category: 'wealth',
    rating: 4.8, reviews: 256,
    description: 'The legendary wealth beast Pixiu paired with protective black obsidian. Pixiu is a powerful celestial creature known for its insatiable appetite for gold and treasure. This bracelet combines the wealth-attracting energy of Pixiu with the grounding protection of black obsidian, making it an essential tool for both prosperity and spiritual shielding.',
    material: 'Black Obsidian', size: 'Adjustable 6-8 inches', weight: '0.3 lbs',
    tags: ['Wealth', 'Protection', 'Obsidian'], bestseller: true,
    images: [], handle: 'obsidian-pixiu', variantId: 'v2', inventoryQuantity: 42,
  },
  {
    id: 'demo-3', name: 'Bagua Mirror Set (3pc)', price: 62, category: 'protection',
    rating: 4.7, reviews: 89,
    description: 'Complete set of flat, convex, and concave Bagua mirrors. The Bagua mirror is one of the most revered tools in Feng Shui practice. This comprehensive set includes three essential mirror types: flat for general protection, convex for deflecting negative energy, and concave for absorbing beneficial chi. Each mirror is handcrafted with precision and blessed according to traditional rituals.',
    material: 'Wood, Glass Mirror', size: '6 inches each', weight: '1.2 lbs',
    tags: ['Protection', 'Bagua', 'Mirror'], bestseller: false,
    images: [], handle: 'bagua-mirror-set', variantId: 'v3', inventoryQuantity: 8,
  },
  {
    id: 'demo-4', name: 'Five Elements Crystal Grid', price: 89, category: 'harmony',
    rating: 4.9, reviews: 67,
    description: 'Curated crystal set representing Wood, Fire, Earth, Metal, and Water elements. This harmonious crystal grid brings the Five Elements into perfect balance within your space. Each crystal is carefully selected for its elemental correspondence and energetic purity. The grid serves as a powerful focal point for meditation, intention setting, and space harmonization.',
    material: 'Natural Crystals', size: 'Grid 8×8 inches', weight: '2.4 lbs',
    tags: ['Five Elements', 'Crystals', 'Harmony'], bestseller: false,
    images: [], handle: 'five-elements-grid', variantId: 'v4', inventoryQuantity: 5,
  },
  {
    id: 'demo-5', name: 'Rose Quartz Mandarin Ducks', price: 54, category: 'love',
    rating: 4.8, reviews: 143,
    description: 'A pair of mandarin ducks carved from rose quartz, the stone of unconditional love. In Feng Shui tradition, mandarin ducks are the ultimate symbol of love, fidelity, and marital happiness. This exquisite pair is carved from genuine rose quartz, the stone of unconditional love and emotional healing. Place them in the southwest corner of your home to nurture romance.',
    material: 'Rose Quartz', size: '3 inches each', weight: '0.6 lbs',
    tags: ['Love', 'Rose Quartz', 'Mandarin Ducks'], bestseller: true,
    images: [], handle: 'rose-quartz-ducks', variantId: 'v5', inventoryQuantity: 12,
  },
  {
    id: 'demo-6', name: 'Brass Money Frog (Three-Legged Toad)', price: 42, category: 'wealth',
    rating: 4.6, reviews: 198,
    description: 'The legendary Jin Chan sits upon coins, holding one in its mouth. The three-legged money frog is one of the most recognizable Feng Shui wealth symbols. According to legend, Jin Chan was originally a greedy wife transformed by the Buddha and now brings prosperity to all who display her. This finely detailed brass statue will attract abundance to your home or office.',
    material: 'Brass with Gold Finish', size: '3.5 inches', weight: '0.9 lbs',
    tags: ['Wealth', 'Brass', 'Money Frog'], bestseller: false,
    images: [], handle: 'brass-money-frog', variantId: 'v6', inventoryQuantity: 25,
  },
  {
    id: 'demo-7', name: 'Bamboo Wind Chime (8 Rods)', price: 38, category: 'harmony',
    rating: 4.7, reviews: 112,
    description: 'Eight bamboo rods produce soothing tones that activate positive chi flow. Wind chimes are powerful Feng Shui tools that transform stagnant energy into vibrant, flowing chi. This eight-rod bamboo chime is tuned to a harmonious pentatonic scale. Each rod is carefully selected for its tonal quality, then cured and finished by hand.',
    material: 'Natural Bamboo', size: '24 inches total', weight: '0.5 lbs',
    tags: ['Harmony', 'Bamboo', 'Sound'], bestseller: false,
    images: [], handle: 'bamboo-wind-chime', variantId: 'v7', inventoryQuantity: 20,
  },
  {
    id: 'demo-8', name: 'Five Emperor Coins Set', price: 28, category: 'wealth',
    rating: 4.5, reviews: 234,
    description: 'Replica coins from five powerful Qing Dynasty emperors. The Five Emperor Coins represent the reign of China\'s five most prosperous Qing emperors: Shunzhi, Kangxi, Yongzheng, Qianlong, and Jiaqing. String them together and place them above your door, in your cash register, or carry them in your wallet to attract wealth and protect against negative energy.',
    material: 'Brass Alloy', size: '1.2 inches each', weight: '0.2 lbs',
    tags: ['Wealth', 'Coins', 'History'], bestseller: false,
    images: [], handle: 'five-emperor-coins', variantId: 'v8', inventoryQuantity: 60,
  },
  {
    id: 'demo-9', name: 'Selenite Wand Set', price: 45, category: 'protection',
    rating: 4.8, reviews: 156,
    description: 'High-vibration selenite wands for space cleansing and energy clearing. Selenite is unique among crystals for its exceptionally high vibration and ability to cleanse other stones without needing cleansing itself. This set of three wands can be used to clear stagnant energy from rooms, recharge other crystals, and create protective grids around your sacred spaces.',
    material: 'Natural Selenite', size: '6 inches each (3pc)', weight: '0.7 lbs',
    tags: ['Protection', 'Cleansing', 'Selenite'], bestseller: false,
    images: [], handle: 'selenite-wand-set', variantId: 'v9', inventoryQuantity: 18,
  },
  {
    id: 'demo-10', name: 'Ammonite Fossil Display', price: 78, category: 'wealth',
    rating: 4.9, reviews: 45,
    description: 'Ancient ammonite fossil with natural golden ratio spiral. Ammonite fossils are powerful Earth-based Feng Shui tools that have been accumulating stable, grounded energy for millions of years. The natural spiral of the ammonite follows the sacred golden ratio, making it a potent symbol of growth, prosperity, and the infinite cycle of abundance.',
    material: 'Natural Fossil', size: '5-6 inches', weight: '1.5 lbs',
    tags: ['Wealth', 'Fossil', 'Ancient'], bestseller: false,
    images: [], handle: 'ammonite-fossil', variantId: 'v10', inventoryQuantity: 3,
  },
  {
    id: 'demo-11', name: 'Red String Protection Bracelet', price: 18, category: 'protection',
    rating: 4.4, reviews: 567,
    description: 'Simple yet powerful red string bracelet blessed with protective intention. The red string is one of humanity\'s oldest and most universal protection symbols. This bracelet is hand-braided by practitioners who infuse each knot with protective mantras. Simple, elegant, and powerful — wear it as a daily reminder of your spiritual practice.',
    material: 'Silk Thread', size: 'Adjustable', weight: '0.05 lbs',
    tags: ['Protection', 'Simple', 'Red String'], bestseller: true,
    images: [], handle: 'red-string-bracelet', variantId: 'v11', inventoryQuantity: 200,
  },
  {
    id: 'demo-12', name: 'Lucky Bamboo (3 Stalks)', price: 32, category: 'wealth',
    rating: 4.6, reviews: 389,
    description: 'Three stalks represent happiness, long life, and prosperity. Lucky Bamboo is one of the most beloved Feng Shui plants, with each stalk count carrying specific meanings. Three stalks invite the three blessings: happiness, long life, and prosperity. This arrangement comes rooted in a beautiful ceramic container with river stones.',
    material: 'Live Plant + Ceramic', size: '12-16 inches', weight: '1.8 lbs',
    tags: ['Wealth', 'Plant', 'Bamboo'], bestseller: false,
    images: [], handle: 'lucky-bamboo', variantId: 'v12', inventoryQuantity: 10,
  },
]

/** Map handle to product for quick lookup */
export const PRODUCT_BY_HANDLE = Object.fromEntries(
  DEMO_PRODUCTS.map(p => [p.handle, p])
)

/** Find demo product by handle */
export function getDemoProduct(handle: string): ProductItem | undefined {
  return PRODUCT_BY_HANDLE[handle]
}

// ========== Demo Review Data ==========

interface DemoReviewEntry {
  productId: string
  distribution: RatingDistribution
  reviews: ReviewItem[]
}

export const DEMO_REVIEWS: DemoReviewEntry[] = [
  {
    productId: 'demo-1',
    distribution: { 5: 108, 4: 15, 3: 3, 2: 1, 1: 1 },
    reviews: [
      { id: 'r1', productId: 'demo-1', rating: 5, title: 'Beautiful craftsmanship', content: 'The detail on this brass Wu Lou is absolutely stunning. You can feel the quality the moment you hold it. I placed it in my health corner and immediately noticed a shift in energy.', author: 'Sarah M.', isVerifiedPurchase: true, date: '2026-02-15', helpfulCount: 23 },
      { id: 'r2', productId: 'demo-1', rating: 5, title: 'Authentic and powerful', content: 'This is not some cheap souvenir — it\'s a genuine Feng Shui tool made with care and intention. The brass has a beautiful weight to it and the finish is flawless.', author: 'Chen W.', isVerifiedPurchase: true, date: '2026-01-28', helpfulCount: 18 },
      { id: 'r3', productId: 'demo-1', rating: 4, title: 'Very nice but smaller than expected', content: 'The quality is excellent but it\'s a bit smaller than I imagined from the description. Still, it\'s a powerful addition to my altar and the energy feels right.', author: 'Priya K.', isVerifiedPurchase: true, date: '2026-01-10', helpfulCount: 7 },
      { id: 'r4', productId: 'demo-1', rating: 5, title: 'Perfect for my health corner', content: 'I\'ve been practicing Feng Shui for over a decade and this Wu Lou is one of the finest I\'ve encountered. The proportions are correct and the energy is palpable.', author: 'James L.', isVerifiedPurchase: false, date: '2025-12-05', helpfulCount: 12 },
      { id: 'r5', productId: 'demo-1', rating: 5, title: 'Excellent gift', content: 'Bought this as a get-well gift for a friend and she absolutely loved it. The packaging was beautiful and the piece itself radiates positive energy.', author: 'Amanda R.', isVerifiedPurchase: true, date: '2025-11-20', helpfulCount: 9 },
      { id: 'r6', productId: 'demo-1', rating: 3, title: 'Nice but overpriced', content: 'It\'s a well-made piece but I feel the price is a bit high for what it is. The energy is nice but I\'ve found similar items for less.', author: 'Tom D.', isVerifiedPurchase: true, date: '2025-10-15', helpfulCount: 4 },
    ],
  },
  {
    productId: 'demo-2',
    distribution: { 5: 195, 4: 45, 3: 12, 2: 2, 1: 2 },
    reviews: [
      { id: 'r7', productId: 'demo-2', rating: 5, title: 'My finances have improved!', content: 'I\'ve been wearing this bracelet for three months and I\'ve noticed a real shift in my financial situation. Whether it\'s the Pixiu or just mindset, I\'m not taking it off!', author: 'David L.', isVerifiedPurchase: true, date: '2026-03-01', helpfulCount: 45 },
      { id: 'r8', productId: 'demo-2', rating: 5, title: 'Beautiful and powerful', content: 'The obsidian beads are perfectly polished and the Pixiu charm is exquisitely detailed. I feel protected and grounded whenever I wear it.', author: 'Yuki T.', isVerifiedPurchase: true, date: '2026-02-18', helpfulCount: 31 },
      { id: 'r9', productId: 'demo-2', rating: 4, title: 'Great quality, nice weight', content: 'The bracelet has a satisfying weight and the beads are genuine obsidian. The adjustable cord is well-made. Only giving 4 stars because I wish the Pixiu was a bit larger.', author: 'Marcus J.', isVerifiedPurchase: true, date: '2026-02-01', helpfulCount: 12 },
      { id: 'r10', productId: 'demo-2', rating: 5, title: 'Daily wear for 6 months', content: 'I wear this every day and it still looks as good as new. The cord hasn\'t frayed at all and the obsidian beads have a beautiful natural luster.', author: 'Lin H.', isVerifiedPurchase: true, date: '2025-12-22', helpfulCount: 27 },
    ],
  },
  {
    productId: 'demo-3',
    distribution: { 5: 62, 4: 20, 3: 5, 2: 1, 1: 1 },
    reviews: [
      { id: 'r11', productId: 'demo-3', rating: 5, title: 'Complete and authentic set', content: 'Having all three mirror types in one set is incredibly convenient. The frames are beautifully carved and the mirrors are true. I\'ve already recommended them to my students.', author: 'Master Feng L.', isVerifiedPurchase: true, date: '2026-01-05', helpfulCount: 34 },
      { id: 'r12', productId: 'demo-3', rating: 4, title: 'Good quality, heavy frames', content: 'The wooden frames are substantial and well-crafted. The mirrors reflect clearly. I deducted one star because the hanging hardware could be sturdier given the weight.', author: 'Rachel G.', isVerifiedPurchase: true, date: '2025-11-12', helpfulCount: 8 },
    ],
  },
  {
    productId: 'demo-4',
    distribution: { 5: 55, 4: 9, 3: 2, 2: 1, 1: 0 },
    reviews: [
      { id: 'r13', productId: 'demo-4', rating: 5, title: 'Stunning crystal quality', content: 'Each crystal in this grid is carefully chosen — you can tell they weren\'t just randomly assembled. The amethyst and citrine pieces are particularly beautiful. My meditation practice has deepened significantly.', author: 'Ananda P.', isVerifiedPurchase: true, date: '2026-02-28', helpfulCount: 29 },
      { id: 'r14', productId: 'demo-4', rating: 5, title: 'Worth every penny', content: 'I was hesitant about the price but the moment I unboxed this grid I understood. The crystals are genuine, the wooden base is beautiful, and the energy in my room has completely transformed.', author: 'Steven C.', isVerifiedPurchase: true, date: '2026-01-20', helpfulCount: 19 },
    ],
  },
  {
    productId: 'demo-5',
    distribution: { 5: 112, 4: 25, 3: 5, 2: 1, 1: 0 },
    reviews: [
      { id: 'r15', productId: 'demo-5', rating: 5, title: 'Brought sweetness to our home', content: 'My partner and I placed these in our relationship corner and there\'s been a noticeable shift toward more tenderness and understanding. The rose quartz is genuine and the carving is meticulous.', author: 'Elena R.', isVerifiedPurchase: true, date: '2026-03-10', helpfulCount: 38 },
      { id: 'r16', productId: 'demo-5', rating: 5, title: 'Beautiful gift for my wife', content: 'I surprised my wife with these for our anniversary and she was moved to tears. They are absolutely exquisite and the energy in our bedroom has never been better.', author: 'Michael T.', isVerifiedPurchase: true, date: '2026-02-14', helpfulCount: 25 },
    ],
  },
  {
    productId: 'demo-6',
    distribution: { 5: 125, 4: 48, 3: 18, 2: 5, 1: 2 },
    reviews: [
      { id: 'r17', productId: 'demo-6', rating: 5, title: 'Classic wealth symbol', content: 'This money frog is beautifully finished and has a pleasant weight. I placed it facing inward from my front door as tradition dictates. My business has seen steady growth since.', author: 'Robert K.', isVerifiedPurchase: true, date: '2026-01-08', helpfulCount: 42 },
      { id: 'r18', productId: 'demo-6', rating: 4, title: 'Nice piece but gold finish is subtle', content: 'The brass quality is excellent but the gold finish is more subdued than the pictures suggest. Still a beautiful piece and the craftsmanship is undeniable.', author: 'Nancy D.', isVerifiedPurchase: true, date: '2025-12-15', helpfulCount: 11 },
    ],
  },
  {
    productId: 'demo-7',
    distribution: { 5: 78, 4: 25, 3: 7, 2: 1, 1: 1 },
    reviews: [
      { id: 'r19', productId: 'demo-7', rating: 5, title: 'Soothing sound, beautiful design', content: 'The tone of these bamboo chimes is incredibly relaxing. I hung them on my front porch and the gentle sound creates such a peaceful welcome. The bamboo is high quality with no cracking.', author: 'Grace S.', isVerifiedPurchase: true, date: '2026-02-20', helpfulCount: 19 },
      { id: 'r20', productId: 'demo-7', rating: 5, title: 'Perfect for my garden', content: 'These chimes have a deep, resonant tone that carries beautifully through my garden. They\'ve held up well in rain and sun. Highly recommend for outdoor spaces.', author: 'Hiroshi N.', isVerifiedPurchase: true, date: '2025-10-05', helpfulCount: 14 },
    ],
  },
]

/** Find reviews by product ID */
export function getDemoReviews(productId: string) {
  return DEMO_REVIEWS.find(r => r.productId === productId) || null
}
