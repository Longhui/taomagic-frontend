'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Sparkles, Play, BookOpen, Star, ChevronDown, Check,
  Home, Compass, Users, Info, ShoppingBag, Calendar, Search,
  RotateCcw, Moon, Sun, Shield, Heart, Zap, Gem, Layers,
} from 'lucide-react'
import Navigation from '@/app/components/Navigation'
import {
  calcMingGua, getDirectionFortunes, getHouseGroup,
  directionToAngle, directionToLabel,
  type Gender, type Direction, type DirectionFortune,
} from '../../lib/fengshui'


// ========== Reusable Components ==========
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

// ========== Section: What is Ba Zhai Ming Jing ==========
const WhatIsBaZhai = () => (
  <section id="what-is-ba-zhai" className="py-24 bg-rice">
    <div className="max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-lg border border-ink/10 p-8 md:p-12 shadow-sm">
        <h2 className="text-3xl font-serif text-ink text-center mb-6">What is Ba Zhai Feng Shui?</h2>
        <p className="text-ink/60 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
          The Eight Mansions Bright Mirror (Ba Zhai Ming Jing) is the most practical and
          accessible system in the School of Form &amp; Qi Feng Shui.
        </p>

        {/* Core concept */}
        <div className="bg-bronze/5 border border-bronze/20 rounded-lg p-8 mb-10 text-center">
          <p className="text-2xl md:text-3xl font-serif text-bronze mb-4 tracking-wider italic">
            &ldquo;People have their destiny; houses have their direction.&rdquo;
          </p>
          <p className="text-ink/70 max-w-3xl mx-auto leading-relaxed">
            Every person is born with a unique <strong className="text-ink">&ldquo;energy code&rdquo; (Ming Gua)</strong>,
            and every house has a fixed <strong className="text-ink">&ldquo;energy attribute&rdquo; (Zhai Gua)</strong>.
            When your personal Ming Gua aligns with your home&rsquo;s Zhai Gua, you feel
            balanced, healthy, and fortunate. When they conflict, you may experience
            discomfort and obstacles.
          </p>
        </div>

        {/* Key points grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: <Moon size={32} />, title: 'Best Sleep Direction', desc: 'Know which direction supports deep, restorative rest' },
            { icon: <BookOpen size={32} />, title: 'Desk Positioning', desc: 'Find the optimal orientation for focus and productivity' },
            { icon: <Home size={32} />, title: 'Transform Negative Energy', desc: 'Place bathrooms to neutralize inauspicious sectors' },
            { icon: <Gem size={32} />, title: 'Energy Balancing', desc: 'Wear crystal bracelets to harmonize your personal energy' },
          ].map((item, i) => (
            <div key={i} className="bg-ink/5 rounded-lg p-6 text-center">
              <div className="text-bronze flex justify-center mb-3">{item.icon}</div>
              <h4 className="font-medium text-ink mb-2">{item.title}</h4>
              <p className="text-sm text-ink/60">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-ink/10" />
          <span className="text-ink/30 text-sm">Eight Mansions &middot; Eight Directions</span>
          <div className="flex-1 h-px bg-ink/10" />
        </div>

        <p className="text-sm text-ink/50 text-center leading-relaxed">
          Ba Zhai Ming Jing divides space into eight directions, each with a different
          influence on your well-being. Some directions bring good fortune (auspicious),
          while others may bring challenges (inauspicious). By understanding these
          directions, you can optimize your living environment to work with the energy,
          not against it.
        </p>
      </div>
    </div>
  </section>
)

// ========== Section: Preparation ==========
const Preparation = () => (
  <section className="py-24 bg-ink">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-serif text-rice text-center mb-4">Preparations Before You Start</h2>
      <p className="text-rice/60 text-center mb-12 max-w-2xl mx-auto">
        Gather these tools before beginning your Feng Shui evaluation
      </p>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { icon: <Compass size={36} />, title: 'Compass App', desc: 'Measure house facing direction', tip: 'iPhone built-in or any compass app' },
          { icon: <Home size={36} />, title: 'Floor Plan', desc: 'Mark room locations', tip: 'A rough hand drawing is fine' },
          { icon: <BookOpen size={36} />, title: 'Notebook & Pen', desc: 'Record measurements', tip: 'Note angles and direction data' },
          { icon: <Calendar size={36} />, title: 'Date of Birth', desc: 'Calculate your Ming Gua', tip: 'Note if born before Feb 4 (Li Chun)' },
        ].map((item, i) => (
          <div key={i} className="bg-rice/5 rounded-lg border border-rice/10 p-6 text-center">
            <div className="text-gold flex justify-center mb-4">{item.icon}</div>
            <h3 className="text-rice font-serif text-lg mb-2">{item.title}</h3>
            <p className="text-rice/60 text-sm mb-3">{item.desc}</p>
            <div className="text-xs text-gold/70 bg-gold/5 rounded-sm px-3 py-1.5 inline-block">
              💡 {item.tip}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ========== Interactive Ming Gua Calculator ==========
const MingGuaCalculator = () => {
  const [gender, setGender] = useState<Gender | null>(null)
  const [birthYear, setBirthYear] = useState<string>('')
  const [birthMonth, setBirthMonth] = useState<string>('')
  const [birthDay, setBirthDay] = useState<string>('')

  const result = useMemo(() => {
    if (!gender || !birthYear || !birthMonth || !birthDay) return null
    const y = parseInt(birthYear)
    const m = parseInt(birthMonth)
    const d = parseInt(birthDay)
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null
    try {
      const mingGua = calcMingGua(y, m, d, gender)
      const fortunes = getDirectionFortunes(mingGua.number)
      return { mingGua, fortunes }
    } catch {
      return null
    }
  }, [gender, birthYear, birthMonth, birthDay])

  const elementEmoji: Record<string, string> = {
    Water: '💧', Earth: '⛰️', Wood: '🌿', Metal: '⚔️', Fire: '🔥',
  }
  const elementColors: Record<string, string> = {
    Water: 'text-blue-400', Earth: 'text-amber-400', Wood: 'text-green-400',
    Metal: 'text-yellow-300', Fire: 'text-red-400',
  }
  const groupColors: Record<string, string> = {
    east: 'text-green-400 bg-green-500/10 border-green-500/30',
    west: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  }

  const goodFortunes = result?.fortunes.slice(0, 4) || []
  const badFortunes = result?.fortunes.slice(4) || []

  return (
    <div className="max-w-4xl mx-auto">
      {/* Calculator Card */}
      <div className="bg-white rounded-lg border border-ink/10 p-8 shadow-sm mb-8">
        <div className="text-center mb-6">
          <Users size={40} className="text-bronze mx-auto mb-3" />
          <h3 className="text-2xl font-serif text-ink mb-1">Calculate Your Ming Gua</h3>
          <p className="text-sm text-ink/50">Enter your birth details to automatically calculate your life trigram</p>
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-ink mb-3">Select Gender</label>
          <div className="flex gap-3">
            {(['male', 'female'] as Gender[]).map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-sm text-center font-medium transition-all border-2
                  ${gender === g
                    ? 'bg-cinnabar/5 border-cinnabar text-cinnabar'
                    : 'bg-white border-ink/10 text-ink/50 hover:border-ink/30'}`}
              >
                {g === 'male' ? '🚹 Male' : '🚺 Female'}
              </button>
            ))}
          </div>
        </div>

        {/* Birth Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-ink mb-3">Date of Birth</label>
          <div className="grid grid-cols-3 gap-3">
            <select
              value={birthYear}
              onChange={e => setBirthYear(e.target.value)}
              className="w-full px-3 py-2.5 rounded-sm border border-ink/20 text-sm focus:outline-none focus:border-bronze bg-white"
            >
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => 2026 - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={birthMonth}
              onChange={e => setBirthMonth(e.target.value)}
              className="w-full px-3 py-2.5 rounded-sm border border-ink/20 text-sm focus:outline-none focus:border-bronze bg-white"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={birthDay}
              onChange={e => setBirthDay(e.target.value)}
              className="w-full px-3 py-2.5 rounded-sm border border-ink/20 text-sm focus:outline-none focus:border-bronze bg-white"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-ink/40 mt-2">
            ⚠️ Feng Shui years begin at Spring Begins (Li Chun, ~Feb 4).
            If born in January or early February, check whether Li Chun has passed.
          </p>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 border-t border-ink/10 pt-6">
            {/* Ming Gua Display */}
            <div className="bg-gradient-to-br from-ink to-ink/90 rounded-lg p-6 text-rice text-center border border-gold/20">
              <p className="text-sm text-rice/40 mb-2">Your Ming Gua</p>
              <div className="text-4xl font-serif text-gold mb-2">{result.mingGua.trigram} &middot; {result.mingGua.number}</div>
              <div className="flex items-center justify-center gap-4 text-sm mb-4">
                <span className="flex items-center gap-1">
                  <span className={elementColors[result.mingGua.element]}>{elementEmoji[result.mingGua.element]}</span>
                  <span>{result.mingGua.element}</span>
                </span>
                <span className={`px-3 py-0.5 rounded-sm text-xs border ${groupColors[result.mingGua.group]}`}>
                  {result.mingGua.groupLabel}
                </span>
              </div>
              <p className="text-xs text-rice/50 italic">{result.mingGua.description}</p>
            </div>

            {/* Fortune Directions */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center gap-2">
                  <Star size={16} /> Four Auspicious Directions
                </h4>
                <div className="space-y-2">
                  {goodFortunes.map(f => (
                    <div key={f.direction} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-sm text-sm">
                      <span className="font-medium text-green-800">{f.directionLabel}</span>
                      <span className="text-green-600">{f.name.split('(')[0].trim()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-green-50/50 border border-green-200/50 rounded-sm text-xs text-green-700">
                  Your lucky directions &rarr; E, SE, S, N
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center gap-2">
                  <Shield size={16} /> Four Inauspicious Directions
                </h4>
                <div className="space-y-2">
                  {badFortunes.map(f => (
                    <div key={f.direction} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-sm text-sm">
                      <span className="font-medium text-red-800">{f.directionLabel}</span>
                      <span className="text-red-600">{f.name.split('(')[0].trim()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-red-50/50 border border-red-200/50 rounded-sm text-xs text-red-700">
                  Your challenging directions &rarr; W, NW, SW, NE
                </div>
              </div>
            </div>

            {/* Key takeaway */}
            <div className={`mt-6 p-4 rounded-sm border text-sm ${
              result.mingGua.group === 'east'
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}>
              <p className="font-medium mb-1">
                🔑 Key Insight: You are <strong>{
                  result.mingGua.group === 'east' ? 'East Life Group' : 'West Life Group'
                }</strong>
              </p>
              <p className="text-xs opacity-80">
                {result.mingGua.group === 'east'
                  ? 'Your auspicious directions are East, Southeast, South, North. Houses facing these directions suit you best.'
                  : 'Your auspicious directions are West, Northwest, Southwest, Northeast. Houses facing these directions suit you best.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Calculation method reference */}
      <div className="bg-ink rounded-lg p-6 border border-rice/10">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-gold" />
          <h4 className="text-rice font-medium">Calculation Method Reference</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gold mb-2">Step 1: Determine Feng Shui Year</p>
            <ul className="text-rice/60 space-y-1">
              <li>&bull; Born after Feb 4 &rarr; use current year</li>
              <li>&bull; Born before Feb 4 &rarr; use previous year</li>
            </ul>
          </div>
          <div>
            <p className="text-gold mb-2">Step 2: Gender Formula</p>
            <div className="text-rice/60 space-y-1">
              <p>Male: 11 - digit sum (pre-2000) / 9 - digit sum (2000 onward)</p>
              <p>Female: 5 + digit sum (pre-2000) / 6 + digit sum (2000 onward)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== Section: Step 1 - Determine Ming Gua ==========
const Step1_MingGua = () => (
  <section className="py-24 bg-ink">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-rice mb-4">Step 1: Determine Your Ming Gua</h2>
        <p className="text-rice/60 max-w-2xl mx-auto">
          Your Ming Gua is determined by your birth year and gender. The cosmic energy
          field of your birth year grants you a specific Five Element attribute.
        </p>
      </div>

      <MingGuaCalculator />

      {/* Reference Table */}
      <div className="mt-8 bg-white rounded-lg border border-ink/10 p-6 shadow-sm">
        <h4 className="text-lg font-serif text-ink mb-4 text-center">Ming Gua Quick Reference</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10">
                <th className="py-2 px-4 text-left text-ink/60 font-medium">Number</th>
                <th className="py-2 px-4 text-left text-ink/60 font-medium">Trigram</th>
                <th className="py-2 px-4 text-left text-ink/60 font-medium">Group</th>
                <th className="py-2 px-4 text-left text-ink/60 font-medium">Element</th>
                <th className="py-2 px-4 text-left text-ink/60 font-medium">Lucky Directions</th>
              </tr>
            </thead>
            <tbody>
              {[
                [1, 'Kan', 'East Group', 'Water', 'E, SE, S, N'],
                [2, 'Kun', 'West Group', 'Earth', 'W, NW, SW, NE'],
                [3, 'Zhen', 'East Group', 'Wood', 'E, SE, S, N'],
                [4, 'Xun', 'East Group', 'Wood', 'E, SE, S, N'],
                [6, 'Qian', 'West Group', 'Metal', 'W, NW, SW, NE'],
                [7, 'Dui', 'West Group', 'Metal', 'W, NW, SW, NE'],
                [8, 'Gen', 'West Group', 'Earth', 'W, NW, SW, NE'],
                [9, 'Li', 'East Group', 'Fire', 'E, SE, S, N'],
              ].map((row, i) => (
                <tr key={i} className="border-b border-ink/5 hover:bg-ink/5 transition-colors">
                  <td className="py-2.5 px-4 font-medium">{row[0]}</td>
                  <td className="py-2.5 px-4">{row[1] as string}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded-sm text-xs ${
                      row[2] === 'East Group' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{row[2] as string}</span>
                  </td>
                  <td className="py-2.5 px-4">{row[3] as string}</td>
                  <td className="py-2.5 px-4 text-ink/60">{row[4] as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-bronze/5 rounded-sm border border-bronze/20">
          <p className="text-sm text-bronze">
            <strong>⚠️ Special case:</strong> If result is 5 &mdash; Male converts to 2 (West Group), Female converts to 8 (West Group)
          </p>
        </div>
      </div>
    </div>
  </section>
)

// ========== Section: Step 2 - Determine House Facing ==========
const Step2_HouseDirection = () => {
  const COMPASS_DIRS: { dir: Direction; label: string; angle: number }[] = [
    { dir: 'north', label: 'N', angle: 0 },
    { dir: 'northeast', label: 'NE', angle: 45 },
    { dir: 'east', label: 'E', angle: 90 },
    { dir: 'southeast', label: 'SE', angle: 135 },
    { dir: 'south', label: 'S', angle: 180 },
    { dir: 'southwest', label: 'SW', angle: 225 },
    { dir: 'west', label: 'W', angle: 270 },
    { dir: 'northwest', label: 'NW', angle: 315 },
  ]

  const angleRanges: { range: string; dir: string; label: string; type: string }[] = [
    { range: '337.5° – 22.5°', dir: 'North', label: 'N', type: 'East House' },
    { range: '22.5° – 67.5°', dir: 'Northeast', label: 'NE', type: 'West House' },
    { range: '67.5° – 112.5°', dir: 'East', label: 'E', type: 'East House' },
    { range: '112.5° – 157.5°', dir: 'Southeast', label: 'SE', type: 'East House' },
    { range: '157.5° – 202.5°', dir: 'South', label: 'S', type: 'East House' },
    { range: '202.5° – 247.5°', dir: 'Southwest', label: 'SW', type: 'West House' },
    { range: '247.5° – 292.5°', dir: 'West', label: 'W', type: 'West House' },
    { range: '292.5° – 337.5°', dir: 'Northwest', label: 'NW', type: 'West House' },
  ]

  return (
    <section className="py-24 bg-rice">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-ink text-center mb-4">Step 2: Measure Your House Facing</h2>
        <p className="text-ink/60 text-center mb-12 max-w-2xl mx-auto">
          Stand inside your home, facing the main entrance door. The direction you are
          looking at is your house facing direction.
        </p>

        {/* Important clarification */}
        <div className="bg-cinnabar/5 border border-cinnabar/20 rounded-lg p-6 mb-10">
          <h3 className="font-medium text-cinnabar mb-4 flex items-center gap-2">
            <Info size={20} /> ⚠️ Common Misconceptions
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-cinnabar/70">❌ Not looking from outside in</p>
              <p className="text-cinnabar/70">❌ Not the balcony orientation</p>
            </div>
            <div className="space-y-2">
              <p className="text-cinnabar/70">❌ Not the direction with most windows</p>
              <p className="text-green-700">✅ Stand inside, face the door, read your compass</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Compass Visual */}
          <div className="bg-white rounded-lg border border-ink/10 p-8 shadow-sm">
            <h3 className="text-lg font-serif text-ink mb-6 text-center">Eight-Direction Compass</h3>
            <svg viewBox="0 0 280 280" className="w-full max-w-xs mx-auto">
              <circle cx="140" cy="140" r="130" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.3" />
              <circle cx="140" cy="140" r="120" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.15" />
              <circle cx="140" cy="140" r="45" fill="none" stroke="#4a6741" strokeWidth="1" opacity="0.2" />

              {/* Center */}
              <text x="140" y="134" textAnchor="middle" fontSize="12" fill="#4a6741" fontWeight="600">Ba Gua</text>
              <text x="140" y="150" textAnchor="middle" fontSize="9" fill="#4a6741" opacity="0.5">Eight Mansions</text>

              {/* Direction labels */}
              {COMPASS_DIRS.map((d) => {
                const rad = (d.angle - 90) * Math.PI / 180
                const r = 95
                const x = 140 + r * Math.cos(rad)
                const y = 140 + r * Math.sin(rad)
                return (
                  <g key={d.dir}>
                    <line x1="140" y1="140" x2={x} y2={y} stroke="#1a1a1a" strokeWidth="0.3" opacity="0.1" />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                      fontSize="13" fontWeight="bold" fill="#1a1a1a"
                    >{d.label}</text>
                    <text x={140 + 60 * Math.cos(rad)} y={140 + 60 * Math.sin(rad)}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize="8" fill="#c41e3a" opacity="0.6"
                    >{d.dir === 'north' ? 'S' : d.dir === 'south' ? 'N' : d.dir === 'east' ? 'W' : d.dir === 'west' ? 'E' : ''}</text>
                  </g>
                )
              })}

              {/* Cardinal marks */}
              <text x="140" y="14" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#c41e3a">S</text>
              <text x="140" y="270" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1a1a1a">N</text>
              <text x="14" y="142" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1a1a1a">W</text>
              <text x="266" y="142" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1a1a1a">E</text>

              <circle cx="140" cy="140" r="4" fill="#c41e3a" opacity="0.4" />
            </svg>
          </div>

          {/* Angle Reference Table */}
          <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm">
            <h3 className="text-lg font-serif text-ink mb-4 text-center">Angle &middot; Direction &middot; House Type</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10">
                    <th className="py-2 px-3 text-left text-ink/60 font-medium">Angle Range</th>
                    <th className="py-2 px-3 text-left text-ink/60 font-medium">Direction</th>
                    <th className="py-2 px-3 text-left text-ink/60 font-medium">House Type</th>
                  </tr>
                </thead>
                <tbody>
                  {angleRanges.map((row, i) => (
                    <tr key={i} className="border-b border-ink/5 hover:bg-ink/5 transition-colors">
                      <td className="py-2 px-3 font-mono text-xs">{row.range}</td>
                      <td className="py-2 px-3 font-medium">{row.dir}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-sm text-xs ${
                          row.type === 'East House' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>{row.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Special Cases */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm">
            <h4 className="font-medium text-ink mb-2">🏠 Off-Angle Doors</h4>
            <p className="text-sm text-ink/60">Within 22.5&deg; of a cardinal direction, count it as that direction. For precise boundaries, consult a professional.</p>
          </div>
          <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm">
            <h4 className="font-medium text-ink mb-2">🏢 Apartments</h4>
            <p className="text-sm text-ink/60">Use the building entrance or your most frequently used door as the reference point.</p>
          </div>
          <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm">
            <h4 className="font-medium text-ink mb-2">📐 Irregular Layouts</h4>
            <p className="text-sm text-ink/60">Find the geometric center. For highly irregular shapes, use the main living area as your reference.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== Section: Step 3 - Room Layout ==========
const Step3_RoomLayout = () => (
  <section className="py-24 bg-ink">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-serif text-rice text-center mb-4">Step 3: Configure Your Room Layout</h2>
      <p className="text-rice/60 text-center mb-12 max-w-2xl mx-auto">
        Divide your floor plan into 9 sectors and label each room&rsquo;s function
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Grid Visual */}
        <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm">
          <h3 className="text-lg font-serif text-ink mb-4 text-center">3&times;3 Grid Layout</h3>
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            {[
              [{ dir: 'NW', color: 'bg-yellow-50 border-yellow-300' }, { dir: 'North', color: 'bg-blue-50 border-blue-300' }, { dir: 'NE', color: 'bg-yellow-50 border-yellow-300' }],
              [{ dir: 'West', color: 'bg-white border-gray-300' }, { dir: 'Center', color: 'bg-cinnabar/10 border-cinnabar' }, { dir: 'East', color: 'bg-green-50 border-green-300' }],
              [{ dir: 'SW', color: 'bg-yellow-50 border-yellow-300' }, { dir: 'South', color: 'bg-red-50 border-red-300' }, { dir: 'SE', color: 'bg-green-50 border-green-300' }],
            ].map((row, ri) =>
              row.map((cell, ci) => (
                <div key={`${ri}-${ci}`} className={`aspect-square rounded-sm border-2 ${cell.color} flex items-center justify-center text-sm font-medium`}>
                  <span className="text-center leading-tight">
                    {cell.dir}
                    <br />
                    <span className="text-[10px] opacity-60">
                      {cell.dir === 'Center' ? '(Fixed)' : ''}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-ink/40 text-center mt-4">
            The center point never moves &mdash; it is the &ldquo;heart&rdquo; of the house
          </p>
        </div>

        {/* Room Type Reference */}
        <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm">
          <h3 className="text-lg font-serif text-ink mb-4 text-center">Room Types &amp; Feng Shui Meaning</h3>
          <div className="space-y-2">
            {[
              { room: '🛏️ Bedroom', meaning: 'Rest, energy recovery' },
              { room: '👑 Master Bedroom', meaning: 'Core energy hub' },
              { room: '🛋️ Living Room', meaning: 'Family activities, hosting' },
              { room: '🍳 Kitchen', meaning: 'Fire source, cooking' },
              { room: '🚿 Bathroom', meaning: 'Drainage, neutralization' },
              { room: '📚 Study', meaning: 'Work, learning' },
              { room: '🍽️ Dining Room', meaning: 'Eating, gathering' },
              { room: '📦 Storage', meaning: 'Stillness, suppression' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-ink/5 rounded-sm text-sm">
                <span className="font-medium text-ink">{item.room}</span>
                <span className="text-ink/60">{item.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

// ========== Section: Step 4 - Understand Results ==========
const Step4_Results = () => (
  <section className="py-24 bg-rice">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-serif text-ink text-center mb-4">Step 4: Understanding Your Results</h2>
      <p className="text-ink/60 text-center mb-12 max-w-2xl mx-auto">
        Learn the meaning of the four auspicious and four inauspicious directions,
        and how your Ming Gua matches your house.
      </p>

      {/* Four Auspicious */}
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        {[
          { name: 'Sheng Qi', english: 'Vitality', meaning: 'Strongest positive energy', keyword: 'Wealth &middot; Career', color: 'bg-green-50 border-green-300', best: 'Front door, study, office', icon: '✨' },
          { name: 'Tian Yi', english: 'Healer', meaning: 'Health, recovery, benefactors', keyword: 'Health &middot; Healing', color: 'bg-teal-50 border-teal-300', best: 'Bedroom, bed headboard', icon: '💊' },
          { name: 'Yan Nian', english: 'Longevity', meaning: 'Relationships, marriage, harmony', keyword: 'Relationships', color: 'bg-blue-50 border-blue-300', best: 'Living room, master bedroom', icon: '💞' },
          { name: 'Fu Wei', english: 'Stability', meaning: 'Stability, peace, tranquility', keyword: 'Inner peace', color: 'bg-purple-50 border-purple-300', best: 'Study, meditation room', icon: '🧘' },
        ].map((item, i) => (
          <div key={i} className={`${item.color} border-2 rounded-lg p-5 text-center`}>
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="text-lg font-serif text-ink mb-1">{item.name}</h3>
            <p className="text-xs text-ink/50 mb-1">{item.english}</p>
            <p className="text-sm text-ink/70 mb-3">{item.meaning}</p>
            <div className="text-xs bg-white/60 rounded-sm px-3 py-1.5">
              Best for: {item.best}
            </div>
          </div>
        ))}
      </div>

      {/* Four Inauspicious */}
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        {[
          { name: 'Jue Ming', english: 'Death', meaning: 'Strongest negative energy', risk: 'Illness, financial loss', color: 'bg-red-50 border-red-300', fix: 'Place bathroom or kitchen here', icon: '☠️' },
          { name: 'Wu Gui', english: 'Five Ghosts', meaning: 'Accidents, fire, arguments', risk: 'Unexpected harm', color: 'bg-orange-50 border-orange-300', fix: 'Bathroom or kitchen (use fire to suppress)', icon: '👻' },
          { name: 'Liu Sha', english: 'Six Harms', meaning: 'Emotional turmoil, stress', risk: 'Interpersonal issues', color: 'bg-rose-50 border-rose-300', fix: 'Bathroom, trash storage area', icon: '💔' },
          { name: 'Huo Hai', english: 'Misfortune', meaning: 'Gossip, petty troubles', risk: 'Conflict, disputes', color: 'bg-amber-50 border-amber-300', fix: 'Bathroom, storage room', icon: '🗣️' },
        ].map((item, i) => (
          <div key={i} className={`${item.color} border-2 rounded-lg p-5 text-center`}>
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="text-lg font-serif text-ink mb-1">{item.name}</h3>
            <p className="text-xs text-ink/50 mb-1">{item.english}</p>
            <p className="text-sm text-ink/70 mb-3">{item.meaning}</p>
            <div className="text-xs bg-white/60 rounded-sm px-3 py-1.5">
              Remedy: {item.fix}
            </div>
          </div>
        ))}
      </div>

      {/* Match Table */}
      <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm">
        <h3 className="text-lg font-serif text-ink mb-4 text-center">Ming Gua &amp; House Compatibility</h3>
        <div className="space-y-3">
          {[
            { situation: 'East Life + East House', result: '✅ Perfect Match', suggestion: 'Natural harmony, minor optimization', color: 'bg-green-50 border-green-200' },
            { situation: 'West Life + West House', result: '✅ Perfect Match', suggestion: 'Natural harmony, minor optimization', color: 'bg-green-50 border-green-200' },
            { situation: 'East Life + West House', result: '⚠️ Mismatch', suggestion: 'Personal remedies recommended', color: 'bg-orange-50 border-orange-200' },
            { situation: 'West Life + East House', result: '⚠️ Mismatch', suggestion: 'Personal remedies recommended', color: 'bg-orange-50 border-orange-200' },
          ].map((item, i) => (
            <div key={i} className={`${item.color} border rounded-lg p-4 flex items-center justify-between`}>
              <span className="font-medium text-ink">{item.situation}</span>
              <div className="text-right">
                <span className="font-medium block">{item.result}</span>
                <span className="text-xs text-ink/50">{item.suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

// ========== Section: Step 5 - Remedies & Bracelets ==========
const Step5_Remedies = () => (
  <section className="py-24 bg-ink">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-serif text-rice text-center mb-4">Step 5: Remedies &amp; Bracelet Selection</h2>
      <p className="text-rice/60 text-center mb-12 max-w-2xl mx-auto">
        Core principle: &ldquo;Energize the auspicious, suppress the inauspicious&rdquo;
      </p>

      {/* Room Remedy Table */}
      <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm mb-8">
        <h3 className="text-lg font-serif text-ink mb-4 text-center">Remedies for Rooms in Inauspicious Sectors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10">
                <th className="py-2.5 px-4 text-left text-ink/60 font-medium">Room in Bad Sector</th>
                <th className="py-2.5 px-4 text-left text-ink/60 font-medium">Remedy Strategy</th>
              </tr>
            </thead>
            <tbody>
              {[
                { room: '🛏️ Bedroom', remedy: 'Adjust bed headboard toward a lucky direction; wear obsidian bracelet; place salt water under bed' },
                { room: '📚 Study', remedy: 'Face your desk toward an auspicious direction; place plants on desk; wear clear quartz' },
                { room: '🍳 Kitchen', remedy: '✅ Ideal! Kitchen fire energy naturally suppresses inauspicious sectors' },
                { room: '🚿 Bathroom', remedy: '✅ Perfect! Drainage energy neutralizes negative sectors' },
                { room: '🛋️ Living Room', remedy: 'Minimize time spent here; place heavy furniture to suppress energy' },
              ].map((item, i) => (
                <tr key={i} className="border-b border-ink/5 hover:bg-ink/5 transition-colors">
                  <td className="py-2.5 px-4 font-medium">{item.room}</td>
                  <td className={`py-2.5 px-4 ${
                    item.remedy.startsWith('✅') ? 'text-green-700' : 'text-ink/70'
                  }`}>{item.remedy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bracelet Recommendations */}
      <div className="mb-8">
        <h3 className="text-2xl font-serif text-rice text-center mb-6">Bracelet Recommendation Guide</h3>
        <p className="text-rice/60 text-center mb-8 text-sm">Based on your evaluation, the system recommends bracelets tailored to your needs</p>
        <div className="bg-white rounded-lg border border-ink/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-ink/5">
                  <th className="py-3 px-4 text-left text-ink/60 font-medium">Your Concern</th>
                  <th className="py-3 px-4 text-left text-ink/60 font-medium">Recommended Stone</th>
                  <th className="py-3 px-4 text-left text-ink/60 font-medium">Element</th>
                  <th className="py-3 px-4 text-left text-ink/60 font-medium">Benefit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { problem: 'Poor sleep, mental fatigue', material: 'Obsidian', element: 'Water', benefit: 'Protection, grounding, calming' },
                  { problem: 'Anxiety, stress', material: 'Green Phantom / Sandalwood', element: 'Wood', benefit: 'Soothes emotions, vitality' },
                  { problem: 'Blocked wealth, career issues', material: 'Citrine / Golden Rutile', element: 'Earth / Metal', benefit: 'Attract prosperity, stability' },
                  { problem: 'Relationship tension', material: 'Rose Quartz / Moonstone', element: 'Fire / Water', benefit: 'Love, harmony, empathy' },
                  { problem: 'Weak health', material: 'Red Agate / Carnelian', element: 'Fire', benefit: 'Boost Yang energy, vitality' },
                  { problem: 'Overall fortune boost', material: 'Multi-gem combination', element: 'Balanced', benefit: 'Complete Five Elements harmony' },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-ink/5 hover:bg-ink/5 transition-colors">
                    <td className="py-3 px-4 text-ink">{item.problem}</td>
                    <td className="py-3 px-4 font-medium text-bronze">{item.material}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-sm bg-ink/5 text-ink/70 text-xs">{item.element}</span>
                    </td>
                    <td className="py-3 px-4 text-ink/70">{item.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Wearing Guide */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-rice/5 rounded-lg border border-rice/10 p-6">
          <h3 className="text-lg font-serif text-rice mb-4 flex items-center gap-2">
            <Gem size={22} className="text-gold" />
            Left Hand vs Right Hand
          </h3>
          <div className="space-y-4">
            <div className="bg-ink rounded-lg p-4 border border-bronze/30">
              <p className="text-bronze font-medium mb-1">🤲 Left Hand = &ldquo;Receiving&rdquo; Side</p>
              <p className="text-rice/60 text-sm">To attract good fortune, wealth &rarr; wear on left</p>
            </div>
            <div className="bg-ink rounded-lg p-4 border border-cinnabar/30">
              <p className="text-cinnabar font-medium mb-1">🤲 Right Hand = &ldquo;Releasing&rdquo; Side</p>
              <p className="text-rice/60 text-sm">To dispel negative energy, toxins &rarr; wear on right</p>
            </div>
          </div>
        </div>

        <div className="bg-rice/5 rounded-lg border border-rice/10 p-6">
          <h3 className="text-lg font-serif text-rice mb-4 flex items-center gap-2">
            <Moon size={22} className="text-gold" />
            Daily Care
          </h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Rinse with clean water on the first of each month' },
              { step: '2', text: 'Remove at night and place by the bedside' },
              { step: '3', text: 'Avoid letting others touch it (personal energy item)' },
              { step: '4', text: 'Periodically charge under moonlight (best on full moon)' },
            ].map(item => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">{item.step}</div>
                <p className="text-rice/70 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gold/10 rounded-lg p-6 border border-gold/30">
        <p className="text-rice/80 text-sm text-center leading-relaxed">
          <span className="text-gold font-medium">💡 A Note:</span>
          From a scientific perspective, crystal bracelets serve as physical anchors for
          &ldquo;environmental psychology&rdquo; &mdash; reminding you to stay mindful of your energy
          balance. From a traditional view, natural stones carry specific vibrational
          frequencies that resonate with your personal energy field. Either way,
          belief + action = transformation.
        </p>
      </div>
    </div>
  </section>
)

// ========== FAQ ==========
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: 'I rent my home. Does Feng Shui still apply?',
      a: 'Yes. Even though you don\'t own the house, the energy field of your living space still affects you while you reside there. You can improve your situation by adjusting your bed position, desk orientation, and wearing appropriate bracelets.'
    },
    {
      q: 'What if family members have different Ming Gua?',
      a: 'Traditionally, the primary breadwinner\'s Ming Gua takes priority for shared spaces. Individual bedrooms can be adjusted according to each person\'s Ming Gua, and common areas follow the main decision-maker\'s energy.'
    },
    {
      q: 'My house faces 15 degrees off a cardinal direction. Which is it?',
      a: 'Within 22.5 degrees of a main direction, it counts as that direction. If exactly on the boundary (e.g., exactly 22.5&deg;), professional measurement may be needed to determine the &ldquo;mountain and facing.&rdquo;'
    },
    {
      q: 'The evaluation says I don\'t match my house. Do I need to move?',
      a: 'Not at all. Ba Zhai Ming Jing offers optimization guidance, not a life sentence. Through bed adjustments, wearing bracelets, and placing Feng Shui objects, you can completely neutralize any mismatch.'
    },
    {
      q: 'Do bracelets really work, or is it psychological?',
      a: 'Scientifically, bracelets serve as &ldquo;environmental psychology&rdquo; tools &mdash; they remind you to maintain positive energy and intention. Traditionally, natural crystals have specific vibrational frequencies that interact with your body\'s energy field. Belief + action = real transformation.'
    },
    {
      q: 'How accurate is my Ming Gua calculation?',
      a: 'Ming Gua is calculated from your birth year and gender, a method refined over thousands of years. The key variable is the Feng Shui year beginning from Li Chun (Spring Begins ~Feb 4). If you were born in January or early February, confirm whether Spring Begins had passed. Try our interactive calculator above for an instant result.'
    },
  ]

  return (
    <section className="py-24 bg-rice">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-ink text-center mb-12">Frequently Asked Questions</h2>
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

// ========== CTA ==========
const CTA = () => (
  <section className="py-24 bg-bronze/10">
    <div className="max-w-3xl mx-auto px-4 text-center">
      <Compass size={48} className="text-bronze mx-auto mb-4" />
      <h2 className="text-3xl font-serif text-ink mb-4">Start Your Evaluation</h2>
      <p className="text-ink/70 mb-4 max-w-xl mx-auto leading-relaxed">
        Now that you understand the theory, it&rsquo;s time to put it into practice.
      </p>
      <div className="text-left bg-white/60 rounded-lg p-6 mb-8 max-w-lg mx-auto">
        <h3 className="font-medium text-ink mb-3">Steps to Get Started:</h3>
        <ol className="space-y-2 text-sm text-ink/70">
          <li>1. Have your date of birth ready (check Li Chun boundary)</li>
          <li>2. Open your phone&rsquo;s compass app</li>
          <li>3. Stand at the center of your home, facing the front door</li>
          <li>4. Record the angle and determine the direction</li>
          <li>5. Enter all information into our evaluation tool</li>
        </ol>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/fengshui" className="bg-cinnabar text-rice px-8 py-4 rounded-sm text-lg hover:bg-cinnabar/80 transition-colors inline-flex items-center justify-center gap-2">
          <Sparkles size={20} />
          Start Personalized Evaluation
        </Link>
        <Link href="/shop" className="border border-ink/30 text-ink px-8 py-4 rounded-sm text-lg hover:bg-ink/5 transition-colors inline-flex items-center justify-center gap-2">
          <ShoppingBag size={20} />
          Browse Feng Shui Bracelets
        </Link>
      </div>
      <p className="text-xs text-ink/40 mt-6 max-w-lg mx-auto leading-relaxed">
        Remember: Feng Shui is not superstition &mdash; it is the ancient wisdom of
        &ldquo;environmental psychology&rdquo; and &ldquo;space energy management.&rdquo;
        The best Feng Shui is a space where you feel comfortable, at peace, and energized.
        Don&rsquo;t overthink it &mdash; let theory guide, not govern.
      </p>
    </div>
  </section>
)

// ========== Footer ==========
const Footer = () => (
  <footer className="bg-ink text-rice/60 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <svg width="24" height="24" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="98" fill="#1a1a1a" stroke="#c9a227" strokeWidth="2" />
              <path d="M100,2 A49,49 0 0,1 100,98 A49,49 0 0,0 100,198 A98,98 0 0,1 100,2" fill="#f5f0e8" />
              <circle cx="100" cy="50" r="15" fill="#1a1a1a" />
              <circle cx="100" cy="150" r="15" fill="#f5f0e8" />
            </svg>
            <span className="text-rice font-serif text-lg font-bold">TaoMagic</span>
          </div>
          <p className="text-sm leading-relaxed">Bridging 5,000 years of Chinese wisdom with modern seekers worldwide.</p>
        </div>
        <div>
          <h4 className="text-rice font-medium mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/wisdom" className="hover:text-gold transition-colors">Yi Jing Wisdom</Link></li>
            <li><Link href="/iching" className="hover:text-gold transition-colors">I Ching Guidance</Link></li>
            <li><Link href="/shop" className="hover:text-gold transition-colors">Feng Shui Store</Link></li>
            <li><Link href="/fengshui" className="hover:text-gold transition-colors">Indoor Feng Shui</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-rice font-medium mb-4">Guides</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide" className="hover:text-gold transition-colors">I Ching Coin Guide</Link></li>
            <li><Link href="/fengshui/guide" className="hover:text-gold transition-colors">Ba Zhai Feng Shui Guide</Link></li>
            <li><Link href="/iching" className="hover:text-gold transition-colors">Free AI Reading</Link></li>
            <li><Link href="/shop" className="hover:text-gold transition-colors">Feng Shui Objects</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-rice font-medium mb-4">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gold transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Shipping &amp; Returns</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rice/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">2026 TaoMagic. All rights reserved.</p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
)

// ========== Page ==========
export default function FengShuiGuidePage() {
  return (
    <div className="min-h-screen bg-rice">
      <Navigation solid />

      {/* ===== Hero ===== */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-ink pt-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bronze rounded-full blur-3xl" />
        </div>
        {/* Bagua decorative overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-8xl text-gold">☰</div>
          <div className="absolute top-10 right-10 text-8xl text-gold">☷</div>
          <div className="absolute bottom-10 left-10 text-8xl text-gold">☵</div>
          <div className="absolute bottom-10 right-10 text-8xl text-gold">☲</div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <Compass size={64} className="text-gold" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-rice mb-2 leading-tight">
            Free Ba Zhai Feng Shui Guidance
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif text-gold/80 mb-4">
            Analyze Your Home&#39;s Lucky Directions
          </h2>
          <p className="text-xl text-rice/70 max-w-3xl mx-auto mb-8">
            Calculate your home&rsquo;s Ba Zhai (Eight Mansions) feng shui directions for free. Get personalized analysis of wealth, health, love, and career sectors with remedies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fengshui" className="bg-cinnabar text-rice px-8 py-4 rounded-sm text-lg hover:bg-cinnabar/80 transition-all flex items-center justify-center gap-2">
              <Play size={20} />
              Start Free Calculator
            </Link>
            <a href="#what-is-ba-zhai" className="border border-rice/30 text-rice px-8 py-4 rounded-sm text-lg hover:bg-rice/10 transition-all flex items-center justify-center gap-2">
              <BookOpen size={20} />
              Read Full Guide
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-4 gap-4 max-w-lg mx-auto">
            {[
              { num: '5', label: 'Steps' },
              { num: '8', label: 'Directions' },
              { num: '8', label: 'Trigrams' },
              { num: '5', label: 'Elements' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-serif text-gold">{stat.num}</div>
                <div className="text-sm text-rice/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== What is Ba Zhai ===== */}
      <WhatIsBaZhai />

      {/* ===== Preparation ===== */}
      <Preparation />

      {/* ===== Step 1: Ming Gua ===== */}
      <div id="step-1">
        <Step1_MingGua />
      </div>

      {/* ===== Step 2: House Direction ===== */}
      <div id="step-2">
        <Step2_HouseDirection />
      </div>

      {/* ===== Step 3: Room Layout ===== */}
      <Step3_RoomLayout />

      {/* ===== Step 4: Results ===== */}
      <Step4_Results />

      {/* ===== Step 5: Remedies ===== */}
      <Step5_Remedies />

      {/* ===== FAQ ===== */}
      <FAQ />

      {/* ===== CTA ===== */}
      <CTA />

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  )
}
