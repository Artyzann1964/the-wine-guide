// src/components/Logo.jsx
// The Wine Guide — brand logo component
// Amanda loves fizzy — so we celebrate with a Champagne flute + rising bubbles

import { Link } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────
// Core SVG — hand-crafted Champagne flute, golden palette
// Bubbles animated with SVG-native animateTransform
// ─────────────────────────────────────────────────────────────
export function WineGlassSVG({ size = 48, className = '', animate = true }) {
  const h = Math.round(size * 2.2)
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 40 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Champagne fill — warm straw gold */}
        <linearGradient id="champGrad" x1="0%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%"   stopColor="#F2D060" stopOpacity="0.85" />
          <stop offset="60%"  stopColor="#C89828" stopOpacity="0.90" />
          <stop offset="100%" stopColor="#9A6E10" stopOpacity="0.95" />
        </linearGradient>

        {/* Glass body — very subtle tint */}
        <linearGradient id="glassBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0.06" />
          <stop offset="40%"  stopColor="#D4AF37" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.04" />
        </linearGradient>

        {/* Left-side shine */}
        <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Foot gradient */}
        <linearGradient id="footGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#A07818" stopOpacity="0.7" />
        </linearGradient>

        {/* Clip to bowl interior for fill + bubbles */}
        <clipPath id="bowlClip">
          <path d="M 10,6 C 10,16 13,34 15,50 L 25,50 C 27,34 30,16 30,6 Z" />
        </clipPath>
      </defs>

      {/* ── Glass bowl — subtle fill ── */}
      <path
        d="M 10,6 C 10,16 13,34 15,50 L 25,50 C 27,34 30,16 30,6 Z"
        fill="url(#glassBodyGrad)"
      />

      {/* ── Champagne fill — clipped to bowl, ~75% full ── */}
      <g clipPath="url(#bowlClip)">
        {/* Fill body */}
        <path
          d="M 10,17 C 14,16 26,16 30,17 L 30,50 L 10,50 Z"
          fill="url(#champGrad)"
        />
        {/* Meniscus — subtle curved top of liquid */}
        <ellipse cx="20" cy="17" rx="9.6" ry="1.4"
          fill="#F5DC70" fillOpacity="0.45" />

        {/* ── Bubbles ── each rises from bottom to surface ── */}
        {/* Bubble 1 — centre */}
        <circle cx="20" cy="46" r="1.1" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; -0.5,-28; 0.3,-28" keyTimes="0;0.85;1"
              dur="2.4s" repeatCount="indefinite" begin="0s" />
            <animate attributeName="opacity"
              values="0;0;0.55;0.45;0"
              keyTimes="0;0.05;0.2;0.85;1"
              dur="2.4s" repeatCount="indefinite" begin="0s" />
          </>}
        </circle>

        {/* Bubble 2 — left of centre */}
        <circle cx="16.5" cy="44" r="0.9" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0.8,-26; -0.4,-26" keyTimes="0;0.85;1"
              dur="1.9s" repeatCount="indefinite" begin="0.7s" />
            <animate attributeName="opacity"
              values="0;0;0.5;0.4;0"
              keyTimes="0;0.05;0.2;0.85;1"
              dur="1.9s" repeatCount="indefinite" begin="0.7s" />
          </>}
        </circle>

        {/* Bubble 3 — right of centre */}
        <circle cx="23.5" cy="42" r="1.0" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; -0.6,-24; 0.5,-24" keyTimes="0;0.85;1"
              dur="2.1s" repeatCount="indefinite" begin="1.3s" />
            <animate attributeName="opacity"
              values="0;0;0.5;0.4;0"
              keyTimes="0;0.05;0.2;0.85;1"
              dur="2.1s" repeatCount="indefinite" begin="1.3s" />
          </>}
        </circle>

        {/* Bubble 4 — far left, tiny */}
        <circle cx="14" cy="40" r="0.75" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 1,-22" keyTimes="0;1"
              dur="2.7s" repeatCount="indefinite" begin="0.3s" />
            <animate attributeName="opacity"
              values="0;0;0.45;0.35;0"
              keyTimes="0;0.05;0.25;0.85;1"
              dur="2.7s" repeatCount="indefinite" begin="0.3s" />
          </>}
        </circle>

        {/* Bubble 5 — right side, tiny */}
        <circle cx="25.5" cy="38" r="0.7" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; -0.8,-20" keyTimes="0;1"
              dur="3.0s" repeatCount="indefinite" begin="1.8s" />
            <animate attributeName="opacity"
              values="0;0;0.4;0.3;0"
              keyTimes="0;0.05;0.25;0.85;1"
              dur="3.0s" repeatCount="indefinite" begin="1.8s" />
          </>}
        </circle>

        {/* Bubble 6 — slow, large, centre */}
        <circle cx="19" cy="47" r="1.3" fill="white" fillOpacity="0">
          {animate && <>
            <animateTransform attributeName="transform" type="translate"
              values="0,0; 0.5,-30"
              dur="3.4s" repeatCount="indefinite" begin="2.2s" />
            <animate attributeName="opacity"
              values="0;0;0.45;0.3;0"
              keyTimes="0;0.04;0.18;0.85;1"
              dur="3.4s" repeatCount="indefinite" begin="2.2s" />
          </>}
        </circle>
      </g>

      {/* ── Glass outline ── */}
      <path
        d="
          M 10,6
          C 10,16 13,34 15,50
          L 15,68
          L 8,68
          C 5,68 4,70 4,72
          C 4,75 6,76 9,76
          L 31,76
          C 34,76 36,75 36,72
          C 36,70 35,68 32,68
          L 25,68
          L 25,50
          C 27,34 30,16 30,6
          Z
        "
        stroke="url(#footGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Left-side glass sheen ── */}
      <path
        d="M 11,8 C 11,18 12,30 13,42"
        stroke="url(#shineGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Rim highlight ── */}
      <path
        d="M 11,7 C 15,5.5 25,5.5 29,7"
        stroke="#D4AF37"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />

      {/* ── Tiny effervescence dot at base of fill (nucleation point) ── */}
      <circle cx="20" cy="49.5" r="0.7" fill="#D4AF37" fillOpacity="0.6" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// NAV LOGO — icon + horizontal wordmark
// ─────────────────────────────────────────────────────────────
export function NavLogo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-3 group select-none ${className}`}>
      <div className="transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
        <WineGlassSVG size={26} />
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
// HERO LOGO — large stacked, for home page / splash
// ─────────────────────────────────────────────────────────────
export function HeroLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-5 select-none ${className}`}>
      <div className="relative">
        <WineGlassSVG size={96} />
        {/* Golden glow behind the flute */}
        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-35 scale-75"
          style={{ background: 'radial-gradient(ellipse, #F2D060 0%, #D4AF37 40%, transparent 70%)' }}
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
