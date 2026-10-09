const BASE = 'https://api.ship24.com/public/v1'
const KEY = process.env.SHIP24_API_KEY

async function s24(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    cache: 'no-store',
  })
  let json = null
  try { json = await res.json() } catch {}
  return { ok: res.ok, status: res.status, json }
}

// Registers a parcel with Ship24 (uses 1 of your 10 free monthly slots).
export async function createTracker(trackingNumber, orderId) {
  if (!KEY) return { ok: false, error: 'SHIP24_API_KEY not set' }
  try {
    const { ok, json } = await s24('/trackers', {
      method: 'POST',
      body: JSON.stringify({ trackingNumber, shipmentReference: orderId }),
    })
    const trackerId = json?.data?.tracker?.trackerId
    if (ok && trackerId) return { ok: true, trackerId }
    console.error('Ship24 createTracker failed:', JSON.stringify(json))
    return { ok: false, error: json?.errors?.[0]?.message || 'Ship24 error' }
  } catch (err) {
    console.error('Ship24 createTracker error:', err)
    return { ok: false, error: err.message }
  }
}

// Latest scans for a registered parcel, in the shape the tracking page expects.
export async function getTracking(trackerId) {
  if (!KEY || !trackerId) return { available: false }
  try {
    const { ok, json } = await s24(`/trackers/${trackerId}/results`)
    if (!ok) {
      console.error('Ship24 results failed:', JSON.stringify(json))
      return { available: false }
    }
    const t = json?.data?.trackings?.[0]
    const events = (t?.events || [])
      .map(e => ({
        date: e.occurrenceDatetime || e.datetime || null,
        detail: e.status || '',
        location: e.location || '',
      }))
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))

    return {
      available: true,
      status: t?.shipment?.statusMilestone || 'pending',
      events,
    }
  } catch (err) {
    console.error('Ship24 getTracking error:', err)
    return { available: false }
  }
}