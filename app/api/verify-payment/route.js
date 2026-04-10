import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cod, customer, items, subtotal, shipping, total, user_id } = body

    if (!cod) {
      const text = `${razorpay_order_id}|${razorpay_payment_id}`
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(text).digest('hex')
      if (expected !== razorpay_signature) return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabaseAdmin.from('orders').insert({
      customer_name: customer.name, phone: customer.phone, email: customer.email || null,
      address: customer.address, city: customer.city, state: customer.state, pincode: customer.pincode,
      booking_date: customer.booking_date || null, subtotal, shipping_amount: shipping, total_amount: total,
      payment_method: cod ? 'cod' : 'razorpay', payment_status: cod ? 'pending' : 'paid',
      order_status: 'confirmed', razorpay_order_id: razorpay_order_id || null,
      razorpay_payment_id: razorpay_payment_id || null, razorpay_signature: razorpay_signature || null,
      user_id: user_id || null,
    }).select().single()

    if (orderError) throw new Error(orderError.message)

    await supabaseAdmin.from('order_items').insert(
      items.map(item => ({
        order_id: order.id, product_id: item.id, product_name: item.name,
        product_image: item.image_url || null, quantity: item.quantity,
        unit_price: item.price, total_price: item.price * item.quantity,
      }))
    )

    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}