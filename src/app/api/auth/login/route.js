import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma.js'
import { createSessionToken, ADMIN_COOKIE_NAME, sessionCookieOptions } from '../../../../lib/auth.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../../lib/api-error.js'
import { getClientIp, rateLimit } from '../../../../lib/rate-limit.js'

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(`admin-login:${ip}`, { limit: 5, windowMs: 5 * 60_000 })

    if (!limit.allowed) {
      return jsonError('Too many login attempts. Please try again in a few minutes.', 429)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return jsonError('Invalid request body.', 400)
    }

    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')

    if (!email || !password) {
      return jsonError('Email and password are required.', 400)
    }

    if (email.length > 254 || password.length > 1024) {
      return jsonError('Invalid email or password.', 401)
    }

    const admin = await prisma.admin.findUnique({ where: { email } })
    const passwordMatches =
      admin?.password && typeof admin.password === 'string' && admin.password.startsWith('$')
        ? await bcrypt.compare(password, admin.password)
        : false

    if (!admin || !passwordMatches) {
      return jsonError('Invalid email or password.', 401)
    }

    const token = createSessionToken(admin)

    const response = jsonSuccess({
      message: 'Logged in successfully.',
      admin: { id: admin.id, email: admin.email },
    })
    response.cookies.set(ADMIN_COOKIE_NAME, token, sessionCookieOptions())

    return response
  } catch (error) {
    return handleApiError(error, 'Login failed. Please try again.')
  }
}
