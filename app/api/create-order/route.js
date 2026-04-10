import { razorpay } from '@/lib/razorpay'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { amount } = await req.json()
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    })
    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}