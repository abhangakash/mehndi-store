import { supabaseAdmin } from '@/lib/supabase'
import { createTracker, getTracking } from '@/lib/ship24'
import { markDelivered } from '@/lib/markDelivered'
import { NextResponse } from 'next/server'

const FIELDS =
  'id, created_at, order_status, total_amount, subtotal, shipping_amount, payment_method, ' +
  'customer_name, address, city, state, pincode, phone, courier, tracking_number, shipped_at, ship24_tracker_id, ' +
  'order_items(*)'

export async function POST(req) {
  try {
    const { type, value } = await req.json()
    const v = (value || '').trim()
    if (!v) return NextResponse.json({ error: 'Missing value' }, { status: 400 })

    let query = supabaseAdmin.from('orders').select(FIELDS)

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

    const orders = await Promise.all(
      (data || []).map(async (o) => {
        const { ship24_tracker_id, ...safe } = o
        let tracking = null

        if (o.tracking_number && o.courier === 'india_post' && o.order_status !== 'cancelled') {
          let trackerId = ship24_tracker_id
          // Registered late (e.g. Ship24 was down when admin saved)? Register now.
          if (!trackerId) {
            const created = await createTracker(o.tracking_number, o.id)
            if (created.ok) {
              trackerId = created.trackerId
              await supabaseAdmin.from('orders').update({ ship24_tracker_id: trackerId }).eq('id', o.id)
            }
          }
          tracking = trackerId ? await getTracking(trackerId) : { available: false }

          // Backup for the webhook: if India Post says delivered, update the order and send the email once.
          if (tracking?.status === 'delivered' && o.order_status !== 'delivered') {
            await markDelivered(o.id)
            safe.order_status = 'delivered'
          }
        }
        return { ...safe, tracking }
      })
    )

    return NextResponse.json({ orders })
  } catch (err) {
    console.error('track-order error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}