import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminGuard'
import { fail, cleanSearch, readJson, todayIST, UUID_RE } from '@/lib/apiUtils'

export const dynamic = 'force-dynamic'

const sum = (rows, key) => rows.reduce((t, r) => t + Number(r[key] || 0), 0)

// GET /api/offline/orders?q=&status=&payment=&from=&to=&customer_id=
export async function GET(req) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const sp = new URL(req.url).searchParams
  const today = todayIST()
  const monthStart = today.slice(0, 8) + '01'

  let query = supabaseAdmin
    .from('offline_orders')
    .select('id, invoice_no, invoice_date, customer_name, customer_phone, customer_type, total_amount, amount_paid, balance_due, payment_status, status, public_token, created_at')
    .order('invoice_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(300)

  const status = sp.get('status')
  if (status === 'active' || status === 'cancelled') query = query.eq('status', status)
  const payment = sp.get('payment')
  if (['paid', 'partial', 'unpaid'].includes(payment)) query = query.eq('payment_status', payment)
  if (/^\d{4}-\d{2}-\d{2}$/.test(sp.get('from') || '')) query = query.gte('invoice_date', sp.get('from'))
  if (/^\d{4}-\d{2}-\d{2}$/.test(sp.get('to') || '')) query = query.lte('invoice_date', sp.get('to'))
  if (UUID_RE.test(sp.get('customer_id') || '')) query = query.eq('customer_id', sp.get('customer_id'))
  const q = cleanSearch(sp.get('q'))
  if (q) query = query.or(`customer_name.ilike.%${q}%,invoice_no.ilike.%${q}%,customer_phone.ilike.%${q}%`)

  const [list, monthRows, dueRows] = await Promise.all([
    query,
    supabaseAdmin.from('offline_orders').select('invoice_date, total_amount').eq('status', 'active').gte('invoice_date', monthStart),
    supabaseAdmin.from('offline_orders').select('balance_due').eq('status', 'active').gt('balance_due', 0),
  ])

  if (list.error) return fail(list.error.message, 500)

  const month = monthRows.data || []
  return NextResponse.json({
    orders: list.data || [],
    summary: {
      todaySales: sum(month.filter((r) => r.invoice_date === today), 'total_amount'),
      monthSales: sum(month, 'total_amount'),
      monthCount: month.length,
      totalDue: sum(dueRows.data || [], 'balance_due'),
      dueCount: (dueRows.data || []).length,
    },
  })
}

// POST /api/offline/orders  — create a sale (stock is deducted atomically in the database)
export async function POST(req) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const b = await readJson(req)
  const items = Array.isArray(b.items)
    ? b.items.map((i) => ({
        product_id: String(i.product_id || ''),
        name: String(i.name || '').trim(),
        quantity: parseInt(i.quantity, 10),
        unit_price: Number(i.unit_price),
      }))
    : []

  if (!b.customer || !String(b.customer.name || '').trim()) return fail('Customer name is required')
  if (!items.length) return fail('Add at least one item')
  if (items.some((i) => !i.product_id || !(i.quantity > 0) || !Number.isFinite(i.unit_price) || i.unit_price < 0)) {
    return fail('Check the items: every line needs a product, quantity and rate')
  }

  const { data, error } = await supabaseAdmin.rpc('create_offline_sale', {
    p_customer: b.customer,
    p_items: items,
    p_discount: Number(b.discount) || 0,
    p_paid: Number(b.paid) || 0,
    p_method: b.method || 'cash',
    p_reference: b.reference || null,
    p_date: /^\d{4}-\d{2}-\d{2}$/.test(b.date || '') ? b.date : null,
    p_notes: b.notes || null,
  })

  if (error) return fail(error.message, 400)
  return NextResponse.json({ id: data })
}
