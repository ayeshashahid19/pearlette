import { getCategories } from '../../../lib/categories-db.js'
import { handleApiError, jsonSuccess } from '../../../lib/api-error.js'

export async function GET() {
  try {
    const categories = await getCategories()
    return jsonSuccess({ categories })
  } catch (error) {
    return handleApiError(error, 'Failed to load categories.')
  }
}
