import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { modelFromOffline } from '@/lib/invoiceModel'
import { renderInvoicePdf, pdfResponse } from '@/lib/renderInvoicePdf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/offline-invoice/<token>             -> PDF opens in the browser (print from there)
// GET /api/offline-invoice/<token>?download=1  -> forces a download
// The token is a 64-character random string, so the link can be sent to a customer
// on WhatsApp without exposing any other invoice.
export async function GET(req, { params }) {
  try {
    const { token } = await params
    if (!/^[a-f0-9]{64}$/.test(token || '')) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const { data: order, error } = await supabaseAdmin
      .from('offline_orders')
      .select('*, offline_order_items(*), offline_payments(*)')
      .eq('public_token', token)
      .single()

    if (error || !order) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

    const bytes = await renderInvoicePdf(modelFromOffline(order))
    const download = new URL(req.url).searchParams.get('download') === '1'
    return pdfResponse(bytes, `Invoice-${order.invoice_no}`, { download })
  } catch (err) {
    console.error('Offline invoice error:', err)
    return NextResponse.json({ error: 'Could not generate invoice' }, { status: 500 })
  }
}
