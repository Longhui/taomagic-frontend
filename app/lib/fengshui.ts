// Ba Zhai Ming Jing (Eight Mansions) Feng Shui Calculation Library

export type Gender = 'male' | 'female'

export type Direction =
  | 'north' | 'south' | 'east' | 'west'
  | 'northeast' | 'northwest' | 'southeast' | 'southwest'

export type RoomType =
  | 'bedroom' | 'livingroom' | 'kitchen' | 'bathroom'
  | 'study' | 'dining' | 'storage' | 'master-bedroom'
  | 'empty'

export type GridCell = { row: number; col: number } // 0-indexed 3x3 grid

export interface RoomAssignment {
  pos: GridCell
  room: RoomType
}

export interface MingGuaInfo {
  number: number      // 1-9
  trigram: string     // Kan, Kun, etc.
  element: string     // Water, Earth, Wood, Metal, Fire
  group: 'east' | 'west'
  groupLabel: string  // "East Life Group" or "West Life Group"
  description: string
}

export interface DirectionFortune {
  direction: Direction
  directionLabel: string
  name: string       // e.g. Sheng Qi
  type: 'great' | 'medium' | 'small' | 'bad' | 'worst'
  typeLabel: string
  color: string
  score: number     // 0-100
}

export interface DiagnosisResult {
  item: RoomAssignment
  direction: Direction
  fortune: DirectionFortune
  verdict: 'good' | 'warning' | 'bad'
  message: string
  score: number
}

export interface BraceletRec {
  id: string
  name: string
  material: string
  element: string
  price: number
  image: string
  description: string
  benefits: string[]
  matchReason: string
}

// ========== Ming Gua Calculation ==========

function sumToDigit(n: number): number {
  let s = n
  while (s >= 10) {
    s = String(s).split('').reduce((a, b) => a + parseInt(b), 0)
  }
  return s
}

function isBeforeSpringBegins(month: number, day: number): boolean {
  // Spring Begins (Li Chun) is around Feb 4
  return month < 2 || (month === 2 && day < 4)
}

export function calcMingGua(year: number, month: number, day: number, gender: Gender): MingGuaInfo {
  // Adjust year if before Spring Begins
  let adjustedYear = isBeforeSpringBegins(month, day) ? year - 1 : year
  if (adjustedYear < 1900) adjustedYear = year

  const lastTwo = adjustedYear % 100
  const digit = sumToDigit(lastTwo)

  let mingGuaNum: number

  if (gender === 'male') {
    if (adjustedYear < 2000) {
      mingGuaNum = 10 - digit
    } else {
      mingGuaNum = 9 - digit
    }
  } else {
    if (adjustedYear < 2000) {
      mingGuaNum = 5 + digit
    } else {
      mingGuaNum = 6 + digit
    }
  }

  if (mingGuaNum === 0) mingGuaNum = 9
  if (mingGuaNum > 9) mingGuaNum -= 9

  // Special case: 5 maps to different trigrams
  if (mingGuaNum === 5) {
    return gender === 'male'
      ? { number: 5, trigram: 'Gen', element: 'Earth', group: 'west', groupLabel: 'West Life Group', description: 'Gen (Earth) · West Group · Steadfast as a mountain' }
      : { number: 5, trigram: 'Kun', element: 'Earth', group: 'west', groupLabel: 'West Life Group', description: 'Kun (Earth) · West Group · Nurturing as the earth' }
  }

  const trigramMap: Record<number, { trigram: string; element: string; group: 'east' | 'west' }> = {
    1: { trigram: 'Kan', element: 'Water', group: 'east' },
    2: { trigram: 'Kun', element: 'Earth', group: 'west' },
    3: { trigram: 'Zhen', element: 'Wood', group: 'east' },
    4: { trigram: 'Xun', element: 'Wood', group: 'east' },
    6: { trigram: 'Qian', element: 'Metal', group: 'west' },
    7: { trigram: 'Dui', element: 'Metal', group: 'west' },
    8: { trigram: 'Gen', element: 'Earth', group: 'west' },
    9: { trigram: 'Li', element: 'Fire', group: 'east' },
  }

  const info = trigramMap[mingGuaNum]

  const descriptions: Record<string, string> = {
    'Kan': 'Kan (Water) · East Group · Wisdom flows like water',
    'Kun': 'Kun (Earth) · West Group · Nurturing as the earth',
    'Zhen': 'Zhen (Wood) · East Group · Thunder awakens life',
    'Xun': 'Xun (Wood) · East Group · Wind penetrates all',
    'Qian': 'Qian (Metal) · West Group · Heaven moves with strength',
    'Dui': 'Dui (Metal) · West Group · Joy nourishes all',
    'Gen': 'Gen (Earth) · West Group · Steadfast as a mountain',
    'Li': 'Li (Fire) · East Group · Fire illuminates the world',
  }

  return {
    number: mingGuaNum,
    trigram: info.trigram,
    element: info.element,
    group: info.group,
    groupLabel: info.group === 'east' ? 'East Life Group' : 'West Life Group',
    description: descriptions[info.trigram] || '',
  }
}

// ========== House Gua ==========

const directionToHouseGroup: Record<Direction, 'east' | 'west'> = {
  east: 'east',
  southeast: 'east',
  south: 'east',
  north: 'east',
  west: 'west',
  southwest: 'west',
  northwest: 'west',
  northeast: 'west',
}

export function getHouseGroup(facing: Direction): 'east' | 'west' {
  return directionToHouseGroup[facing]
}

// ========== Direction Fortune Mapping ==========

const directionLabels: Record<Direction, string> = {
  north: 'North', south: 'South', east: 'East', west: 'West',
  northeast: 'Northeast', northwest: 'Northwest', southeast: 'Southeast', southwest: 'Southwest',
}

const FORTUNE_MAP: Record<number, Direction[]> = {
  1: ['southeast', 'east', 'south', 'north', 'northeast', 'west', 'northwest', 'southwest'],
  2: ['northeast', 'west', 'northwest', 'southwest', 'south', 'southeast', 'east', 'north'],
  3: ['south', 'north', 'southeast', 'east', 'northwest', 'southwest', 'northeast', 'west'],
  4: ['north', 'south', 'east', 'southeast', 'northwest', 'northeast', 'southwest', 'west'],
  6: ['southwest', 'northeast', 'west', 'northwest', 'north', 'south', 'southeast', 'east'],
  7: ['northwest', 'southwest', 'northeast', 'west', 'southeast', 'north', 'east', 'south'],
  8: ['west', 'northwest', 'southwest', 'northeast', 'east', 'north', 'southeast', 'south'],
  9: ['east', 'southeast', 'north', 'south', 'southwest', 'northwest', 'west', 'northeast'],
}

const FORTUNE_TYPES: { name: string; type: 'great' | 'medium' | 'small' | 'bad' | 'worst' }[] = [
  { name: 'Sheng Qi (Vitality)', type: 'great' },
  { name: 'Tian Yi (Healer)', type: 'medium' },
  { name: 'Yan Nian (Longevity)', type: 'small' },
  { name: 'Fu Wei (Stability)', type: 'small' },
  { name: 'Huo Hai (Misfortune)', type: 'bad' },
  { name: 'Liu Sha (Six Harms)', type: 'bad' },
  { name: 'Wu Gui (Five Ghosts)', type: 'worst' },
  { name: 'Jue Ming (Death)', type: 'worst' },
]

const TYPE_LABELS: Record<string, string> = {
  great: 'Great Auspicious', medium: 'Medium Auspicious', small: 'Minor Auspicious',
  bad: 'Inauspicious', worst: 'Great Inauspicious',
}

const TYPE_COLORS: Record<string, string> = {
  great: 'text-green-600 bg-green-50 border-green-300',
  medium: 'text-teal-600 bg-teal-50 border-teal-300',
  small: 'text-blue-600 bg-blue-50 border-blue-300',
  bad: 'text-orange-600 bg-orange-50 border-orange-300',
  worst: 'text-red-600 bg-red-50 border-red-300',
}

const TYPE_SCORES: Record<string, number> = {
  great: 90, medium: 75, small: 60, bad: 30, worst: 10,
}

export function getDirectionFortunes(mingGuaNum: number): DirectionFortune[] {
  const normNum = mingGuaNum === 5 ? 2 : mingGuaNum // 5 maps to Kun(2)
  const dirs = FORTUNE_MAP[normNum]
  if (!dirs) return []

  return dirs.map((dir, i) => ({
    direction: dir,
    directionLabel: directionLabels[dir],
    name: FORTUNE_TYPES[i].name,
    type: FORTUNE_TYPES[i].type,
    typeLabel: TYPE_LABELS[FORTUNE_TYPES[i].type],
    color: TYPE_COLORS[FORTUNE_TYPES[i].type],
    score: TYPE_SCORES[FORTUNE_TYPES[i].type],
  }))
}

// ========== Room Layout Diagnosis ==========

export const ROOM_NAMES: Record<RoomType, string> = {
  'bedroom': 'Bedroom', 'master-bedroom': 'Master Bedroom', 'livingroom': 'Living Room',
  'kitchen': 'Kitchen', 'bathroom': 'Bathroom', 'study': 'Study',
  'dining': 'Dining Room', 'storage': 'Storage', 'empty': 'Empty',
}

const GRID_DIRECTION: Record<string, Direction> = {
  '0,0': 'northwest', '0,1': 'north', '0,2': 'northeast',
  '1,0': 'west',      '1,1': 'north', '1,2': 'east',
  '2,0': 'southwest', '2,1': 'south', '2,2': 'southeast',
}

export function gridCellToDirection(row: number, col: number): Direction {
  const key = `${row},${col}`
  return GRID_DIRECTION[key] || 'north'
}

export function roomDiagnosis(
  rooms: RoomAssignment[],
  mingGuaNum: number,
): DiagnosisResult[] {
  const fortunes = getDirectionFortunes(mingGuaNum)
  const fortuneByDir: Record<string, DirectionFortune> = {}
  fortunes.forEach(f => { fortuneByDir[f.direction] = f })

  const results: DiagnosisResult[] = []

  for (const r of rooms) {
    if (r.room === 'empty') continue

    const dir = gridCellToDirection(r.pos.row, r.pos.col)
    const fortune = fortuneByDir[dir]
    if (!fortune) continue

    const roomName = ROOM_NAMES[r.room] || r.room
    const dirName = directionLabels[dir]

    let verdict: 'good' | 'warning' | 'bad'
    let message: string

    if (fortune.type === 'great' || fortune.type === 'medium') {
      if (r.room === 'bedroom' || r.room === 'master-bedroom') {
        verdict = 'good'
        message = `${roomName} is in ${dirName} (${fortune.name}) — very auspicious! Absorbing beneficial energy for body and mind.`
      } else if (r.room === 'study') {
        verdict = 'good'
        message = `${roomName} is in ${dirName} (${fortune.name}) — excellent for study and concentration.`
      } else if (r.room === 'livingroom') {
        verdict = 'good'
        message = `${roomName} is in ${dirName} (${fortune.name}) — harmonious family energy, welcoming to guests.`
      } else if (r.room === 'kitchen') {
        verdict = 'warning'
        message = `${roomName} is in ${dirName} (${fortune.name}) — fire energy in an auspicious sector; keep fire safety in mind.`
      } else if (r.room === 'bathroom') {
        verdict = 'warning'
        message = `${roomName} is in ${dirName} (${fortune.name}) — drainage in an auspicious sector; keep it clean.`
      } else {
        verdict = 'good'
        message = `${roomName} is in ${dirName} (${fortune.name}) — well positioned.`
      }
    } else if (fortune.type === 'small') {
      if (r.room === 'kitchen') {
        verdict = 'warning'
        message = `${roomName} is in ${dirName} (${fortune.name}) — fire energy is stable; ensure good ventilation.`
      } else if (r.room === 'bathroom') {
        verdict = 'bad'
        message = `${roomName} is in ${dirName} (${fortune.name}) — drainage in a minor auspicious sector may weaken family luck.`
      } else if (r.room === 'storage') {
        verdict = 'good'
        message = `${roomName} is in ${dirName} (${fortune.name}) — suitable for storage.`
      } else {
        verdict = 'warning'
        message = `${roomName} is in ${dirName} (${fortune.name}) — a neutral position; consider adjusting.`
      }
    } else {
      if (r.room === 'bathroom') {
        verdict = 'good'
        message = `${roomName} is in ${dirName} (${fortune.name}) — drainage suppresses the inauspicious energy, turning it favorable!`
      } else if (r.room === 'storage') {
        verdict = 'warning'
        message = `${roomName} is in ${dirName} (${fortune.name}) — suitable for storage but avoid spending time here.`
      } else if (r.room === 'kitchen') {
        verdict = 'bad'
        message = `${roomName} is in ${dirName} (${fortune.name}) — fire in an inauspicious sector may cause conflict.`
      } else if (r.room === 'bedroom' || r.room === 'master-bedroom') {
        verdict = 'bad'
        message = `${roomName} is in ${dirName} (${fortune.name}) — very inauspicious! Prolonged stay affects health and fortune. Consider relocating.`
      } else if (r.room === 'livingroom') {
        verdict = 'bad'
        message = `${roomName} is in ${dirName} (${fortune.name}) — a living area in an inauspicious sector affects family harmony.`
      } else if (r.room === 'study') {
        verdict = 'bad'
        message = `${roomName} is in ${dirName} (${fortune.name}) — studying here may disturb peace of mind.`
      } else {
        verdict = 'bad'
        message = `${roomName} is in ${dirName} (${fortune.name}) — consider relocating or applying remedies.`
      }
    }

    results.push({
      item: r,
      direction: dir,
      fortune,
      verdict,
      message,
      score: fortune.score,
    })
  }

  return results
}

// ========== Bracelet Recommendations ==========

const BRACELETS: BraceletRec[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Bracelet',
    material: 'Black Obsidian',
    element: 'Water',
    price: 168,
    image: '/images/fengshui/bracelet-obsidian.png',
    description: 'Natural black obsidian with powerful protective and neutralizing properties — the top choice for Feng Shui remedies.',
    benefits: ['Dispels negative energy', 'Calms the mind', 'Protects from harm', 'Stabilizes aura'],
    matchReason: 'Best when there are many inauspicious sectors or strong Fire Sha. Water energy subdues Fire, neutralizing Jue Ming and Wu Gui.',
  },
  {
    id: 'green-ghost',
    name: 'Green Phantom Bracelet',
    material: 'Green Phantom Crystal',
    element: 'Wood',
    price: 238,
    image: '/images/fengshui/bracelet-green-ghost.png',
    description: 'Natural green phantom crystal with life-giving energy, soothes emotions and enhances vitality.',
    benefits: ['Soothes emotions', 'Boosts career luck', 'Enhances vitality', 'Purifies the mind'],
    matchReason: 'Ideal for Huo Hai sectors or interpersonal conflicts. Wood energy brings calm and growth.',
  },
  {
    id: 'citrine',
    name: 'Citrine Bracelet',
    material: 'Citrine Crystal',
    element: 'Earth',
    price: 198,
    image: '/images/fengshui/bracelet-citrine.png',
    description: 'Natural citrine crystal — the stone of abundance, stabilizes fortune and attracts prosperity.',
    benefits: ['Attracts wealth', 'Strengthens foundation', 'Boosts confidence', 'Draws benefactors'],
    matchReason: 'Recommended when wealth sectors are blocked or disrupted. Earth energy stabilizes and attracts prosperity.',
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz Bracelet',
    material: 'Rose Quartz',
    element: 'Fire',
    price: 168,
    image: '/images/fengshui/bracelet-rose-quartz.png',
    description: 'Natural rose quartz, softens emotional energy, improves relationships and love luck.',
    benefits: ['Improves relationships', 'Attracts love', 'Calms emotions', 'Enhances charm'],
    matchReason: 'Best for Liu Sha sectors or interpersonal tension. Fire energy warms and harmonizes.',
  },
  {
    id: 'red-agate',
    name: 'Red Agate Bracelet',
    material: 'Red Agate',
    element: 'Fire',
    price: 138,
    image: '/images/fengshui/bracelet-red-agate.png',
    description: 'Natural red agate, invigorates Yang energy, enhances health and vitality.',
    benefits: ['Boosts Yang energy', 'Enhances health', 'Increases vitality', 'Warms the body'],
    matchReason: 'Recommended when health luck is weak or Tian Yi sector is compromised. Fire energy strengthens vitality.',
  },
  {
    id: 'multi-bead',
    name: 'Multi-Gem Bracelet',
    material: 'Multi-Gem Combination',
    element: 'Balanced',
    price: 358,
    image: '/images/fengshui/bracelet-multi.png',
    description: 'A curated combination of multiple natural gemstones, balancing all Five Elements for comprehensive luck enhancement.',
    benefits: ['Full balance', 'Five Elements harmony', 'Comprehensive boost', 'Long-term wear'],
    matchReason: 'Best choice when overall fortune needs improvement. Multi-gem combination balances all Five Elements.',
  },
  {
    id: 'golden-citrine',
    name: 'Golden Citrine Bracelet',
    material: 'Golden Citrine',
    element: 'Metal',
    price: 358,
    image: '/images/fengshui/bracelet-golden.png',
    description: 'Natural golden citrine — the wealth stone, powerfully attracts prosperity and enhances career luck.',
    benefits: ['Powerful wealth luck', 'Enhances career', 'Dispels negativity', 'Sharpens decision-making'],
    matchReason: 'Recommended when wealth is severely blocked or for career breakthroughs.',
  },
  {
    id: 'moonstone',
    name: 'Moonstone Bracelet',
    material: 'Moonstone',
    element: 'Water',
    price: 198,
    image: '/images/fengshui/bracelet-moonstone.png',
    description: 'Natural moonstone, gentle emotional balancer, aids sleep and calms the mind.',
    benefits: ['Balances emotions', 'Promotes sleep', 'Softens energy', 'Enhances intuition'],
    matchReason: 'Suitable for anxiety, poor sleep, or emotional turbulence. Water energy nourishes and calms.',
  },
]

export function getBraceletRecommendations(
  diagnoses: DiagnosisResult[],
  mingGuaInfo: MingGuaInfo,
): BraceletRec[] {
  const badCount = diagnoses.filter(d => d.verdict === 'bad').length
  const warningCount = diagnoses.filter(d => d.verdict === 'warning').length
  const worstFortuneCount = diagnoses.filter(d => d.fortune.type === 'worst').length
  const badFortuneCount = diagnoses.filter(d => d.fortune.type === 'bad').length

  const badRoomTypes = diagnoses.filter(d => d.verdict === 'bad').map(d => d.item.room)
  const hasBadBedroom = badRoomTypes.some(r => r === 'bedroom' || r === 'master-bedroom')
  const hasBadKitchen = badRoomTypes.some(r => r === 'kitchen')

  const recs: BraceletRec[] = []

  if (hasBadBedroom || worstFortuneCount >= 2) {
    recs.push(BRACELETS.find(b => b.id === 'obsidian')!)
  }

  if (hasBadKitchen || badFortuneCount >= 2) {
    if (!recs.some(r => r.id === 'citrine')) recs.push(BRACELETS.find(b => b.id === 'citrine')!)
  }

  if (diagnoses.some(d => d.item.room === 'bedroom' && d.verdict === 'bad')) {
    if (!recs.some(r => r.id === 'red-agate')) recs.push(BRACELETS.find(b => b.id === 'red-agate')!)
  }

  if (warningCount >= 2 || badCount + warningCount >= 3) {
    if (!recs.some(r => r.id === 'green-ghost')) recs.push(BRACELETS.find(b => b.id === 'green-ghost')!)
  }

  const allIds = recs.map(r => r.id)
  const remaining = BRACELETS.filter(b => !allIds.includes(b.id))

  if (badCount + warningCount >= 4) {
    if (!allIds.includes('multi-bead')) {
      recs.splice(1, 0, BRACELETS.find(b => b.id === 'multi-bead')!)
    }
  }

  while (recs.length < 3 && remaining.length > 0) {
    const next = remaining.shift()!
    if (!recs.some(r => r.id === next.id)) {
      recs.push(next)
    }
  }

  return recs.slice(0, 3)
}

// ========== Utility ==========

export function directionToAngle(dir: Direction): number {
  const angles: Record<Direction, number> = {
    north: 0, northeast: 45, east: 90, southeast: 135,
    south: 180, southwest: 225, west: 270, northwest: 315,
  }
  return angles[dir]
}

export function directionToLabel(dir: Direction): string {
  return directionLabels[dir]
}

export function calcOverallScore(diagnoses: DiagnosisResult[]): number {
  if (diagnoses.length === 0) return 50
  const avg = diagnoses.reduce((s, d) => s + d.score, 0) / diagnoses.length
  return Math.round(avg)
}

export function getScoreLevel(score: number): { label: string; color: string; emoji: string } {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-600', emoji: '🟢' }
  if (score >= 60) return { label: 'Good', color: 'text-teal-600', emoji: '🟢' }
  if (score >= 40) return { label: 'Fair', color: 'text-orange-600', emoji: '🟡' }
  return { label: 'Needs Improvement', color: 'text-red-600', emoji: '🔴' }
}

export function formatDate(year: number, month: number, day: number): string {
  return `${year}/${month}/${day}`
}
