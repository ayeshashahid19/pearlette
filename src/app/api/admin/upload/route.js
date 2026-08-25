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
    const requestedFolder = String(formData.get('folder') || 'products')
    const folder = ['products', 'categories'].includes(requestedFolder)
      ? requestedFolder
      : 'products'

    validateImageFile(file)

    const buffer = Buffer.from(await file.arrayBuffer())
    validateImageBuffer(buffer, file.type)

    const upload = await uploadImage(
      {
        buffer,
        filename: file.name || 'product-image',
        mimeType: file.type,
      },
      { folder }
    )

    const providerName = process.env.STORAGE_PROVIDER || (process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob' : 'local')

    if (providerName === 'local' && process.env.VERCEL) {
      return jsonError('Image uploads require a Blob store on Vercel. Connect one in Settings → Storage.', 500)
    }

    return jsonSuccess({ url: upload.url }, 201)
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.status)
    }

    return handleApiError(error, 'Failed to upload image.')
  }
}
