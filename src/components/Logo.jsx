import { Link } from 'react-router-dom'

export function AmandaAvatar({ size = 34, className = '', alt = 'Amanda Holmes' }) {
  return (
    <img
      src="/amanda-avatar.jpg"
      width={size}
      height={size}
      alt={alt}
      className={`rounded-full object-cover object-top border border-gold/45 shadow-md ${className}`}
      loading="eager"
      decoding="async"
    />
  )
}

export function AmandaBrandGlyph({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="amandaRing" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F5DC8A" />
          <stop offset="0.5" stopColor="#C9973A" />
          <stop offset="1" stopColor="#8A5F1A" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" stroke="url(#amandaRing)" strokeWidth="3" />
      <path d="M20 46L31 18L43 46" stroke="#C9973A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25.5 34H37.5" stroke="#C9973A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="14" r="4" fill="#C9973A" fillOpacity="0.28" />
      <path d="M50 10.5V17.5M46.5 14H53.5" stroke="#C9973A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function NavLogo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group select-none ${className}`}>
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
        <AmandaAvatar size={32} alt="Amanda Holmes" />
      </div>
      <div className="shrink-0 transition-transform duration-300 group-hover:rotate-3">
        <AmandaBrandGlyph size={24} />
      </div>
      <div className="flex flex-col leading-none gap-0.5">
        <span className="font-body text-[8px] tracking-[0.22em] uppercase text-gold/70 font-semibold">Amanda's</span>
        <span className="font-display font-bold text-[17px] text-white tracking-wide leading-none">Wine Guide</span>
        <span className="font-body text-[8px] tracking-[0.18em] uppercase text-white/45">by Richard</span>
      </div>
    </Link>
  )
}

export function HeroLogo({ className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-4 select-none ${className}`}>
      <div className="relative flex items-center gap-4">
        <AmandaAvatar size={62} />
        <AmandaBrandGlyph size={72} />
        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-30 scale-75"
          style={{ background: 'radial-gradient(ellipse, #F5DC6A 0%, #D4AF37 40%, transparent 70%)' }}
        />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="font-body text-[10px] tracking-[0.42em] uppercase text-gold/65 font-semibold">Amanda's</span>
        <h1 className="font-display font-bold text-5xl text-white tracking-wide leading-none" style={{ textShadow: '0 2px 28px rgba(212,175,55,0.3)' }}>
          Wine Guide
        </h1>
        <p className="font-body text-[10px] tracking-[0.22em] uppercase text-white/55">A gift by Richard</p>
      </div>
    </div>
  )
}

export function LogoMark({ size = 42, className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-1.5 select-none ${className}`} aria-label="Amanda's Wine Guide">
      <AmandaAvatar size={Math.max(22, Math.round(size * 0.62))} />
      <AmandaBrandGlyph size={Math.max(16, Math.round(size * 0.5))} />
    </Link>
  )
}

export default NavLogo
