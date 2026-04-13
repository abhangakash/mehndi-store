import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

function validateCustomer(c) {
  if (!c?.name?.trim()) return 'Name is required'
  if (!c?.phone?.trim() || c.phone.length < 10) return 'Valid phone is required'
  if (!c?.address?.trim()) return 'Address is required'
  if (!c?.city?.trim()) return 'City is required'
  if (!c?.state?.trim()) return 'State is required'
  if (!c?.pincode?.trim() || c.pincode.length !== 6) return 'Valid 6-digit pincode is required'
  return null
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) return 'Cart is empty'
  for (const item of items) {
    if (!item.id || !item.name || !item.price || !item.quantity) return 'Invalid cart item'
    if (item.price <= 0 || item.quantity <= 0) return 'Invalid price or quantity'
  }
  return null
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cod, customer, items, total, user_id } = body

    const customerError = validateCustomer(customer)
    if (customerError) return NextResponse.json({ error: customerError }, { status: 400 })

    const itemsError = validateItems(items)
    if (itemsError) return NextResponse.json({ error: itemsError }, { status: 400 })

    // Always recalculate server-side — never trust client totals
    const recalcSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const recalcShipping = recalcSubtotal >= 499 ? 0 : 60
    const recalcTotal = recalcSubtotal + recalcShipping

    if (Math.abs(recalcTotal - total) > 1) {
      return NextResponse.json({ error: 'Order total mismatch' }, { status: 400 })
    }

    if (!cod) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
      }
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')
      if (expected !== razorpay_signature) {
        console.error('Payment signature mismatch')
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
      }
    }

    if (cod && recalcTotal < 999) {
      return NextResponse.json({ error: 'COD available only on orders above ₹999' }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || null,
        address: customer.address.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim(),
        booking_date: customer.booking_date || null,
        subtotal: recalcSubtotal,
        shipping_amount: recalcShipping,
        total_amount: recalcTotal,
        payment_method: cod ? 'cod' : 'razorpay',
        payment_status: cod ? 'pending' : 'paid',
        order_status: 'confirmed',
        razorpay_order_id: razorpay_order_id || null,
        razorpay_payment_id: razorpay_payment_id || null,
        razorpay_signature: razorpay_signature || null,
        user_id: user_id || null,
      })
      .select()
      .single()

    if (orderError) throw new Error(orderError.message)

    await supabaseAdmin.from('order_items').insert(
      items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image_url || null,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))
    )

    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.error('Verify payment error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please contact support.' }, { status: 500 })
  }
}