export default function VivinoImportPanel({ status, importing, onImport }) {
  return (
    <div className="surface-panel p-5 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="max-w-2xl">
          <p className="section-label mb-2">Vivino</p>
          <h3 className="font-display font-semibold text-2xl text-slate mb-1">Import your Vivino history</h3>
          <p className="font-body text-sm text-slate-lt">Loads wines from `public/vivino_wines_export.csv` into Tasting Notes with duplicate protection.</p>
        </div>
        <button onClick={onImport} disabled={importing} className={`btn-primary ${importing ? 'opacity-65 cursor-wait' : ''}`}>
          {importing ? 'Importing…' : 'Import Vivino CSV'}
        </button>
      </div>

      {status?.message && (
        <div className={`mt-3 rounded-xl border px-3 py-2.5 ${
          status.tone === 'success'
            ? 'bg-emerald-50 border-emerald-200'
            : status.tone === 'error'
              ? 'bg-rose-50 border-rose-200'
              : 'bg-gold/10 border-gold/30'
        }`}>
          <p className="font-body text-xs text-slate">{status.message}</p>
        </div>
      )}
    </div>
  )
}
