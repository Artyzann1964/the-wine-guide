import { useState } from 'react'
import { StarInput } from './StarRating'

export default function TastingNoteModal({ bottle, onClose, onSave }) {
  const [form, setForm] = useState({
    rating: bottle?.rating || 0,
    score: bottle?.score || '',
    note: '',
    wouldBuyAgain: 0,
  })

  function set(key, value) {
    setForm(current => ({ ...current, [key]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave({
      rating: Number(form.rating) || 0,
      score: form.score === '' ? null : Number(form.score),
      note: form.note,
      wouldBuyAgain: form.wouldBuyAgain || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-slate/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-cream flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-xl text-slate">Mark as Tasted</h2>
            <p className="font-body text-xs text-slate-lt mt-1">
              {bottle.quantity > 1 ? 'This logs one bottle as tasted and leaves the rest in your cellar.' : 'This moves the bottle into Tasting Notes.'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-slate-lt hover:bg-gold/20 transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="font-display font-semibold text-slate text-lg leading-tight">{bottle.name}</p>
            {bottle.producer && <p className="font-body text-xs text-slate-lt mt-1">{bottle.producer}</p>}
          </div>

          <StarInput
            label="Quality Rating"
            value={form.rating}
            onChange={v => set('rating', v)}
            size="w-7 h-7"
          />

          <StarInput
            label="Would Buy Again?"
            value={form.wouldBuyAgain}
            onChange={v => set('wouldBuyAgain', v)}
            size="w-7 h-7"
          />

          <div>
            <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Score (optional)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.score}
              onChange={e => set('score', e.target.value)}
              placeholder="e.g. 92"
              className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Tasting note</label>
            <textarea
              value={form.note}
              onChange={e => set('note', e.target.value)}
              rows={4}
              placeholder="What stood out? Fruit, structure, pairing, occasion..."
              className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save Tasting Note</button>
          </div>
        </form>
      </div>
    </div>
  )
}
