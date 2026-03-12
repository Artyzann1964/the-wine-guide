export function StarIcon({ filled, className = 'w-4 h-4' }) {
  return (
    <svg className={`${className} ${filled ? 'text-gold fill-gold' : 'text-cream fill-cream stroke-cream/40'}`} viewBox="0 0 16 16">
      <path d="M8 1.5l1.65 3.35L13.5 5.5l-2.75 2.68.65 3.77L8 10.15l-3.4 1.8.65-3.77L2.5 5.5l3.85-.65L8 1.5z" />
    </svg>
  )
}

export function StarDisplay({ rating, size = 'w-4 h-4' }) {
  if (!rating || rating <= 0) return null
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < rating} className={size} />
      ))}
    </div>
  )
}

export function StarInput({ value, onChange, size = 'w-6 h-6', label }) {
  return (
    <div>
      {label && (
        <span className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">{label}</span>
      )}
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(value === i + 1 ? 0 : i + 1)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <StarIcon filled={i < (value || 0)} className={size} />
          </button>
        ))}
        {value > 0 && (
          <button
            type="button"
            onClick={() => onChange(0)}
            className="ml-1 font-body text-xs text-slate-lt hover:text-terracotta transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
