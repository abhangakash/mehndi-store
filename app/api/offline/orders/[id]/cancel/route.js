import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminGuard'
import { fail, readJson, UUID_RE } from '@/lib/apiUtils'

// POST /api/offline/orders/<id>/cancel  { reason }  — cancels the sale and restores stock
export async function POST(req, { params }) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  if (!UUID_RE.test(id || '')) return fail('Sale not found', 404)

  const b = await readJson(req)
  const { error } = await supabaseAdmin.rpc('cancel_offline_order', {
    p_order_id: id,
    p_reason: b.reason || null,
  })

  if (error) return fail(error.message, 400)
  return NextResponse.json({ ok: true })
}
