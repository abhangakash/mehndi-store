import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminGuard'
import { fail, readJson, UUID_RE } from '@/lib/apiUtils'

// POST /api/offline/orders/<id>/payments  { amount, method, reference, note, paid_on }
export async function POST(req, { params }) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  if (!UUID_RE.test(id || '')) return fail('Sale not found', 404)

  const b = await readJson(req)
  const amount = Number(b.amount)
  if (!Number.isFinite(amount) || amount <= 0) return fail('Enter a valid amount')

  const { error } = await supabaseAdmin.rpc('add_offline_payment', {
    p_order_id: id,
    p_amount: amount,
    p_method: b.method || 'cash',
    p_reference: b.reference || null,
    p_note: b.note || null,
    p_paid_on: /^\d{4}-\d{2}-\d{2}$/.test(b.paid_on || '') ? b.paid_on : null,
  })

  if (error) return fail(error.message, 400)
  return NextResponse.json({ ok: true })
}
