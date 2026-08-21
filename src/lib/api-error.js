import { NextResponse } from 'next/server'

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function jsonSuccess(data, status = 200) {
  return NextResponse.json(data, { status })
}

export function handleApiError(error, fallbackMessage = 'Something went wrong') {
  console.error(error)

  if (error?.code === 'P2002') {
    return jsonError('A record with this value already exists.', 409)
  }

  if (error?.code === 'P2025') {
    return jsonError('Record not found.', 404)
  }

  return jsonError(fallbackMessage, 500)
}
