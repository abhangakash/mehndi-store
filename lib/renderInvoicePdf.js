import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import InvoicePdf from './InvoicePdf'

// Returns a Uint8Array ready to send as an HTTP response body.
export async function renderInvoicePdf(model) {
  const buffer = await renderToBuffer(<InvoicePdf inv={model} />)
  return new Uint8Array(buffer)
}

export function pdfResponse(bytes, filename, { download = false } = {}) {
  const safe = String(filename).replace(/[^A-Za-z0-9._-]/g, '-')
  return new Response(bytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${safe}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}
