import { NextResponse } from 'next/server'

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const fail = (message, status = 400) => NextResponse.json({ error: message }, { status })

// Strip characters that have special meaning inside a PostgREST filter string.
export const cleanSearch = (s) => String(s || '').replace(/[^\p{L}\p{N}\s\-\/.@+]/gu, '').trim().slice(0, 60)

export const todayIST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

export async function readJson(req) {
  try { return await req.json() } catch { return {} }
}
