import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma.js'
import { handleApiError } from '../../../../lib/api-error.js'

const MAX_PRODUCT_IDS = 100

function jsonNoStore(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(request) {
  let body

  try {
    body = await request.json()
  } catch {
    return jsonNoStore({ error: 'Invalid JSON body.' }, 400)
  }

  const { productIds } = body ?? {}

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return jsonNoStore({ error: 'productIds must be a non-empty array.' }, 400)
  }

  if (productIds.length > MAX_PRODUCT_IDS) {
    return jsonNoStore(
      { error: `A maximum of ${MAX_PRODUCT_IDS} product IDs is allowed.` },
      400
    )
  }

  const uniqueIds = []
  const seen = new Set()

  for (const value of productIds) {
    if (typeof value !== 'string' || !value.trim()) {
      return jsonNoStore({ error: 'Each product ID must be a non-empty string.' }, 400)
    }

    const id = value.trim()
    if (!seen.has(id)) {
      seen.add(id)
      uniqueIds.push(id)
    }
  }

  if (uniqueIds.length === 0) {
    return jsonNoStore({ error: 'At least one valid product ID is required.' }, 400)
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        id: { in: uniqueIds },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        img: true,
        slug: true,
      },
    })

    return jsonNoStore({ products })
  } catch (error) {
    const response = handleApiError(error, 'Failed to validate cart items.')
    response.headers.set('Cache-Control', 'no-store')
    return response
  }
}
