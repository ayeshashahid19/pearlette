import { prisma } from '../../../../lib/prisma.js'
import { serializeCustomOrder } from '../../../../lib/custom-orders.js'
import { requireAdmin } from '../../../../lib/auth.js'
import { handleApiError, jsonSuccess } from '../../../../lib/api-error.js'

export async function GET(request) {
  const { errorResponse } = await requireAdmin()
  if (errorResponse) return errorResponse

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const customOrders = await prisma.customOrder.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return jsonSuccess({
      customOrders: customOrders.map(serializeCustomOrder),
    })
  } catch (error) {
    return handleApiError(error, 'Failed to load custom orders.')
  }
}
