import { supabaseAdmin } from '@/lib/supabase'

async function getOrders() {
  const { data } = await supabaseAdmin.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(50)
  return data || []
}

const STATUS_COLORS = {
  pending:   { bg: '#FAEEDA', color: '#854F0B' },
  confirmed: { bg: '#E6F1FB', color: '#185FA5' },
  shipped:   { bg: '#EEEDFE', color: '#534AB7' },
  delivered: { bg: '#dcfce7', color: '#15803d' },
  cancelled: { bg: '#fee2e2', color: '#dc2626' },
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="section-title">All Orders</h1>
      <p className="section-subtitle">{orders.length} orders total</p>
      <div className="flex flex-col gap-4">
        {orders.map(order => {
          const s = STATUS_COLORS[order.order_status] || STATUS_COLORS.pending
          return (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--brand-text)' }}>{order.customer_name} — #{order.id.slice(0,8).toUpperCase()}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--brand-muted)' }}>{order.phone} · {order.city}, {order.state}</p>
                  <p className="text-xs" style={{ color: 'var(--brand-muted)' }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold" style={{ color: 'var(--brand-brown)' }}>₹{Number(order.total_amount).toFixed(0)}</p>
                  <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{order.order_status}</span>
                  <p className="text-xs mt-1" style={{ color: 'var(--brand-muted)' }}>{order.payment_method}</p>
                </div>
              </div>
              <div className="border-t pt-3" style={{ borderColor: 'var(--brand-border)' }}>
                {order.order_items?.map(item => (
                  <span key={item.id} className="text-xs mr-3" style={{ color: 'var(--brand-muted)' }}>{item.product_name} ×{item.quantity}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}