'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Play, BookOpen, Star, ChevronDown, Check } from 'lucide-react'
import Navigation from '@/app/components/Navigation'

type CoinFace = 'H' | 'T'
type LineValue = 6 | 7 | 8 | 9

const lineInfo: Record<LineValue, { name: string; symbol: string; desc: string }> = {
  9: { name: 'Old Yang (9)', symbol: '⚊○', desc: '3 Heads — Changing line' },
  8: { name: 'Young Yin (8)', symbol: '⚋⚋', desc: '2 Heads + 1 Tail — Static line' },
  7: { name: 'Young Yang (7)', symbol: '⚊', desc: '1 Head + 2 Tails — Static line' },
  6: { name: 'Old Yin (6)', symbol: '⚋×', desc: '3 Tails — Changing line' },
}

// ========== Quick Reference Card ==========
const QuickReference = () => (
  <section className="py-16 bg-rice">
    <div className="max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-lg border border-ink/10 p-8 shadow-sm">
        <h2 className="text-2xl font-serif text-ink mb-6 text-center">Coin-to-Line Quick Reference</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-medium text-ink flex items-center gap-2">
              <span className="text-bronze">✦</span>
              US Dollar Coins (Recommended)
            </h3>
            <div className="space-y-3">
              {[
                { label: '3 Heads (9) — Old Yang', symbol: '⚊○', desc: 'Changing line', color: 'bg-bronze/5', faces: ['H', 'H', 'H'], coinColors: ['ink', 'ink', 'ink'] },
                { label: '2 Heads, 1 Tail (8) — Young Yin', symbol: '⚋⚋', desc: 'Static line', color: 'bg-rice', faces: ['H', 'H', 'T'], coinColors: ['ink', 'ink', 'rice'] },
                { label: '1 Head, 2 Tails (7) — Young Yang', symbol: '⚊', desc: 'Static line', color: 'bg-rice', faces: ['H', 'T', 'T'], coinColors: ['ink', 'rice', 'rice'] },
                { label: '3 Tails (6) — Old Yin', symbol: '⚋×', desc: 'Changing line', color: 'bg-cinnabar/5', faces: ['T', 'T', 'T'], coinColors: ['rice', 'rice', 'rice'] },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${row.color}`}>
                  <div className="flex gap-1">
                    {row.faces.map((f, j) => (
                      <div key={j} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 ${row.coinColors[j] === 'ink' ? 'bg-ink text-rice border-gold' : 'bg-rice text-ink border-ink'}`}>
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{row.label}</div>
                    <div className="text-xs text-ink/60">{row.symbol} — {row.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-ink flex items-center gap-2">
              <BookOpen size={20} className="text-cinnabar" />
              What You Need to Know
            </h3>
            <div className="space-y-3 text-sm text-ink/80">
              <p><span className="font-medium text-ink">Heads = Yang (3 points)</span> — The "active" side with the portrait</p>
              <p><span className="font-medium text-ink">Tails = Yin (2 points)</span> — The "receptive" side with the building</p>
              <p className="pt-2 border-t border-ink/10"><span className="text-cinnabar font-medium">Old Yang (9)</span> and <span className="text-cinnabar font-medium">Old Yin (6)</span> are "changing lines" — they transform, revealing future development.</p>
              <p><span className="text-bronze font-medium">Young Yang (7)</span> and <span className="text-bronze font-medium">Young Yin (8)</span> are "static lines" — they remain as they are.</p>
              <p className="pt-2 border-t border-ink/10">You cast <span className="font-medium">6 times</span> to build a hexagram from bottom (Line 1) to top (Line 6).</p>
            </div>
            <div className="bg-gold/10 p-4 rounded-lg mt-4">
              <p className="text-sm text-ink/80"><span className="text-gold font-medium">Pro Tip:</span> Use three identical coins of the same denomination for consistency. US quarters or pennies work perfectly.</p>
            </div>
          </div>
        </div>

        {/* Reference Images */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-ink/10 p-4">
            <h4 className="font-medium text-ink mb-3 text-center">US Penny Example (WikiHow)</h4>
            <div className="aspect-[4/3] bg-ink/5 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/images/us_coins_guide.png" alt="US penny coin divination guide showing 3 heads = Old Yang" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs text-ink/50 mt-2 text-center">3 Heads = 9 (Old Yang) | 3 Tails = 6 (Old Yin) | 2H1T = 8 (Young Yin) | 1H2T = 7 (Young Yang)</p>
          </div>
          <div className="bg-white rounded-lg border border-ink/10 p-4">
            <h4 className="font-medium text-ink mb-3 text-center">Traditional Chinese Coins</h4>
            <div className="aspect-[4/3] bg-ink/5 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/images/coin_sides.png" alt="Traditional Chinese coins - character side (Yang) vs reverse side (Yin)" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs text-ink/50 mt-2 text-center">Character side (字) = Yang | Reverse side (背) = Yin</p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// ========== Step Card ==========
const StepCard = ({ num, title, children }: { num: number; title: string; children: React.ReactNode }) => (
  <div className="bg-rice/5 rounded-lg border border-rice/10 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-start gap-6">
      <div className="hidden md:flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-gold text-ink flex items-center justify-center text-xl font-bold font-serif">{num}</div>
        <div className="w-px h-full bg-rice/20 mt-2" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="md:hidden w-10 h-10 rounded-full bg-gold text-ink flex items-center justify-center text-lg font-bold">{num}</div>
          <h3 className="text-2xl font-serif text-rice">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  </div>
)

const CheckItem = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex items-start gap-3">
    <Check size={20} className="text-gold mt-0.5 shrink-0" />
    <div>
      <div className="text-rice font-medium">{title}</div>
      <div className="text-rice/60 text-sm">{desc}</div>
    </div>
  </div>
)

// ========== Interactive Demo ==========
const InteractiveDemo = () => {
  const [demoLines, setDemoLines] = useState<LineValue[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const [demoMethod, setDemoMethod] = useState<'manual' | 'random'>('manual')
  const [manualCoins, setManualCoins] = useState<[CoinFace, CoinFace, CoinFace]>(['H', 'H', 'H'])
  const [randomCoins, setRandomCoins] = useState<[CoinFace, CoinFace, CoinFace]>(['H', 'H', 'H'])
  const [lastResult, setLastResult] = useState<LineValue | null>(null)

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

  const recordLine = () => {
    if (currentLine >= 6) return
    const heads = manualCoins.filter(c => c === 'H').length
    const value = calculateLine(heads)
    setDemoLines(prev => [...prev, value])
    setCurrentLine(prev => prev + 1)
    setLastResult(value)
    setManualCoins(['H', 'H', 'H'])
  }

  const shakeRandom = () => {
    if (isShaking || currentLine >= 6) return
    setIsShaking(true)

    setTimeout(() => {
      const values: [CoinFace, CoinFace, CoinFace] = [
        Math.random() > 0.5 ? 'H' : 'T',
        Math.random() > 0.5 ? 'H' : 'T',
        Math.random() > 0.5 ? 'H' : 'T',
      ]
      setRandomCoins(values)
      const heads = values.filter(v => v === 'H').length
      const value = calculateLine(heads)
      setDemoLines(prev => [...prev, value])
      setCurrentLine(prev => prev + 1)
      setLastResult(value)
      setIsShaking(false)
    }, 1000)
  }

  const resetDemo = () => {
    setDemoLines([])
    setCurrentLine(0)
    setLastResult(null)
    setManualCoins(['H', 'H', 'H'])
    setRandomCoins(['H', 'H', 'H'])
  }

  const CoinVisual = ({ face, isFlipping }: { face: CoinFace; isFlipping: boolean }) => {
    const isHeads = face === 'H'
    return (
      <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg text-2xl font-bold transition-all ${isFlipping ? 'coin-flip' : ''} ${isHeads ? 'bg-ink text-rice' : 'bg-rice text-ink border-4 border-ink'}`}>
        {face}
        <span className="text-xs opacity-70">{isHeads ? 'Heads' : 'Tails'}</span>
      </div>
    )
  }

  const CoinButton = ({ face, onClick }: { face: CoinFace; onClick: () => void }) => {
    const isHeads = face === 'H'
    return (
      <button onClick={onClick} className={`w-8 h-8 rounded-full text-xs transition-colors ${isHeads ? 'bg-ink text-rice border border-ink/30 hover:bg-cinnabar' : 'bg-rice text-ink border border-ink hover:bg-cinnabar'}`}>
        {face}
      </button>
    )
  }

  const isComplete = currentLine >= 6

  return (
    <section id="interactive-demo" className="py-24 bg-rice">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-ink text-center mb-4">Interactive Practice</h2>
        <p className="text-ink/60 text-center mb-12 max-w-2xl mx-auto">
          Practice the casting process. Choose your preferred method: use real coins and record results, or generate digitally.
        </p>

        <div className="bg-white rounded-lg border border-ink/10 p-8 shadow-lg">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-ink/60 mb-2">
                <span>Progress</span>
                <span>Line {Math.min(currentLine + 1, 6)} of 6</span>
              </div>
              <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
                <div className="h-full bg-cinnabar rounded-full transition-all duration-500" style={{ width: `${(currentLine / 6) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Method Selection */}
          <div className="bg-bronze/5 rounded-lg p-4 mb-8">
            <div className="flex justify-center gap-4 mb-3">
              <button
                onClick={() => setDemoMethod('manual')}
                className={`px-4 py-2 rounded-sm text-sm transition-colors ${demoMethod === 'manual' ? 'bg-cinnabar text-rice' : 'bg-ink/10 text-ink/70 hover:bg-ink/5'}`}
              >
                Use Real Coins (Recommended)
              </button>
              <button
                onClick={() => setDemoMethod('random')}
                className={`px-4 py-2 rounded-sm text-sm transition-colors ${demoMethod === 'random' ? 'bg-cinnabar text-rice' : 'bg-ink/10 text-ink/70 hover:bg-ink/5'}`}
              >
                Random Generate
              </button>
            </div>
            <p className="text-xs text-ink/50 text-center">
              {demoMethod === 'manual' ? 'Shake three real coins, then click the coin icons to match your result' : 'Digital random generation for practice'}
            </p>
          </div>

          {/* Manual Mode */}
          {demoMethod === 'manual' && (
            <div className="mb-8">
              <div className="flex justify-center gap-6 mb-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="text-center">
                    <div className="cursor-pointer" onClick={() => toggleCoin(i)}>
                      <CoinVisual face={manualCoins[i]} isFlipping={false} />
                    </div>
                    <div className="flex gap-1 justify-center mt-2">
                      <CoinButton face="H" onClick={() => setCoin(i, 'H')} />
                      <CoinButton face="T" onClick={() => setCoin(i, 'T')} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={recordLine}
                  disabled={isComplete}
                  className="bg-cinnabar text-rice px-8 py-3 rounded-sm text-lg hover:bg-cinnabar/80 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Check size={20} />
                  Record Line {Math.min(currentLine + 1, 6)}
                </button>
              </div>
            </div>
          )}

          {/* Random Mode */}
          {demoMethod === 'random' && (
            <div className="mb-8">
              <div className="flex justify-center gap-6 mb-6">
                {[0, 1, 2].map((i) => (
                  <CoinVisual key={i} face={randomCoins[i]} isFlipping={isShaking} />
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={shakeRandom}
                  disabled={isShaking || isComplete}
                  className="bg-cinnabar text-rice px-8 py-3 rounded-sm text-lg hover:bg-cinnabar/80 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isShaking ? 'Shaking...' : `Shake & Cast Line ${Math.min(currentLine + 1, 6)}`}
                </button>
              </div>
            </div>
          )}

          {/* Last Result */}
          {lastResult !== null && (
            <div className="mb-8">
              <div className="bg-bronze/5 rounded-lg p-6 text-center">
                <div className="text-2xl font-serif text-ink mb-2">{lineInfo[lastResult].symbol} {lineInfo[lastResult].name}</div>
                <div className="text-sm text-ink/60">{lineInfo[lastResult].desc}</div>
              </div>
            </div>
          )}

          {/* Hexagram Building */}
          <div className="mb-8">
            <h3 className="text-lg font-serif text-ink mb-4 text-center">Your Hexagram</h3>
            <div className="flex flex-col-reverse items-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const line = demoLines[i]
                if (line === undefined) {
                  return <div key={i} className="h-4 w-56 rounded-sm bg-ink/10" />
                }
                const isYang = line === 7 || line === 9
                const isChanging = line === 6 || line === 9
                return (
                  <div key={i} className="flex items-center justify-center gap-2">
                    {isYang ? (
                      <div className={`h-4 w-56 rounded-sm ${isChanging ? 'bg-cinnabar' : 'bg-ink'}`} />
                    ) : (
                      <>
                        <div className={`h-4 w-24 rounded-sm ${isChanging ? 'bg-cinnabar' : 'bg-ink'}`} />
                        <div className="w-4" />
                        <div className={`h-4 w-24 rounded-sm ${isChanging ? 'bg-cinnabar' : 'bg-ink'}`} />
                      </>
                    )}
                    {isChanging && <span className={`text-xs ${isChanging ? 'text-cinnabar' : ''}`}>{line === 9 ? '○' : '×'}</span>}
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-4 text-sm text-ink/50">
              {isComplete ? 'All 6 lines cast!' : 'Select your casting method above to begin'}
            </div>
          </div>

          {/* Complete + Reset */}
          <div className="flex justify-center gap-4">
            {isComplete && (
              <Link
                href="/divination"
                className="bg-cinnabar text-rice px-6 py-3 rounded-sm hover:bg-cinnabar/80 transition-colors inline-flex items-center gap-2"
              >
                <Sparkles size={18} />
                Try Full AI Reading
              </Link>
            )}
            {demoLines.length > 0 && (
              <button onClick={resetDemo} className="border border-ink/30 text-ink px-6 py-3 rounded-sm hover:bg-ink/5 transition-colors">
                Cast Again
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== FAQ ==========
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Can I use any coins, or do they need to be Chinese?',
      a: 'Any three identical coins work perfectly. US quarters, pennies, or Euro coins are all fine. The I Ching responds to your intention and the mathematical probability (not the coin\'s origin). What matters is consistency — use the same three coins for all six casts.'
    },
    {
      q: 'What if a coin lands on its edge or rolls away?',
      a: 'If a coin lands on its edge or falls off the table, that cast is considered "void" — the energy was not settled. Simply gather the coins and cast again. Some practitioners view this as the I Ching indicating the question needs refinement.'
    },
    {
      q: 'How often can I cast for the same question?',
      a: 'Traditional wisdom says: once per question. If you cast repeatedly hoping for a "better" answer, you are not seeking guidance — you are seeking validation. Wait at least a moon cycle (28 days) before casting on the same topic, or until the situation has materially changed.'
    },
    {
      q: 'Do I need to speak my question aloud?',
      a: 'No — mental focus is sufficient and often preferred. Speaking aloud can scatter energy. Hold your question clearly in your mind as you shake the coins. Some practitioners silently recite their question in rhythm with the shakes.'
    },
    {
      q: 'What does it mean if I get no changing lines?',
      a: 'A hexagram with no changing lines (all 7s and 8s) indicates a stable situation. The energy pattern is fixed, and the guidance focuses on how to work within the current structure rather than anticipating major shifts. Read the main hexagram text carefully — it contains all the wisdom you need.'
    },
    {
      q: 'Can I cast for someone else?',
      a: 'Yes, but with important conditions. You must have their explicit permission and they should formulate the question themselves. You act as a "medium" for their energy. Never cast for someone without their knowledge — this violates the principle of sincerity that the I Ching requires.'
    },
  ]

  return (
    <section className="py-24 bg-rice">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-ink text-center mb-12">Common Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="bg-white rounded-lg border border-ink/10 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-ink/5 transition-colors"
                >
                  <span className="font-medium text-ink pr-4">{faq.q}</span>
                  <ChevronDown size={20} className={`text-ink/40 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-ink/70 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ========== Page ==========
export default function GuidePage() {
  return (
    <div className="min-h-screen bg-rice">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-ink pt-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cinnabar rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" /><circle cx="16" cy="16" r="6" />
              <path d="M8 14v4a6 6 0 0 0 6 6" /><path d="M16 10V6a6 6 0 0 0-6-6" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-rice mb-4 leading-tight">
            How to Cast I Ching with <span className="text-gold">Coins</span>
          </h1>
          <p className="text-xl text-rice/70 max-w-2xl mx-auto mb-8">
            A step-by-step guide to authentic Liu Yao divination using three coins. Master the ancient art of hexagram casting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#interactive-demo" className="bg-cinnabar text-rice px-8 py-4 rounded-sm text-lg hover:bg-cinnabar/80 transition-all flex items-center justify-center gap-2">
              <Play size={20} />
              Try Interactive Demo
            </a>
            <a href="#step-by-step" className="border border-rice/30 text-rice px-8 py-4 rounded-sm text-lg hover:bg-rice/10 transition-all flex items-center justify-center gap-2">
              Read Full Guide
            </a>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <QuickReference />

      {/* Step-by-Step Guide */}
      <section id="step-by-step" className="py-24 bg-ink">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-rice text-center mb-4">The Complete Casting Process</h2>
          <p className="text-rice/60 text-center mb-16 max-w-2xl mx-auto">
            Follow these six phases to perform an authentic I Ching divination. Each phase builds upon the last, creating a ritual of focus and intention.
          </p>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center justify-between mb-12 max-w-3xl mx-auto">
            {['Prepare', 'Question', 'Cast', 'Record', 'Build', 'Read'].map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold text-ink flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <div className="text-xs text-rice/60 uppercase tracking-wider">{label}</div>
                </div>
                {i < 5 && <div className="flex-1 h-px bg-rice/20 mx-2" />}
              </React.Fragment>
            ))}
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <StepCard num={1} title="Preparation & Sacred Space">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-rice/80 mb-4 leading-relaxed">Before casting, create an environment conducive to focused intention. This is not superstition — it is the practical psychology of entering a receptive state.</p>
                  <div className="space-y-3">
                    <CheckItem title="Find Quiet Space" desc="Turn off notifications. Close the door. Let others know you need 10 minutes of uninterrupted focus." />
                    <CheckItem title="Gather Your Tools" desc="Three identical coins, a notebook, and a flat surface. A small cloth or tray to catch the coins is helpful." />
                    <CheckItem title="Center Yourself" desc="Take three deep breaths. Feel your feet on the floor. Let your mind settle like still water." />
                  </div>
                </div>
                <div className="bg-ink rounded-lg p-6 border border-rice/10">
                  <div className="text-center mb-4">
                    <svg width="48" height="48" className="text-gold mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    <h4 className="text-rice font-serif text-lg">Best Times to Cast</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-rice/80"><span>Early Morning</span><span className="text-gold">Yin energy, clarity</span></div>
                    <div className="flex justify-between text-rice/80"><span>Midday</span><span className="text-gold">Yang energy, action</span></div>
                    <div className="flex justify-between text-rice/80"><span>Evening</span><span className="text-gold">Reflection, insight</span></div>
                    <div className="flex justify-between text-rice/80"><span>Avoid</span><span className="text-cinnabar">When angry or rushed</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-rice/10 text-xs text-rice/50">
                    The I Ching responds to sincerity, not convenience. Choose a time when you can be fully present.
                  </div>
                </div>
              </div>
            </StepCard>

            {/* Step 2 */}
            <StepCard num={2} title="Formulate Your Question">
              <p className="text-rice/80 mb-6 leading-relaxed">The quality of your question determines the quality of your answer. A vague question yields a vague response.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-gold font-medium flex items-center gap-2"><Check size={18} /> Good Questions</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-bronze/10 p-3 rounded-lg text-rice/80">"Should I accept the job offer from Company X, and what should I watch for?"</div>
                    <div className="bg-bronze/10 p-3 rounded-lg text-rice/80">"What is the true nature of my relationship with [Name], and how should I proceed?"</div>
                    <div className="bg-bronze/10 p-3 rounded-lg text-rice/80">"What do I need to understand about my current health situation?"</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-cinnabar font-medium flex items-center gap-2"><ChevronDown size={18} /> Avoid These</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-cinnabar/10 p-3 rounded-lg text-rice/80">"Will I win the lottery?" — The I Ching guides decisions, not gambling.</div>
                    <div className="bg-cinnabar/10 p-3 rounded-lg text-rice/80">"What is [someone else] thinking?" — Ask about your own situation only.</div>
                    <div className="bg-cinnabar/10 p-3 rounded-lg text-rice/80">"Should I do this or that?" — Frame as "What should I understand about..."</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-ink rounded-lg p-6 border border-gold/30">
                <p className="text-rice/80 text-sm leading-relaxed">
                  <span className="text-gold font-medium">The Golden Rule:</span> Ask about <span className="text-gold">process and understanding</span>, not <span className="text-cinnabar">outcomes and predictions</span>.
                  Instead of "Will I get the job?" ask "What energy surrounds my application, and how should I approach it?"
                </p>
              </div>
            </StepCard>

            {/* Step 3 */}
            <StepCard num={3} title="The Casting Ritual">
              <p className="text-rice/80 mb-6 leading-relaxed">Each cast generates one line of your hexagram. You will cast six times total, from Line 1 (bottom) to Line 6 (top).</p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-ink rounded-lg p-6 border border-rice/10 text-center">
                  <svg width="40" height="40" className="text-gold mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                  </svg>
                  <h4 className="text-rice font-medium mb-2">1. Cup the Coins</h4>
                  <p className="text-rice/60 text-sm">Place three coins in your dominant hand. Cup them gently, feeling their weight and temperature.</p>
                </div>
                <div className="bg-ink rounded-lg p-6 border border-rice/10 text-center">
                  <svg width="40" height="40" className="text-gold mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                  </svg>
                  <h4 className="text-rice font-medium mb-2">2. Focus Intention</h4>
                  <p className="text-rice/60 text-sm">Hold your question clearly in mind. Let it resonate in your heart.</p>
                </div>
                <div className="bg-ink rounded-lg p-6 border border-rice/10 text-center">
                  <svg width="40" height="40" className="text-gold mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="8" r="6" /><circle cx="16" cy="16" r="6" />
                    <path d="M8 14v4a6 6 0 0 0 6 6" /><path d="M16 10V6a6 6 0 0 0-6-6" />
                  </svg>
                  <h4 className="text-rice font-medium mb-2">3. Shake & Release</h4>
                  <p className="text-rice/60 text-sm">Shake the coins gently 6-9 times, then release them onto your flat surface.</p>
                </div>
              </div>
              <div className="bg-gold/10 rounded-lg p-6 border border-gold/30">
                <h4 className="text-gold font-serif text-lg mb-3">The Shake Count</h4>
                <p className="text-rice/80 text-sm leading-relaxed mb-4">
                  Traditionally, coins are shaken <span className="font-medium text-gold">6 or 9 times</span> — numbers sacred in Taoist numerology.
                  Use whatever number feels natural, but be consistent across all six casts.
                </p>
                <div className="text-xs text-rice/50">
                  Some practitioners shake while silently reciting their question. Find what creates the strongest sense of connection for you.
                </div>
              </div>
            </StepCard>

            {/* Step 4 */}
            <StepCard num={4} title="Record the Result">
              <p className="text-rice/80 mb-6 leading-relaxed">Immediately after each cast, record the result before the pattern is disturbed. This is your raw data — treat it with respect.</p>
              <div className="bg-ink rounded-lg p-6 border border-rice/10 mb-6">
                <h4 className="text-gold font-medium mb-4">Recording Template</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {([9, 8, 7, 6] as LineValue[]).map(v => (
                    <div key={v} className="bg-rice/5 p-3 rounded-lg">
                      <div className="text-2xl font-serif text-rice mb-1">{lineInfo[v].symbol}</div>
                      <div className={`text-xs ${v === 9 ? 'text-gold' : v === 6 ? 'text-cinnabar' : 'text-bronze'}`}>{lineInfo[v].name}</div>
                      <div className="text-xs text-rice/50">{lineInfo[v].desc.split(' — ')[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <CheckItem title="Record immediately" desc="Do not rely on memory. Write down or sketch the result before touching the coins." />
                <CheckItem title="Note the order" desc="Line 1 is the first cast (bottom of hexagram). Line 6 is the last cast (top)." />
                <CheckItem title="Mark changing lines" desc="Circle or highlight Old Yang (9) and Old Yin (6). These are crucial for interpretation." />
              </div>
            </StepCard>

            {/* Step 5 */}
            <StepCard num={5} title="Build the Hexagram">
              <p className="text-rice/80 mb-6 leading-relaxed">After six casts, you have all the data needed to construct your hexagram — the pattern of your situation made manifest.</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-gold font-medium mb-4">Assembly Method</h4>
                  <div className="space-y-4">
                    {[
                      { step: '1', title: 'Start from the Bottom', desc: 'Line 1 (first cast) goes at the bottom. Line 6 (last cast) goes at the top.' },
                      { step: '2', title: 'Draw the Lines', desc: 'Yang (7, 9) = solid line ———. Yin (6, 8) = broken line — —.' },
                      { step: '3', title: 'Mark Changes', desc: 'Circle Old Yang (9) and cross Old Yin (6). These lines will transform.' },
                    ].map(item => (
                      <div key={item.step} className="bg-ink rounded-lg p-4 border border-rice/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">{item.step}</div>
                          <div className="text-rice font-medium">{item.title}</div>
                        </div>
                        <p className="text-rice/60 text-sm pl-11">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-gold font-medium mb-4">Example Hexagram</h4>
                  <div className="bg-ink rounded-lg p-6 border border-rice/10">
                    <div className="flex flex-col-reverse items-center gap-2 mb-4">
                      <div className="flex items-center gap-2"><div className="h-3 w-32 bg-rice rounded-sm"></div><span className="text-xs text-cinnabar">×</span></div>
                      <div className="h-3 w-32 bg-rice rounded-sm"></div>
                      <div className="flex items-center gap-2"><div className="h-3 w-14 bg-rice rounded-sm"></div><div className="w-3"></div><div className="h-3 w-14 bg-rice rounded-sm"></div></div>
                      <div className="h-3 w-32 bg-rice rounded-sm"></div>
                      <div className="flex items-center gap-2"><div className="h-3 w-14 bg-rice rounded-sm"></div><div className="w-3"></div><div className="h-3 w-14 bg-rice rounded-sm"></div><span className="text-xs text-cinnabar">○</span></div>
                      <div className="h-3 w-32 bg-rice rounded-sm"></div>
                    </div>
                    <div className="text-center text-xs text-rice/50 space-y-1">
                      <div>Line 6: Old Yin (6) — Changing ×</div>
                      <div>Line 5: Young Yang (7)</div>
                      <div>Line 4: Young Yin (8)</div>
                      <div>Line 3: Young Yang (7)</div>
                      <div>Line 2: Old Yang (9) — Changing ○</div>
                      <div>Line 1: Young Yang (7)</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-rice/10 text-xs text-gold text-center">
                      This hexagram has 2 changing lines, creating a second "future" hexagram.
                    </div>
                  </div>
                </div>
              </div>
            </StepCard>

            {/* Step 6 */}
            <StepCard num={6} title="Interpretation & Reading">
              <p className="text-rice/80 mb-6 leading-relaxed">The hexagram is not a fortune — it is a mirror reflecting the energy pattern of your situation and the natural path of transformation.</p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-ink rounded-lg p-6 border border-rice/10">
                  <BookOpen size={32} className="text-gold mx-auto mb-3" />
                  <h4 className="text-rice font-medium text-center mb-2">Read the Main Text</h4>
                  <p className="text-rice/60 text-sm text-center">Start with the Gua Ci (hexagram text) for your primary hexagram. This gives the overall theme.</p>
                </div>
                <div className="bg-ink rounded-lg p-6 border border-rice/10">
                  <Sparkles size={32} className="text-cinnabar mx-auto mb-3" />
                  <h4 className="text-rice font-medium text-center mb-2">Study Changing Lines</h4>
                  <p className="text-rice/60 text-sm text-center">If you have changing lines (6 or 9), read their Yao Ci (line texts). These are the most specific guidance.</p>
                </div>
                <div className="bg-ink rounded-lg p-6 border border-rice/10">
                  <svg width="32" height="32" className="text-bronze mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2" /><path d="M6 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                    <path d="M12 18v2" /><path d="M8 22v2" /><path d="M16 22v2" />
                  </svg>
                  <h4 className="text-rice font-medium text-center mb-2">Check Future Hexagram</h4>
                  <p className="text-rice/60 text-sm text-center">If lines changed, the second hexagram shows where your situation is heading.</p>
                </div>
              </div>
              <div className="bg-gold/10 rounded-lg p-6 border border-gold/30">
                <h4 className="text-gold font-serif text-lg mb-3">Reading Principles</h4>
                <div className="space-y-2 text-sm text-rice/80">
                  {[
                    'The I Ching speaks in archetypes, not specifics. "The dragon rises from the deep" means your potential is emerging — not that you will literally encounter a dragon.',
                    'Changing lines are the "active" energy in your situation. They represent what is in motion and what requires attention.',
                    'The text is a starting point, not a command. Use it as a framework for your own intuition and reasoning.',
                    'Return to the text over days or weeks. The I Ching often reveals deeper layers with time.',
                  ].map((p, i) => (
                    <p key={i}><span className="text-gold font-medium">{i + 1}.</span> {p}</p>
                  ))}
                </div>
              </div>
            </StepCard>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <InteractiveDemo />

      {/* Video Guide */}
      <section className="py-24 bg-ink">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-rice text-center mb-4">Video Guide</h2>
          <p className="text-rice/60 text-center mb-12 max-w-2xl mx-auto">Watch the complete casting process demonstrated step by step.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Part 1: Understanding the Basics', desc: 'Learn the fundamentals: Yin and Yang, line values, and how coins form hexagrams.', tags: 'Coin identification • Line values • Recording methods' },
              { title: 'Part 2: Full Casting Ritual', desc: 'Watch a complete divination from preparation through interpretation in real time.', tags: 'Preparation • Six casts • Hexagram assembly • Reading' },
            ].map((video, i) => (
              <div key={i} className="bg-rice/5 rounded-lg border border-rice/10 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-ink to-ink/80 flex items-center justify-center">
                  <div className="text-center text-rice/40">
                    <Play size={48} className="mx-auto mb-2" />
                    <span className="text-sm">Video placeholder</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-rice font-serif text-lg mb-2">{video.title}</h3>
                  <p className="text-rice/60 text-sm mb-4">{video.desc}</p>
                  <div className="flex items-center gap-2 text-xs text-rice/40">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="8" r="6" /><circle cx="16" cy="16" r="6" />
                      <path d="M8 14v4a6 6 0 0 0 6 6" /><path d="M16 10V6a6 6 0 0 0-6-6" />
                    </svg>
                    <span>{video.tags}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-rice/5 rounded-lg p-6 border border-rice/10">
            <h3 className="text-gold font-serif text-lg mb-3 text-center">About These Videos</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-rice/70">
              {['Privacy-enhanced YouTube embed (no cookies until play)', 'Lightweight player for faster loading', 'Mobile-responsive with gesture controls'].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check size={16} className="text-gold mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <section className="py-24 bg-bronze/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Sparkles size={48} className="text-bronze mx-auto mb-4" />
          <h2 className="text-3xl font-serif text-ink mb-4">Ready to Cast Your First Hexagram?</h2>
          <p className="text-ink/70 mb-8">Now that you understand the method, try it yourself. Our digital divination tool faithfully replicates the coin-casting process.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/divination" className="bg-cinnabar text-rice px-8 py-4 rounded-sm text-lg hover:bg-cinnabar/80 transition-colors inline-flex items-center justify-center gap-2">
              <Sparkles size={20} />
              Start Digital Divination
            </Link>
            <Link href="/shop" className="border border-ink/30 text-ink px-8 py-4 rounded-sm text-lg hover:bg-ink/5 transition-colors inline-flex items-center justify-center gap-2">
              Browse Feng Shui Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-rice/60 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="24" height="24" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="98" fill="#1a1a1a" stroke="#c9a227" strokeWidth="2" />
                  <path d="M100,2 A49,49 0 0,1 100,98 A49,49 0 0,0 100,198 A98,98 0 0,1 100,2" fill="#f5f0e8" />
                  <circle cx="100" cy="50" r="15" fill="#1a1a1a" />
                  <circle cx="100" cy="150" r="15" fill="#f5f0e8" />
                </svg>
                <span className="text-rice font-serif text-lg font-bold">TaoInsight</span>
              </div>
              <p className="text-sm leading-relaxed">Bridging 5,000 years of Chinese wisdom with modern seekers worldwide.</p>
            </div>
            <div>
              <h4 className="text-rice font-medium mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/wisdom" className="hover:text-gold transition-colors">Yi Jing Wisdom</Link></li>
                <li><Link href="/divination" className="hover:text-gold transition-colors">I Ching Divination</Link></li>
                <li><Link href="/shop" className="hover:text-gold transition-colors">Feng Shui Store</Link></li>
                <li><Link href="/guide" className="hover:text-gold transition-colors">How to Cast</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-rice font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guide" className="hover:text-gold transition-colors">Coin Guide</Link></li>
                <li><Link href="/divination" className="hover:text-gold transition-colors">Hexagram Lookup</Link></li>
                <li><a href="#interactive-demo" className="hover:text-gold transition-colors">Video Tutorials</a></li>
                <li><a href="#faq" className="hover:text-gold transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-rice font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-gold transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-rice/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">2024 TaoInsight. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
