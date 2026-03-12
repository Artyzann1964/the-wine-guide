import { useState } from 'react'
import { useCellar } from '../../hooks/useCellar'
import { PURCHASE_CHANNELS, RETAILER_OPTIONS } from './constants'
import { StarInput } from './StarRating'

export default function EditBottleModal({ bottle, onClose }) {
  const { updateBottle } = useCellar()
  const [form, setForm] = useState({
    name: bottle.name || '',
    producer: bottle.producer || '',
    vintage: bottle.vintage || '',
    category: bottle.category || 'red',
    quantity: bottle.quantity || 1,
    purchasePrice: bottle.purchasePrice || '',
    location: bottle.location || '',
    notes: bottle.notes || '',
    purchaseSourceType: bottle.purchaseSourceType || 'supermarket',
    purchaseRetailer: bottle.purchaseRetailer || '',
    purchaseRetailerOther: bottle.purchaseRetailerOther || '',
    rating: bottle.rating || 0,
    drinkFrom: bottle.drinkFrom || '',
    drinkBy: bottle.drinkBy || '',
  })
  const [saved, setSaved] = useState(false)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    updateBottle(bottle.id, {
      ...form,
      quantity: Number(form.quantity) || 1,
      rating: form.rating || null,
    })
    setSaved(true)
    setTimeout(onClose, 800)
  }

  const inputCls = 'w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm text-slate focus:outline-none focus:border-gold transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-slate/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-cream flex items-center justify-between">
          <h2 className="font-display font-semibold text-xl text-slate">Edit Bottle</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-slate-lt hover:bg-gold/20 transition-colors">
            ✕
          </button>
        </div>

        {saved ? (
          <div className="p-10 text-center">
            <span className="text-4xl mb-3 block">✅</span>
            <p className="font-display font-semibold text-lg text-slate">Bottle updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Wine Name *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Producer / House</label>
                <input type="text" value={form.producer} onChange={e => set('producer', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Vintage</label>
                <input type="text" value={form.vintage} onChange={e => set('vintage', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                  {['sparkling', 'white', 'red', 'rosé', 'dessert'].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Quantity</label>
                <input type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Purchase Price (£)</label>
                <input type="number" step="0.01" value={form.purchasePrice} onChange={e => set('purchasePrice', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Storage location</label>
                <input type="text" value={form.location} onChange={e => set('location', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Drink from (year)</label>
                <input type="text" value={form.drinkFrom} onChange={e => set('drinkFrom', e.target.value)} placeholder="e.g. 2025" className={inputCls} />
              </div>
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Drink by (year)</label>
                <input type="text" value={form.drinkBy} onChange={e => set('drinkBy', e.target.value)} placeholder="e.g. 2030" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Bought via</label>
                <select value={form.purchaseSourceType} onChange={e => set('purchaseSourceType', e.target.value)} className={inputCls}>
                  {PURCHASE_CHANNELS.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Bought from</label>
                <select value={form.purchaseRetailer} onChange={e => set('purchaseRetailer', e.target.value)} className={inputCls}>
                  <option value="">Select retailer / venue</option>
                  {RETAILER_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            {form.purchaseRetailer === 'Other' && (
              <div>
                <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Other retailer / venue</label>
                <input type="text" value={form.purchaseRetailerOther} onChange={e => set('purchaseRetailerOther', e.target.value)} placeholder="Enter store or venue name" className={inputCls} />
              </div>
            )}

            <StarInput
              label="My Rating"
              value={form.rating}
              onChange={v => set('rating', v)}
              size="w-7 h-7"
            />

            <div>
              <label className="font-body text-xs text-slate-lt uppercase tracking-widest block mb-1.5">Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Any notes — occasion, gift, where purchased..." className={`${inputCls} resize-none`} />
            </div>
            <button type="submit" className="btn-primary w-full text-base py-3">
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
