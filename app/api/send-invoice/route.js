import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { modelFromOnline } from '@/lib/invoiceModel'
import { renderInvoicePdf, pdfResponse } from '@/lib/renderInvoicePdf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/send-invoice?orderId=xxx            -> invoice PDF (opens in the browser)
// GET /api/send-invoice?orderId=xxx&download=1 -> forces a download
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const bytes = await renderInvoicePdf(modelFromOnline(order))
    return pdfResponse(bytes, `Invoice-${String(order.id).slice(0, 8).toUpperCase()}`, {
      download: searchParams.get('download') === '1',
    })
  } catch (err) {
    console.error('Invoice error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
