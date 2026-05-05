import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { OrderConfirmationEmail, orderConfirmationText } from '@/emails/OrderConfirmationEmail'
import { ShippedEmail } from '@/emails/ShippedEmail'
import { createElement } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST /api/send-order-email
// Body: { type: 'confirmation' | 'shipped', orderId, trackingNumber? }
export async function POST(req) {
  try {
    const { type, orderId, trackingNumber } = await req.json()

    if (!type || !orderId) {
      return NextResponse.json({ error: 'Missing type or orderId' }, { status: 400 })
    }

    // Fetch order + items from Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Need email to send
    const recipientEmail = order.email
    if (!recipientEmail) {
      return NextResponse.json({ error: 'No email on this order — skipping' }, { status: 200 })
    }

    const items = order.order_items || []
    let subject, html, text

    if (type === 'confirmation') {
      subject = `✅ Order Confirmed #${order.id.slice(0, 8).toUpperCase()} — Shrilekha Mehndi Art`
      // Render email template to HTML string
      const emailElement = createElement(OrderConfirmationEmail, { order, items })
      text = orderConfirmationText({ order, items })
      
      const { data, error } = await resend.emails.send({
        from: 'Shrilekha Mehndi Art <orders@shrilekha.com>',
        to: [recipientEmail],
        subject,
        react: emailElement,
        text,
      })

      if (error) throw new Error(error.message)
      return NextResponse.json({ success: true, emailId: data?.id })
    }

    if (type === 'shipped') {
      subject = `🚚 Your Order is Shipped! #${order.id.slice(0, 8).toUpperCase()} — Shrilekha Mehndi Art`
      const emailElement = createElement(ShippedEmail, { order, trackingNumber })

      const { data, error } = await resend.emails.send({
        from: 'Shrilekha Mehndi Art <orders@shrilekha.com>',
        to: [recipientEmail],
        subject,
        react: emailElement,
      })

      if (error) throw new Error(error.message)
      return NextResponse.json({ success: true, emailId: data?.id })
    }

    return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })
  } catch (err) {
    console.error('Send email error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}