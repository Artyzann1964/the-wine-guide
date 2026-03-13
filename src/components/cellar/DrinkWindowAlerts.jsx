import { drinkWindowStatus } from './constants'

export default function DrinkWindowAlerts({ bottles }) {
  const year = new Date().getFullYear()
  const overdue = bottles.filter(b => drinkWindowStatus(b)?.status === 'over')
  const ready   = bottles.filter(b => drinkWindowStatus(b)?.status === 'ready')
  const soonYear = year + 2
  const soon = bottles.filter(b => {
    const from = parseInt(b.drinkFrom)
    return drinkWindowStatus(b)?.status === 'wait' && !isNaN(from) && from <= soonYear
  })

  if (!overdue.length && !ready.length && !soon.length) return null

  return (
    <div className="mb-6 space-y-2">
      {overdue.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">🔴</span>
          <div>
            <p className="font-body text-sm font-semibold text-rose-700">
              {overdue.length} bottle{overdue.length !== 1 ? 's' : ''} past peak — drink soon
            </p>
            <p className="font-body text-xs text-rose-600 mt-0.5">
              {overdue.map(b => b.name).join(', ')}
            </p>
          </div>
        </div>
      )}
      {ready.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">🟢</span>
          <div>
            <p className="font-body text-sm font-semibold text-emerald-700">
              {ready.length} bottle{ready.length !== 1 ? 's' : ''} in their drinking window now
            </p>
            <p className="font-body text-xs text-emerald-600 mt-0.5">
              {ready.map(b => b.name).join(', ')}
            </p>
          </div>
        </div>
      )}
      {soon.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">🟡</span>
          <div>
            <p className="font-body text-sm font-semibold text-amber-700">
              {soon.length} bottle{soon.length !== 1 ? 's' : ''} opening within 2 years
            </p>
            <p className="font-body text-xs text-amber-600 mt-0.5">
              {soon.map(b => `${b.name} (${b.drinkFrom})`).join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
