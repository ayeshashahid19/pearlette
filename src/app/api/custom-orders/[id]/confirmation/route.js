import { prisma } from '../../../../../lib/prisma.js'
import { serializeCustomOrderConfirmation } from '../../../../../lib/custom-orders.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../../../lib/api-error.js'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const customOrder = await prisma.customOrder.findUnique({
      where: { id },
    })

    if (!customOrder) {
      return jsonError('Custom order request not found.', 404)
    }

    return jsonSuccess({ customOrder: serializeCustomOrderConfirmation(customOrder) })
  } catch (error) {
    return handleApiError(error, 'Failed to load custom order confirmation.')
  }
}
