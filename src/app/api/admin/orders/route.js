import { prisma } from '../../../../lib/prisma.js'
import { serializeOrder } from '../../../../lib/orders.js'
import { requireAdmin } from '../../../../lib/auth.js'
import { handleApiError, jsonSuccess } from '../../../../lib/api-error.js'

export async function GET(request) {
  const { errorResponse } = await requireAdmin()
  if (errorResponse) return errorResponse

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    return jsonSuccess({
      orders: orders.map((order) => serializeOrder(order, { includeCustomerDetails: true })),
    })
  } catch (error) {
    return handleApiError(error, 'Failed to load orders.')
  }
}
