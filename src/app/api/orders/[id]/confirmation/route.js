import { prisma } from '../../../../../lib/prisma.js'
import { serializeOrder } from '../../../../../lib/orders.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../../../lib/api-error.js'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!order) {
      return jsonError('Order not found.', 404)
    }

    return jsonSuccess({ order: serializeOrder(order) })
  } catch (error) {
    return handleApiError(error, 'Failed to load order confirmation.')
  }
}
