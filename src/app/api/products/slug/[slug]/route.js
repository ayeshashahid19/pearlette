import { getProductBySlug } from '../../../../../lib/products.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../../../lib/api-error.js'

export async function GET(request, { params }) {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
      return jsonError('Product not found.', 404)
    }

    return jsonSuccess({ product })
  } catch (error) {
    return handleApiError(error, 'Failed to load product.')
  }
}
