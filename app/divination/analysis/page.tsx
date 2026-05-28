'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { ArrowLeft, Sparkles, BookOpen, Check, AlertCircle, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface StoredData {
  hexagram: { name: string; chinese: string; trigrams: string; meaning: string; num: number }
  question: string
  lines: number[]
  prompt?: string
  analysis?: string
  status: 'loading' | 'complete' | 'error'
  date: string
}

function formatInline(s: string) {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>
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
      <li key={i} className="flex items-start gap-2 text-sm text-ink/70"><span className="text-gold mt-1.5 shrink-0">•</span><span>{formatInline(s)}</span></li>
    ))}</ul>)
    items = []
  }
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    if (!t) { flush(); continue }
    if (/^[-*_]{3,}$/.test(t)) { flush(); out.push(<hr key={`hr-${i}`} className="my-6 border-ink/10" />); continue }
    if (t.startsWith('### ')) { flush(); out.push(<h4 key={`h4-${i}`} className="font-serif text-lg text-ink mt-6 mb-2">{t.replace('### ', '')}</h4>); continue }
    if (t.startsWith('## ')) { flush(); out.push(<h3 key={`h3-${i}`} className="font-serif text-xl text-ink mt-8 mb-3 border-b border-ink/10 pb-2">{t.replace('## ', '')}</h3>); continue }
    if (t.startsWith('# ')) { flush(); out.push(<h2 key={`h2-${i}`} className="font-serif text-2xl text-ink mt-8 mb-4">{t.replace('# ', '')}</h2>); continue }
    if (t.startsWith('- ') || t.startsWith('* ')) { items.push(t.replace(/^[-*]\s+/, '')); continue }
    if (/^\d+[\.\)]\s/.test(t)) {
      flush()
      const num = t.match(/^\d+/)?.[0]
      out.push(<p key={`p-${i}`} className="text-sm text-ink/70 mb-2 ml-2"><span className="font-medium text-ink mr-1">{num}.</span>{formatInline(t.replace(/^\d+[\.\)]\s*/, ''))}</p>)
      continue
    }
    flush()
    out.push(<p key={`p-${i}`} className="text-sm text-ink/70 mb-3 leading-relaxed">{formatInline(t)}</p>)
  }
  flush()
  return out
}

export default function AnalysisPage() {
  const router = useRouter()
  const [data, setData] = useState<StoredData | null>(null)
  const [progress, setProgress] = useState(10)
  const [fetching, setFetching] = useState(false)

  const doFetch = useCallback(async (parsed: StoredData) => {
    setFetching(true)
    setProgress(15)
    const timer1 = setTimeout(() => setProgress(40), 2000)
    const timer2 = setTimeout(() => setProgress(65), 5000)
    const timer3 = setTimeout(() => setProgress(85), 10000)
    try {
      const resp = await fetch('/api/divination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: parsed.prompt, question: parsed.question }),
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const result = await resp.json()
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3)
      setProgress(100)
      const updated: StoredData = {
        hexagram: parsed.hexagram, question: parsed.question, lines: parsed.lines,
        analysis: result.analysis || '', status: 'complete', date: parsed.date,
      }
      localStorage.setItem('master_consultation', JSON.stringify(updated))
      setData(updated)
    } catch (e) {
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3)
      const updated: StoredData = { ...parsed, status: 'error' }
      localStorage.setItem('master_consultation', JSON.stringify(updated))
      setData(updated)
    }
    setFetching(false)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('master_consultation')
      if (!raw) { router.replace('/divination'); return }
      const parsed: StoredData = JSON.parse(raw)
      setData(parsed)
      if (parsed.status === 'loading') doFetch(parsed)
    } catch { router.replace('/divination') }
  }, []) // eslint-disable-line

  // Loading
  if (data?.status === 'loading') {
    return (
      <div className="min-h-screen bg-rice flex items-center justify-center">
        <div className="max-w-sm mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-ink flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} className="text-gold" />
          </div>
          <h2 className="text-2xl font-serif text-ink mb-2">Master Consultation</h2>
          <p className="text-ink/60 text-sm mb-8 truncate max-w-xs">&ldquo;{data.question}&rdquo;</p>
          <div className="mb-2 flex justify-between text-sm text-ink/50">
            <span>Consulting the I Ching...</span>
            <span>{Math.min(Math.round(progress), 99)}%</span>
          </div>
          <div className="h-2.5 bg-ink/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cinnabar to-gold rounded-full transition-all duration-700" style={{ width: `${Math.min(progress, 99)}%` }} />
          </div>
          <p className="text-xs text-ink/40 mt-3">
            {progress < 35 ? 'Connecting to divination master...' : progress < 60 ? 'Analyzing hexagram structure...' : progress < 80 ? 'Interpreting line relationships...' : 'Finalizing the reading...'}
          </p>
          {fetching && progress > 90 && (
            <p className="text-xs text-ink/30 mt-2">Still processing... this may take a moment</p>
          )}
        </div>
      </div>
    )
  }

  // Error
  if (data?.status === 'error') {
    return (
      <div className="min-h-screen bg-rice flex items-center justify-center">
        <div className="max-w-sm mx-auto px-4 text-center">
          <AlertCircle size={40} className="text-cinnabar mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-ink mb-2">Consultation Unavailable</h2>
          <p className="text-ink/60 text-sm mb-4">The consultation service encountered an error.</p>
          <Link href="/divination" className="bg-ink text-rice px-6 py-3 rounded-sm hover:bg-ink/80 transition-colors inline-flex items-center gap-2">
            Back to Divination
          </Link>
          <button
            onClick={() => {
              if (!data) return
              const updated = { ...data, status: 'loading' as const }
              localStorage.setItem('master_consultation', JSON.stringify(updated))
              setData(updated)
              doFetch(updated)
            }}
            className="block mx-auto mt-3 text-sm text-ink/50 hover:text-ink transition-colors underline"
          >
            Retry Consultation
          </button>
        </div>
      </div>
    )
  }

  // Result (complete)
  if (data?.status === 'complete') {
    const lines = data.lines as (6 | 7 | 8 | 9)[]
    const isYang = (v: number) => v === 7 || v === 9
    const isChanging = (v: number) => v === 6 || v === 9
    return (
      <div className="min-h-screen bg-rice">
        <div className="bg-ink text-rice">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/divination" className="flex items-center gap-2 text-rice/70 hover:text-gold transition-colors"><ArrowLeft size={20} /> Back to Divination</Link>
            <Link href="/" className="text-rice/50 hover:text-gold transition-colors text-sm">Home</Link>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-3 py-1 rounded-sm text-sm mb-4">
              <Check size={14} /> Consultation Complete &middot; {data.date}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-ink mb-2">{data.hexagram.name}</h1>
            <p className="text-xl text-ink/40 font-serif mb-1">{data.hexagram.chinese} &middot; {data.hexagram.trigrams}</p>
            <p className="text-ink/60 italic mt-4 mb-6 max-w-xl mx-auto">&ldquo;{data.question}&rdquo;</p>
            <div className="flex flex-col-reverse items-center gap-1 mb-4">
              {lines.map((line, i) => {
                const y = isYang(line), c = isChanging(line), cl = c ? 'bg-cinnabar' : 'bg-ink'
                return (
                  <div key={i} className="flex items-center justify-center gap-2">
                    {y ? <div className={`h-2.5 w-40 rounded-sm ${cl}`} /> : <><div className={`h-2.5 w-[70px] rounded-sm ${cl}`} /><div className="w-3" /><div className={`h-2.5 w-[70px] rounded-sm ${cl}`} /></>}
                    {c && <span className="text-[10px] text-cinnabar">{line === 9 ? '○' : '×'}</span>}
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-ink/40">{data.hexagram.meaning}</p>
          </div>

          {data.analysis ? (
            <div className="bg-white rounded-lg border border-ink/10 p-8 md:p-12 shadow-sm">{formatAnalysis(data.analysis)}</div>
          ) : (
            <div className="bg-white rounded-lg border border-ink/10 p-12 shadow-sm text-center text-ink/50">
              <BookOpen size={32} className="mx-auto mb-3" />
              <p>The consultation did not return any analysis.</p>
              <button
                onClick={() => {
                  const updated = { ...data, status: 'loading' as const }
                  localStorage.setItem('master_consultation', JSON.stringify(updated))
                  setData(updated)
                  doFetch(updated)
                }}
                className="mt-4 text-sm text-cinnabar hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw size={14} /> Retry
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/divination" className="bg-ink text-rice px-6 py-3 rounded-sm hover:bg-ink/80 transition-colors inline-flex items-center gap-2">
              <Sparkles size={18} /> New Divination
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
