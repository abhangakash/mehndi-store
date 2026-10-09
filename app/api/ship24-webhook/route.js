import { supabaseAdmin } from '@/lib/supabase'
import { markDelivered } from '@/lib/markDelivered'
import { NextResponse } from 'next/server'

// Ship24 calls this URL whenever a tracked parcel gets new scans.
// In Ship24 dashboard (Integrations > Webhook) set:
//   URL:    https://YOUR-DOMAIN/api/ship24-webhook
//   Secret: copy it into SHIP24_WEBHOOK_SECRET in your env
export async function POST(req) {
  const secret = process.env.SHIP24_WEBHOOK_SECRET
  const auth = req.headers.get('authorization') || ''
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const trackings = body?.trackings || body?.data?.trackings || []

    for (const t of trackings) {
      if (t?.shipment?.statusMilestone !== 'delivered') continue

      const trackerId = t?.tracker?.trackerId
      const trackingNumber = t?.tracker?.trackingNumber

      let query = supabaseAdmin.from('orders').select('id')
      if (trackerId) query = query.eq('ship24_tracker_id', trackerId)
      else if (trackingNumber) query = query.eq('tracking_number', trackingNumber)
      else continue

      const { data: orders } = await query
      for (const o of orders || []) await markDelivered(o.id)
    }
  } catch (err) {
    // Always answer 2xx-or-handled so Ship24 doesn't keep retrying on our parsing problems
    console.error('ship24-webhook error:', err)
  }

  return NextResponse.json({ ok: true })
}