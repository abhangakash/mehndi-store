import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminGuard'
import { fail, readJson } from '@/lib/apiUtils'

export const dynamic = 'force-dynamic'

// GET /api/offline/stock?product_id=  — products with live stock + recent stock movements
export async function GET(req) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const productId = new URL(req.url).searchParams.get('product_id')

  let moves = supabaseAdmin
    .from('stock_movements')
    .select('id, product_id, product_name, change, stock_after, reason, order_id, note, created_at')
    .order('created_at', { ascending: false })
    .limit(60)
  if (productId) moves = moves.eq('product_id', productId)

  const [products, movements] = await Promise.all([
    supabaseAdmin.from('products').select('id, name, price, stock').order('name', { ascending: true }),
    moves,
  ])

  if (products.error) return fail(products.error.message, 500)
  return NextResponse.json({ products: products.data || [], movements: movements.data || [] })
}

// POST /api/offline/stock  { product_id, change, reason: 'restock' | 'adjustment', note }
export async function POST(req) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const b = await readJson(req)
  const change = parseInt(b.change, 10)
  if (!b.product_id) return fail('Choose a product')
  if (!Number.isInteger(change) || change === 0) return fail('Enter a quantity')

  const { data, error } = await supabaseAdmin.rpc('adjust_stock', {
    p_product_id: String(b.product_id),
    p_change: change,
    p_reason: b.reason === 'adjustment' ? 'adjustment' : 'restock',
    p_note: b.note || null,
  })

  if (error) return fail(error.message, 400)
  return NextResponse.json({ stock: data })
}
