import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

// =====================================================================
// ADMIN CHECK for every /api/offline/* route.
//
// Matches what app/api/admin-auth/route.js and middleware.js already do:
// after a correct login the cookie `admin_auth` holds ADMIN_PASSWORD.
// (middleware.js only covers /admin pages, so the API routes need this.)
// =====================================================================

function safeEqual(a, b) {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b))
  return x.length === y.length && timingSafeEqual(x, y)
}

function isAdmin(req) {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) return false // fail closed if the env var is missing
  const token = req.cookies.get('admin_auth')?.value
  return !!token && safeEqual(token, secret)
}

export function requireAdmin(req) {
  if (isAdmin(req)) return null
  return NextResponse.json({ error: 'Unauthorized — please log in again.' }, { status: 401 })
}