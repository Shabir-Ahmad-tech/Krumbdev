'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { TOOLS, BUILT_TOOLS } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'

// ── Data ──
const FEATURED_SLUGS = [
  'json-formatter',
  'jwt-decoder',
  'regex-tester',
  'password-generator',
  'hash-generator',
  'code-formatter',
  'diff-checker',
  'uuid-generator',
]

const TYPEWRITER_TOOLS = [
  'json_formatter',
  'jwt_decoder',
  'regex_tester',
  'password_generator',
  'hash_generator',
]

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________'
const HEX_CHARS = '0123456789ABCDEF'

// ── Canvas-based Matrix Rain ──
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const fontSize = 11
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array.from({ length: columns }, () => Math.random() * -canvas.height / fontSize)
    const delay: number[] = Array.from({ length: columns }, () => Math.random() * 120)

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]|&^%$#@!'

    let frame = 0
    const draw = () => {
      frame++
      // Semi-transparent fade for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        if (frame < delay[i]) continue

        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Leading character is bright green, rest are dim
        ctx.fillStyle = i % 3 === 0 ? '#00FF41' : 'rgba(0, 255, 65, 0.25)'
        ctx.fillText(char, x, y)

        // Reset drop
        drops[i]++
        if (y > canvas.height + fontSize * 20) {
          drops[i] = Math.random() * -canvas.height / fontSize
          delay[i] = frame + Math.random() * 180
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}

// ── Random Glitch Overlay ──
function GlitchOverlay() {
  const [glitching, setGlitching] = useState(false)
  const [glitchType, setGlitchType] = useState(0)

  useEffect(() => {
    const schedule = () => {
      const delay = 6000 + Math.random() * 10000
      return setTimeout(() => {
        setGlitchType(Math.floor(Math.random() * 3))
        setGlitching(true)
        setTimeout(() => setGlitching(false), 100 + Math.random() * 120)
        schedule()
      }, delay)
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [])

  if (!glitching) return null

  const styles: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    pointerEvents: 'none',
  }

  if (glitchType === 0) {
    // Color channel shift
    return (
      <>
        <div
          style={{
            ...styles,
            background: 'rgba(0, 255, 65, 0.03)',
            transform: 'translateX(3px)',
            clipPath: 'inset(20% 0 30% 0)',
          }}
        />
        <div
          style={{
            ...styles,
            background: 'rgba(255, 0, 0, 0.02)',
            transform: 'translateX(-3px)',
            clipPath: 'inset(60% 0 10% 0)',
          }}
        />
      </>
    )
  }

  if (glitchType === 1) {
    // Full scanline flash
    return (
      <div
        style={{
          ...styles,
          background: 'rgba(0, 255, 65, 0.06)',
        }}
      />
    )
  }

  // Horizontal band tear
  return (
    <div
      style={{
        ...styles,
        background: 'rgba(0, 0, 0, 0.9)',
        clipPath: `inset(${10 + Math.random() * 30}% 0 ${10 + Math.random() * 30}% 0)`,
      }}
    />
  )
}

// ── Floating Hex / Code Debris ──
function HexDebris({ count = 12 }: { count?: number }) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      text: Array.from({ length: 2 + Math.floor(Math.random() * 6) }, () =>
        HEX_CHARS[Math.floor(Math.random() * 16)]
      ).join(''),
      x: Math.random() * 100,
      y: 10 + Math.random() * 80,
      size: 9 + Math.random() * 4,
      delay: Math.random() * 15,
      duration: 20 + Math.random() * 25,
      opacity: 0.04 + Math.random() * 0.06,
    }))
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute font-mono font-bold text-[#00FF41] select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            opacity: p.opacity,
            animation: `hex-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            transform: 'translateY(0)',
          }}
        >
          {p.text}
        </div>
      ))}
    </div>
  )
}

// ── Background Terminal Debris (command fragments) ──
function TerminalDebris() {
  const [lines] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      text: [
        'root@krumb:~# nmap -sV target',
        '> initializing payload... done',
        '$ curl -s https://api.github.com',
        'SSH-2.0-OpenSSH_9.0',
        'GET / HTTP/1.1 200 OK',
        'traceroute to 8.8.8.8...',
        '[INFO] processing complete',
        'HTTP/2 200 1432 bytes',
        '>>> decrypting payload...',
        'CONNECT wss://krumb.dev:443',
        './configure --prefix=/usr',
        'make -j$(nproc) 2>&1',
      ][i % 12],
      x: -5 + Math.random() * 30,
      y: 15 + Math.random() * 70,
      size: 8 + Math.random() * 3,
      delay: Math.random() * 20,
      duration: 25 + Math.random() * 20,
      opacity: 0.03 + Math.random() * 0.04,
    }))
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {lines.map(l => (
        <div
          key={l.id}
          className="absolute font-mono text-[#00FF41] whitespace-nowrap select-none"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            fontSize: l.size,
            opacity: l.opacity,
            animation: `hex-drift ${l.duration}s ease-in-out ${l.delay}s infinite`,
          }}
        >
          {l.text}
        </div>
      ))}
    </div>
  )
}

// ── Hooks ──

/** Scroll-triggered reveal (fires once) */
function useOnScreen(threshold = 0.12): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); o.unobserve(el) } },
      { threshold },
    )
    o.observe(el)
    return () => o.disconnect()
  }, [threshold])
  return [ref, visible]
}

/** Animated counter 0 → target */
function useCountUp(target: number, active: boolean, duration = 1800): number {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const steps = 30
    const increment = target / steps
    const interval = duration / steps
    let c = 0
    const t = setInterval(() => {
      c++
      setCount(Math.min(Math.round(c * increment), target))
      if (c >= steps) clearInterval(t)
    }, interval)
    return () => clearInterval(t)
  }, [target, active, duration])
  return count
}

/** Floating particles generator — static positions, animated via CSS */
function useParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 12,
    opacity: 0.15 + Math.random() * 0.25,
  }))
}

// ── Sub-components ──

/** Scramble-text card */
function ToolCard({ name, description, slug, index }: { name: string; description: string; slug: string; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [displayName, setDisplayName] = useState(name)
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const enter = () => {
    setHovered(true)
    if (intRef.current) clearInterval(intRef.current)
    let pos = 0
    intRef.current = setInterval(() => {
      const chars = name.split('').map((c, i) => (i < pos ? c : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])).join('')
      setDisplayName(chars)
      pos++
      if (pos > name.length) { clearInterval(intRef.current!); setDisplayName(name) }
    }, 35)
  }
  const leave = () => {
    setHovered(false)
    if (intRef.current) clearInterval(intRef.current)
    setDisplayName(name)
  }
  useEffect(() => () => { if (intRef.current) clearInterval(intRef.current) }, [])

  return (
    <Link
      href={`/${slug}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="group block border border-[#333333] bg-[#000000] p-5 cursor-pointer relative hover:z-10"
      style={{
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        borderColor: hovered ? '#00FF41' : undefined,
        boxShadow: hovered ? '5px 5px 0px #00FF41' : 'none',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.15s ease, box-shadow 0.15s ease',
        animation: `card-enter 0.5s ease-out ${0.1 + index * 0.07}s both`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] text-[#444444] select-none">[{slug}]</span>
        <span
          className="font-mono text-[10px] text-[#00FF41] select-none"
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.15s ease' }}
        >
          [RUN]
        </span>
      </div>
      <h3 className="font-heading text-base md:text-lg font-bold text-[#F9F9F9] mb-2 leading-snug">
        {displayName}
      </h3>
      <p className="font-mono text-[11px] text-[#666666] leading-relaxed">{description}</p>
      {/* Bottom-right corner accent on hover */}
      <div
        className="absolute bottom-0 right-0 w-0 h-0 border-b-[12px] border-r-[12px] border-[#00FF41]"
        style={{
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          borderBottomColor: hovered ? '#00FF41' : 'transparent',
          borderRightColor: hovered ? '#00FF41' : 'transparent',
        }}
      />
    </Link>
  )
}

/** Stat counter block */
function StatBlock({ label, value, active, suffix = '' }: { label: string; value: number; active: boolean; suffix?: string }) {
  const count = useCountUp(value, active, 2000)
  return (
    <div className="text-center px-4 md:px-6">
      <div className="font-heading text-2xl md:text-4xl font-bold text-[#00FF41] tabular-nums">
        {count}{suffix}
      </div>
      <div className="font-mono text-[10px] md:text-xs text-[#555555] uppercase tracking-widest mt-1">{label}</div>
    </div>
  )
}

/** Typewriter cycling */
function TypewriterLine() {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing')
  const [pos, setPos] = useState(0)
  const tool = TYPEWRITER_TOOLS[idx]

  useEffect(() => {
    if (phase === 'typing') {
      if (pos >= tool.length) { const t = setTimeout(() => setPhase('pause'), 1800); return () => clearTimeout(t) }
      const t = setTimeout(() => { setText(tool.slice(0, pos + 1)); setPos(p => p + 1) }, 55 + Math.random() * 45)
      return () => clearTimeout(t)
    }
    if (phase === 'pause') { const t = setTimeout(() => setPhase('deleting'), 100); return () => clearTimeout(t) }
    if (phase === 'deleting') {
      if (pos <= 0) { setIdx(i => (i + 1) % TYPEWRITER_TOOLS.length); setPhase('typing'); return }
      const t = setTimeout(() => { setText(tool.slice(0, pos - 1)); setPos(p => p - 1) }, 25)
      return () => clearTimeout(t)
    }
  }, [phase, pos, tool])

  return (
    <div className="font-mono text-sm md:text-base text-[#888888] flex items-center gap-2 h-6">
      <span className="text-[#00FF41] font-bold">&gt;</span>
      <span className="text-[#555555]">RUN:</span>
      <span className="text-[#F9F9F9]">{text}</span>
      <span className="inline-block w-[5px] h-4 md:h-5 bg-[#00FF41] animate-terminal-blink" />
    </div>
  )
}

/** Terminal mockup with cycling content */
function TerminalMockup() {
  const demos = [
    { cmd: 'cat payload.json', lines: ['{', '  "name": "krumb",', '  "type": "dev-tools",', '  "processed": "client-side",', '  "status": "✓ private"', '}'], result: 'done — 0 server uploads' },
    { cmd: 'curl -X POST /api/format', lines: ['{', '  "payload": "received",', '  "size": "2.4 KB",', '  "location": "browser",', '  "latency": "0ms (local)"', '}'], result: 'formatted in 0ms' },
    { cmd: 'openssl dgst -sha256 input', lines: ['hash: a3f1b...c9e2d', 'algorithm: SHA-256', 'mode: client-side', 'verification: ✓ match'], result: 'checksum verified locally' },
  ]
  const [demoIdx, setDemoIdx] = useState(0)
  const [vis, setVis] = useState(0)
  const [cursor, setCursor] = useState(true)
  const demo = demos[demoIdx]

  useEffect(() => {
    if (vis >= demo.lines.length + 1) {
      const t = setTimeout(() => { setDemoIdx(i => (i + 1) % demos.length); setVis(0) }, 2500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setVis(v => v + 1), 90)
    return () => clearTimeout(t)
  }, [vis, demo, demos.length])

  useEffect(() => { const b = setInterval(() => setCursor(c => !c), 500); return () => clearInterval(b) }, [])

  return (
    <div className="bg-[#0a0a0a] border border-[#333333] p-4 md:p-5 font-mono text-xs leading-relaxed min-h-[220px]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1a1a1a]">
        <span className="w-2.5 h-2.5 rounded-none bg-[#FF4444]" />
        <span className="w-2.5 h-2.5 rounded-none bg-[#FFB800]" />
        <span className="w-2.5 h-2.5 rounded-none bg-[#00FF41]" />
        <span className="ml-3 text-[#555555] text-[10px]">terminal — krumb.dev</span>
      </div>
      <div className="text-[#F9F9F9]">
        <div className="whitespace-pre text-[#888888]">
          <span className="text-[#00FF41]">$</span> {demo.cmd}
        </div>
        {demo.lines.slice(0, vis).map((l, i) => (
          <div key={i} className="whitespace-pre text-[#888888]">
            {l}
          </div>
        ))}
        {vis > demo.lines.length && (
          <div className="mt-1 text-[#00FF41]">
            <span className="text-[#555555]">$</span> {demo.result}
            <span className="inline-block w-[5px] h-3 bg-[#00FF41] ml-1 animate-terminal-blink" />
          </div>
        )}
        {vis <= demo.lines.length && (
          <span className="inline-block w-[5px] h-3 bg-[#00FF41]" style={{ opacity: cursor ? 1 : 0 }} />
        )}
      </div>
    </div>
  )
}

/** Scrolling progress bar */
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? Math.min(window.scrollY / h, 1) : 0)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[100] pointer-events-none">
      <div className="h-full bg-[#00FF41] transition-[width] duration-100 ease-out" style={{ width: `${progress * 100}%` }} />
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════

export default function LandingPage() {
  const builtTools = TOOLS.filter(t => BUILT_TOOLS.includes(t.slug))
  const featuredTools = FEATURED_SLUGS.map(s => builtTools.find(t => t.slug === s)).filter(Boolean) as typeof builtTools

  // Scroll reveals
  const [heroRef, heroVisible] = useOnScreen(0.01)
  const [statsRef, statsVisible] = useOnScreen(0.3)
  const [gridRef, gridVisible] = useOnScreen(0.08)
  const [whyRef, whyVisible] = useOnScreen(0.1)
  const [compareRef, compareVisible] = useOnScreen(0.1)
  const [ctaRef, ctaVisible] = useOnScreen(0.15)

  // Hero scramble on "43"
  const [heroCount, setHeroCount] = useState('43')
  useEffect(() => {
    if (!heroVisible) return
    let runs = 0
    const t = setInterval(() => {
      setHeroCount(
        Array.from({ length: 2 }, () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]).join(''),
      )
      runs++
      if (runs > 12) { clearInterval(t); setHeroCount('43') }
    }, 60)
    return () => clearInterval(t)
  }, [heroVisible])

  // Nav scroll effect
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const particles = useParticles(30)

  return (
    <div className="bg-[#000000] text-[#F9F9F9] min-h-screen overflow-x-hidden">
      <ScrollProgress />
      <GlitchOverlay />

      {/* ═══════════════════════════════════════════════════════
          STICKY NAV
          ═══════════════════════════════════════════════════════ */}
      <nav
        className={`sticky top-0 z-50 px-6 md:px-10 py-3 transition-all duration-300 ${
          scrolled
            ? 'bg-[#000000]/80 backdrop-blur-md border-b border-[#333333] shadow-[0_1px_20px_rgba(0,0,0,0.8)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/icons/logo-icon.svg" alt="K" className="w-8 h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-heading text-base md:text-lg font-bold text-[#F9F9F9] tracking-tight hidden sm:inline">
              KRUMB.DEV
            </span>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/tools" className="font-mono text-xs uppercase tracking-wider text-[#888888] hover:text-[#F9F9F9] transition-colors duration-200">
              Tools
            </Link>
            <Link href="/about" className="font-mono text-xs uppercase tracking-wider text-[#888888] hover:text-[#F9F9F9] transition-colors duration-200">
              About
            </Link>
            <Link
              href="/tools"
              className="font-mono text-xs font-bold text-[#00FF41] border border-[#00FF41] px-3 py-1.5 hover:bg-[#00FF41]/5 transition-all duration-200"
              style={{ boxShadow: scrolled ? '0 0 12px rgba(0,255,65,0.15)' : 'none' }}
            >
              [<span className="text-[#00FF41]">&gt;</span> RUN TOOLS]
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef as React.RefObject<HTMLDivElement>}
        className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center px-6 md:px-10 overflow-hidden"
      >
        {/* Background: Matrix rain + dot grid + gradient + particles */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          {/* Matrix rain — subtle, canvas-based */}
          <div className="absolute inset-0 opacity-20 md:opacity-25">
            <MatrixRain />
          </div>
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #00FF41 0.7px, transparent 0.7px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Gradient washes */}
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00FF41]/[0.03] blur-[120px] rounded-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00FF41]/[0.02] blur-[100px] rounded-none" />
          {/* Floating particles */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: '#00FF41',
                opacity: p.opacity,
                animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>

        <div
          className="relative z-10 max-w-5xl space-y-6 md:space-y-8"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <TypewriterLine />

          {/* Headline */}
          <h1
            className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tighter"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="text-[#F9F9F9]">{heroCount} DEV TOOLS.</span>
            <br />
            <span className="text-[#F9F9F9]">ZERO UPLOAD.</span>
            <br />
            <span className="text-[#00FF41] relative inline-block">
              ZERO SIGNUP.
              <span
                className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00FF41] opacity-40"
                style={{ animation: 'shimmer-expand 2s ease-out 0.5s both' }}
              />
            </span>
          </h1>

          <p className="font-mono text-sm md:text-base text-[#888888] max-w-2xl leading-relaxed">
            Format JSON, decode JWT, test regex, generate passwords, beautify code —{' '}
            <span className="text-[#F9F9F9]">all in your browser.</span>{' '}
            Most tools run 100% client-side. No accounts, no uploads, no tracking.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <Link
              href="/tools"
              className="group relative inline-flex items-center gap-2 border-2 border-[#00FF41] px-7 py-3.5 text-sm md:text-base font-mono font-bold text-[#00FF41] bg-[#000000] hover:bg-[#00FF41]/5 transition-all duration-200"
              style={{ animation: heroVisible ? 'cta-jitter-in 0.6s ease-out 0.3s both' : 'none' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,65,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
            >
              <span>[</span>
              <span>&gt;</span> RUN_TOOLS
              <span>]</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <a
              href="https://github.com/krumbdev"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-mono text-xs md:text-sm text-[#555555] hover:text-[#F9F9F9] transition-colors duration-200"
            >
              <span className="text-[#444444] group-hover:text-[#00FF41] transition-colors duration-200">&gt;</span>
              view source on github
            </a>
          </div>

          {/* Bottom fade hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
            <div className="font-mono text-[10px] text-[#444444] animate-bounce-subtle">scroll ↓</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS BAND
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={statsRef as React.RefObject<HTMLDivElement>}
        className="relative border-y border-[#1a1a1a] py-10 md:py-14 px-6 md:px-10"
      >
        <HexDebris count={8} />
        <div
          className="relative z-10 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          style={{
            opacity: statsVisible ? 1 : 0,
            transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <StatBlock label="Developer Tools" value={43} active={statsVisible} />
          <StatBlock label="Server Uploads" value={0} active={statsVisible} />
          <StatBlock label="Free Forever" value={100} active={statsVisible} suffix="%" />
          <StatBlock label="MIT Licensed" value={1} active={statsVisible} suffix="" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURE GRID
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={gridRef as React.RefObject<HTMLDivElement>}
        className="relative px-6 md:px-10 py-16 md:py-24"
      >
        <TerminalDebris />
        <div
          className="relative z-10 max-w-6xl mx-auto space-y-10"
          style={{
            opacity: gridVisible ? 1 : 0,
            transform: gridVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-[#F9F9F9] pb-4">
            <div>
              <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-tight">
                WHAT&apos;S INSIDE
              </h2>
              <p className="text-[#888888] text-xs mt-1 font-mono">
                SYS_DIR: /tools/featured — 8 of {builtTools.length} utilities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {featuredTools.map((tool, i) => (
              <ToolCard
                key={tool.slug}
                name={tool.name}
                description={tool.shortDescription}
                slug={tool.slug}
                index={i}
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 font-mono text-sm text-[#666666] hover:text-[#00FF41] transition-colors duration-200"
            >
              <span className="text-[#444444] group-hover:text-[#00FF41]">&gt;</span>
              browse all {builtTools.length} tools{' '}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHY CLIENT-SIDE
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={whyRef as React.RefObject<HTMLDivElement>}
        className="relative px-6 md:px-10 py-16 md:py-24 border-t border-[#1a1a1a]"
      >
        {/* Subtle bg pattern */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,255,65,0.1) 25%, rgba(0,255,65,0.1) 26%, transparent 27%, transparent 74%, rgba(0,255,65,0.1) 75%, rgba(0,255,65,0.1) 76%, transparent 77%)',
            backgroundSize: '60px 60px',
          }}
        />
        <HexDebris count={10} />
        <div
          className="relative z-10 max-w-6xl mx-auto"
          style={{
            opacity: whyVisible ? 1 : 0,
            transform: whyVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-6">
              <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-tight leading-tight">
                YOUR CODE NEVER
                <br />
                LEAVES YOUR{' '}
                <span className="text-[#00FF41] relative">
                  BROWSER.
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#00FF41]/30" />
                </span>
              </h2>

              <p className="font-mono text-xs md:text-sm text-[#888888] leading-relaxed">
                Most tools — formatting, encoding, hashing, generating — run 100% in your
                browser. Your JSON, tokens, source code, and passwords never touch a server.
              </p>

              <p className="font-mono text-xs md:text-sm text-[#888888] leading-relaxed">
                Tools that need server logic (DNS lookups, SSL checks) use lightweight edge
                functions — clearly noted on each tool page, payloads never logged.
              </p>

              {/* Proof points with animated icons */}
              <div className="space-y-4 pt-2">
                {[
                  { icon: 'bolt', title: 'INSTANT', desc: 'No network round-trip for core tools — results appear as you type.' },
                  { icon: 'lock', title: 'PRIVATE', desc: 'No payload storage, no server logs for client-side operations.' },
                  { icon: 'star', title: 'FREE', desc: 'No account, no paywall, no usage limits. Every tool is MIT licensed.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 group">
                    <div className="w-5 h-5 shrink-0 mt-0.5 text-[#00FF41] transition-transform duration-300 group-hover:scale-110">
                      {item.icon === 'bolt' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      )}
                      {item.icon === 'lock' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                      )}
                      {item.icon === 'star' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className="font-heading text-sm font-bold text-[#F9F9F9] uppercase tracking-wide">{item.title}</span>
                      <p className="font-mono text-[11px] text-[#666666]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal mockup */}
            <div className="flex items-start">
              <TerminalMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          COMPARISON
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={compareRef as React.RefObject<HTMLDivElement>}
        className="relative px-6 md:px-10 py-16 md:py-24 border-t border-[#1a1a1a]"
      >
        <TerminalDebris />
        <div
          className="relative z-10 max-w-4xl mx-auto space-y-10"
          style={{
            opacity: compareVisible ? 1 : 0,
            transform: compareVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          }}
        >
          <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-tight text-center">
            OLD WAY <span className="text-[#555555]">vs</span>{' '}
            <span className="text-[#00FF41]">KRUMB</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]">
            {/* Headers */}
            <div className="bg-[#000000] p-4 md:p-5 border border-[#1a1a1a]">
              <span className="font-heading text-sm font-bold uppercase text-[#FF4444]">❌ Other Sites</span>
            </div>
            <div className="bg-[#000000] p-4 md:p-5 border border-[#1a1a1a]">
              <span className="font-heading text-sm font-bold uppercase text-[#00FF41]">✅ KRUMB.DEV</span>
            </div>

            {[
              ['Upload your code to a random server', 'Runs entirely in your browser'],
              ['Sign up just to format JSON', 'Zero accounts, ever'],
              ['Cluttered, ad-heavy tool sites', 'Clean terminal-inspired interface'],
              ['One tool per bookmark', '47 tools, one URL'],
            ].map(([bad, good], i) => (
              <div key={i} className="contents">
                <div className="bg-[#000000] p-4 md:p-5 border border-[#1a1a1a] flex items-center gap-3 group hover:bg-[#0d0d0d] transition-colors duration-200">
                  <span className="text-[#FF4444] text-lg shrink-0 group-hover:scale-110 transition-transform duration-200">✗</span>
                  <span className="font-mono text-xs md:text-sm text-[#888888]">{bad}</span>
                </div>
                <div className="bg-[#000000] p-4 md:p-5 border border-[#1a1a1a] flex items-center gap-3 group hover:bg-[#0d0d0d] transition-colors duration-200">
                  <span className="text-[#00FF41] text-lg shrink-0 group-hover:scale-110 transition-transform duration-200">✓</span>
                  <span className="font-mono text-xs md:text-sm text-[#888888]">{good}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef as React.RefObject<HTMLDivElement>}
        className="relative px-6 md:px-10 py-20 md:py-32 overflow-hidden border-t border-[#1a1a1a]"
      >
        {/* Dramatic background */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, #00FF41 0.5px, transparent 0.5px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.04) 2px, rgba(0,255,65,0.04) 4px)',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[#00FF41]/[0.03] blur-[150px] rounded-none" />
          {/* Light Matrix rain in CTA */}
          <div className="absolute inset-0 opacity-[0.10]">
            <MatrixRain />
          </div>
        </div>

        <div
          className="relative z-10 max-w-3xl mx-auto text-center space-y-8"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out 0.1s',
          }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tighter">
            STOP SEARCHING.
            <br />
            <span className="text-[#00FF41] relative">
              START RUNNING.
              <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#00FF41]/40" />
            </span>
          </h2>

          <p className="font-mono text-sm text-[#666666] max-w-xl mx-auto">
            No more bookmarking random tool sites. No more signing up for a simple format job.
            One URL, 47 tools, zero friction.
          </p>

          <div className="pt-4">
            <Link
              href="/tools"
              className="group relative inline-flex items-center gap-3 border-2 border-[#00FF41] px-8 md:px-14 py-4 md:py-5 text-base md:text-lg font-mono font-bold text-[#00FF41] bg-[#000000] hover:bg-[#00FF41]/5 transition-all duration-200"
              style={{
                animation: ctaVisible ? 'cta-glow-pulse 5s ease-in-out infinite' : 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0,255,65,0.4)'
                e.currentTarget.style.animation = 'none'
                // Glitch effect on hover
                e.currentTarget.style.transform = 'translateX(-1px)'
                setTimeout(() => { if (e.currentTarget) e.currentTarget.style.transform = 'translateX(1px)' }, 50)
                setTimeout(() => { if (e.currentTarget) e.currentTarget.style.transform = 'translateX(0)' }, 100)
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.animation = 'cta-glow-pulse 5s ease-in-out infinite'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <span className="text-[#00FF41]">[</span>
              <span className="text-[#00FF41]">&gt;</span> RUN_TOOLS.EXE
              <span className="text-[#00FF41]">]</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-xs text-[#555555]">
              no signup &middot; no credit card &middot; runs instantly
            </p>
            <p className="font-mono text-[10px] text-[#444444]">
              Press <kbd className="border border-[#333333] px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd> to search all tools
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
