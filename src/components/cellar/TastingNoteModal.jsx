import { useState } from 'react'
import { StarInput } from './StarRating'

const COLOUR_OPTIONS = [
  'Pale straw', 'Golden', 'Amber', 'Light ruby', 'Garnet', 'Ruby', 'Deep ruby', 'Inky purple', 'Tawny',
]

const NOSE_OPTIONS = [
  'Red fruit', 'Black fruit', 'Citrus', 'Tropical', 'Stone fruit', 'Floral',
  'Earthy', 'Spicy', 'Oaky/vanilla', 'Mineral', 'Herbal', 'Smoky', 'Nutty', 'Yeasty',
]

const BODY_OPTIONS = ['Light', 'Medium', 'Full']
const ACIDITY_OPTIONS = ['Crisp', 'Balanced', 'Soft']
const TANNIN_OPTIONS = ['Soft', 'Silky', 'Firm', 'Grippy']
const FINISH_OPTIONS = ['Short', 'Medium', 'Long', 'Very long']

function ChipSelect({ options, selected, onToggle, multi = false }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => {
        const isSelected = multi
          ? (selected || []).includes(opt)
          : selected === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`px-2.5 py-1 rounded-full font-body text-xs transition-all ${
              isSelected
                ? 'bg-slate text-white'
                : 'bg-cream text-slate-lt hover:bg-cream/70 hover:text-slate'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function hasStructuredData(bottle) {
  return !!(
    bottle?.colour ||
    (Array.isArray(bottle?.nose) && bottle.nose.length > 0) ||
    bottle?.body ||
    bottle?.acidity ||
    bottle?.tannins ||
    bottle?.finish
  )
}

export default function TastingNoteModal({ bottle, onClose, onSave, editMode = false }) {
  const [form, setForm] = useState({
    rating: bottle?.rating || 0,
    score: bottle?.score ?? '',
    note: editMode ? (bottle?.tastingNote || '') : '',
    wouldBuyAgain: editMode ? (bottle?.wouldBuyAgain || 0) : 0,
    colour: editMode ? (bottle?.colour || '') : '',
    nose: editMode ? (bottle?.nose || []) : [],
    body: editMode ? (bottle?.body || '') : '',
    acidity: editMode ? (bottle?.acidity || '') : '',
    tannins: editMode ? (bottle?.tannins || '') : '',
    finish: editMode ? (bottle?.finish || '') : '',
  })
  const [showStructured, setShowStructured] = useState(editMode && hasStructuredData(bottle))

  function set(key, value) {
    setForm(current => ({ ...current, [key]: value }))
  }

  function toggleNose(item) {
    setForm(current => ({
      ...current,
      nose: current.nose.includes(item)
        ? current.nose.filter(n => n !== item)
        : [...current.nose, item],
    }))
  }

  function toggleSingle(key, value) {
    setForm(current => ({
      ...current,
      [key]: current[key] === value ? '' : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const structured = showStructured ? {
      colour: form.colour || null,
      nose: form.nose.length ? form.nose : null,
      body: form.body || null,
      acidity: form.acidity || null,
      tannins: form.tannins || null,
      finish: form.finish || null,
    } : {}
    onSave({
      rating: Number(form.rating) || 0,
      score: form.score === '' ? null : Number(form.score),
      note: form.note,
      wouldBuyAgain: form.wouldBuyAgain || null,
      ...structured,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-slate/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="p-6 border-b border-cream flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-xl text-slate">
              {editMode ? 'Edit Tasting Note' : 'Mark as Tasted'}
            </h2>
            {!editMode && (
              <p className="font-body text-xs text-slate-lt mt-1">
                {bottle.quantity > 1 ? 'This logs one bottle as tasted and leaves the rest in your cellar.' : 'This moves the bottle into Tasting Notes.'}
              </p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-slate-lt hover:bg-gold/20 transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
              rows={3}
              placeholder="What stood out? Fruit, structure, pairing, occasion..."
              className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          {/* Structured tasting fields — collapsible */}
          <div className="rounded-xl border border-cream overflow-hidden">
            <button
              type="button"
              onClick={() => setShowStructured(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-cream/40 hover:bg-cream/70 transition-colors"
            >
              <span className="font-body text-xs font-semibold text-slate uppercase tracking-widest">
                Structured Notes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-body text-xs text-slate-lt">optional</span>
                <svg
                  className={`w-4 h-4 text-slate-lt transition-transform ${showStructured ? 'rotate-180' : ''}`}
                  viewBox="0 0 16 16" fill="none"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            {showStructured && (
              <div className="px-4 py-4 space-y-4">
                <div>
                  <p className="font-body text-xs text-slate-lt uppercase tracking-widest mb-2">Colour</p>
                  <ChipSelect
                    options={COLOUR_OPTIONS}
                    selected={form.colour}
                    onToggle={v => toggleSingle('colour', v)}
                  />
                </div>

                <div>
                  <p className="font-body text-xs text-slate-lt uppercase tracking-widest mb-2">Nose / Aromas</p>
                  <ChipSelect
                    options={NOSE_OPTIONS}
                    selected={form.nose}
                    onToggle={toggleNose}
                    multi
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs text-slate-lt uppercase tracking-widest mb-2">Body</p>
                    <ChipSelect options={BODY_OPTIONS} selected={form.body} onToggle={v => toggleSingle('body', v)} />
                  </div>
                  <div>
                    <p className="font-body text-xs text-slate-lt uppercase tracking-widest mb-2">Acidity</p>
                    <ChipSelect options={ACIDITY_OPTIONS} selected={form.acidity} onToggle={v => toggleSingle('acidity', v)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-body text-xs text-slate-lt uppercase tracking-widest mb-2">Tannins</p>
                    <ChipSelect options={TANNIN_OPTIONS} selected={form.tannins} onToggle={v => toggleSingle('tannins', v)} />
                  </div>
                  <div>
                    <p className="font-body text-xs text-slate-lt uppercase tracking-widest mb-2">Finish</p>
                    <ChipSelect options={FINISH_OPTIONS} selected={form.finish} onToggle={v => toggleSingle('finish', v)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">
              {editMode ? 'Save Changes' : 'Save Tasting Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
