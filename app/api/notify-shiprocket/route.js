import { createShiprocketOrder } from '@/lib/shiprocket'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { order, items } = await req.json()
    if (!order) return NextResponse.json({ error: 'Missing order' }, { status: 400 })

    const result = await createShiprocketOrder(order, items)
    console.log('Raw Shiprocket response:', JSON.stringify(result, null, 2))

    // Save Shiprocket references back onto the order for tracking/debugging
    console.log('Attempting to update order:', order.id, 'with shiprocket_order_id:', result.order_id)

    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        shiprocket_order_id: result.order_id || null,
        shiprocket_shipment_id: result.shipment_id || null,
        shiprocket_status: result.status || null,
      })
      .eq('id', order.id)
      .select()

    console.log('Update result — rows affected:', updateData?.length, 'data:', updateData)

    if (updateError) {
      console.error('Failed to save Shiprocket refs on order (non-critical):', updateError.message)
    } else if (!updateData || updateData.length === 0) {
      console.error('Shiprocket update matched 0 rows! order.id was:', order.id, '(type:', typeof order.id, ')')
    }

    return NextResponse.json({ success: true, shiprocket: result })
  } catch (err) {
    console.error('Shiprocket notify error:', err)
    // Non-critical — order is already saved and paid, this just failed to auto-push to Shiprocket
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}