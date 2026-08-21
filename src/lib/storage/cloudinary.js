import crypto from 'crypto'

export async function uploadFile({ buffer, filename, mimeType, folder = 'pearlette/custom-orders' }) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured.')
  }

  const timestamp = Math.round(Date.now() / 1000)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex')

  const body = new FormData()
  body.append('file', new Blob([buffer], { type: mimeType }), filename || 'upload')
  body.append('api_key', apiKey)
  body.append('timestamp', String(timestamp))
  body.append('signature', signature)
  body.append('folder', folder)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed.')
  }

  return {
    url: data.secure_url,
    provider: 'cloudinary',
  }
}
