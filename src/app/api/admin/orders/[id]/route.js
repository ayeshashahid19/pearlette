import { prisma } from '../../../../../lib/prisma.js'
import { serializeOrder } from '../../../../../lib/orders.js'
import { validateOrderStatus, ValidationError } from '../../../../../lib/validation.js'
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

    return jsonSuccess({ order: serializeOrder(order, { includeCustomerDetails: true }) })
  } catch (error) {
    return handleApiError(error, 'Failed to load order.')
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body?.status) {
      return jsonError('Status is required.', 400)
    }

    const status = validateOrderStatus(body.status)

    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) {
      return jsonError('Order not found.', 404)
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    })

    return jsonSuccess({ order: serializeOrder(order, { includeCustomerDetails: true }) })
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.status)
    }

    return handleApiError(error, 'Failed to update order.')
  }
}
