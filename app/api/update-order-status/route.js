import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

async function sendStatusEmail(orderId, type, baseUrl) {
  try {
    await fetch(`${baseUrl}/api/send-order-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, orderId }),
    })
  } catch (err) {
    console.error('Status email failed (non-critical):', err.message)
  }
}

export async function POST(req) {
  try {
    const { orderId, status } = await req.json()

    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    if (!VALID_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Auto-send emails for shipped, delivered, cancelled
    const baseUrl = req.headers.get('origin') || `https://${req.headers.get('host')}`
    if (status === 'shipped') await sendStatusEmail(orderId, 'shipped', baseUrl)
    if (status === 'delivered') await sendStatusEmail(orderId, 'delivered', baseUrl)
    if (status === 'cancelled') await sendStatusEmail(orderId, 'cancelled', baseUrl)

    return NextResponse.json({ success: true, order: data })
  } catch (err) {
    console.error('Update order status error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
