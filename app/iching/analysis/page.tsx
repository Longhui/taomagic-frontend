'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { ArrowLeft, Sparkles, BookOpen, Check, AlertCircle, RotateCcw, Download } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'

interface StoredData {
  hexagram: { name: string; chinese: string; trigrams: string; meaning: string; num: number }
  question: string
  lines: number[]
  prompt?: string
  analysis?: string
  status: 'loading' | 'complete' | 'error'
  errorMessage?: string
  date: string
}

const FETCH_TIMEOUT_MS = 60000

function formatInline(s: string) {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-[#3d2314]">{part.slice(2, -2)}</strong>
      : part
  )
}

function formatAnalysis(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const out: React.ReactNode[] = []
  let items: string[] = []
  const flush = () => {
    if (!items.length) return
    out.push(<ul key={`ul-${out.length}`} className="space-y-1 mb-4">{items.map((s, i) => (
      <li key={i} className="flex items-start gap-2 text-[22px] text-[#3d2314]"><span className="text-[#8b4513] mt-2 shrink-0">•</span><span>{formatInline(s)}</span></li>
    ))}</ul>)
    items = []
  }
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    if (!t) { flush(); continue }
    if (/^[-*_]{3,}$/.test(t)) { flush(); out.push(<hr key={`hr-${i}`} className="my-6 border-[rgba(139,90,43,0.2)]" />); continue }
    if (t.startsWith('### ')) { flush(); out.push(<h4 key={`h4-${i}`} className="font-caveat text-2xl text-[#3d2314] mt-6 mb-2 font-semibold">{t.replace('### ', '')}</h4>); continue }
    if (t.startsWith('## ')) { flush(); out.push(<h3 key={`h3-${i}`} className="font-caveat text-3xl text-[#3d2314] mt-8 mb-3 font-semibold">{t.replace('## ', '')}</h3>); continue }
    if (t.startsWith('# ')) { flush(); out.push(<h2 key={`h2-${i}`} className="font-caveat text-3xl text-[#3d2314] mt-8 mb-4 font-semibold">{t.replace('# ', '')}</h2>); continue }
    if (t.startsWith('- ') || t.startsWith('* ')) { items.push(t.replace(/^[-*]\s+/, '')); continue }
    if (/^\d+[\.\)]\s/.test(t)) {
      flush()
      const num = t.match(/^\d+/)?.[0]
      out.push(<p key={`p-${i}`} className="text-[22px] text-[#3d2314] mb-2 ml-2"><span className="font-semibold text-[#3d2314] mr-1">{num}.</span>{formatInline(t.replace(/^\d+[\.\)]\s*/, ''))}</p>)
      continue
    }
    flush()
    out.push(<p key={`p-${i}`} className="text-[22px] text-[#3d2314] mb-3 leading-relaxed" style={{ textIndent: '1.5em' }}>{formatInline(t)}</p>)
  }
  flush()
  return out
}

const candleGradient = {
  backgroundColor: '#0a0806',
  backgroundImage: `
    radial-gradient(ellipse at 30% 20%, rgba(139, 90, 43, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(139, 90, 43, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(218, 165, 32, 0.03) 0%, transparent 70%)
  `,
}

export default function AnalysisPage() {
  const router = useRouter()
  const [data, setData] = useState<StoredData | null>(null)
  const [progress, setProgress] = useState(10)
  const [fetching, setFetching] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  const doFetch = useCallback(async (parsed: StoredData) => {
    // Cancel any previous request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setFetching(true)
    setProgress(15)

    const timer1 = setTimeout(() => setProgress(40), 2000)
    const timer2 = setTimeout(() => setProgress(65), 5000)
    const timer3 = setTimeout(() => setProgress(85), 10000)
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      const resp = await fetch('/api/iching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: parsed.prompt, question: parsed.question }),
        signal: controller.signal,
      })
      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}))
        throw new Error(errBody?.error || `Server error (HTTP ${resp.status})`)
      }
      const result = await resp.json()
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timeoutId)
      if (!mountedRef.current) return
      setProgress(100)
      const updated: StoredData = {
        hexagram: parsed.hexagram, question: parsed.question, lines: parsed.lines,
        analysis: result.analysis || '', status: 'complete', date: parsed.date,
      }
      localStorage.setItem('master_consultation', JSON.stringify(updated))
      setData(updated)
    } catch (e: any) {
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timeoutId)
      if (!mountedRef.current) return
      const message = e?.name === 'AbortError'
        ? 'The consultation request timed out. Please try again.'
        : e?.message || 'An unknown error occurred.'
      const updated: StoredData = { ...parsed, status: 'error', errorMessage: message }
      localStorage.setItem('master_consultation', JSON.stringify(updated))
      setData(updated)
    }
    setFetching(false)
    abortRef.current = null
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('master_consultation')
      if (!raw) { router.replace('/iching'); return }
      const parsed: StoredData = JSON.parse(raw)
      setData(parsed)
      if (parsed.status === 'loading') doFetch(parsed)
    } catch { router.replace('/iching') }
  }, []) // eslint-disable-line

  // =========== Loading ===========
  if (data?.status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0806] pt-16 flex items-center justify-center">
        <Navigation />
        <div className="max-w-sm mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#d4a574]/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} className="text-[#d4a574]" />
          </div>
          <h2 className="text-2xl font-serif text-[#d4a574] mb-2" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>Master Consultation</h2>
          <p className="text-[#c9a070]/60 text-sm mb-8 truncate max-w-xs">&ldquo;{data.question}&rdquo;</p>
          <div className="mb-2 flex justify-between text-sm text-[#c9a070]/50">
            <span>Consulting the I Ching...</span>
            <span>{Math.min(Math.round(progress), 99)}%</span>
          </div>
          <div className="h-2.5 bg-[#c9a070]/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#8b4513] to-[#d4a574] rounded-full transition-all duration-700" style={{ width: `${Math.min(progress, 99)}%` }} />
          </div>
          <p className="text-xs text-[#c9a070]/40 mt-3">
            {progress < 35 ? 'Connecting to I Ching master...' : progress < 60 ? 'Analyzing hexagram structure...' : progress < 80 ? 'Interpreting line relationships...' : 'Finalizing the reading...'}
          </p>
          {fetching && progress > 90 && (
            <p className="text-xs text-[#c9a070]/30 mt-2">Still processing... this may take a moment</p>
          )}
        </div>
      </div>
    )
  }

  // =========== Error ===========
  if (data?.status === 'error') {
    return (
      <div className="min-h-screen bg-[#0a0806] pt-16 flex items-center justify-center">
        <Navigation />
        <div className="max-w-sm mx-auto px-4 text-center">
          <AlertCircle size={40} className="text-[#c41e3a] mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-[#d4a574] mb-2" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>Consultation Unavailable</h2>
          <p className="text-[#c9a070]/80 text-sm mb-2">The consultation service encountered an error.</p>
          {data.errorMessage && (
            <p className="text-[#c9a070]/40 text-xs mb-6 italic">{data.errorMessage}</p>
          )}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => {
                const updated = { ...data, status: 'loading' as const, errorMessage: undefined }
                localStorage.setItem('master_consultation', JSON.stringify(updated))
                setData(updated)
                doFetch(updated)
              }}
              className="bg-[#d4a574] text-[#0a0806] px-6 py-3 rounded-sm hover:bg-[#d4a574]/80 transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw size={16} /> Retry Consultation
            </button>
            <Link href="/iching" className="text-sm text-[#c9a070]/50 hover:text-[#d4a574] transition-colors">
              Back to I Ching
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // =========== Complete — Parchment Scroll Design ===========
  if (data?.status === 'complete') {
    const lines = data.lines as (6 | 7 | 8 | 9)[]
    const isYang = (v: number) => v === 7 || v === 9
    const isChanging = (v: number) => v === 6 || v === 9

    return (
      <div className="min-h-screen pt-16 relative overflow-x-hidden" style={candleGradient}>
        <Navigation />
        {/* Floating dust particles */}
        <div className="fixed w-[2px] h-[2px] bg-[rgba(218,165,32,0.3)] rounded-full pointer-events-none z-[2]" style={{ top: '10%', left: '20%', animation: 'float 15s infinite ease-in-out' }} />
        <div className="fixed w-[2px] h-[2px] bg-[rgba(218,165,32,0.3)] rounded-full pointer-events-none z-[2]" style={{ top: '30%', left: '70%', animation: 'float 15s infinite ease-in-out 3s' }} />
        <div className="fixed w-[2px] h-[2px] bg-[rgba(218,165,32,0.3)] rounded-full pointer-events-none z-[2]" style={{ top: '60%', left: '40%', animation: 'float 15s infinite ease-in-out 7s' }} />
        <div className="fixed w-[2px] h-[2px] bg-[rgba(218,165,32,0.3)] rounded-full pointer-events-none z-[2]" style={{ top: '80%', left: '80%', animation: 'float 15s infinite ease-in-out 11s' }} />

        <div className="relative z-10 flex justify-center py-16 px-4">
          {/* SVG filter (ink blur) */}
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="ink-blur-scroll">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>

          {/* Scroll container */}
          <div className="relative max-w-[700px] w-full" style={{ transform: 'rotate(-0.5deg)' }}>
            {/* Scroll edges */}
            <div className="absolute -left-[10px] -right-[10px] h-[30px] z-20 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.3)]" style={{ top: '-15px', background: 'linear-gradient(to bottom, #8b4513 0%, #a0522d 30%, #cd853f 50%, #a0522d 70%, #8b4513 100%)' }} />
            <div className="absolute -left-[10px] -right-[10px] h-[30px] z-20 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.3)]" style={{ bottom: '-15px', background: 'linear-gradient(to bottom, #8b4513 0%, #a0522d 30%, #cd853f 50%, #a0522d 70%, #8b4513 100%)', transform: 'rotate(180deg)' }} />

            {/* Wax seal */}
            <div className="absolute top-[30px] right-[40px] z-20" style={{ transform: 'rotate(-15deg)' }}>
              <div className="w-[70px] h-[70px] rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_-3px_10px_rgba(0,0,0,0.2),inset_0_3px_10px_rgba(255,255,255,0.1)] flex items-center justify-center relative" style={{ background: 'radial-gradient(circle at 30% 30%, #c41e3a, #8b0000)' }}>
                <span className="text-[32px]" style={{ color: 'rgba(255,215,0,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>☯</span>
                <div className="absolute -top-[5px] -left-[5px] -right-[5px] -bottom-[5px] border-2 border-[rgba(196,30,58,0.3)] rounded-full" />
              </div>
            </div>
            <div className="absolute top-[60px] right-[75px] w-[2px] h-[150px] z-[15] opacity-60" style={{ background: 'linear-gradient(to bottom, #8b0000, #c41e3a, #8b0000)', transform: 'rotate(-15deg)' }} />

            {/* Parchment */}
            <div className="relative px-[50px] py-[60px] pb-[80px]" style={{
              background: 'linear-gradient(135deg, #d4a574 0%, #c4956a 20%, #d4a574 40%, #b8935f 60%, #c9a070 80%, #d4a574 100%)',
              backgroundBlendMode: 'multiply',
              boxShadow: '0 0 60px rgba(139, 90, 43, 0.3), 0 20px 40px rgba(0, 0, 0, 0.5), inset 0 0 100px rgba(139, 69, 19, 0.1)',
              clipPath: 'polygon(0% 2%, 3% 0%, 7% 1%, 12% 0%, 18% 2%, 25% 0%, 35% 1%, 45% 0%, 55% 1%, 65% 0%, 75% 2%, 85% 0%, 92% 1%, 97% 0%, 100% 2%, 100% 98%, 97% 100%, 92% 99%, 85% 100%, 75% 98%, 65% 100%, 55% 99%, 45% 100%, 35% 99%, 25% 100%, 18% 98%, 12% 100%, 7% 99%, 3% 100%, 0% 98%)',
              animation: 'flicker 4s infinite ease-in-out',
            }}>
              {/* Background texture overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at 20% 30%, rgba(139, 90, 43, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(101, 67, 33, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(160, 82, 45, 0.04) 0%, transparent 60%)',
              }} />
              <div className="absolute top-[15%] right-[10%] w-[80px] h-[60px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139, 90, 43, 0.08) 0%, transparent 70%)', transform: 'rotate(-20deg)' }} />

              {/* Ink drops */}
              <div className="absolute top-[15%] left-[8%] w-[3px] h-[3px] rounded-full pointer-events-none" style={{ background: 'rgba(61, 35, 20, 0.4)' }} />
              <div className="absolute top-[45%] right-[12%] w-[2px] h-[2px] rounded-full pointer-events-none" style={{ background: 'rgba(61, 35, 20, 0.4)' }} />
              <div className="absolute bottom-[25%] left-[15%] w-[4px] h-[4px] rounded-full pointer-events-none opacity-30" style={{ background: 'rgba(61, 35, 20, 0.4)' }} />

              {/* Ink splatters */}
              <div className="absolute rounded-full pointer-events-none ink-splatter-anim" style={{ width: '40px', height: '30px', top: '25%', left: '5%', transform: 'rotate(30deg)', background: 'radial-gradient(circle, rgba(61, 35, 20, 0.2) 0%, transparent 70%)' }} />
              <div className="absolute rounded-full pointer-events-none ink-splatter-anim" style={{ width: '25px', height: '20px', bottom: '35%', right: '8%', transform: 'rotate(-20deg)', background: 'radial-gradient(circle, rgba(61, 35, 20, 0.2) 0%, transparent 70%)', animationDelay: '3s' }} />
              <div className="absolute rounded-full pointer-events-none ink-splatter-anim" style={{ width: '50px', height: '40px', top: '60%', left: '85%', transform: 'rotate(45deg)', background: 'radial-gradient(circle, rgba(61, 35, 20, 0.2) 0%, transparent 70%)', opacity: 0.5, animationDelay: '6s' }} />

              {/* ===== Content ===== */}
              <div className="relative z-[1]">
                {/* Header */}
                <div className="text-center mb-[40px]">
                  <div className="font-pinyon text-[24px] text-[#5c3a21] mb-[10px] tracking-[1px]">
                    The {data.date}
                  </div>
                  <div className="font-cinzel text-[28px] text-[#3d2314] tracking-[3px] uppercase border-b-2 border-[#8b4513] border-t-2 border-[#8b4513] py-[15px] my-[20px]">
                    The Master&apos;s Interpretation
                  </div>
                  <div className="font-medieval text-[16px] text-[#6b4423] tracking-[2px]">
                    A Comprehensive Liu Yao Hexagram Analysis
                  </div>
                </div>

                {/* Hexagram display */}
                <div className="text-center my-[30px] p-[20px]" style={{ background: 'rgba(139, 90, 43, 0.05)', border: '1px solid rgba(139, 90, 43, 0.2)', borderRadius: '4px' }}>
                  <div className="font-cinzel text-[14px] text-[#8b4513] tracking-[3px] mb-[15px]">
                    HEXAGRAM {data.hexagram.num} — {data.hexagram.name.toUpperCase()}
                  </div>
                  <div className="font-cinzel text-[16px] text-[#5c3a21] tracking-[2px] mb-[15px]">
                    {data.hexagram.chinese} · {data.hexagram.trigrams}
                  </div>
                  <div className="flex flex-col-reverse items-center gap-[8px] my-[15px]">
                    {lines.map((line, i) => {
                      const y = isYang(line), c = isChanging(line)
                      return (
                        <div key={i} className="flex items-center gap-[10px]">
                          {y ? (
                            <div className="w-[120px] h-[4px] rounded-[2px] relative" style={{
                              background: c ? 'linear-gradient(to right, #c41e3a, #c41e3a)' : 'linear-gradient(to right, #3d2314, #5c3a21, #3d2314)',
                            }}>
                              <div className="absolute top-1/2 -translate-y-1/2 -left-[4px] w-[8px] h-[8px] rounded-full" style={{ background: c ? '#c41e3a' : '#3d2314' }} />
                              <div className="absolute top-1/2 -translate-y-1/2 -right-[4px] w-[8px] h-[8px] rounded-full" style={{ background: c ? '#c41e3a' : '#3d2314' }} />
                            </div>
                          ) : (
                            <div className="flex gap-[15px] items-center">
                              <div className="w-[50px] h-[4px] rounded-[2px]" style={{
                                background: c ? 'linear-gradient(to right, #c41e3a, #c41e3a)' : 'linear-gradient(to right, #3d2314, #5c3a21, #3d2314)',
                              }} />
                              <div className="w-[50px] h-[4px] rounded-[2px]" style={{
                                background: c ? 'linear-gradient(to right, #c41e3a, #c41e3a)' : 'linear-gradient(to right, #3d2314, #5c3a21, #3d2314)',
                              }} />
                            </div>
                          )}
                          {c && (
                            <span className="font-caveat text-[24px] font-bold text-[#c41e3a]">{line === 9 ? '○' : '×'}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {data.question && (
                    <div className="font-caveat text-[20px] text-[#6b4423] mt-[10px] italic">
                      &ldquo;{data.question}&rdquo;
                    </div>
                  )}
                </div>

                {/* Analysis body */}
                {data.analysis ? (
                  <div className="font-caveat text-[26px] leading-[1.5] text-[#3d2314] my-[30px] tracking-[0.5px]">
                    {formatAnalysis(data.analysis)}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#6b4423] font-caveat text-[24px]">
                    <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
                    <p>The consultation did not return any analysis.</p>
                    <button
                      onClick={() => {
                        const updated = { ...data, status: 'loading' as const, errorMessage: undefined }
                        localStorage.setItem('master_consultation', JSON.stringify(updated))
                        setData(updated)
                        doFetch(updated)
                      }}
                      className="mt-4 text-[#c41e3a] hover:underline inline-flex items-center gap-1 text-sm"
                    >
                      <RotateCcw size={14} /> Retry
                    </button>
                  </div>
                )}

                {/* Signature */}
                <div className="mt-[50px] text-right pr-[30px]">
                  <div className="font-pinyon text-[42px] text-[#5c3a21] inline-block" style={{ transform: 'rotate(-5deg)' }}>
                    The Master
                  </div>
                  <div className="font-cinzel text-[12px] text-[#8b4513] tracking-[3px] mt-[10px]">
                    KEEPER OF THE BOOK OF CHANGES
                  </div>
                </div>

                {/* Bottom seal */}
                <div className="text-center mt-[40px] pt-[20px]" style={{ borderTop: '1px solid rgba(139, 90, 43, 0.3)' }}>
                  <div className="font-cinzel text-[11px] text-[#8b4513] tracking-[4px] opacity-60">
                    ☯ AS ABOVE, SO BELOW ☯
                  </div>
                </div>

                {/* Download section */}
                <div className="text-center mt-[40px] pt-[30px]" style={{ borderTop: '2px dashed rgba(139, 90, 43, 0.3)' }}>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-[10px] font-cinzel text-[14px] tracking-[2px] px-[30px] py-[12px] transition-all duration-300 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #8b4513, #a0522d)',
                      color: '#f5f0e8',
                      borderRadius: '4px',
                      boxShadow: '0 4px 15px rgba(139, 69, 19, 0.4)',
                      border: '2px solid #d4a574',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.5)'
                      e.currentTarget.style.background = 'linear-gradient(135deg, #a0522d, #8b4513)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 69, 19, 0.4)'
                      e.currentTarget.style.background = 'linear-gradient(135deg, #8b4513, #a0522d)'
                    }}
                  >
                    <Download size={18} />
                    Print This Scroll
                  </button>
                  <div className="font-caveat text-[18px] text-[#6b4423] mt-[15px] italic">
                    Preserve the Master&apos;s wisdom for future reflection...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Caveat:wght@400;500;600;700&family=Pinyon+Script&family=MedievalSharp&display=swap');

          .font-cinzel { font-family: 'Cinzel Decorative', cursive; }
          .font-caveat { font-family: 'Caveat', cursive; }
          .font-pinyon { font-family: 'Pinyon Script', cursive; }
          .font-medieval { font-family: 'MedievalSharp', cursive; }

          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.6; }
            50% { transform: translateY(-100px) translateX(30px); opacity: 0.3; }
            90% { opacity: 0.6; }
          }

          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.95; }
            75% { opacity: 0.98; }
          }

          @keyframes inkSpreadAnim {
            0% { transform: scale(0.8); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.5; }
            100% { transform: scale(0.9); opacity: 0.3; }
          }

          .ink-splatter-anim {
            animation: inkSpreadAnim 8s infinite ease-in-out;
          }

          .font-caveat p:first-child { text-indent: 0; }

          @media (max-width: 600px) {
            .scroll-container > div > div:nth-child(2) { padding: 40px 25px 60px; }
          }

          @media print {
            body { background: white !important; }
            .fixed { display: none !important; }
            .relative.z-30 { display: none !important; }
          }
        `}</style>
      </div>
    )
  }

  return null
}
