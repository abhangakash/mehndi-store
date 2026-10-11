import { supabaseAdmin } from '@/lib/supabase'
import { ORDER_FIELDS, attachTracking } from '@/lib/orderTracking'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { type, value } = await req.json()
    const v = (value || '').trim()
    if (!v) return NextResponse.json({ error: 'Missing value' }, { status: 400 })

    let query = supabaseAdmin.from('orders').select(ORDER_FIELDS)

    if (type === 'phone') {
      if (!/^\d{10}$/.test(v)) return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
      query = query.eq('phone', v)
    } else if (type === 'email') {
      const escaped = v.replace(/[\\%_]/g, (c) => '\\' + c)
      query = query.ilike('email', escaped)
    } else if (type === 'order_id') {
      const p = v.replace(/^#/, '').toLowerCase()
      if (!/^[0-9a-f]{8}$/.test(p)) return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
      query = query
        .gte('id', `${p}-0000-0000-0000-000000000000`)
        .lte('id', `${p}-ffff-ffff-ffff-ffffffffffff`)
    } else {
      return NextResponse.json({ error: 'Invalid search type' }, { status: 400 })
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(10)
    if (error) {
      console.error('track-order query error:', error.message)
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
    }

    const orders = await attachTracking(data)
    return NextResponse.json({ orders })
  } catch (err) {
    console.error('track-order error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}