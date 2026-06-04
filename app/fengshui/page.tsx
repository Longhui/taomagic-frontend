'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, ChevronRight, Check, RotateCcw, ShoppingBag, Info, Home, Compass, Users, BookOpen, Star, Mail } from 'lucide-react'
import Navigation from '@/app/components/Navigation'
import {
  calcMingGua, getDirectionFortunes, roomDiagnosis,
  getBraceletRecommendations, getHouseGroup,
  type Gender, type Direction, type RoomType, type RoomAssignment,
  formatDate, directionToLabel, calcOverallScore, getScoreLevel,
  ROOM_NAMES, gridCellToDirection,
} from '../lib/fengshui'

// Yin Yang SVG
const YinYangSVG = ({ size = 200, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className={`yin-yang-rotate ${className}`}>
    <circle cx="100" cy="100" r="98" fill="#1a1a1a" stroke="#c9a227" strokeWidth="2"/>
    <path d="M100,2 A49,49 0 0,1 100,98 A49,49 0 0,0 100,198 A98,98 0 0,1 100,2" fill="#f5f0e8"/>
    <circle cx="100" cy="50" r="15" fill="#1a1a1a"/>
    <circle cx="100" cy="150" r="15" fill="#f5f0e8"/>
  </svg>
)

// ========== Constants ==========
const ROOM_ICONS: Record<RoomType, string> = {
  'bedroom': '🛏️', 'master-bedroom': '👑', 'livingroom': '🛋️',
  'kitchen': '🍳', 'bathroom': '🚿', 'study': '📚',
  'dining': '🍽️', 'storage': '📦', 'empty': '⬜',
}

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

const ALL_ROOM_TYPES: { type: RoomType; label: string; icon: string }[] = [
  { type: 'bedroom', label: 'Bedroom', icon: '🛏️' },
  { type: 'master-bedroom', label: 'Master BD', icon: '👑' },
  { type: 'livingroom', label: 'Living Room', icon: '🛋️' },
  { type: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { type: 'bathroom', label: 'Bathroom', icon: '🚿' },
  { type: 'study', label: 'Study', icon: '📚' },
  { type: 'dining', label: 'Dining', icon: '🍽️' },
  { type: 'storage', label: 'Storage', icon: '📦' },
]

// ========== StepIndicator ==========
const StepIndicator = ({ current }: { current: number }) => {
  const steps = [
    { num: 1, label: 'Profile', desc: 'Personal Info' },
    { num: 2, label: 'House', desc: 'Layout Setup' },
    { num: 3, label: 'Analysis', desc: 'Feng Shui Report' },
    { num: 4, label: 'Remedy', desc: 'Recommendations' },
  ]
  return (
    <div className="flex items-center justify-center gap-0 max-w-2xl mx-auto mb-8">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
              ${current === s.num ? 'bg-cinnabar text-rice ring-4 ring-cinnabar/20 scale-110' :
                current > s.num ? 'bg-bronze text-rice' : 'bg-ink/10 text-ink/40'}`}>
              {current > s.num ? <Check size={18} /> : s.num}
            </div>
            <span className={`text-xs mt-1.5 font-medium ${current === s.num ? 'text-cinnabar' : current > s.num ? 'text-bronze' : 'text-ink/40'}`}>
              {s.label}
            </span>
            <span className="text-[10px] text-ink/30">{s.desc}</span>
          </div>
          {i < 3 && (
            <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${current > s.num ? 'bg-bronze' : 'bg-ink/10'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ========== Compass ==========
const CompassSelector = ({
  selected,
  onSelect,
}: {
  selected: Direction | null
  onSelect: (d: Direction) => void
}) => {
  return (
    <div className="relative w-72 h-72 mx-auto">
      <svg viewBox="0 0 240 240" className="w-full h-full">
        <circle cx="120" cy="120" r="115" fill="none" stroke="#4a6741" strokeWidth="1.5" className="opacity-30" />
        <circle cx="120" cy="120" r="108" fill="none" stroke="#4a6741" strokeWidth="0.5" className="opacity-20" />

        {COMPASS_DIRS.map((d) => {
          const rad = (d.angle - 90) * Math.PI / 180
          const r = 80
          const x = 120 + r * Math.cos(rad)
          const y = 120 + r * Math.sin(rad)
          const isSelected = selected === d.dir
          return (
            <g key={d.dir} onClick={() => onSelect(d.dir)} className="cursor-pointer">
              {isSelected && (
                <circle cx={x} cy={y} r="14" fill="#c41e3a" opacity="0.15" />
              )}
              <text x={x} y={y}
                textAnchor="middle" dominantBaseline="central"
                fontSize="14" fontWeight={isSelected ? 'bold' : 'normal'}
                fill={isSelected ? '#c41e3a' : '#1a1a1a'}
                className="select-none"
              >
                {d.label}
              </text>
            </g>
          )
        })}

        <line x1="120" y1="20" x2="120" y2="220" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.15" />
        <line x1="20" y1="120" x2="220" y2="120" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.15" />

        <text x="120" y="105" textAnchor="middle" fontSize="11" fill="#4a6741" fontWeight="600" className="select-none">Ba Zhai</text>
        <text x="120" y="125" textAnchor="middle" fontSize="9" fill="#4a6741" className="opacity-60 select-none">Feng Shui</text>

        <text x="120" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c41e3a" className="select-none">S</text>
        <text x="120" y="228" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a1a1a" className="select-none">N</text>
        <text x="14" y="120" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a1a1a" className="select-none">W</text>
        <text x="226" y="120" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a1a1a" className="select-none">E</text>
      </svg>
    </div>
  )
}

// ========== RoomGrid ==========
const RoomGrid = ({
  rooms,
  setRooms,
}: {
  rooms: RoomAssignment[]
  setRooms: (r: RoomAssignment[]) => void
}) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('bedroom')

  const getCellRoom = (row: number, col: number): RoomAssignment | undefined =>
    rooms.find(r => r.pos.row === row && r.pos.col === col)

  const handleCellClick = (row: number, col: number) => {
    const existing = getCellRoom(row, col)
    if (existing && existing.room === selectedRoom) {
      setRooms(rooms.filter(r => !(r.pos.row === row && r.pos.col === col)))
    } else {
      setRooms([
        ...rooms.filter(r => !(r.pos.row === row && r.pos.col === col)),
        { pos: { row, col }, room: selectedRoom },
      ])
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {ALL_ROOM_TYPES.map(rt => (
          <button
            key={rt.type}
            onClick={() => setSelectedRoom(rt.type)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm transition-all
              ${selectedRoom === rt.type
                ? 'bg-cinnabar text-rice shadow-sm'
                : 'bg-white border border-ink/20 text-ink/70 hover:border-cinnabar/50'}`}
          >
            <span>{rt.icon}</span>
            <span>{rt.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {[0, 1, 2].map(row =>
          [2, 1, 0].map(col => {
            const cell = getCellRoom(row, col)
            return (
              <button
                key={`${row}-${col}`}
                onClick={() => handleCellClick(row, col)}
                className={`aspect-square rounded-sm border-2 flex flex-col items-center justify-center text-sm transition-all
                  ${cell
                    ? 'bg-bronze/10 border-bronze shadow-sm'
                    : 'bg-white border-ink/10 hover:border-bronze/50 hover:bg-bronze/5'}`}
              >
                {cell ? (
                  <>
                    <span className="text-lg">{ROOM_ICONS[cell.room]}</span>
                    <span className="text-[10px] mt-0.5 text-ink/60">{ROOM_NAMES[cell.room]}</span>
                  </>
                ) : (
                  <span className="text-ink/20 text-lg">+</span>
                )}
              </button>
            )
          })
        )}
      </div>

      <div className="flex justify-between text-xs text-ink/40 mt-2 max-w-xs mx-auto px-2">
        <span>W</span>
        <span className="text-cinnabar/60">S (Facing)</span>
        <span>E</span>
      </div>
      <p className="text-xs text-ink/40 text-center mt-1">North at top, South at bottom · Click cells to place rooms</p>
    </div>
  )
}

// ========== FortuneChart ==========
const FortuneChart = ({ directions }: { directions: ReturnType<typeof getDirectionFortunes> }) => {
  const cols = [
    { title: '4 Auspicious Sectors', items: directions.slice(0, 4) },
    { title: '4 Inauspicious Sectors', items: directions.slice(4, 8) },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {cols.map(col => (
        <div key={col.title}>
          <h4 className="text-sm font-medium text-ink/60 mb-3 text-center">{col.title}</h4>
          <div className="space-y-2">
            {col.items.map(f => (
              <div key={f.direction} className={`p-3 rounded-sm border text-sm ${f.color}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{f.directionLabel} · {f.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/60">{f.typeLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ========== Page Component ==========
export default function FengShuiPage() {
  const [step, setStep] = useState(1)
  const [gender, setGender] = useState<Gender | null>(null)
  const [birthYear, setBirthYear] = useState<string>('')
  const [birthMonth, setBirthMonth] = useState<string>('')
  const [birthDay, setBirthDay] = useState<string>('')
  const [houseDirection, setHouseDirection] = useState<Direction | null>(null)
  const [rooms, setRooms] = useState<RoomAssignment[]>([])
  const [cart, setCart] = useState<string[]>([])

  const fengshuiData = useMemo(() => {
    if (!gender || !birthYear || !birthMonth || !birthDay || !houseDirection) return null
    const year = parseInt(birthYear)
    const month = parseInt(birthMonth)
    const day = parseInt(birthDay)
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null

    const mingGua = calcMingGua(year, month, day, gender)
    const fortunes = getDirectionFortunes(mingGua.number)
    const houseGroup = getHouseGroup(houseDirection)
    const houseMatch = mingGua.group === houseGroup
    const diagnoses = roomDiagnosis(rooms, mingGua.number)
    const overallScore = calcOverallScore(diagnoses)
    const scoreLevel = getScoreLevel(overallScore)
    const bracelets = getBraceletRecommendations(diagnoses, mingGua)

    return { mingGua, fortunes, houseGroup, houseMatch, diagnoses, overallScore, scoreLevel, bracelets, year, month, day }
  }, [gender, birthYear, birthMonth, birthDay, houseDirection, rooms])

  const canProceedStep1 = gender && birthYear && birthMonth && birthDay
  const canProceedStep2 = houseDirection && rooms.length >= 2

  // ========== Hero ==========
  const renderHero = () => (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-ink pt-16">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cinnabar rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 flex justify-center">
          <Compass size={64} className="text-gold" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-rice mb-4 leading-tight">
          Indoor <span className="text-gold">Feng Shui</span> Evaluation
        </h1>
        <p className="text-lg md:text-xl text-rice/70 max-w-2xl mx-auto mb-8 leading-relaxed">
          Enter your information and get a professional indoor Feng Shui analysis in 3 minutes. Discover your Ming Gua, evaluate your living space, and receive personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => document.getElementById('step-1-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-cinnabar text-rice px-8 py-4 rounded-sm text-lg hover:bg-cinnabar/80 transition-all flex items-center justify-center gap-2">
            <Home size={20} />
            Start Evaluation
          </button>
          <Link href="/fengshui/guide" className="border border-rice/30 text-rice px-8 py-4 rounded-sm text-lg hover:bg-rice/10 transition-all flex items-center justify-center gap-2">
            <BookOpen size={20} />
            Read the Guide
          </Link>
          <Link href="/shop" className="border border-rice/30 text-rice px-8 py-4 rounded-sm text-lg hover:bg-rice/10 transition-all flex items-center justify-center gap-2">
            <ShoppingBag size={20} />
            Shop Bracelets
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { num: '8', label: 'Directions' },
            { num: '8', label: 'Mansions' },
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
  )

  // ========== Step 1: Profile ==========
  const renderStep1 = () => (
    <div id="step-1-form" className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg border border-ink/10 p-8 shadow-sm">
        <div className="text-center mb-6">
          <Users size={40} className="text-bronze mx-auto mb-3" />
          <h2 className="text-2xl font-serif text-ink mb-1">Step 1: Your Profile</h2>
          <p className="text-sm text-ink/50">Enter your birth details to calculate your Ming Gua (life trigram)</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-ink mb-3">Gender</label>
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

        <div className="space-y-4 mb-8">
          <label className="block text-sm font-medium text-ink">Date of Birth</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <select
                value={birthYear}
                onChange={e => setBirthYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-sm border border-ink/20 text-sm focus:outline-none focus:border-bronze bg-white"
              >
                <option value="">Year</option>
                {Array.from({ length: 77 }, (_, i) => 2026 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
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
            </div>
            <div>
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
          </div>
          <p className="text-xs text-ink/40">The system automatically adjusts the year based on Spring Begins (Feb 4)</p>
        </div>

        <div className="mb-6 p-3 bg-bronze/5 rounded-sm border border-bronze/20 text-xs text-bronze">
          <Link href="/fengshui/guide#step-1" className="flex items-center gap-1.5 hover:underline">
            <BookOpen size={14} />
            New to Ba Zhai? Learn how Ming Gua is calculated in our complete guide →
          </Link>
        </div>

        <button
          onClick={() => setStep(2)}
          disabled={!canProceedStep1}
          className={`w-full py-3 rounded-sm text-base font-medium flex items-center justify-center gap-2 transition-all
            ${canProceedStep1
              ? 'bg-bronze text-rice hover:bg-bronze/80 cursor-pointer'
              : 'bg-ink/10 text-ink/30 cursor-not-allowed'}`}
        >
          Next: House Info <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )

  // ========== Step 2: House ==========
  const renderStep2 = () => (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg border border-ink/10 p-8 shadow-sm mb-6">
        <div className="text-center mb-6">
          <Home size={40} className="text-bronze mx-auto mb-3" />
          <h2 className="text-2xl font-serif text-ink mb-1">Step 2: Your House</h2>
          <p className="text-sm text-ink/50">Select the facing direction and arrange your room layout</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-ink mb-3 text-center">House Facing Direction</label>
          <CompassSelector selected={houseDirection} onSelect={setHouseDirection} />
          {houseDirection && (
            <p className="text-center text-sm text-bronze mt-2">
              Selected: {directionToLabel(houseDirection)}-facing
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-ink/10 p-8 shadow-sm mb-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-serif text-ink mb-1">Room Layout</h3>
          <p className="text-sm text-ink/50">Pick a room type below, then click cells to place them</p>
        </div>
        <RoomGrid rooms={rooms} setRooms={setRooms} />
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-sm border border-ink/20 text-ink/70 hover:bg-ink/5 transition-colors text-sm">
          Previous
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!canProceedStep2}
          className={`flex-1 py-3 rounded-sm text-sm font-medium flex items-center justify-center gap-2 transition-all
            ${canProceedStep2
              ? 'bg-bronze text-rice hover:bg-bronze/80 cursor-pointer'
              : 'bg-ink/10 text-ink/30 cursor-not-allowed'}`}
        >
          Start Analysis <Sparkles size={16} />
        </button>
      </div>
    </div>
  )

  // ========== Step 3: Analysis ==========
  const renderStep3 = () => {
    if (!fengshuiData) return null
    const { mingGua, fortunes, houseGroup, houseMatch, diagnoses, overallScore, scoreLevel } = fengshuiData

    return (
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-ink to-ink/90 rounded-lg p-8 text-rice mb-6 border border-gold/20">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center md:text-left">
              <div className="text-4xl font-serif text-gold mb-2">{mingGua.trigram}</div>
              <h2 className="text-xl font-serif mb-1">{mingGua.description}</h2>
              <div className="flex items-center gap-2 text-sm text-rice/60 mt-2">
                <span>DOB: {formatDate(fengshuiData.year, fengshuiData.month, fengshuiData.day)}</span>
                <span>·</span>
                <span>{gender === 'male' ? 'Male' : 'Female'}</span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-rice/5 border border-rice/10">
                <span className="text-sm text-rice/60">House:</span>
                <span className={`font-medium ${houseMatch ? 'text-green-400' : 'text-cinnabar'}`}>
                  {houseGroup === 'east' ? 'East House Group' : 'West House Group'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${houseMatch ? 'bg-green-500/20 text-green-400' : 'bg-cinnabar/20 text-cinnabar'}`}>
                  {houseMatch ? '✓ High Match' : '✗ Mismatch'}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold">{scoreLevel.emoji} {overallScore}</div>
                <div className={`text-sm ${scoreLevel.color}`}>{scoreLevel.label}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fortune chart */}
        <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm mb-6">
          <h3 className="text-lg font-serif text-ink mb-4 text-center">Direction Fortune (Ba Zhai)</h3>
          <FortuneChart directions={fortunes} />
        </div>

        {/* Diagnosis */}
        {diagnoses.length > 0 && (
          <div className="bg-white rounded-lg border border-ink/10 p-6 shadow-sm mb-6">
            <h3 className="text-lg font-serif text-ink mb-4 text-center">Room Diagnosis</h3>
            <div className="space-y-3">
              {diagnoses.map((d, i) => (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-sm border
                  ${d.verdict === 'good' ? 'bg-green-50 border-green-200' :
                    d.verdict === 'warning' ? 'bg-orange-50 border-orange-200' :
                    'bg-red-50 border-red-200'}`}>
                  <span className="text-lg mt-0.5">
                    {d.verdict === 'good' ? '✅' : d.verdict === 'warning' ? '⚠️' : '❌'}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{ROOM_NAMES[d.item.room]}</span>
                      <span className="text-xs text-ink/40">{directionToLabel(d.direction)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${d.fortune.color}`}>
                        {d.fortune.name}
                      </span>
                    </div>
                    <p className="text-sm text-ink/70">{d.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advice */}
        <div className="bg-bronze/5 rounded-lg p-6 border border-bronze/20 mb-6">
          <h3 className="font-serif text-ink mb-3 flex items-center gap-2">
            <Info size={20} className="text-bronze" />
            Personalized Advice
          </h3>
          <div className="space-y-2 text-sm text-ink/70">
            {mingGua.group === 'east' ? (
              <>
                <p>• You belong to the East Life Group. East-facing houses (S, N, E, SE) are most compatible.</p>
                <p>• Position your bed to face the Sheng Qi or Tian Yi direction for beneficial energy.</p>
                <p>• Place your study in the Yan Nian sector ({fortunes[2].directionLabel}) to enhance career luck.</p>
                <p>• Your wealth sector is Sheng Qi ({fortunes[0].directionLabel}) — place plants or crystals there.</p>
              </>
            ) : (
              <>
                <p>• You belong to the West Life Group. West-facing houses (W, SW, NW, NE) are most compatible.</p>
                <p>• Position your bedroom in Fu Wei or Tian Yi ({fortunes[3].directionLabel} or {fortunes[1].directionLabel}).</p>
                <p>• Place your main door in the Yan Nian sector ({fortunes[2].directionLabel}) for family harmony.</p>
                <p>• Bathrooms and storage are best placed in inauspicious sectors to suppress negative energy.</p>
              </>
            )}
            {!houseMatch && (
              <p className="text-cinnabar font-medium mt-2">
                ⚠️ Your Ming Gua and house are not a natural match. Feng Shui remedies and crystals can help balance the energy.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-sm border border-ink/20 text-ink/70 hover:bg-ink/5 transition-colors text-sm">
            Previous
          </button>
          <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-sm bg-cinnabar text-rice hover:bg-cinnabar/80 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            View Remedies <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  // ========== Step 4: Remedies ==========
  const renderStep4 = () => {
    if (!fengshuiData) return null
    const { overallScore, scoreLevel, diagnoses, bracelets } = fengshuiData

    const badCount = diagnoses.filter(d => d.verdict === 'bad').length
    const warnCount = diagnoses.filter(d => d.verdict === 'warning').length
    const goodCount = diagnoses.filter(d => d.verdict === 'good').length

    const getCoreNeeds = () => {
      const needs: string[] = []
      if (badCount >= 2) needs.push('Neutralize negative energy')
      if (warnCount >= 2) needs.push('Stabilize aura')
      if (diagnoses.some(d => d.item.room === 'bedroom' && d.verdict === 'bad')) needs.push('Improve sleep quality')
      if (diagnoses.some(d => d.item.room === 'kitchen' && d.verdict === 'bad')) needs.push('Calm fire energy')
      if (goodCount >= 3) needs.push('Enhance auspicious sectors')
      if (needs.length === 0) needs.push('Boost overall fortune')
      return needs
    }

    const coreNeeds = getCoreNeeds()
    const toggleCart = (id: string) => {
      setCart(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    return (
      <div className="max-w-4xl mx-auto">
        {/* Core needs */}
        <div className="bg-gradient-to-br from-bronze/10 to-bronze/5 rounded-lg p-8 border border-bronze/30 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-bronze text-rice flex items-center justify-center text-2xl">🎯</div>
            <div>
              <h2 className="text-2xl font-serif text-ink">Your Personalized Remedy Plan</h2>
              <p className="text-sm text-ink/50">Based on your indoor Feng Shui analysis</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-sm p-6">
            <p className="text-sm font-medium text-ink mb-3">Core Needs:</p>
            <div className="flex flex-wrap gap-2">
              {coreNeeds.map((need, i) => (
                <span key={i} className="px-3 py-1 bg-bronze/10 text-bronze rounded-sm text-sm border border-bronze/20">
                  {need}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink/50">
              <span>Overall Score:</span>
              <span className={`text-lg font-bold ${scoreLevel.color}`}>{overallScore}</span>
              <span className={scoreLevel.color}>({scoreLevel.label})</span>
            </div>
          </div>
        </div>

        {/* Bracelet recommendations */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <ShoppingBag size={40} className="text-cinnabar mx-auto mb-3" />
            <h3 className="text-2xl font-serif text-ink">Recommended Bracelets</h3>
            <p className="text-ink/60">Feng Shui bracelets tailored to your evaluation results</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {bracelets.map((b, i) => {
              const inCart = cart.includes(b.id)
              return (
                <div key={b.id} className={`group relative bg-white rounded-lg border-2 p-6 transition-all duration-300 hover:-translate-y-1 ${inCart ? 'border-cinnabar bg-cinnabar/5 shadow-md' : 'border-ink/10 hover:shadow-xl hover:border-bronze/30'}`}>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gold text-ink flex items-center justify-center text-sm font-bold shadow-md">
                    {i + 1}
                  </div>

                  <div className="w-full aspect-square bg-gradient-to-br from-ink/5 to-ink/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-5xl">
                      {b.id === 'obsidian' ? '⚫' :
                       b.id === 'green-ghost' ? '🟢' :
                       b.id === 'citrine' ? '🟡' :
                       b.id === 'rose-quartz' ? '🩷' :
                       b.id === 'red-agate' ? '🔴' :
                       b.id === 'multi-bead' ? '💎' :
                       b.id === 'golden-citrine' ? '✨' :
                       b.id === 'moonstone' ? '🌙' : '📿'}
                    </span>
                  </div>

                  <h4 className="font-medium text-ink">{b.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-ink/40">{b.material}</span>
                    <span className="text-xs px-2 py-0.5 bg-ink/5 rounded-sm">{b.element}</span>
                  </div>
                  <p className="text-xl font-bold text-cinnabar mt-2">¥{b.price}</p>

                  <p className="text-xs text-ink/60 mt-3 leading-relaxed">{b.matchReason}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {b.benefits.slice(0, 2).map(ben => (
                      <span key={ben} className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded-sm">
                        {ben}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => toggleCart(b.id)}
                    className={`w-full mt-4 py-2.5 rounded-sm text-sm font-medium transition-all
                      ${inCart
                        ? 'bg-cinnabar text-rice'
                        : 'bg-bronze text-rice hover:bg-bronze/80'}`}
                  >
                    {inCart ? '✓ Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Wearing guide */}
        <div className="bg-ink rounded-lg p-8 mb-8">
          <h3 className="font-serif text-xl text-rice mb-6 flex items-center gap-2">
            <Info size={24} className="text-gold" />
            Wearing Guide
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-rice/5 rounded-lg p-6 text-center">
              <span className="text-3xl block mb-3">📿</span>
              <p className="text-rice font-medium">Wear on left wrist</p>
              <p className="text-xs text-rice/40 mt-1">Receives energy, attracts fortune</p>
            </div>
            <div className="bg-rice/5 rounded-lg p-6 text-center">
              <span className="text-3xl block mb-3">🌙</span>
              <p className="text-rice font-medium">Remove at night</p>
              <p className="text-xs text-rice/40 mt-1">Place by the bedside to purify</p>
            </div>
            <div className="bg-rice/5 rounded-lg p-6 text-center">
              <span className="text-3xl block mb-3">💧</span>
              <p className="text-rice font-medium">Cleanse monthly</p>
              <p className="text-xs text-rice/40 mt-1">Rinse with clean water and dry</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => { setStep(1); setGender(null); setBirthYear(''); setBirthMonth(''); setBirthDay(''); setHouseDirection(null); setRooms([]); setCart([]) }}
            className="flex-1 py-4 rounded-sm border border-ink/20 text-ink/70 hover:bg-ink/5 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Start Over
          </button>
          <Link
            href="/shop"
            className="flex-1 py-4 rounded-sm bg-cinnabar text-rice hover:bg-cinnabar/80 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Visit Shop {cart.length > 0 && `(${cart.length})`}
          </Link>
        </div>
      </div>
    )
  }

  // ========== Main Render ==========
  return (
    <main className="min-h-screen bg-rice">
      <Navigation />

      {step === 1 && renderHero()}

      {/* Main content area */}
      <section className={`${step === 1 ? 'py-16' : 'py-24'} bg-rice`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepIndicator current={step} />

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-rice/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <YinYangSVG size={24} />
                <span className="text-rice font-serif text-lg font-bold">TaoInsight</span>
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
              <h4 className="text-rice font-medium mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/iching" className="hover:text-gold transition-colors">Free AI Reading</Link></li>
                <li><Link href="/iching/analysis" className="hover:text-gold transition-colors">Master Consultation</Link></li>
                <li><Link href="/fengshui" className="hover:text-gold transition-colors">Space Analysis</Link></li>
                <li><Link href="/shop" className="hover:text-gold transition-colors">Feng Shui Objects</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-rice font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-gold transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Shipping & Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-rice/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2024 TaoInsight. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
