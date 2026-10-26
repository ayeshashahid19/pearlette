import { CATEGORY_SLUGS } from './categories.js'
import { slugify } from './slug.js'

const VALID_CATEGORIES = new Set(CATEGORY_SLUGS)

export function parseProductListQuery(searchParams) {
  const category = searchParams.get('category') || undefined
  const featured = searchParams.get('featured')
  const includeInactive = searchParams.get('includeInactive') === 'true'

  if (category && !VALID_CATEGORIES.has(category)) {
    throw new ValidationError('Invalid category.')
  }

  return {
    category,
    featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
    includeInactive,
  }
}

export function validateProductInput(body, { isUpdate = false } = {}) {
  const errors = []

  if (!isUpdate || body.name !== undefined) {
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      errors.push('Name is required.')
    }
  }

  if (!isUpdate || body.price !== undefined) {
    const price = Number(body.price)
    if (Number.isNaN(price) || price < 0) {
      errors.push('Price must be a valid non-negative number.')
    }
  }

  if (!isUpdate || body.category !== undefined) {
    if (!body.category || !VALID_CATEGORIES.has(body.category)) {
      errors.push('Valid category is required.')
    }
  }

  if (!isUpdate || body.description !== undefined) {
    if (!body.description || typeof body.description !== 'string' || !body.description.trim()) {
      errors.push('Description is required.')
    }
  }

  if (body.material !== undefined && body.material !== null && typeof body.material !== 'string') {
    errors.push('Material must be a string.')
  }

  if (body.stock !== undefined && body.stock !== null) {
    const stock = Number(body.stock)
    if (!Number.isInteger(stock) || stock < 0) {
      errors.push('Stock must be a non-negative integer.')
    }
  }

  if (errors.length) {
    throw new ValidationError(errors.join(' '))
  }

  const payload = {}

  if (body.name !== undefined) payload.name = body.name.trim()
  if (body.price !== undefined) payload.price = Number(body.price)
  if (body.category !== undefined) payload.category = body.category
  if (body.description !== undefined) payload.description = body.description.trim()
  if (body.material !== undefined) payload.material = body.material?.trim() || null
  if (body.img !== undefined) payload.img = body.img?.trim() || '/images/placeholder.jpg'
  if (body.handcrafted !== undefined) payload.handcrafted = Boolean(body.handcrafted)
  if (body.featured !== undefined) payload.featured = Boolean(body.featured)
  if (body.isActive !== undefined) payload.isActive = Boolean(body.isActive)
  if (body.stock !== undefined) payload.stock = body.stock === null ? null : Number(body.stock)

  if (!isUpdate && body.name) {
    payload.slug = body.slug?.trim() || slugify(body.name)
  } else if (body.slug?.trim()) {
    payload.slug = slugify(body.slug.trim())
  } else if (body.name) {
    payload.slug = slugify(body.name)
  }

  return payload
}

export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
    this.status = 400
  }
}

export const MAX_ITEM_QUANTITY = 99

const PK_PHONE_REGEX = /^(?:\+92|92|0)?3[0-9]{9}$/

export function normalizePhone(phone) {
  return String(phone || '')
    .trim()
    .replace(/[\s-]/g, '')
}

export function isValidPakistaniPhone(phone) {
  return PK_PHONE_REGEX.test(normalizePhone(phone))
}

export function validateOrderInput(body) {
  const errors = []

  if (!body || typeof body !== 'object') {
    throw new ValidationError('Invalid order payload.')
  }

  if (!body.customerName || typeof body.customerName !== 'string' || !body.customerName.trim()) {
    errors.push('Full name is required.')
  }

  if (!body.customerPhone || !isValidPakistaniPhone(body.customerPhone)) {
    errors.push('A valid Pakistani phone number is required.')
  }

  if (!body.customerAddress || typeof body.customerAddress !== 'string' || !body.customerAddress.trim()) {
    errors.push('Delivery address is required.')
  }

  if (!body.customerCity || typeof body.customerCity !== 'string' || !body.customerCity.trim()) {
    errors.push('City is required.')
  }

  if (body.customerEmail && typeof body.customerEmail === 'string' && body.customerEmail.trim()) {
    const email = body.customerEmail.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email address is invalid.')
    }
  }

  if (body.customerInstructions && typeof body.customerInstructions !== 'string') {
    errors.push('Special instructions must be text.')
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push('At least one cart item is required.')
  } else {
    body.items.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`Item ${index + 1} is invalid.`)
        return
      }

      if (
        !item.productId ||
        typeof item.productId !== 'string' ||
        !item.productId.trim()
      ) {
        errors.push(`Item ${index + 1} is missing a product ID.`)
      }

      const quantity = Number(item.quantity)
      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_ITEM_QUANTITY
      ) {
        errors.push(
          `Item ${index + 1} must have a quantity between 1 and ${MAX_ITEM_QUANTITY}.`
        )
      }
    })
  }

  // Merge duplicate product lines before validating and returning so the
  // quantity cap applies to the combined line. Without this, two entries of
  // 60 would each pass the per-line check and produce a quantity of 120.
  const mergedItems = new Map()
  let hasDuplicateLines = false

  if (Array.isArray(body.items)) {
    for (const item of body.items) {
      if (!item || typeof item !== 'object' || typeof item.productId !== 'string') {
        continue
      }

      const productId = item.productId.trim()
      const quantity = Number(item.quantity)

      if (!productId || !Number.isInteger(quantity)) continue

      if (mergedItems.has(productId)) hasDuplicateLines = true
      mergedItems.set(productId, (mergedItems.get(productId) || 0) + quantity)
    }

    // No order should ever be created from an empty item list. Invalid lines
    // are reported as errors above, so this is a final guard.
    if (body.items.length > 0 && mergedItems.size === 0 && errors.length === 0) {
      errors.push('At least one cart item is required.')
    }

    if (hasDuplicateLines) {
      for (const quantity of mergedItems.values()) {
        if (quantity > MAX_ITEM_QUANTITY) {
          errors.push(
            `Combined quantity for a single item cannot exceed ${MAX_ITEM_QUANTITY}.`
          )
          break
        }
      }
    }
  }

  if (errors.length) {
    throw new ValidationError(errors.join(' '))
  }

  return {
    customerName: body.customerName.trim(),
    customerEmail: body.customerEmail?.trim() || null,
    customerPhone: normalizePhone(body.customerPhone),
    customerAddress: body.customerAddress.trim(),
    customerCity: body.customerCity.trim(),
    customerInstructions: body.customerInstructions?.trim() || null,
    items: Array.from(mergedItems.entries()).map(([productId, quantity]) => ({
      productId,
      quantity,
    })),
  }
}

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export function validateOrderStatus(status) {
  if (!ORDER_STATUSES.includes(status)) {
    throw new ValidationError('Invalid order status.')
  }
  return status
}

export const CUSTOM_JEWELRY_TYPES = [
  'necklace',
  'bracelet',
  'earrings',
  'ring',
  'armcuff',
  'charm',
  'other',
]

export const CUSTOM_ORDER_STATUSES = [
  'pending',
  'reviewing',
  'quoted',
  'approved',
  'in_progress',
  'completed',
  'cancelled',
]

export const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
export const MAX_INSPIRATION_IMAGES = 5
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

export function validateImageFile(file, { index = 0 } = {}) {
  const label = index > 0 ? `Image ${index}` : 'Image'

  if (!file || typeof file !== 'object') {
    throw new ValidationError(`${label} is invalid.`)
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new ValidationError(`${label} must be JPG, PNG, or WebP.`)
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new ValidationError(`${label} must be 5MB or smaller.`)
  }
}

export function validateImageBuffer(buffer, mimeType) {
  if (!buffer || buffer.length < 12) {
    throw new ValidationError('Invalid image file.')
  }

  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  const isWebp =
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'

  const matches =
    (mimeType === 'image/jpeg' && isJpeg) ||
    (mimeType === 'image/png' && isPng) ||
    (mimeType === 'image/webp' && isWebp)

  if (!matches) {
    throw new ValidationError('Uploaded file content does not match an allowed image type.')
  }
}

export function validateCustomOrderFields(fields) {
  const errors = []

  if (!fields.customerName?.trim()) {
    errors.push('Your name is required.')
  }

  if (!fields.customerPhone || !isValidPakistaniPhone(fields.customerPhone)) {
    errors.push('A valid Pakistani phone number is required.')
  }

  if (fields.customerEmail?.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.customerEmail.trim())) {
      errors.push('Email address is invalid.')
    }
  }

  if (!fields.jewelryType || !CUSTOM_JEWELRY_TYPES.includes(fields.jewelryType)) {
    errors.push('Please select a valid jewelry type.')
  }

  if (!fields.description?.trim()) {
    errors.push('Please describe your vision.')
  }

  if (fields.budget && typeof fields.budget !== 'string') {
    errors.push('Budget must be text.')
  }

  if (fields.timeline && typeof fields.timeline !== 'string') {
    errors.push('Timeline must be text.')
  }

  if (errors.length) {
    throw new ValidationError(errors.join(' '))
  }

  return {
    customerName: fields.customerName.trim(),
    customerEmail: fields.customerEmail?.trim() || null,
    customerPhone: normalizePhone(fields.customerPhone),
    jewelryType: fields.jewelryType,
    description: fields.description.trim(),
    budget: fields.budget?.trim() || null,
    timeline: fields.timeline?.trim() || null,
  }
}

export function validateCustomOrderStatus(status) {
  if (!CUSTOM_ORDER_STATUSES.includes(status)) {
    throw new ValidationError('Invalid custom order status.')
  }
  return status
}

