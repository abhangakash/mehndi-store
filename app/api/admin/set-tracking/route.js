import { supabaseAdmin } from '@/lib/supabase'
import { createTracker } from '@/lib/ship24'
import { POST as sendOrderEmail } from '@/app/api/send-order-email/route'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { orderId, trackingNumber, courier = 'india_post', sendEmail = true } = await req.json()
    const tn = (trackingNumber || '').trim().toUpperCase().replace(/\s+/g, '')

    if (!orderId || !tn) {
      return NextResponse.json({ error: 'Order and tracking number are required' }, { status: 400 })
    }
    if (courier === 'india_post' && !/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(tn)) {
      return NextResponse.json({ error: 'India Post number should look like EE123456789IN' }, { status: 400 })
    }

    // Same number saved again? Reuse the existing Ship24 tracker (don't spend another free slot).
    const { data: existing } = await supabaseAdmin
      .from('orders').select('tracking_number, ship24_tracker_id').eq('id', orderId).maybeSingle()

    let trackerId = existing?.tracking_number === tn ? existing?.ship24_tracker_id || null : null
    // Same number already tracked on another order (e.g. while testing)? Reuse it, don't spend a slot.
    if (!trackerId) {
      const { data: dup } = await supabaseAdmin
        .from('orders')
        .select('ship24_tracker_id')
        .eq('tracking_number', tn)
        .not('ship24_tracker_id', 'is', null)
        .limit(1)
        .maybeSingle()
      if (dup?.ship24_tracker_id) trackerId = dup.ship24_tracker_id
    }
    let trackerError = null
    if (!trackerId && courier === 'india_post') {
      const created = await createTracker(tn, orderId)
      if (created.ok) trackerId = created.trackerId
      else trackerError = created.error
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({
        courier,
        tracking_number: tn,
        ship24_tracker_id: trackerId,
        order_status: 'shipped',
        shipped_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select('id, email')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data?.length) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    console.log('set-tracking email check:', { sendEmail, orderHasEmail: !!data[0].email, trackerId })

    let emailResult = { skipped: true }
    if (sendEmail && data[0].email) {
      try {
        // Call the email code directly (no HTTP hop, so proxy/middleware can't block it)
        const res = await sendOrderEmail(
          new Request(new URL('/api/send-order-email', req.url), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'shipped', orderId }),
          })
        )
        emailResult = await res.json()
        console.log('set-tracking email result:', emailResult)
      } catch (e) {
        console.error('set-tracking email error:', e)
        emailResult = { error: e.message }
      }
    }

    return NextResponse.json({
      success: true,
      trackingNumber: tn,
      trackingRegistered: !!trackerId,
      trackerError,
      email: emailResult,
    })
  } catch (err) {
    console.error('set-tracking error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}