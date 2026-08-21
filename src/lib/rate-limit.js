const buckets = new Map()

export function rateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now()
  let bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs }
  }

  bucket.count += 1
  buckets.set(key, bucket)

  if (bucket.count > limit) {
    return {
      allowed: false,
      retryAfterMs: bucket.resetAt - now,
    }
  }

  return { allowed: true }
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  return request.headers.get('x-real-ip') || 'unknown'
}
