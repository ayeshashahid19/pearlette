import { prisma } from '../../../../../lib/prisma.js'
import { serializeCustomOrder } from '../../../../../lib/custom-orders.js'
import { requireAdmin } from '../../../../../lib/auth.js'
import { validateCustomOrderStatus, ValidationError } from '../../../../../lib/validation.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../../../lib/api-error.js'

export async function GET(request, { params }) {
  const { errorResponse } = await requireAdmin()
  if (errorResponse) return errorResponse

  try {
    const { id } = await params

    const customOrder = await prisma.customOrder.findUnique({
      where: { id },
    })

    if (!customOrder) {
      return jsonError('Custom order request not found.', 404)
    }

    return jsonSuccess({ customOrder: serializeCustomOrder(customOrder) })
  } catch (error) {
    return handleApiError(error, 'Failed to load custom order.')
  }
}

export async function PATCH(request, { params }) {
  const { errorResponse } = await requireAdmin()
  if (errorResponse) return errorResponse

  try {
    const { id } = await params
    const body = await request.json()

    if (!body?.status) {
      return jsonError('Status is required.', 400)
    }

    const status = validateCustomOrderStatus(body.status)

    const existing = await prisma.customOrder.findUnique({ where: { id } })
    if (!existing) {
      return jsonError('Custom order request not found.', 404)
    }

    const customOrder = await prisma.customOrder.update({
      where: { id },
      data: { status },
    })

    return jsonSuccess({ customOrder: serializeCustomOrder(customOrder) })
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.status)
    }

    return handleApiError(error, 'Failed to update custom order.')
  }
}
