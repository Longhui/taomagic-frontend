'use client'

import React, { useState } from 'react'
import { ArrowLeft, RotateCcw, Sparkles, BookOpen, Star, ChevronRight, Check, Brain } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { analyzeLiuYao, generateAIPrompt } from '../lib/liuyao'
import Navigation from '@/app/components/Navigation'

// Hexagram data - 64卦
const HEXAGRAMS = [
  { num: 1, name: "The Creative", chinese: "乾", trigrams: "☰☰", meaning: "Pure yang energy, creative power, initiative. The dragon rising." },
  { num: 2, name: "The Receptive", chinese: "坤", trigrams: "☷☷", meaning: "Pure yin energy, nurturing, following. Fertile ground receiving seeds." },
  { num: 3, name: "Difficulty at the Beginning", chinese: "屯", trigrams: "☳☵", meaning: "Birth pains, chaos before order. Persist and gather support." },
  { num: 4, name: "Youthful Folly", chinese: "蒙", trigrams: "☵☶", meaning: "Inexperience, learning, seeking instruction. Find proper guidance." },
  { num: 5, name: "Waiting", chinese: "需", trigrams: "☵☰", meaning: "Nourishment, patience, anticipation. Wait with confidence." },
  { num: 6, name: "Conflict", chinese: "讼", trigrams: "☰☵", meaning: "Dispute, litigation. Avoid prolonged battle, seek mediation." },
  { num: 7, name: "The Army", chinese: "师", trigrams: "☵☷", meaning: "Collective force, discipline, leadership. Organization brings success." },
  { num: 8, name: "Holding Together", chinese: "比", trigrams: "☷☵", meaning: "Union, seeking leadership, group formation. Choose allegiances wisely." },
  { num: 9, name: "Small Taming", chinese: "小畜", trigrams: "☴☰", meaning: "Gentle accumulation, small gains. Patience with gradual progress." },
  { num: 10, name: "Treading", chinese: "履", trigrams: "☰☱", meaning: "Conduct, proper behavior. Walk carefully on tiger's tail." },
  { num: 11, name: "Peace", chinese: "泰", trigrams: "☷☰", meaning: "Harmony, prosperity. Heaven and earth aligned. Flourishing conditions." },
  { num: 12, name: "Standstill", chinese: "否", trigrams: "☰☷", meaning: "Stagnation, blockage. Heaven and earth not communicating." },
  { num: 13, name: "Fellowship", chinese: "同人", trigrams: "☲☰", meaning: "Community, shared purpose. Brotherhood emerges from common ground." },
  { num: 14, name: "Great Possession", chinese: "大有", trigrams: "☰☲", meaning: "Abundance, wealth. Use resources wisely, share generously." },
  { num: 15, name: "Modesty", chinese: "谦", trigrams: "☶☷", meaning: "Humility, unpretentiousness. The wise conceal their brilliance." },
  { num: 16, name: "Enthusiasm", chinese: "豫", trigrams: "☷☳", meaning: "Joyful movement, inspiration. Thunder from the earth awakens." },
  { num: 17, name: "Following", chinese: "随", trigrams: "☱☳", meaning: "Adaptation, acceptance. Follow the natural flow of events." },
  { num: 18, name: "Work on the Decayed", chinese: "蛊", trigrams: "☶☴", meaning: "Repair, restoration. Address what has been neglected." },
  { num: 19, name: "Approach", chinese: "临", trigrams: "☷☱", meaning: "Advance, coming forward. The powerful approaches the receptive." },
  { num: 20, name: "Contemplation", chinese: "观", trigrams: "☴☷", meaning: "Viewing, observation. Look within and without with clarity." },
  { num: 21, name: "Biting Through", chinese: "噬嗑", trigrams: "☲☳", meaning: "Decision, justice. Remove obstacles with determined action." },
  { num: 22, name: "Grace", chinese: "贲", trigrams: "☶☲", meaning: "Beauty, adornment. Outer grace reflects inner worth." },
  { num: 23, name: "Splitting Apart", chinese: "剥", trigrams: "☶☷", meaning: "Decline, decay. Yield gracefully to the inevitable." },
  { num: 24, name: "Return", chinese: "复", trigrams: "☷☳", meaning: "Turning point, recovery. The light returns after darkness." },
  { num: 25, name: "Innocence", chinese: "无妄", trigrams: "☰☳", meaning: "Naturalness, purity. Act without ulterior motives." },
  { num: 26, name: "Great Taming", chinese: "大畜", trigrams: "☶☰", meaning: "Potential energy, accumulation. Store power for right timing." },
  { num: 27, name: "Nourishment", chinese: "颐", trigrams: "☶☳", meaning: "Sustenance, care. Nourish body and spirit properly." },
  { num: 28, name: "Great Exceeding", chinese: "大过", trigrams: "☱☴", meaning: "Excess, critical point. Dangerous imbalance requires bold action." },
  { num: 29, name: "The Abysmal", chinese: "坎", trigrams: "☵☵", meaning: "Danger, depth. Maintain integrity through repeated peril." },
  { num: 30, name: "The Clinging", chinese: "离", trigrams: "☲☲", meaning: "Clarity, illumination. Fire clings to its fuel. Sustain wisely." },
  { num: 31, name: "Influence", chinese: "咸", trigrams: "☱☶", meaning: "Attraction, mutual influence. Courtship and receptivity." },
  { num: 32, name: "Duration", chinese: "恒", trigrams: "☴☳", meaning: "Endurance, consistency. Lasting commitment brings success." },
  { num: 33, name: "Retreat", chinese: "遁", trigrams: "☰☶", meaning: "Strategic withdrawal. Disengage to preserve strength." },
  { num: 34, name: "Great Power", chinese: "大壮", trigrams: "☳☰", meaning: "Great strength, momentum. Use power with wisdom and restraint." },
  { num: 35, name: "Progress", chinese: "晋", trigrams: "☲☷", meaning: "Rapid advancement, recognition. Sun rising over the earth." },
  { num: 36, name: "Darkening of the Light", chinese: "明夷", trigrams: "☷☲", meaning: "Concealment, adversity. Hide brilliance to survive difficult times." },
  { num: 37, name: "The Family", chinese: "家人", trigrams: "☲☴", meaning: "Household order, defined roles. Domestic harmony through proper relationships." },
  { num: 38, name: "Opposition", chinese: "睽", trigrams: "☱☲", meaning: "Divergence, estrangement. Find unity within difference." },
  { num: 39, name: "Obstruction", chinese: "蹇", trigrams: "☵☶", meaning: "Obstacles, impasse. Step back and gather allies." },
  { num: 40, name: "Deliverance", chinese: "解", trigrams: "☳☵", meaning: "Liberation, relief. Thunder and rain dissolve tension." },
  { num: 41, name: "Decrease", chinese: "损", trigrams: "☶☱", meaning: "Reduction, sacrifice. Decrease ego to increase virtue." },
  { num: 42, name: "Increase", chinese: "益", trigrams: "☴☱", meaning: "Growth, benefit. Wind and thunder bring flourishing." },
  { num: 43, name: "Breakthrough", chinese: "夬", trigrams: "☱☰", meaning: "Resolute action, determination. Forceful but righteous advance." },
  { num: 44, name: "Coming to Meet", chinese: "姤", trigrams: "☰☴", meaning: "Encounter, temptation. Be cautious with unexpected meetings." },
  { num: 45, name: "Gathering Together", chinese: "萃", trigrams: "☱☷", meaning: "Assembly, collecting. Assemble resources for collective effort." },
  { num: 46, name: "Pushing Upward", chinese: "升", trigrams: "☴☷", meaning: "Gradual ascent. Patient advancement through consistent effort." },
  { num: 47, name: "Oppression", chinese: "困", trigrams: "☵☱", meaning: "Exhaustion, confinement. Conserve resources, speak less." },
  { num: 48, name: "The Well", chinese: "井", trigrams: "☵☴", meaning: "Source, community resource. Maintain what serves all." },
  { num: 49, name: "Revolution", chinese: "革", trigrams: "☱☲", meaning: "Transformation, upheaval. Change must be timed perfectly." },
  { num: 50, name: "The Cauldron", chinese: "鼎", trigrams: "☲☴", meaning: "Nourishment, transformation. Cook the raw into the refined." },
  { num: 51, name: "The Arousing", chinese: "震", trigrams: "☳☳", meaning: "Shock, awakening. Sudden change brings breakthrough." },
  { num: 52, name: "Keeping Still", chinese: "艮", trigrams: "☶☶", meaning: "Stillness, meditation. The wisdom of non-action." },
  { num: 53, name: "Development", chinese: "渐", trigrams: "☴☶", meaning: "Gradual progress, maturation. Tree growing on the mountain." },
  { num: 54, name: "The Marrying Maiden", chinese: "归妹", trigrams: "☱☳", meaning: "Transition, unripe action. Act within proper boundaries." },
  { num: 55, name: "Abundance", chinese: "丰", trigrams: "☲☳", meaning: "Peak prosperity, fullness. Enjoy while recognizing decline follows." },
  { num: 56, name: "The Wanderer", chinese: "旅", trigrams: "☲☶", meaning: "Travel, strangeness. Adapt to unfamiliar circumstances." },
  { num: 57, name: "The Gentle", chinese: "巽", trigrams: "☴☴", meaning: "Penetration, subtle influence. Patient effort moves mountains." },
  { num: 58, name: "The Joyous", chinese: "兑", trigrams: "☱☱", meaning: "Joy, pleasure. Open communication and genuine happiness." },
  { num: 59, name: "Dispersion", chinese: "涣", trigrams: "☴☵", meaning: "Dissolution, dispersion. Water over wind dissolves rigidity." },
  { num: 60, name: "Limitation", chinese: "节", trigrams: "☵☱", meaning: "Boundaries, regulation. Proper limits create freedom." },
  { num: 61, name: "Inner Truth", chinese: "中孚", trigrams: "☱☴", meaning: "Sincerity, centering. Truth from the heart moves others." },
  { num: 62, name: "Small Exceeding", chinese: "小过", trigrams: "☶☳", meaning: "Preponderance of the small. Attend to details carefully." },
  { num: 63, name: "After Completion", chinese: "既济", trigrams: "☵☲", meaning: "Completion, fulfillment. Maintain vigilance after success." },
  { num: 64, name: "Before Completion", chinese: "未济", trigrams: "☲☵", meaning: "Incompletion, transition. The cycle begins again." }
]

type LineValue = 6 | 7 | 8 | 9
type CoinFace = 'H' | 'T'
type CastingMethod = 'manual' | 'random'

function getGuidance(hexagramNum: number, lines: LineValue[]): string {
  const changingLines = lines.map((line, idx) => {
    if (line === 6 || line === 9) {
      const name = line === 9 ? 'Old Yang (9)' : 'Old Yin (6)'
      const symbol = line === 9 ? '⚊○' : '⚋×'
      return `Line ${idx + 1}: ${name} ${symbol}`
    }
    return null
  }).filter(Boolean)

  let guidance = 'This hexagram suggests that the current situation requires ' +
    (hexagramNum % 2 === 0 ? 'patience and receptivity' : 'active engagement and initiative') + '. '
  if (changingLines.length > 0) {
    guidance += 'Pay special attention to the changing lines: ' + changingLines.join('; ') + '. These indicate areas of transformation in your situation.'
  } else {
    guidance += 'The energy pattern is stable. Focus on working within the current structure rather than anticipating major shifts.'
  }
  return guidance
}

const CoinDisplay = ({ face, isFlipping }: { face: CoinFace; isFlipping: boolean }) => {
  const isHeads = face === 'H'
  return (
    <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg text-xl font-bold mb-2 ${isFlipping ? 'coin-flip' : ''} ${isHeads ? 'bg-rice text-ink border-2 border-ink' : 'bg-ink text-rice'}`}>
      {face}
      <span className="text-[10px] opacity-70">{isHeads ? 'Heads' : 'Tails'}</span>
    </div>
  )
}

const HexagramLine = ({ value, isChanging }: { value?: LineValue; isChanging?: boolean }) => {
  if (value === undefined) {
    return <div className="h-3 w-48 rounded-sm bg-rice/20 mx-auto" />
  }
  const isYang = value === 7 || value === 9
  const changing = isChanging ?? (value === 6 || value === 9)
  const color = changing ? 'bg-cinnabar' : 'bg-rice'
  if (isYang) {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className={`h-3 w-48 rounded-sm ${color}`} />
        {changing && <span className="text-cinnabar text-xs">○</span>}
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center gap-2">
      <div className={`h-3 w-20 rounded-sm ${color}`} />
      <div className="w-4" />
      <div className={`h-3 w-20 rounded-sm ${color}`} />
      {changing && <span className="text-cinnabar text-xs">×</span>}
    </div>
  )
}

export default function DivinationPage() {
  const router = useRouter()
  const [step, setStep] = useState<'intro' | 'casting' | 'result'>('intro')
  const [lines, setLines] = useState<LineValue[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [question, setQuestion] = useState('')
  const [hexagram, setHexagram] = useState<typeof HEXAGRAMS[0] | null>(null)
  const [method, setMethod] = useState<CastingMethod>('manual')
  const [manualCoins, setManualCoins] = useState<[CoinFace, CoinFace, CoinFace]>(['H', 'H', 'H'])
  const [isFlipping, setIsFlipping] = useState(false)
  const [randomCoins, setRandomCoins] = useState<[CoinFace, CoinFace, CoinFace]>(['H', 'H', 'H'])
  const reset = () => {
    setLines([])
    setCurrentLine(0)
    setHexagram(null)
    setStep('intro')
    setQuestion('')
    setMethod('manual')
    setManualCoins(['H', 'H', 'H'])
    setIsFlipping(false)
  }

  const toggleCoin = (idx: number) => {
    setManualCoins(prev => {
      const next = [...prev] as [CoinFace, CoinFace, CoinFace]
      next[idx] = next[idx] === 'H' ? 'T' : 'H'
      return next
    })
  }

  const setCoin = (idx: number, face: CoinFace) => {
    setManualCoins(prev => {
      const next = [...prev] as [CoinFace, CoinFace, CoinFace]
      next[idx] = face
      return next
    })
  }

  const calculateLine = (heads: number): LineValue => {
    if (heads === 3) return 9
    if (heads === 2) return 8
    if (heads === 1) return 7
    return 6
  }

  const castManualLine = () => {
    if (currentLine >= 6) return
    const heads = manualCoins.filter(c => c === 'H').length
    const lineValue = calculateLine(heads)
    const newLines = [...lines, lineValue] as LineValue[]
    setLines(newLines)
    setCurrentLine(currentLine + 1)
    setManualCoins(['H', 'H', 'H'])
    if (newLines.length === 6) finishCasting(newLines)
  }

  const castRandomLine = () => {
    if (isFlipping || currentLine >= 6) return
    setIsFlipping(true)
    setTimeout(() => {
      const values: [CoinFace, CoinFace, CoinFace] = [
        Math.random() > 0.5 ? 'H' : 'T',
        Math.random() > 0.5 ? 'H' : 'T',
        Math.random() > 0.5 ? 'H' : 'T',
      ]
      setRandomCoins(values)
      const heads = values.filter(v => v === 'H').length
      const lineValue = calculateLine(heads)
      const newLines = [...lines, lineValue] as LineValue[]
      setLines(newLines)
      setCurrentLine(currentLine + 1)
      setIsFlipping(false)
      if (newLines.length === 6) finishCasting(newLines)
    }, 1000)
  }

  const finishCasting = (newLines: LineValue[]) => {
    const upper = newLines.slice(3, 6).map(l => (l === 7 || l === 9) ? 1 : 0)
    const lower = newLines.slice(0, 3).map(l => (l === 7 || l === 9) ? 1 : 0)
    const upperVal = parseInt(upper.join(''), 2) || 0
    const lowerVal = parseInt(lower.join(''), 2) || 0
    const hexNum = ((upperVal * 8 + lowerVal) % 64) + 1
    setHexagram(HEXAGRAMS[hexNum - 1])
    setTimeout(() => setStep('result'), 500)
  }

  const handleMasterConsultation = () => {
    if (!hexagram) return
    // Clear stale data first
    try { localStorage.removeItem('master_consultation') } catch {}
    const liuYaoResult = analyzeLiuYao(lines as LineValue[], question)
    const prompt = generateAIPrompt(liuYaoResult, question)
    localStorage.setItem('master_consultation', JSON.stringify({
      hexagram: {
        name: hexagram.name,
        chinese: hexagram.chinese,
        trigrams: hexagram.trigrams,
        meaning: hexagram.meaning,
        num: hexagram.num,
      },
      question,
      lines,
      prompt,
      status: 'loading',
      date: liuYaoResult.dateStr,
    }))
    router.push('/divination/analysis')
  }

  // =========== INTRO ===========
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-rice pt-16">
        <Navigation solid />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Sparkles size={48} className="text-cinnabar mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-serif text-ink mb-4">I Ching Guidance</h1>
          </div>
          <div className="bg-white rounded-lg border border-ink/10 p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif text-ink">How It Works</h2>
              <a href="/guide" target="_blank" className="text-sm text-cinnabar hover:text-cinnabar/80 transition-colors inline-flex items-center gap-1">
                <BookOpen size={16} />
                View Detailed Guide
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { step: '1', title: 'Focus Your Question', desc: 'Think clearly about what you seek guidance on.' },
                { step: '2', title: 'Cast the Coins', desc: 'Three coins determine each line of your hexagram.' },
                { step: '3', title: 'Receive Wisdom', desc: 'Your hexagram reveals the pattern of change.' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-bronze/10 text-bronze flex items-center justify-center text-xl font-bold mx-auto mb-3">{item.step}</div>
                  <h3 className="font-medium text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-ink/60">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-ink/10 pt-6">
              <div className="bg-bronze/5 rounded-lg p-4 mb-4 flex items-center gap-3">
                <BookOpen size={20} className="text-bronze shrink-0" />
                <p className="text-sm text-ink/80">New to coin divination? Learn the <a href="/guide" target="_blank" className="text-cinnabar hover:underline">proper casting method</a> with our step-by-step guide.</p>
              </div>
              <label className="block text-sm font-medium text-ink mb-2">Your Question</label>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What guidance do you seek?" className="w-full px-4 py-3 rounded-sm border border-ink/20 focus:outline-none focus:border-bronze mb-4 resize-none" rows={3} />
              <button onClick={() => question.trim() ? setStep('casting') : null} className={`w-full py-4 rounded-sm text-lg transition-colors flex items-center justify-center gap-2 ${question.trim() ? 'bg-cinnabar text-rice hover:bg-cinnabar/80 cursor-pointer' : 'bg-cinnabar/50 text-rice/60 cursor-not-allowed'}`}>
                <Sparkles size={20} />
                {question.trim() ? 'Begin Divination' : 'Enter Your Question First'}
              </button>
            </div>
          </div>
          <div className="bg-bronze/5 rounded-lg p-6">
            <h3 className="font-serif text-ink mb-3 flex items-center gap-2">
              <BookOpen size={20} className="text-bronze" />
              About the Method
            </h3>
            <p className="text-ink/70 text-sm leading-relaxed">The I Ching (Book of Changes) is one of the oldest divination systems, dating back over 3,000 years. Our digital method faithfully replicates the traditional three-coin technique used to generate one of 64 hexagrams.</p>
          </div>
        </div>
      </div>
    )
  }

  // =========== CASTING ===========
  if (step === 'casting') {
    return (
      <div className="min-h-screen bg-ink text-rice pt-16">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif mb-2">Casting Line {currentLine + 1} of 6</h2>
            <p className="text-rice/60">Choose your casting method below</p>
          </div>
          <div className="bg-rice/5 rounded-lg p-4 mb-8">
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setMethod('manual')} className={`px-4 py-2 rounded-sm text-sm transition-colors ${method === 'manual' ? 'bg-cinnabar text-rice' : 'bg-rice/10 text-rice/70 hover:bg-rice/20'}`}>Use Real Coins (Recommended)</button>
              <button onClick={() => setMethod('random')} className={`px-4 py-2 rounded-sm text-sm transition-colors ${method === 'random' ? 'bg-cinnabar text-rice' : 'bg-rice/10 text-rice/70 hover:bg-rice/20'}`}>Random Generate</button>
            </div>
          </div>

          {method === 'manual' && (
            <div className="mb-8">
              <div className="flex justify-center gap-6 mb-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="text-center">
                    <div className="cursor-pointer" onClick={() => toggleCoin(i)}><CoinDisplay face={manualCoins[i]} isFlipping={false} /></div>
                    <div className="flex gap-1 justify-center">
                      <button onClick={() => setCoin(i, 'H')} className={`w-8 h-8 rounded-full text-xs transition-colors ${manualCoins[i] === 'H' ? 'bg-ink text-rice border border-rice/30' : 'bg-rice text-ink border border-ink'}`}>H</button>
                      <button onClick={() => setCoin(i, 'T')} className={`w-8 h-8 rounded-full text-xs transition-colors ${manualCoins[i] === 'T' ? 'bg-ink text-rice border border-rice/30' : 'bg-rice text-ink border border-ink'}`}>T</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button onClick={castManualLine} disabled={currentLine >= 6} className="bg-cinnabar text-rice px-8 py-3 rounded-sm hover:bg-cinnabar/80 transition-colors disabled:opacity-50 inline-flex items-center gap-2">
                  <Check size={18} /> Record Line {Math.min(currentLine + 1, 6)}
                </button>
              </div>
            </div>
          )}

          {method === 'random' && (
            <div className="mb-8">
              <div className="flex justify-center gap-6 mb-6">
                {[0, 1, 2].map((i) => (<CoinDisplay key={i} face={randomCoins[i]} isFlipping={isFlipping} />))}
              </div>
              <div className="text-center">
                <button onClick={castRandomLine} disabled={isFlipping || currentLine >= 6} className="bg-cinnabar text-rice px-8 py-3 rounded-sm hover:bg-cinnabar/80 transition-colors disabled:opacity-50 inline-flex items-center gap-2">
                  {isFlipping ? 'Shaking...' : `Shake & Cast Line ${Math.min(currentLine + 1, 6)}`}
                </button>
              </div>
            </div>
          )}

          <div className="bg-gold/10 rounded-lg p-4 mb-6 border border-gold/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen size={20} className="text-gold shrink-0" />
                <div>
                  <p className="text-sm font-medium">New to coin divination?</p>
                  <p className="text-rice/60 text-xs">Learn the proper casting method with our step-by-step guide</p>
                </div>
              </div>
              <a href="/guide" target="_blank" className="bg-gold text-ink px-4 py-2 rounded-sm text-sm hover:bg-gold/80 transition-colors inline-flex items-center gap-1 shrink-0">
                View Guide <ChevronRight size={14} />
              </a>
            </div>
          </div>

          <div className="bg-rice/5 rounded-lg p-6 mb-8">
            <h3 className="text-rice font-serif text-center mb-4">Your Hexagram</h3>
            <div className="flex flex-col-reverse items-center gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-center gap-2">
                  {lines[i] !== undefined ? <HexagramLine value={lines[i]} /> : <div className="h-3 w-48 rounded-sm bg-rice/20" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={reset} className="border border-rice/30 text-rice px-6 py-3 rounded-sm hover:bg-rice/10 transition-colors flex items-center gap-2">
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      </div>
    )
  }

  // =========== RESULT ===========
  if (step === 'result' && hexagram) {
    const guidance = getGuidance(hexagram.num, lines as LineValue[])

    return (
      <div className="min-h-screen bg-rice pt-16">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-sm text-sm mb-4">Hexagram {hexagram.num} of 64</div>
            <h1 className="text-4xl md:text-5xl font-serif text-ink mb-2">{hexagram.name}</h1>
            <p className="text-2xl text-ink/40 font-serif mb-4">{hexagram.chinese} · {hexagram.trigrams}</p>
            {question && <p className="text-ink/60 italic">&ldquo;{question}&rdquo;</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg border border-ink/10 p-8">
              <h3 className="font-serif text-ink mb-4 text-center">Your Hexagram</h3>
              <div className="flex flex-col-reverse items-center gap-1">
                {lines.map((line, i) => (<HexagramLine key={i} value={line as LineValue} />))}
              </div>
              <div className="mt-4 text-center text-sm text-ink/50"><p>Bottom (Line 1) → Top (Line 6)</p></div>
            </div>
            <div className="bg-white rounded-lg border border-ink/10 p-8">
              <h3 className="font-serif text-ink mb-4">Interpretation</h3>
              <p className="text-ink/80 leading-relaxed mb-6">{hexagram.meaning}</p>
              <div className="space-y-3">
                <h4 className="font-medium text-ink">Guidance for Your Question:</h4>
                <div className="bg-bronze/5 p-4 rounded-sm">
                  <p className="text-ink/70 text-sm leading-relaxed">{guidance}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-ink to-ink/90 rounded-lg p-8 text-center border border-gold/20">
            <Brain size={36} className="text-gold mx-auto mb-4" />
            <h3 className="text-rice font-serif text-2xl mb-2">Master Consultation</h3>
            <p className="text-rice/60 mb-6 max-w-xl mx-auto">
              A comprehensive Liu Yao divination analysis based on traditional Five Elements (五行),
              Six Relations (六亲), and Six Spirits (六神) theories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleMasterConsultation}
                className="bg-cinnabar text-rice px-6 py-3 rounded-sm hover:bg-cinnabar/80 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Sparkles size={18} /> Master Consultation $29
              </button>
              <button onClick={reset} className="border border-rice/30 text-rice px-6 py-3 rounded-sm hover:bg-rice/10 transition-colors">New Reading</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
