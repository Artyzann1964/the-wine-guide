import { Link } from 'react-router-dom'

export default function EmptyState({ icon, title, body, cta, onCta, ctaLink }) {
  return (
    <div className="text-center py-20">
      <span className="text-5xl mb-4 block">{icon}</span>
      <h3 className="font-display font-semibold text-xl text-slate mb-2">{title}</h3>
      <p className="font-body text-sm text-slate-lt max-w-sm mx-auto mb-6">{body}</p>
      {ctaLink ? (
        <Link to={ctaLink} className="btn-primary">{cta}</Link>
      ) : (
        <button onClick={onCta} className="btn-primary">{cta}</button>
      )}
    </div>
  )
}
