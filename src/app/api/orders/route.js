import { prisma } from '../../../lib/prisma.js'
import { serializeOrder } from '../../../lib/orders.js'
import { validateOrderInput, ValidationError } from '../../../lib/validation.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../lib/api-error.js'
import { getClientIp, rateLimit } from '../../../lib/rate-limit.js'

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(`orders:${ip}`, { limit: 5, windowMs: 60_000 })

    if (!limit.allowed) {
      return jsonError('Too many order attempts. Please try again shortly.', 429)
    }

    const body = await request.json()
    const data = validateOrderInput(body)

    const productIds = data.items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    })

    if (products.length !== productIds.length) {
      return jsonError('One or more products in your cart are unavailable.', 400)
    }

    const productMap = new Map(products.map((product) => [product.id, product]))

    const orderItems = data.items.map(({ productId, quantity }) => {
      const product = productMap.get(productId)
      return {
        productId,
        name: product.name,
        price: product.price,
        quantity,
      }
    })

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await prisma.order.create({
      data: {
        total,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerCity: data.customerCity,
        customerInstructions: data.customerInstructions,
        paymentMethod: 'Cash on Delivery',
        status: 'pending',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    })

    return jsonSuccess(
      {
        order: serializeOrder(order),
        message: 'Order placed successfully.',
      },
      201
    )
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.status)
    }

    return handleApiError(error, 'Failed to place order.')
  }
}
