'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

const FRAME_SIZE = 300
const OUTPUT_SIZE = 800
const MIN_ZOOM = 1
const MAX_ZOOM = 4

function clampOffset(offset, displayedSize, frame) {
  const minX = frame - displayedSize.width
  const minY = frame - displayedSize.height

  return {
    x: Math.min(0, Math.max(minX, offset.x)),
    y: Math.min(0, Math.max(minY, offset.y)),
  }
}

export default function ImageCropUploader({ value, onChange, label = 'Product Image', folder = 'products' }) {
  const fileInputRef = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [imageEl, setImageEl] = useState(null)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const dragState = useRef(null)

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc)
    }
  }, [imageSrc])

  const baseScale = imageEl
    ? Math.max(FRAME_SIZE / imageEl.naturalWidth, FRAME_SIZE / imageEl.naturalHeight)
    : 1

  const displayedSize = imageEl
    ? {
        width: imageEl.naturalWidth * baseScale * zoom,
        height: imageEl.naturalHeight * baseScale * zoom,
      }
    : { width: FRAME_SIZE, height: FRAME_SIZE }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''

    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Image must be JPG, PNG, or WebP.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5MB or smaller.')
      return
    }

    setError('')
    const objectUrl = URL.createObjectURL(file)

    const img = new Image()
    img.onload = () => {
      const bs = Math.max(FRAME_SIZE / img.naturalWidth, FRAME_SIZE / img.naturalHeight)
      setImageSrc(objectUrl)
      setImageEl(img)
      setZoom(MIN_ZOOM)
      setOffset({
        x: (FRAME_SIZE - img.naturalWidth * bs) / 2,
        y: (FRAME_SIZE - img.naturalHeight * bs) / 2,
      })
      setModalOpen(true)
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      setError('Could not read that image. Please try another file.')
    }
    img.src = objectUrl
  }

  const openPicker = () => {
    setError('')
    fileInputRef.current?.click()
  }

  const handlePointerDown = (e) => {
    e.preventDefault()
    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: offset,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    const drag = dragState.current
    if (!drag || drag.pointerId !== e.pointerId) return

    const next = clampOffset(
      {
        x: drag.startOffset.x + (e.clientX - drag.startX),
        y: drag.startOffset.y + (e.clientY - drag.startY),
      },
      displayedSize,
      FRAME_SIZE
    )
    setOffset(next)
  }

  const handlePointerUp = (e) => {
    const drag = dragState.current
    if (drag && drag.pointerId === e.pointerId) {
      dragState.current = null
    }
  }

  const handleZoomChange = (nextZoom) => {
    setZoom(nextZoom)
    setOffset((current) =>
      clampOffset(current, {
        width: imageEl.naturalWidth * baseScale * nextZoom,
        height: imageEl.naturalHeight * baseScale * nextZoom,
      }, FRAME_SIZE)
    )
  }

  const applyCropAndUpload = async () => {
    if (!imageEl) return

    setUploading(true)
    setError('')

    try {
      const totalScale = baseScale * zoom
      const sx = -offset.x / totalScale
      const sy = -offset.y / totalScale
      const sw = FRAME_SIZE / totalScale
      const sh = FRAME_SIZE / totalScale

      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_SIZE
      canvas.height = OUTPUT_SIZE
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
      ctx.drawImage(imageEl, sx, sy, sw, sh, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('Could not process image.'))), 'image/jpeg', 0.9)
      })

      const body = new FormData()
      body.append('file', blob, 'product-image.jpg')
      if (folder) {
        body.append('folder', folder)
      }

      const response = await fetch('/api/admin/upload', { method: 'POST', body })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed.')
      }

      onChange(data.url)
      closeModal()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    dragState.current = null
    if (imageSrc) URL.revokeObjectURL(imageSrc)
    setImageSrc('')
    setImageEl(null)
    setZoom(MIN_ZOOM)
    setOffset({ x: 0, y: 0 })
    setError('')
  }

  return (
    <div>
      <label style={{
        display: 'block',
        color: '#3d2c2a',
        fontWeight: '500',
        marginBottom: '4px',
        fontSize: '0.8rem',
      }}>{label}</label>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#fce4e6',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#b58d8a',
          fontSize: '0.65rem',
        }}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Current product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            'None'
          )}
        </div>

        <button type="button" onClick={openPicker} style={{
          padding: '9px 18px',
          borderRadius: '40px',
          border: '1px solid #d49b9f',
          background: 'white',
          color: '#d49b9f',
          fontWeight: '600',
          fontSize: '0.82rem',
          cursor: 'pointer',
        }}>
          Upload from desktop
        </button>

        {value && value !== '/images/placeholder.jpg' && (
          <button type="button" onClick={() => onChange('/images/placeholder.jpg')} style={{
            padding: '9px 14px',
            borderRadius: '40px',
            border: '1px solid #f0dbd9',
            background: 'white',
            color: '#5f4a47',
            fontSize: '0.78rem',
            cursor: 'pointer',
          }}>
            Reset
          </button>
        )}
      </div>

      {value && (
        <p style={{ color: '#b58d8a', fontSize: '0.72rem', margin: '6px 0 0', wordBreak: 'break-all' }}>
          {value}
        </p>
      )}

      {error && !modalOpen && (
        <p role="alert" style={{ color: '#8a2f2f', fontSize: '0.8rem', margin: '6px 0 0' }}>
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Adjust product image"
          onClick={(e) => {
            if (e.target === e.currentTarget && !uploading) closeModal()
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(61, 44, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 200,
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '92vh',
            overflowY: 'auto',
          }}>
            <h3 style={{ margin: '0 0 4px', color: '#3d2c2a', fontSize: '1.05rem' }}>
              Adjust Image
            </h3>
            <p style={{ margin: '0 0 16px', color: '#b58d8a', fontSize: '0.78rem' }}>
              Drag to reposition · use the slider to zoom
            </p>

            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                width: '100%',
                maxWidth: `${FRAME_SIZE}px`,
                aspectRatio: '1/1',
                margin: '0 auto',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                touchAction: 'none',
                cursor: uploading ? 'default' : 'grab',
                background: '#fef9f7',
                userSelect: 'none',
              }}
            >
              {imageEl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt="Crop preview"
                  draggable={false}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${displayedSize.width}px`,
                    height: `${displayedSize.height}px`,
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    pointerEvents: 'none',
                    maxWidth: 'none',
                  }}
                />
              )}
            </div>

            <div style={{ margin: '16px 0 4px' }}>
              <label htmlFor="crop-zoom" style={{
                display: 'block',
                color: '#5f4a47',
                fontSize: '0.8rem',
                fontWeight: '500',
                marginBottom: '4px',
              }}>Zoom ({zoom.toFixed(1)}x)</label>
              <input
                id="crop-zoom"
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step="0.1"
                value={zoom}
                disabled={uploading}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#d49b9f' }}
              />
            </div>

            {error && (
              <p role="alert" style={{ color: '#8a2f2f', fontSize: '0.8rem', margin: '8px 0' }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" onClick={closeModal} disabled={uploading} style={{
                padding: '9px 20px',
                borderRadius: '40px',
                border: '1px solid #d49b9f',
                background: 'white',
                color: '#d49b9f',
                fontWeight: '600',
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}>
                Cancel
              </button>
              <button type="button" onClick={applyCropAndUpload} disabled={uploading} style={{
                padding: '9px 24px',
                borderRadius: '40px',
                border: 'none',
                background: uploading ? '#d9b3b6' : 'linear-gradient(135deg, #d49b9f, #c4848a)',
                color: 'white',
                fontWeight: '600',
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}>
                {uploading ? 'Uploading...' : 'Apply & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
