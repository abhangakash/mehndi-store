import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { order, items } = await req.json()
    if (!order) return NextResponse.json({ error: 'Missing order' }, { status: 400 })

    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER
    const apiKey = process.env.CALLMEBOT_API_KEY

    if (!adminPhone || !apiKey) {
      console.log('Admin WhatsApp not configured — skipping')
      return NextResponse.json({ skipped: true })
    }

    const ordNum = order.id.slice(0, 8).toUpperCase()
    const itemList = (items || []).map(i => `${i.product_name || i.name} x${i.quantity}`).join(', ')

    const message = `🦀 NEW ORDER #${ordNum}
👤 ${order.customer_name}
📞 ${order.phone}
💰 ₹${Number(order.total_amount).toFixed(0)} (${order.payment_method === 'cod' ? 'COD' : 'PAID ONLINE'})
📦 ${itemList}
🏠 ${order.address}, ${order.city}, ${order.state} - ${order.pincode}
👉 crabveda.com/admin/orders`

    const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`
    const res = await fetch(url)
    const text = await res.text()
    console.log('CallMeBot:', text)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin notify error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}