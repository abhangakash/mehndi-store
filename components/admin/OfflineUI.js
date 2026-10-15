// Small shared UI pieces for the offline-sales admin pages.
import { PAYMENT_STATUS_LABEL } from '@/lib/format'

export const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50 disabled:text-slate-500'

export const labelCls = 'mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500'

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'

export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'

export function Card({ title, right, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h2>
          {right}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

export function SummaryCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p> : null}
    </div>
  )
}

const BADGE = {
  paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  partial: 'border-amber-200 bg-amber-50 text-amber-700',
  unpaid: 'border-rose-200 bg-rose-50 text-rose-700',
  cancelled: 'border-slate-300 bg-slate-100 text-slate-500',
}

export function StatusBadge({ status, cancelled }) {
  const key = cancelled ? 'cancelled' : status
  const label = cancelled ? 'Cancelled' : PAYMENT_STATUS_LABEL[status] || status
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${BADGE[key] || BADGE.unpaid}`}>
      {label}
    </span>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return <p className="py-10 text-center text-sm text-slate-400">{label}</p>
}
