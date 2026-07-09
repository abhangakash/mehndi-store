// lib/shiprocket.js
// Handles Shiprocket authentication (token caching) and order creation.

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

// Simple in-memory token cache. Token is valid ~10 days.
// This resets on cold starts, which is fine — a fresh login just happens again.
let cachedToken = null
let cachedTokenAt = 0
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000 // refresh a day early, just in case

async function getShiprocketToken() {
  const now = Date.now()
  if (cachedToken && now - cachedTokenAt < TOKEN_TTL_MS) {
    return cachedToken
  }

  const email = process.env.SHIPROCKET_EMAIL
  const password = process.env.SHIPROCKET_PASSWORD

  if (!email || !password) {
    throw new Error('SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD not set in environment variables')
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok || !data.token) {
    console.error('Shiprocket auth failed:', data)
    throw new Error('Shiprocket authentication failed: ' + (data.message || 'Unknown error'))
  }

  cachedToken = data.token
  cachedTokenAt = now
  return cachedToken
}

// ── Product weight/dimension lookup ──────────────────────────────
// Crabveda currently sells 2 products: single bottle & 3-bottle combo.
// Matched by name since there's no dedicated weight/dimension column yet.
function getPackageSpecsForItems(items) {
  const SINGLE = { weight: 0.23, length: 5, breadth: 5, height: 17 }
  const COMBO = { weight: 0.69, length: 15, breadth: 10, height: 18 }

  let totalWeight = 0
  let hasCombo = false

  for (const item of items) {
    const name = (item.product_name || item.name || '').toLowerCase()
    const qty = Number(item.quantity) || 1
    const isCombo = name.includes('combo') || name.includes('3') || name.includes('pack of 3')

    if (isCombo) {
      hasCombo = true
      totalWeight += COMBO.weight * qty
    } else {
      totalWeight += SINGLE.weight * qty
    }
  }

  // Use the combo box dimensions if a combo is present (it's the larger box);
  // otherwise use single bottle dimensions.
  const dims = hasCombo ? COMBO : SINGLE

  return {
    weight: Math.round(totalWeight * 100) / 100, // kg, 2 decimals
    length: dims.length,
    breadth: dims.breadth,
    height: dims.height,
  }
}

// ── Create a Shiprocket order (adhoc) ────────────────────────────
async function createShiprocketOrder(order, items) {
  const token = await getShiprocketToken()
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary'

  const specs = getPackageSpecsForItems(items || [])

  const orderDate = new Date(order.created_at || Date.now())
  const formattedDate = orderDate.toISOString().slice(0, 10) + ' ' + orderDate.toTimeString().slice(0, 5)

  const payload = {
    order_id: order.id, // your Crabveda order id as the reference
    order_date: formattedDate,
    pickup_location: pickupLocation,
    billing_customer_name: order.customer_name,
    billing_last_name: '',
    billing_address: order.address,
    billing_city: order.city,
    billing_pincode: order.pincode,
    billing_state: order.state,
    billing_country: 'India',
    billing_email: order.email || '',
    billing_phone: order.phone,
    shipping_is_billing: true,
    order_items: (items || []).map(item => ({
      name: item.product_name || item.name,
      sku: item.product_id || item.id || 'SKU',
      units: item.quantity,
      selling_price: item.price || item.unit_price,
    })),
    payment_method: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
    sub_total: Number(order.total_amount),
    length: specs.length,
    breadth: specs.breadth,
    height: specs.height,
    weight: specs.weight,
  }

  const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('Shiprocket order creation failed:', data)
    throw new Error('Shiprocket order creation failed: ' + (data.message || JSON.stringify(data)))
  }

  return data // contains shiprocket order_id, shipment_id, status, etc.
}

export { getShiprocketToken, createShiprocketOrder, getPackageSpecsForItems }