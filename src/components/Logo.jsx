// src/components/Logo.jsx
// The Wine Guide — brand logo
// Champagne flute: widest at rim, tapers to base, long thin stem, small foot

import { Link } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────
// Core SVG — proper flute proportions
// ViewBox 40 × 100 → very narrow bowl, long stem
// ─────────────────────────────────────────────────────────────
export function WineGlassSVG({ size = 48, className = '', animate = true }) {
  // Maintain 40:100 aspect ratio
  const w = size
  const h = Math.round(size * 2.5)
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 40 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Champagne liquid — warm straw gold */}
        <linearGradient id="champGrad" x1="0%" y1="0%" x2="15%" y2="100%">
          <stop offset="0%"   stopColor="#F5DC6A" stopOpacity="0.82" />
          <stop offset="55%"  stopColor="#C89A28" stopOpacity="0.90" />
          <stop offset="100%" stopColor="#8A6010" stopOpacity="0.95" />
        </linearGradient>

        {/* Glass body — barely-there warm tint */}
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0.05" />
          <stop offset="35%"  stopColor="#D4AF37" stopOpacity="0.11" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.03" />
        </linearGradient>

        {/* Left-edge glass sheen */}
        <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Stroke gradient — gold fading toward foot */}
        <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity="1" />
          <stop offset="65%"  stopColor="#C09A2A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#A07818" stopOpacity="0.65" />
        </linearGradient>

        {/* Clip to bowl interior only */}
        <clipPath id="fluteClip">
          {/*
            Bowl: rim x=14→26 at y=4, narrows to x=17→23 at y=58
            Left:  M 14,4  C 14,22 16,44 17,58
            Right: M 26,4  C 26,22 24,44 23,58
          */}
          <path d="M 14,4 C 14,22 16,44 17,58 L 23,58 C 24,44 26,22 26,4 Z" />
        </clipPath>
      </defs>

      {/* ── Bowl fill (subtle glass tint) ── */}
      <path
        d="M 14,4 C 14,22 16,44 17,58 L 23,58 C 24,44 26,22 26,4 Z"
        fill="url(#glassGrad)"
      />

      {/* ── Champagne liquid — 78% fill ── */}
      <g clipPath="url(#fluteClip)">
        {/* Liquid body */}
        <path
          d="M 14,15 C 18,13.2 22,13.2 26,15 L 26,58 L 14,58 Z"
          fill="url(#champGrad)"
        />
        {/* Meniscus arc */}
        <ellipse cx="20" cy="15" rx="5.8" ry="1.2"
          fill="#F8E882" fillOpacity="0.5" />

        {/* ── Bubbles — rise from nucleation point at base ── */}

        {/* Bubble A — dead centre, slow */}
        <circle cx="20" cy="54" r="0.85" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; -0.4,-38; 0.2,-39"
              keyTimes="0;0.88;1"
              dur="2.6s" repeatCount="indefinite" begin="0s" />
            <animate attributeName="opacity"
              values="0;0;0.6;0.45;0"
              keyTimes="0;0.04;0.16;0.88;1"
              dur="2.6s" repeatCount="indefinite" begin="0s" />
          </>}
        </circle>

        {/* Bubble B — left, fast, tiny */}
        <circle cx="18.5" cy="52" r="0.65" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0.6,-36"
              dur="1.85s" repeatCount="indefinite" begin="0.65s" />
            <animate attributeName="opacity"
              values="0;0;0.55;0.4;0"
              keyTimes="0;0.04;0.18;0.88;1"
              dur="1.85s" repeatCount="indefinite" begin="0.65s" />
          </>}
        </circle>

        {/* Bubble C — right of centre */}
        <circle cx="21.5" cy="50" r="0.75" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; -0.5,-34"
              dur="2.2s" repeatCount="indefinite" begin="1.25s" />
            <animate attributeName="opacity"
              values="0;0;0.52;0.38;0"
              keyTimes="0;0.05;0.2;0.88;1"
              dur="2.2s" repeatCount="indefinite" begin="1.25s" />
          </>}
        </circle>

        {/* Bubble D — slight left, mid-size */}
        <circle cx="19" cy="48" r="0.9" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0.8,-32"
              dur="2.9s" repeatCount="indefinite" begin="1.9s" />
            <animate attributeName="opacity"
              values="0;0;0.48;0.35;0"
              keyTimes="0;0.04;0.18;0.88;1"
              dur="2.9s" repeatCount="indefinite" begin="1.9s" />
          </>}
        </circle>

        {/* Bubble E — slow, large, centre */}
        <circle cx="20.5" cy="55" r="1.05" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; -0.3,-40"
              dur="3.3s" repeatCount="indefinite" begin="2.5s" />
            <animate attributeName="opacity"
              values="0;0;0.5;0.3;0"
              keyTimes="0;0.03;0.14;0.88;1"
              dur="3.3s" repeatCount="indefinite" begin="2.5s" />
          </>}
        </circle>

        {/* Nucleation point */}
        <circle cx="20" cy="57.2" r="0.5" fill="#D4AF37" fillOpacity="0.7" />
      </g>

      {/* ── Full glass outline ── */}
      <path
        d="
          M 14,4
          C 14,22 16,44 17,58
          L 17,80
          L 10,80
          C 7,80 6,82 6,84
          C 6,87 8,88 11,88
          L 29,88
          C 32,88 34,87 34,84
          C 34,82 33,80 30,80
          L 23,80
          L 23,58
          C 24,44 26,22 26,4
          Z
        "
        stroke="url(#strokeGrad)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Left-side glass sheen ── */}
      <path
        d="M 15,6 C 14.5,20 15,38 16,52"
        stroke="url(#shineGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Rim highlight ── */}
      <path
        d="M 15,4.5 C 17,3.2 23,3.2 25,4.5"
        stroke="#D4AF37"
        strokeWidth="0.85"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// NAV LOGO — flute icon + horizontal wordmark
// ─────────────────────────────────────────────────────────────
export function NavLogo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-3 group select-none ${className}`}>
      <div className="transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105 shrink-0">
        <WineGlassSVG size={22} />
      </div>
      <div className="flex flex-col leading-none gap-0.5">
        <span className="font-body text-[8px] tracking-[0.28em] uppercase text-gold/60 font-semibold">
          The
        </span>
        <span className="font-display font-bold text-[18px] text-white tracking-wide leading-none">
          Wine Guide
        </span>
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────
// HERO LOGO — large stacked version for home page / splash
// ─────────────────────────────────────────────────────────────
export function HeroLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-5 select-none ${className}`}>
      <div className="relative">
        <WineGlassSVG size={80} />
        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-30 scale-75"
          style={{ background: 'radial-gradient(ellipse, #F5DC6A 0%, #D4AF37 40%, transparent 70%)' }}
        />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="font-body text-[10px] tracking-[0.55em] uppercase text-gold/65 font-semibold">
          The
        </span>
        <h1
          className="font-display font-bold text-5xl text-white tracking-wide leading-none"
          style={{ textShadow: '0 2px 28px rgba(212,175,55,0.3)' }}
        >
          Wine Guide
        </h1>
        <div className="flex items-center gap-3 mt-1.5">
          <div className="h-px w-10 bg-gold/35" />
          <span className="font-body text-[9px] tracking-[0.45em] uppercase text-gold/45">
            Est. Sheffield
          </span>
          <div className="h-px w-10 bg-gold/35" />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MARK — icon only (small spaces, loading screens)
// ─────────────────────────────────────────────────────────────
export function LogoMark({ size = 40, className = '' }) {
  return (
    <Link to="/" className={`block select-none ${className}`} aria-label="The Wine Guide">
      <WineGlassSVG size={size} />
    </Link>
  )
}

export default NavLogo
