// Small fetch wrapper for the admin pages. Throws Error(message) so pages can toast it.
export async function api(url, options = {}) {
  const res = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })

  let data = null
  try { data = await res.json() } catch { /* empty body */ }

  if (res.status === 401 && typeof window !== 'undefined') {
    window.location.href = '/admin-login'
    throw new Error('Session expired')
  }
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
  return data
}
