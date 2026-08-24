import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const ADMIN_COOKIE_NAME = 'pearlette_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8
const ISSUER = 'pearlette.pk'

function getSecret() {
  const secret = process.env.AUTH_SECRET

  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET is missing or too short. Set a random 32+ character value.')
  }

  return secret
}

export function createSessionToken(admin) {
  return jwt.sign({ email: admin.email }, getSecret(), {
    subject: admin.id,
    issuer: ISSUER,
    expiresIn: `${SESSION_TTL_SECONDS}s`,
  })
}

export function verifySessionToken(token) {
  if (!token) {
    return null
  }

  try {
    const payload = jwt.verify(token, getSecret(), { issuer: ISSUER })

    if (!payload.sub || !payload.email) {
      return null
    }

    return { adminId: payload.sub, email: payload.email }
  } catch {
    return null
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function requireAdmin() {
  const session = await getAdminSession()

  if (!session) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      ),
    }
  }

  return { session, errorResponse: null }
}
