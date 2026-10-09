import { supabaseAdmin } from '@/lib/supabase'
import { POST as sendOrderEmail } from '@/app/api/send-order-email/route'

// Marks an order as delivered and sends the delivered email, exactly once.
// Safe to call many times (webhook + customer lookups): only the call that actually
// changes the status sends the email, so customers never get duplicates.
export async function markDelivered(orderId) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ order_status: 'delivered' })
    .eq('id', orderId)
    .neq('order_status', 'delivered')
    .neq('order_status', 'cancelled')
    .select('id, email')

  if (error) {
    console.error('markDelivered update failed:', error.message)
    return false
  }
  if (!data?.length) return false // already delivered, cancelled, or not found

  if (data[0].email) {
    try {
      const res = await sendOrderEmail(
        new Request('http://localhost/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'delivered', orderId }),
        })
      )
      const out = await res.json()
      console.log('Delivered email result:', out)
    } catch (err) {
      console.error('Delivered email failed:', err)
    }
  }
  return true
}