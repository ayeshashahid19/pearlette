import { getProductById, serializeProduct } from '../../../../lib/products.js'
import { prisma } from '../../../../lib/prisma.js'
import { validateProductInput, ValidationError } from '../../../../lib/validation.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../../lib/api-error.js'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const product = await getProductById(id, { includeInactive })
    if (!product) {
      return jsonError('Product not found.', 404)
    }

    return jsonSuccess({ product })
  } catch (error) {
    return handleApiError(error, 'Failed to load product.')
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = validateProductInput(body, { isUpdate: true })

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return jsonError('Product not found.', 404)
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    })

    return jsonSuccess({ product: serializeProduct(product) })
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.status)
    }
    return handleApiError(error, 'Failed to update product.')
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return jsonError('Product not found.', 404)
    }

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    return jsonSuccess({ product: serializeProduct(product) })
  } catch (error) {
    return handleApiError(error, 'Failed to deactivate product.')
  }
}
