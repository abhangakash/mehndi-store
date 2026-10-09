'use client'

const TZ = 'Asia/Kolkata'

// Scans at these places are not shown to customers (case-insensitive; matches the scan's place or text).
const HIDE_SCANS_AT = [
  'anjandoh',
  'awati',
  'borgaon (kml)',
  'devlali',
  'gulsade (gulsadi)',
  'jategaon',
  'jinti',
  'karanje',
  'kolegaon (e)',
  'korti',
  'kumbhargaon',
  'mangi',
  'pande',
  'phisare',
  'pothare',
  'rajuri',
  'raogaon (ravgaon)',
  'sawadi',
  'takli rasin',
  'veet',
  'vihal'
];

const dayKey = (d) => d.toLocaleDateString('en-CA', { timeZone: TZ })
const dayLabel = (d) =>
  d.toLocaleDateString('en-IN', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' })
const timeLabel = (d) => {
  const t = d.toLocaleTimeString('en-IN', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true })
  return t.toLowerCase() === '12:00 am' ? '' : t // some scans carry a date but no time
}

export default function TrackingTimeline({ order }) {
  if (!order.tracking_number) return null

  const t = order.tracking
  const courierName = order.courier === 'india_post' ? 'India Post' : 'the courier'

  const carrierEvents = (t?.events || [])
    .filter(e => {
      const text = `${e.location || ''} ${e.detail || ''}`.toLowerCase()
      return !HIDE_SCANS_AT.some(name => text.includes(name))
    })
    .map(e => ({ date: e.date, title: e.detail, place: e.location }))
  const ownEvents = []
  if (order.shipped_at) {
    ownEvents.push({ date: order.shipped_at, title: `Shipped from CrabVeda and handed over to ${courierName}`, place: '' })
  }
  if (order.created_at) {
    ownEvents.push({ date: order.created_at, title: 'Order placed', place: '' })
  }

  const all = [...carrierEvents, ...ownEvents]
    .map(e => ({ ...e, d: new Date(e.date) }))
    .filter(e => e.date && !isNaN(e.d))
    .sort((a, b) => b.d - a.d)

  const groups = []
  for (const e of all) {
    const key = dayKey(e.d)
    let g = groups[groups.length - 1]
    if (!g || g.key !== key) {
      g = { key, label: dayLabel(e.d), items: [] }
      groups.push(g)
    }
    g.items.push(e)
  }
  const latest = all[0]

  return (
    <div className="px-5 py-5 border-t border-gray-100">
      <p className="text-sm font-bold text-[#0a0f0d]">Shipment updates</p>

      {!t?.available && (
        <p className="mt-3 text-[11px] text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          Live updates from {courierName} are temporarily unavailable. Please check again in a little while.
        </p>
      )}
      {t?.available && (t?.events?.length || 0) === 0 && (
        <p className="mt-3 text-[11px] text-gray-600 bg-slate-50 border border-black/5 rounded-lg px-3 py-2">
          {courierName} has not shown a scan yet. The first update usually appears within a day of dispatch.
        </p>
      )}

      {groups.map(g => (
        <div key={g.key} className="mt-5">
          <p className="text-xs font-bold text-[#0a0f0d] mb-3">{g.label}</p>
          <ol className="relative border-l-2 border-slate-200 ml-[5px]">
            {g.items.map((e, i) => {
              const isLatest = e === latest
              return (
                <li key={i} className="relative pl-5 pb-5 last:pb-0">
                  <span
                    className="absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 border-white"
                    style={{
                      backgroundColor: isLatest ? '#93731e' : '#cbd5e1',
                      boxShadow: isLatest ? '0 0 0 3px rgba(147,115,30,0.18)' : 'none',
                    }}
                  />
                  <div className="flex items-start gap-3">
                    <p className="w-[4.5rem] shrink-0 text-[11px] text-gray-500 pt-0.5">{timeLabel(e.d)}</p>
                    <div className="min-w-0">
                      <p className={`text-[13px] leading-snug ${isLatest ? 'font-bold text-[#0a0f0d]' : 'font-medium text-gray-700'}`}>
                        {e.title}
                      </p>
                      {e.place && <p className="text-[11px] text-gray-500 mt-0.5">{e.place}</p>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}