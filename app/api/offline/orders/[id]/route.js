import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminGuard'
import { fail, UUID_RE } from '@/lib/apiUtils'

export const dynamic = 'force-dynamic'

// GET /api/offline/orders/<id> — one sale with its items and payments
export async function GET(req, { params }) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const { id } = await params
  if (!UUID_RE.test(id || '')) return fail('Sale not found', 404)

  const { data, error } = await supabaseAdmin
    .from('offline_orders')
    .select('*, offline_order_items(*), offline_payments(*)')
    .eq('id', id)
    .single()

  if (error || !data) return fail('Sale not found', 404)

  data.offline_payments = (data.offline_payments || []).sort(
    (a, b) => String(a.paid_on).localeCompare(String(b.paid_on)) || String(a.created_at).localeCompare(String(b.created_at))
  )
  return NextResponse.json({ order: data })
}
