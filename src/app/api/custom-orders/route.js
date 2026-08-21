import { prisma } from '../../../lib/prisma.js'
import { uploadImage } from '../../../lib/storage/index.js'
import {
  serializeCustomOrder,
  serializeCustomOrderConfirmation,
} from '../../../lib/custom-orders.js'
import {
  MAX_INSPIRATION_IMAGES,
  validateCustomOrderFields,
  validateImageBuffer,
  validateImageFile,
  ValidationError,
} from '../../../lib/validation.js'
import { handleApiError, jsonError, jsonSuccess } from '../../../lib/api-error.js'
import { getClientIp, rateLimit } from '../../../lib/rate-limit.js'

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(`custom-orders:${ip}`, { limit: 5, windowMs: 60_000 })

    if (!limit.allowed) {
      return jsonError('Too many custom order attempts. Please try again shortly.', 429)
    }

    const formData = await request.formData()

    const fields = validateCustomOrderFields({
      customerName: String(formData.get('customerName') || ''),
      customerEmail: String(formData.get('customerEmail') || ''),
      customerPhone: String(formData.get('customerPhone') || ''),
      jewelryType: String(formData.get('jewelryType') || ''),
      description: String(formData.get('description') || ''),
      budget: String(formData.get('budget') || ''),
      timeline: String(formData.get('timeline') || ''),
    })

    const imageEntries = formData.getAll('inspirationImages').filter(Boolean)

    if (imageEntries.length > MAX_INSPIRATION_IMAGES) {
      return jsonError(`You can upload a maximum of ${MAX_INSPIRATION_IMAGES} inspiration images.`, 400)
    }

    const uploadedUrls = []

    for (let index = 0; index < imageEntries.length; index += 1) {
      const entry = imageEntries[index]

      if (typeof entry === 'string') {
        continue
      }

      validateImageFile(entry, { index: index + 1 })

      const buffer = Buffer.from(await entry.arrayBuffer())
      validateImageBuffer(buffer, entry.type)

      const upload = await uploadImage(
        {
          buffer,
          filename: entry.name || `inspiration-${index + 1}`,
          mimeType: entry.type,
        },
        { folder: 'custom-orders' }
      )

      uploadedUrls.push(upload.url)
    }

    const customOrder = await prisma.customOrder.create({
      data: {
        ...fields,
        inspirationImages: uploadedUrls,
        status: 'pending',
      },
    })

    return jsonSuccess(
      {
        customOrder: serializeCustomOrder(customOrder),
        message: 'Custom order request submitted successfully.',
      },
      201
    )
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.status)
    }

    return handleApiError(error, 'Failed to submit custom order request.')
  }
}
