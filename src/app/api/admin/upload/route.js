import { getAdminSession } from '../../../../lib/auth.js'
import { uploadImage } from '../../../../lib/storage/index.js'
import {
  validateImageFile,
  validateImageBuffer,
  ValidationError,
} from '../../../../lib/validation.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../../lib/api-error.js'
import { getClientIp, rateLimit } from '../../../../lib/rate-limit.js'

export async function POST(request) {
  const session = await getAdminSession()

  if (!session) {
    return jsonError('Authentication required.', 401)
  }

  try {
    const ip = getClientIp(request)
    const limit = rateLimit(`admin-upload:${ip}`, { limit: 30, windowMs: 60_000 })

    if (!limit.allowed) {
      return jsonError('Too many uploads. Please wait a moment.', 429)
    }

    const formData = await request.formData()
    const file = formData.get('file')

    validateImageFile(file)

    const buffer = Buffer.from(await file.arrayBuffer())
    validateImageBuffer(buffer, file.type)

    const upload = await uploadImage(
      {
        buffer,
        filename: file.name || 'product-image',
        mimeType: file.type,
      },
      { folder: 'products' }
    )

    return jsonSuccess({ url: upload.url }, 201)
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.status)
    }

    return handleApiError(error, 'Failed to upload image.')
  }
}
