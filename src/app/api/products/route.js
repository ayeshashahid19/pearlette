import { getProducts, serializeProduct } from '../../../lib/products.js'
import { prisma } from '../../../lib/prisma.js'
import { parseProductListQuery, validateProductInput, ValidationError } from '../../../lib/validation.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../lib/api-error.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = parseProductListQuery(searchParams)
    const products = await getProducts(query)
    return jsonSuccess({ products })
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.status)
    }
    return handleApiError(error, 'Failed to load products.')
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const data = validateProductInput(body)

    const product = await prisma.product.create({ data })
    return jsonSuccess({ product: serializeProduct(product) }, 201)
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.status)
    }
    return handleApiError(error, 'Failed to create product.')
  }
}
