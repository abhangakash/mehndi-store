import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminGuard'
import { fail, cleanSearch, readJson } from '@/lib/apiUtils'

export const dynamic = 'force-dynamic'

// GET /api/offline/customers?q=&due=1  — customers with their outstanding balance
export async function GET(req) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const sp = new URL(req.url).searchParams
  let query = supabaseAdmin.from('offline_customer_summary').select('*').order('name', { ascending: true }).limit(300)

  const q = cleanSearch(sp.get('q'))
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
  if (sp.get('due') === '1') query = query.gt('balance_due', 0)

  const { data, error } = await query
  if (error) return fail(error.message, 500)
  return NextResponse.json({ customers: data || [] })
}

// POST /api/offline/customers — add a customer without making a sale
export async function POST(req) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const b = await readJson(req)
  const name = String(b.name || '').trim()
  if (!name) return fail('Customer name is required')

  const phone = String(b.phone || '').replace(/\s+/g, '') || null
  const { data, error } = await supabaseAdmin
    .from('offline_customers')
    .insert({
      name,
      phone,
      customer_type: b.customer_type === 'retail' ? 'retail' : 'wholesale',
      address: b.address || null,
      city: b.city || null,
      state: b.state || null,
      pincode: b.pincode || null,
      gstin: b.gstin || null,
      notes: b.notes || null,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return fail('A customer with this phone number already exists', 409)
    return fail(error.message, 400)
  }
  return NextResponse.json({ id: data.id })
}
