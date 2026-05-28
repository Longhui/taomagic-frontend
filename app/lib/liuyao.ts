// ==================== Liu Yao Divination System (六爻预测) ====================

// Five Elements
const ELEMENTS = ['Metal', 'Wood', 'Water', 'Fire', 'Earth'] as const
type Element = typeof ELEMENTS[number]

// Heavenly Stems
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const

// Earthly Branches
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const

// Stem → Element
const STEM_ELEMENT: Record<string, Element> = {
  '甲': 'Wood', '乙': 'Wood', '丙': 'Fire', '丁': 'Fire', '戊': 'Earth',
  '己': 'Earth', '庚': 'Metal', '辛': 'Metal', '壬': 'Water', '癸': 'Water',
}

// Branch → Element
const BRANCH_ELEMENT: Record<string, Element> = {
  '子': 'Water', '丑': 'Earth', '寅': 'Wood', '卯': 'Wood', '辰': 'Earth', '巳': 'Fire',
  '午': 'Fire', '未': 'Earth', '申': 'Metal', '酉': 'Metal', '戌': 'Earth', '亥': 'Water',
}

// Six Relations (六亲) : (palaceElement, yaoElement) → relation
const SIX_RELATIONS: Record<string, string> = {
  'Metal,Metal': 'Sibling', 'Metal,Wood': 'Wealth', 'Metal,Water': 'Child',
  'Metal,Fire': 'Official', 'Metal,Earth': 'Parent',
  'Wood,Wood': 'Sibling', 'Wood,Earth': 'Wealth', 'Wood,Fire': 'Child',
  'Wood,Water': 'Official', 'Wood,Metal': 'Parent',
  'Water,Water': 'Sibling', 'Water,Fire': 'Wealth', 'Water,Wood': 'Child',
  'Water,Earth': 'Official', 'Water,Metal': 'Parent',
  'Fire,Fire': 'Sibling', 'Fire,Metal': 'Wealth', 'Fire,Earth': 'Child',
  'Fire,Wood': 'Official', 'Fire,Water': 'Parent',
  'Earth,Earth': 'Sibling', 'Earth,Water': 'Wealth', 'Earth,Metal': 'Child',
  'Earth,Fire': 'Official', 'Earth,Wood': 'Parent',
}

// Six Spirits (六神)
const SIX_SPIRITS = ['Azure Dragon', 'Vermilion Bird', 'Gou Chen', 'Serpent', 'White Tiger', 'Black Tortoise'] as const

// Trigram → Najia stems & branches (6 lines per trigram pair)
const TRIGRAM_NAJIA: Record<string, [string, string][]> = {
  '乾': [['甲', '子'], ['甲', '寅'], ['甲', '辰'], ['壬', '午'], ['壬', '申'], ['壬', '戌']],
  '坤': [['乙', '未'], ['乙', '巳'], ['乙', '卯'], ['癸', '丑'], ['癸', '亥'], ['癸', '酉']],
  '震': [['庚', '子'], ['庚', '寅'], ['庚', '辰'], ['庚', '午'], ['庚', '申'], ['庚', '戌']],
  '巽': [['辛', '丑'], ['辛', '亥'], ['辛', '酉'], ['辛', '未'], ['辛', '巳'], ['辛', '卯']],
  '坎': [['戊', '寅'], ['戊', '辰'], ['戊', '午'], ['戊', '申'], ['戊', '戌'], ['戊', '子']],
  '离': [['己', '卯'], ['己', '丑'], ['己', '亥'], ['己', '酉'], ['己', '未'], ['己', '巳']],
  '艮': [['丙', '辰'], ['丙', '午'], ['丙', '申'], ['丙', '戌'], ['丙', '子'], ['丙', '寅']],
  '兑': [['丁', '巳'], ['丁', '卯'], ['丁', '丑'], ['丁', '亥'], ['丁', '酉'], ['丁', '未']],
}

// Trigram → Element
const TRIGRAM_ELEMENT: Record<string, Element> = {
  '乾': 'Metal', '兑': 'Metal', '离': 'Fire', '震': 'Wood',
  '巽': 'Wood', '坎': 'Water', '艮': 'Earth', '坤': 'Earth',
}

const TRIGRAM_SYMBOLS: Record<string, string> = {
  '乾': '☰', '坤': '☷', '震': '☳', '巽': '☴',
  '坎': '☵', '离': '☲', '艮': '☶', '兑': '☱',
}

// Trigram English names
const TRIGRAM_EN: Record<string, string> = {
  '乾': 'Heaven', '坤': 'Earth', '震': 'Thunder', '巽': 'Wind',
  '坎': 'Water', '离': 'Fire', '艮': 'Mountain', '兑': 'Lake',
}

// Hexagram names (lower, upper) → { chinese, english }
const HEXAGRAM_NAMES: Record<string, { chinese: string; english: string }> = {
  '乾,乾': { chinese: '乾为天', english: 'The Creative' },
  '坤,坤': { chinese: '坤为地', english: 'The Receptive' },
  '震,震': { chinese: '震为雷', english: 'Thunder' },
  '巽,巽': { chinese: '巽为风', english: 'The Gentle' },
  '坎,坎': { chinese: '坎为水', english: 'The Abysmal' },
  '离,离': { chinese: '离为火', english: 'The Clinging' },
  '艮,艮': { chinese: '艮为山', english: 'Keeping Still' },
  '兑,兑': { chinese: '兑为泽', english: 'The Joyous' },
  '乾,坤': { chinese: '天地否', english: 'Standstill' },
  '坤,乾': { chinese: '地天泰', english: 'Peace' },
  '震,巽': { chinese: '雷风恒', english: 'Duration' },
  '巽,震': { chinese: '风雷益', english: 'Increase' },
  '坎,离': { chinese: '水火既济', english: 'After Completion' },
  '离,坎': { chinese: '火水未济', english: 'Before Completion' },
  '艮,兑': { chinese: '山泽损', english: 'Decrease' },
  '兑,艮': { chinese: '泽山咸', english: 'Influence' },
  '乾,震': { chinese: '天雷无妄', english: 'Innocence' },
  '震,乾': { chinese: '雷天大壮', english: 'Great Power' },
  '乾,坎': { chinese: '天水讼', english: 'Conflict' },
  '坎,乾': { chinese: '水天需', english: 'Waiting' },
  '乾,艮': { chinese: '天山遁', english: 'Retreat' },
  '艮,乾': { chinese: '山天大畜', english: 'Great Taming' },
  '乾,巽': { chinese: '天风姤', english: 'Coming to Meet' },
  '巽,乾': { chinese: '风天小畜', english: 'Small Taming' },
  '乾,离': { chinese: '天火同人', english: 'Fellowship' },
  '离,乾': { chinese: '火天大有', english: 'Great Possession' },
  '乾,兑': { chinese: '天泽履', english: 'Treading' },
  '兑,乾': { chinese: '泽天夬', english: 'Breakthrough' },
  '坤,震': { chinese: '地雷复', english: 'Return' },
  '震,坤': { chinese: '雷地豫', english: 'Enthusiasm' },
  '坤,坎': { chinese: '地水师', english: 'The Army' },
  '坎,坤': { chinese: '水地比', english: 'Holding Together' },
  '坤,艮': { chinese: '地山谦', english: 'Modesty' },
  '艮,坤': { chinese: '山地剥', english: 'Splitting Apart' },
  '坤,巽': { chinese: '地风升', english: 'Pushing Upward' },
  '巽,坤': { chinese: '风地观', english: 'Contemplation' },
  '坤,离': { chinese: '地火明夷', english: 'Darkening of the Light' },
  '离,坤': { chinese: '火地晋', english: 'Progress' },
  '坤,兑': { chinese: '地泽临', english: 'Approach' },
  '兑,坤': { chinese: '泽地萃', english: 'Gathering Together' },
  '震,坎': { chinese: '雷水解', english: 'Deliverance' },
  '坎,震': { chinese: '水雷屯', english: 'Difficulty at the Beginning' },
  '震,艮': { chinese: '雷山小过', english: 'Small Exceeding' },
  '艮,震': { chinese: '山雷颐', english: 'Nourishment' },
  '震,离': { chinese: '雷火丰', english: 'Abundance' },
  '离,震': { chinese: '火雷噬嗑', english: 'Biting Through' },
  '震,兑': { chinese: '雷泽归妹', english: 'The Marrying Maiden' },
  '兑,震': { chinese: '泽雷随', english: 'Following' },
  '巽,坎': { chinese: '风水涣', english: 'Dispersion' },
  '坎,巽': { chinese: '水风井', english: 'The Well' },
  '巽,艮': { chinese: '风山渐', english: 'Development' },
  '艮,巽': { chinese: '山风蛊', english: 'Work on the Decayed' },
  '巽,离': { chinese: '风火家人', english: 'The Family' },
  '离,巽': { chinese: '火风鼎', english: 'The Cauldron' },
  '巽,兑': { chinese: '风泽中孚', english: 'Inner Truth' },
  '兑,巽': { chinese: '泽风大过', english: 'Great Exceeding' },
  '坎,艮': { chinese: '水山蹇', english: 'Obstruction' },
  '艮,坎': { chinese: '山水蒙', english: 'Youthful Folly' },
  '坎,兑': { chinese: '水泽节', english: 'Limitation' },
  '兑,坎': { chinese: '泽水困', english: 'Oppression' },
  '离,艮': { chinese: '火山旅', english: 'The Wanderer' },
  '艮,离': { chinese: '山火贲', english: 'Grace' },
  '离,兑': { chinese: '火泽睽', english: 'Opposition' },
  '兑,离': { chinese: '泽火革', english: 'Revolution' },
}

// Xunkong lookup
const XUNKONG_TABLE: Record<string, string[]> = {
  '甲子': ['戌', '亥'], '甲戌': ['申', '酉'], '甲申': ['午', '未'],
  '甲午': ['辰', '巳'], '甲辰': ['寅', '卯'], '甲寅': ['子', '丑'],
}

// Element generating (生) and controlling (克) relationships
const ELEMENT_CYCLES: Record<string, Record<string, string>> = {
  generating: { 'Metal': 'Water', 'Water': 'Wood', 'Wood': 'Fire', 'Fire': 'Earth', 'Earth': 'Metal' },
  controlling: { 'Metal': 'Wood', 'Wood': 'Earth', 'Earth': 'Water', 'Water': 'Fire', 'Fire': 'Metal' },
}

// ==================== Types ====================

export interface YaoLine {
  position: number       // 1-6 (bottom to top)
  value: 6 | 7 | 8 | 9   // traditional line value
  isYang: boolean
  isMoving: boolean
  stem: string
  branch: string
  element: Element
  relation: string       // six relations
  spirit: string         // six spirit
  isEmpty: boolean       // xunkong
  isShi: boolean         // shi yao
  isYing: boolean        // ying yao
}

export interface LiuYaoResult {
  name: string           // hexagram name
  nameEn: string
  chinese: string
  lowerTrigram: string
  upperTrigram: string
  lowerSymbol: string
  upperSymbol: string
  lowerEn: string
  upperEn: string
  palace: string
  palaceElement: Element
  lines: YaoLine[]
  shiPosition: number
  yingPosition: number
  dayStem: string
  dayBranch: string
  monthBranch: string
  yearStem: string
  yearBranch: string
  hourBranch: string
  emptyBranches: string[]
  dateStr: string
}

// ==================== Core functions ====================

function getTrigramFromLines(lines: boolean[]): string {
  const binary = `${lines[2] ? 1 : 0}${lines[1] ? 1 : 0}${lines[0] ? 1 : 0}`
  const idx = parseInt(binary, 2)
  return ['坤', '艮', '坎', '巽', '震', '离', '兑', '乾'][idx]
}

function getHexagramName(lower: string, upper: string) {
  const key = `${lower},${upper}`
  const found = HEXAGRAM_NAMES[key]
  if (found) return found
  // fallback: try reverse key
  const reversed = `${upper},${lower}`
  const revFound = HEXAGRAM_NAMES[reversed]
  if (revFound) return revFound
  return { chinese: `${upper}${lower}`, english: `${upper}${lower}` }
}

function determinePalace(lower: string, upper: string): { palace: string; palaceElement: Element } {
  if (lower === upper) return { palace: lower, palaceElement: TRIGRAM_ELEMENT[lower] }
  const palaces = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']
  for (const p of palaces) {
    if (upper === p) return { palace: p, palaceElement: TRIGRAM_ELEMENT[p] }
  }
  return { palace: '乾', palaceElement: 'Metal' }
}

function getShiYing(lower: string, upper: string): { shi: number; ying: number } {
  if (lower === upper) return { shi: 6, ying: 3 }
  return { shi: 2, ying: 5 }
}

function getNajia(lower: string, upper: string): [string, string][] {
  const lowerNajia = TRIGRAM_NAJIA[lower].slice(0, 3)
  const upperNajia = TRIGRAM_NAJIA[upper].slice(3, 6)
  return [...lowerNajia, ...upperNajia]
}

function getSixSpirits(dayStem: string): string[] {
  const spiritStart: Record<string, number> = {
    '甲': 0, '乙': 0, '丙': 1, '丁': 1, '戊': 2,
    '己': 3, '庚': 4, '辛': 4, '壬': 5, '癸': 5,
  }
  const start = spiritStart[dayStem] || 0
  return Array.from({ length: 6 }, (_, i) => SIX_SPIRITS[(start + i) % 6])
}

function getXunkong(dayStem: string, dayBranch: string): string[] {
  const stemIdx = STEMS.indexOf(dayStem as any)
  const branchIdx = BRANCHES.indexOf(dayBranch as any)
  const diff = ((stemIdx - branchIdx) % 12 + 12) % 12

  const xunMap: Record<number, string> = { 0: '甲子', 10: '甲戌', 8: '甲申', 6: '甲午', 4: '甲辰', 2: '甲寅' }
  const xunShou = xunMap[diff] || '甲子'
  return XUNKONG_TABLE[xunShou] || []
}

function getRelation(palaceElement: Element, yaoElement: Element): string {
  return SIX_RELATIONS[`${palaceElement},${yaoElement}`] || 'Sibling'
}

export function solarToLunarGanzhi(dt?: Date) {
  const now = dt || new Date()
  const baseDate = new Date(1984, 1, 2) // 1984-02-02
  const deltaDays = Math.floor((now.getTime() - baseDate.getTime()) / (86400000))

  // Day ganzhi
  const dayGz = ((2 + deltaDays) % 60 + 60) % 60
  const dayStem = STEMS[dayGz % 10]
  const dayBranch = BRANCHES[dayGz % 12]

  // Year ganzhi (以立春为界, 约2月4日)
  let year = now.getFullYear()
  if (now.getMonth() < 1 || (now.getMonth() === 1 && now.getDate() < 4)) {
    year -= 1
  }
  const yearOffset = year - 1984
  const yearGz = ((0 + yearOffset) % 60 + 60) % 60
  const yearStem = STEMS[yearGz % 10]
  const yearBranch = BRANCHES[yearGz % 12]

  // Month branch
  const monthBranchMap: Record<number, string> = {
    1: "丑", 2: "寅", 3: "卯", 4: "辰", 5: "巳", 6: "午",
    7: "未", 8: "申", 9: "酉", 10: "戌", 11: "亥", 12: "子",
  }
  let month = now.getMonth() + 1
  if (now.getDate() < 6) {
    month -= 1
    if (month === 0) month = 12
  }
  const monthBranch = monthBranchMap[month] || "寅"
  const monthBranchIdx = BRANCHES.indexOf(monthBranch as any)

  // Hour branch
  const hour = now.getHours()
  const hourBranchIdx = Math.floor((hour + 1) / 2) % 12
  const hourBranch = BRANCHES[hourBranchIdx]

  return {
    dateStr: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
    dayStem, dayBranch, monthBranch, yearStem, yearBranch, hourBranch,
  }
}

// Main entry: convert 6 line values (6,7,8,9) into full Liu Yao result
export function analyzeLiuYao(
  lineValues: (6 | 7 | 8 | 9)[],
  question: string,
): LiuYaoResult {
  const date = solarToLunarGanzhi()

  // Build yang/moving arrays
  const yangArr = lineValues.map(v => v === 7 || v === 9)
  const movingArr = lineValues.map(v => v === 6 || v === 9)

  // Lower 3 lines, upper 3 lines
  const lowerYang = yangArr.slice(0, 3)
  const upperYang = yangArr.slice(3, 6)

  const lowerTrigram = getTrigramFromLines(lowerYang)
  const upperTrigram = getTrigramFromLines(upperYang)

  const { chinese, english: nameEn } = getHexagramName(lowerTrigram, upperTrigram)
  const { palace, palaceElement } = determinePalace(lowerTrigram, upperTrigram)
  const { shi, ying } = getShiYing(lowerTrigram, upperTrigram)
  const najia = getNajia(lowerTrigram, upperTrigram)
  const spirits = getSixSpirits(date.dayStem)
  const empty = getXunkong(date.dayStem, date.dayBranch)

  const lines: YaoLine[] = lineValues.map((val, i) => {
    const [stem, branch] = najia[i]
    const element = BRANCH_ELEMENT[branch]
    return {
      position: i + 1,
      value: val,
      isYang: yangArr[i],
      isMoving: movingArr[i],
      stem,
      branch,
      element,
      relation: getRelation(palaceElement, element),
      spirit: spirits[i],
      isEmpty: empty.includes(branch),
      isShi: (i + 1) === shi,
      isYing: (i + 1) === ying,
    }
  })

  return {
    name: chinese,
    nameEn,
    chinese,
    lowerTrigram,
    upperTrigram,
    lowerSymbol: TRIGRAM_SYMBOLS[lowerTrigram],
    upperSymbol: TRIGRAM_SYMBOLS[upperTrigram],
    lowerEn: TRIGRAM_EN[lowerTrigram],
    upperEn: TRIGRAM_EN[upperTrigram],
    palace,
    palaceElement,
    lines,
    shiPosition: shi,
    yingPosition: ying,
    dayStem: date.dayStem,
    dayBranch: date.dayBranch,
    monthBranch: date.monthBranch,
    yearStem: date.yearStem,
    yearBranch: date.yearBranch,
    hourBranch: date.hourBranch,
    emptyBranches: empty,
    dateStr: date.dateStr,
  }
}

// ==================== AI Analysis Generator ====================

export interface LineAnalysis {
  position: number
  value: number
  type: string           // "Old Yang", "Young Yin", etc.
  symbol: string
  isMoving: boolean
  element: string
  relation: string
  spirit: string
  isEmpty: boolean
  isShi: boolean
  isYing: boolean
  analysis: string       // English interpretation
}

export interface AIDivinationAnalysis {
  hexagramName: string
  hexagramNameEn: string
  palace: string
  palaceElement: string
  dateStr: string
  question: string
  elementCycle: string   // generating cycle description
  elementBalance: string // element balance analysis
  shiYingAnalysis: string
  lines: LineAnalysis[]
  movingLines: LineAnalysis[]
  spiritAnalysis: string
  emptyAnalysis: string
  conclusion: string
}

function getElementRelationVerb(palaceEl: Element, yaoEl: Element): string {
  const gen = ELEMENT_CYCLES.generating[palaceEl]
  const genBy = Object.entries(ELEMENT_CYCLES.generating).find(([, v]) => v === palaceEl)?.[0] as Element | undefined
  const ctrl = ELEMENT_CYCLES.controlling[palaceEl]

  if (gen === yaoEl) return `${yaoEl} is generated by ${palaceEl} (nourishing)`
  if (genBy === yaoEl) return `${yaoEl} generates ${palaceEl} (supports the hexagram)`
  if (ctrl === yaoEl) return `${yaoEl} controls ${palaceEl} (restraining)`
  if (yaoEl === palaceEl) return `${yaoEl} matches the palace element (same energy)`
  return `${yaoEl} relates to ${palaceEl}`
}

export function generateLiuYaoAnalysis(result: LiuYaoResult, question: string): AIDivinationAnalysis {
  const movingLines = result.lines.filter(l => l.isMoving)
  const staticLines = result.lines.filter(l => !l.isMoving)

  // Element cycle description
  const genCycle = Object.entries(ELEMENT_CYCLES.generating)
    .map(([k, v]) => `${k} → ${v}`).join(' → ')
  const ctrlCycle = Object.entries(ELEMENT_CYCLES.controlling)
    .map(([k, v]) => `${k} controls ${v}`).join(', ')

  // Element balance: count elements in the lines
  const elementCounts: Record<string, number> = {}
  result.lines.forEach(l => {
    elementCounts[l.element] = (elementCounts[l.element] || 0) + 1
  })
  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]
  const balanceDesc = `${dominantElement[0]} appears ${dominantElement[1]} times, making it the dominant element. `

  // Shi/Ying analysis
  const shiLine = result.lines.find(l => l.isShi)
  const yingLine = result.lines.find(l => l.isYing)
  const shiAnalysis = shiLine
    ? `Shi Yao (Line ${shiLine.position}): ${shiLine.relation} at ${shiLine.element} position, spirit ${shiLine.spirit}. Represents the querent's current state.`
    : ''
  const yingAnalysis = yingLine
    ? `Ying Yao (Line ${yingLine.position}): ${yingLine.relation} at ${yingLine.element}, spirit ${yingLine.spirit}. Represents the external situation or other person.`
    : ''

  // Moving lines analysis
  const movingAnalyses: LineAnalysis[] = movingLines.map(l => {
    const changeDesc = l.isYang ? 'transforms to Yin' : 'transforms to Yang'
    const emptyNote = l.isEmpty ? '. This line is in Xunkong (Void) — the energy is not yet manifest.' : ''
    const shiYingNote = l.isShi ? ' [This is the Shi Yao — represents the querent]' : l.isYing ? ' [This is the Ying Yao — represents the external]' : ''
    return {
      position: l.position,
      value: l.value,
      type: l.value === 9 ? 'Old Yang' : 'Old Yin',
      symbol: l.value === 9 ? '⚊○' : '⚋×',
      isMoving: true,
      element: l.element,
      relation: l.relation,
      spirit: l.spirit,
      isEmpty: l.isEmpty,
      isShi: l.isShi,
      isYing: l.isYing,
      analysis: `Line ${l.position} (${l.relation}, ${l.element}, ${l.spirit}) is a moving line (${l.value === 9 ? 'Old Yang' : 'Old Yin'}, ${changeDesc})${emptyNote}. ${getElementRelationVerb(result.palaceElement, l.element)}.${shiYingNote}`,
    }
  })

  // Static lines analysis (summary)
  const movingNote = movingLines.length > 0
    ? `${movingLines.length} moving line(s) indicate areas of active transformation.`
    : 'No moving lines — the situation is stable and the primary hexagram contains all necessary guidance.'

  // Spirit analysis
  const spiritCounts: Record<string, string[]> = {}
  result.lines.forEach(l => {
    if (!spiritCounts[l.spirit]) spiritCounts[l.spirit] = []
    spiritCounts[l.spirit].push(`Line ${l.position} (${l.relation})`)
  })
  const spiritDesc = Object.entries(spiritCounts).map(([spirit, positions]) => {
    const spiritMeanings: Record<string, string> = {
      'Azure Dragon': 'new beginnings, growth, joy',
      'Vermilion Bird': 'communication, clarity, also disputes',
      'Gou Chen': 'worry, stagnation, routine',
      'Serpent': 'uncertainty, surprise, the unexpected',
      'White Tiger': 'danger, conflict, decisive action',
      'Black Tortoise': 'hidden matters, secrets, behind-the-scenes',
    }
    const meaning = spiritMeanings[spirit] || ''
    return `${spirit} (${meaning}) appears at ${positions.join(', ')}`
  }).join('. ')

  // Empty analysis
  const emptyCount = result.lines.filter(l => l.isEmpty).length
  const emptyAnalysis = emptyCount > 0
    ? `${result.emptyBranches.join(', ')} are Xunkong (Void). ${emptyCount} line(s) are affected, suggesting areas where potential has not yet materialized or needs more time.`
    : 'No Xunkong (Void) branches today — all line energies are active and manifest.'

  // Conclusions
  let conclusion = `The hexagram ${result.nameEn} (${result.name}) from the ${result.palace} palace (${result.palaceElement} element) has been cast. `
  conclusion += `The lower trigram is ${result.lowerEn} ${result.lowerSymbol} and the upper trigram is ${result.upperEn} ${result.upperSymbol}. `

  if (movingLines.length > 0) {
    conclusion += `${movingLines.length} changing line(s) indicate transformation is underway. `
    movingLines.forEach(l => {
      conclusion += `Line ${l.position} (${l.relation}) is ${l.value === 9 ? 'Old Yang turning Yin' : 'Old Yin turning Yang'} — ${l.element} energy is in motion. `
    })
  } else {
    conclusion += 'No changing lines suggest this situation is stable and the current path is clear. '
  }

  const shiRel = shiLine?.relation || ''
  const yingRel = yingLine?.relation || ''
  if (shiRel === yingRel) {
    conclusion += `Both Shi and Ying share the relation "${shiRel}" — alignment between the querent and the situation. `
  } else {
    conclusion += `Shi (${shiRel}) differs from Ying (${yingRel}), suggesting the querent and the external situation are in different relational positions. `
  }

  conclusion += `${dominantElement[0]} energy dominates with ${dominantElement[1]} occurrences. Recommend focusing on ${dominantElement[0]}-related strategies.`
  if (emptyCount > 0) {
    conclusion += ' Be patient with areas marked by Void — they will clarify in time.'
  }

  return {
    hexagramName: result.name,
    hexagramNameEn: result.nameEn,
    palace: result.palace,
    palaceElement: result.palaceElement,
    dateStr: `${result.dayStem}${result.dayBranch} (month ${result.monthBranch})`,
    question,
    elementCycle: `Generating: ${genCycle}. Controlling: ${ctrlCycle}. ${balanceDesc}`,
    elementBalance: balanceDesc + `Palace ${result.palace} is ${result.palaceElement}. ` + movingNote,
    shiYingAnalysis: [shiAnalysis, yingAnalysis].filter(Boolean).join(' '),
    lines: result.lines.map(l => ({
      position: l.position,
      value: l.value,
      type: l.value === 9 ? 'Old Yang' : l.value === 6 ? 'Old Yin' : l.value === 7 ? 'Young Yang' : 'Young Yin',
      symbol: l.value === 9 ? '⚊○' : l.value === 6 ? '⚋×' : l.value === 7 ? '⚊' : '⚋⚋',
      isMoving: l.isMoving,
      element: l.element,
      relation: l.relation,
      spirit: l.spirit,
      isEmpty: l.isEmpty,
      isShi: l.isShi,
      isYing: l.isYing,
      analysis: `Line ${l.position}: ${l.relation} at ${l.element}. ${l.spirit}.${l.isMoving ? ' MOVING.' : ''}${l.isEmpty ? ' VOID.' : ''}${l.isShi ? ' SHI YAO (querent).' : ''}${l.isYing ? ' YING YAO (external).' : ''}`,
    })),
    movingLines: movingAnalyses,
    spiritAnalysis: spiritDesc,
    emptyAnalysis,
    conclusion,
  }
}

// ==================== AI Prompt Generator (v2) ====================

export function generateAIPrompt(result: LiuYaoResult, question: string): string {
  const yaoDetails = [...result.lines].reverse().map(l => {
    const moving = l.isMoving ? "[MOVING]" : ""
    const empty = l.isEmpty ? "[VOID]" : ""
    const symbol = l.value === 9 ? "---○" : l.value === 6 ? "- -×" : l.isYang ? "---" : "- -"
    return `Line ${l.position}: ${symbol} Stem:${l.stem} Branch:${l.branch}(${l.element}) Relation:${l.relation} Spirit:${l.spirit} ${moving} ${empty}`
  }).join("\n")

  return `You are a master of Liu Yao divination and I Ching. Analyze the following hexagram for the querent's question.

## Divination Data
- Question: ${question}
- Date: ${result.dateStr}
- Year Pillar: ${result.yearStem}${result.yearBranch}
- Month Branch: ${result.monthBranch}
- Day: ${result.dayStem}${result.dayBranch}
- Hour Branch: ${result.hourBranch}
- Xunkong (Void): ${result.emptyBranches.length ? result.emptyBranches.join(",") : "None"}

## Hexagram
- Name: ${result.name}
- Palace: ${result.palace} (${result.palaceElement})
- Self (Shi) Position: Line ${result.shiPosition}
- Other (Ying) Position: Line ${result.yingPosition}

## Line Details (top to bottom)
${yaoDetails}

## Analysis Steps

### 1. Choose the Subject (Yong Shen)
Based on the question "${question}", determine the appropriate Subject (Yong Shen). Explain why you selected it and its state.

### 2. Subject Strength
- How does the month branch affect the Subject?
- How does the day branch affect the Subject?
- Is the Subject in Xunkong (Void)?
- Overall strength assessment

### 3. Moving Lines
- Which lines are moving? What do they change into?
- How do moving lines affect the Subject?

### 4. Self-Other Relationship
- What does Self (Shi) represent?
- What does Other (Ying) represent?
- How do Self and Other relate to the Subject?

### 5. Six Spirits
- What do the Six Spirits configurations indicate?
- What do they suggest about the matter?

### 6. Synthesis
- Likely outcome and process
- Timing indications
- Recommendations

### 7. Conclusion
Concise summary with practical guidance.

IMPORTANT: Answer entirely in English. No Chinese characters. Output only the analysis text.`
}
