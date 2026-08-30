'use client'
import { useEffect, useState } from 'react'
import ImageCropUploader from '../../../components/ImageCropUploader'

const cardStyle = {
  background: 'white',
  border: '1px solid #fce4e6',
  borderRadius: '18px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '10px',
  border: '1px solid #f0dbd9',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  background: '#fef9f7',
}

const btnPrimary = {
  padding: '8px 20px',
  borderRadius: '40px',
  border: 'none',
  background: '#d49b9f',
  color: 'white',
  fontWeight: '600',
  fontSize: '0.82rem',
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const btnSecondary = {
  padding: '8px 20px',
  borderRadius: '40px',
  border: '1px solid #d49b9f',
  background: 'white',
  color: '#d49b9f',
  fontWeight: '600',
  fontSize: '0.82rem',
  fontFamily: 'inherit',
  cursor: 'pointer',
}

function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div
      role="alert"
      style={{
        background: '#fff0f0',
        border: '1px solid #ffb3b3',
        color: '#8a2f2f',
        padding: '8px 10px',
        borderRadius: '10px',
        fontSize: '0.8rem',
      }}
    >
      {message}
    </div>
  )
}

function EditModal({ category, onClose, onSaved }) {
  const [name, setName] = useState(category.name)
  const [sortOrder, setSortOrder] = useState(String(category.sortOrder))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sortOrder: Number(sortOrder) }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to save category.')
      }

      onSaved(data.category)
      setSaved(true)
      setTimeout(onClose, 600)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit category"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose()
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
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '24px',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h3 style={{ margin: '0 0 16px', color: '#3d2c2a', fontSize: '1.05rem' }}>
          Edit Category
        </h3>

        <ErrorBanner message={error} />

        <div style={{ display: 'grid', gap: '12px', marginTop: error ? '12px' : 0 }}>
          <div>
            <label
              htmlFor="edit-cat-name"
              style={{ display: 'block', fontWeight: '600', color: '#3d2c2a', fontSize: '0.85rem', marginBottom: '6px' }}
            >
              Category Name
            </label>
            <input
              id="edit-cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              style={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="edit-cat-sort"
              style={{ display: 'block', fontWeight: '600', color: '#3d2c2a', fontSize: '0.85rem', marginBottom: '6px' }}
            >
              Sort Order
            </label>
            <input
              id="edit-cat-sort"
              type="number"
              min="0"
              max="999"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="button" onClick={onClose} disabled={saving} style={{ ...btnSecondary, cursor: saving ? 'not-allowed' : 'pointer' }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              ...btnPrimary,
              background: saving ? '#d9b3b6' : saved ? '#7ab87a' : '#d49b9f',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({ category, onSaved }) {
  const [imgUrl, setImgUrl] = useState(category.imgUrl)
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const [imageSaved, setImageSaved] = useState(false)

  const handleImageChange = async (newUrl) => {
    if (newUrl === imgUrl) return

    setUploading(true)
    setImageError('')
    setImageSaved(false)

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imgUrl: newUrl }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to update category image.')
      }

      setImgUrl(data.category.imgUrl)
      onSaved(data.category)
      setImageSaved(true)
      setShowImageUploader(false)
    } catch (err) {
      setImageError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div style={cardStyle}>
        <div
          style={{
            aspectRatio: '4 / 3',
            background: 'linear-gradient(135deg, #fce4e6, #fef9f7)',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl || '/images/placeholder.jpg'}
            alt={`${category.name} category image`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ErrorBanner message={imageError} />

          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: '#3d2c2a', fontWeight: '600' }}>
              {category.name}
            </h2>
            <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#b58d8a' }}>{category.slug}</p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#5f4a47' }}>
              Sort order: {category.sortOrder}
            </p>
          </div>

          {showImageUploader && (
            <ImageCropUploader
              value={imgUrl}
              onChange={handleImageChange}
              label="Category image"
              folder="categories"
            />
          )}

          {uploading && (
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#5f4a47' }}>Uploading…</p>
          )}

          {imageSaved && !uploading && (
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#5a8a5a' }}>Image updated ✓</p>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setShowImageUploader((v) => !v)
                setImageError('')
                setImageSaved(false)
              }}
              disabled={uploading}
              style={{ ...btnSecondary, cursor: uploading ? 'not-allowed' : 'pointer' }}
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              style={btnPrimary}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditModal
          category={category}
          onClose={() => setShowEditModal(false)}
          onSaved={(updated) => {
            onSaved(updated)
            setShowEditModal(false)
          }}
        />
      )}
    </>
  )
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load categories.')
        }

        if (!cancelled) setCategories(data.categories)
      } catch (err) {
        if (!cancelled) setLoadError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSaved = (updated) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === updated.id ? updated : c))
      return [...next].sort((a, b) => a.sortOrder - b.sortOrder)
    })
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#3d2c2a', margin: '0 0 6px' }}>Categories</h1>
        <p style={{ color: '#5f4a47', fontSize: '0.85rem', margin: 0 }}>
          Manage your collection categories
        </p>
      </div>

      {loadError && (
        <div
          role="alert"
          style={{
            background: '#fff0f0',
            border: '1px solid #ffb3b3',
            color: '#8a2f2f',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '16px',
          }}
        >
          {loadError}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#5f4a47' }}>Loading categories…</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} onSaved={handleSaved} />
          ))}
        </div>
      )}
    </div>
  )
}
