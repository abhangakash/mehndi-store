import { razorpay } from '@/lib/razorpay'
import { NextResponse } from 'next/server'

const rateLimit = new Map()
const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 5

function checkRateLimit(ip) {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const requests = (rateLimit.get(ip) || []).filter(t => t > windowStart)
  if (requests.length >= MAX_REQUESTS) return false
  requests.push(now)
  rateLimit.set(ip, requests)
  return true
}

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    const { amount } = await req.json()
    if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 100000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })
    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}