import { prisma } from '../../../../../lib/prisma.js'
import { requireAdmin } from '../../../../../lib/auth.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../../../lib/api-error.js'

function isValidImgUrl(url) {
  return (
    typeof url === 'string' &&
    url.length > 0 &&
    url.length <= 500 &&
    (url.startsWith('/') || url.startsWith('https://'))
  )
}

export async function GET(request, { params }) {
  const { errorResponse } = await requireAdmin()
  if (errorResponse) return errorResponse

  try {
    const { id } = await params
    const category = await prisma.category.findUnique({ where: { id } })

    if (!category) {
      return jsonError('Category not found.', 404)
    }

    return jsonSuccess({ category })
  } catch (error) {
    return handleApiError(error, 'Failed to load category.')
  }
}

export async function PATCH(request, { params }) {
  const { errorResponse } = await requireAdmin()
  if (errorResponse) return errorResponse

  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return jsonError('Category not found.', 404)
    }

    const data = {}

    if (body?.name !== undefined) {
      const name = String(body.name).trim()
      if (!name || name.length > 60) {
        return jsonError('Name must be 1-60 characters.', 400)
      }
      data.name = name
    }

    if (body?.imgUrl !== undefined) {
      if (!isValidImgUrl(body.imgUrl)) {
        return jsonError('Image URL must be a site path or https:// URL.', 400)
      }
      data.imgUrl = body.imgUrl
    }

    if (Object.keys(data).length === 0) {
      return jsonError('Nothing to update.', 400)
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    })

    return jsonSuccess({ category })
  } catch (error) {
    return handleApiError(error, 'Failed to update category.')
  }
}
