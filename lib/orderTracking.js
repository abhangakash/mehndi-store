import { supabaseAdmin } from '@/lib/supabase'
import { createTracker, getTracking } from '@/lib/ship24'
import { markDelivered } from '@/lib/markDelivered'

// Fields the customer-facing pages may see (no email, payment ids, etc.)
export const ORDER_FIELDS =
  'id, created_at, order_status, total_amount, subtotal, shipping_amount, payment_method, ' +
  'customer_name, address, city, state, pincode, phone, courier, tracking_number, shipped_at, ship24_tracker_id, ' +
  'order_items(*)'

// Adds live courier tracking to a list of orders.
// skipDelivered: don't call the tracking service again for orders already delivered.
export async function attachTracking(rows, { skipDelivered = false } = {}) {
  return Promise.all(
    (rows || []).map(async (o) => {
      const { ship24_tracker_id, ...safe } = o
      let tracking = null

      const eligible =
        o.tracking_number &&
        o.courier === 'india_post' &&
        o.order_status !== 'cancelled' &&
        !(skipDelivered && o.order_status === 'delivered')

      if (eligible) {
        let trackerId = ship24_tracker_id
        // Registered late (e.g. Ship24 was down when admin saved)? Register now.
        if (!trackerId) {
          const created = await createTracker(o.tracking_number, o.id)
          if (created.ok) {
            trackerId = created.trackerId
            await supabaseAdmin.from('orders').update({ ship24_tracker_id: trackerId }).eq('id', o.id)
          }
        }
        tracking = trackerId ? await getTracking(trackerId) : { available: false }

        // Backup for the webhook: if India Post says delivered, update the order and send the email once.
        if (tracking?.status === 'delivered' && o.order_status !== 'delivered') {
          await markDelivered(o.id)
          safe.order_status = 'delivered'
        }
      }
      return { ...safe, tracking }
    })
  )
}