import { supabaseAdmin } from '@/lib/supabase'
import { ORDER_FIELDS, attachTracking } from '@/lib/orderTracking'
import { NextResponse } from 'next/server'

// Orders of the signed-in customer, with live tracking.
// The browser sends its Supabase access token; we verify it and only return that user's orders.
export async function GET(req) {
  try {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim()
    if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token)
    const user = userData?.user
    if (authError || !user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(ORDER_FIELDS)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('my-orders query error:', error.message)
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
    }

    // Same live scans as the Track Order page, including delivered orders
    const orders = await attachTracking(data)
    return NextResponse.json({ orders })
  } catch (err) {
    console.error('my-orders error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}