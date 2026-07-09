import { createShiprocketOrder } from '@/lib/shiprocket'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { order, items } = await req.json()
    if (!order) return NextResponse.json({ error: 'Missing order' }, { status: 400 })

    const result = await createShiprocketOrder(order, items)

    // Save Shiprocket references back onto the order for tracking/debugging
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        shiprocket_order_id: result.order_id || null,
        shiprocket_shipment_id: result.shipment_id || null,
        shiprocket_status: result.status || null,
      })
      .eq('id', order.id)

    if (updateError) {
      console.error('Failed to save Shiprocket refs on order (non-critical):', updateError.message)
    }

    return NextResponse.json({ success: true, shiprocket: result })
  } catch (err) {
    console.error('Shiprocket notify error:', err)
    // Non-critical — order is already saved and paid, this just failed to auto-push to Shiprocket
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}