// components/AdminTrackingInput.jsx
'use client'
import { useState } from 'react'
import { Truck, Check } from 'lucide-react'

// Props: order, onSave(orderId, { trackingNumber, courier, sendEmail }) -> Promise<boolean>
export default function AdminTrackingInput({ order, onSave }) {
  const [courier, setCourier] = useState(order.courier || 'india_post')
  const [number, setNumber] = useState(order.tracking_number || '')
  const [saving, setSaving] = useState(false)
  const saved = !!order.tracking_number && order.tracking_number === number.trim().toUpperCase()

  const submit = async (e) => {
    e.preventDefault()
    if (!number.trim()) return
    setSaving(true)
    await onSave(order.id, { trackingNumber: number, courier, sendEmail: order.tracking_number !== number.trim().toUpperCase() })
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2 pt-2 w-full">
      <select
        value={courier}
        onChange={e => setCourier(e.target.value)}
        className="text-xs font-bold px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700"
      >
        <option value="india_post">India Post</option>
        <option value="other">Other</option>
      </select>
      <input
        value={number}
        onChange={e => setNumber(e.target.value.toUpperCase())}
        placeholder="Consignment no. e.g. EE123456789IN"
        className="flex-1 min-w-[190px] text-xs font-mono px-3 py-1.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-600/40"
      />
      <button
        type="submit"
        disabled={saving || !number.trim() || saved}
        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50"
      >
        {saved ? <><Check size={11} /> Saved</> : <><Truck size={11} /> {saving ? 'Saving...' : order.tracking_number ? 'Update' : 'Save & Mark Shipped'}</>}
      </button>
    </form>
  )
}