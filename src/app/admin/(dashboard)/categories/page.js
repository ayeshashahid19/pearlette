'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ImageCropUploader from '../../../components/ImageCropUploader'

const cardStyle = {
  background: 'white',
  border: '1px solid #fce4e6',
  borderRadius: '18px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

function CategoryCard({ category, onSaved }) {
  const [name, setName] = useState(category.name)
  const [imgUrl, setImgUrl] = useState(category.imgUrl)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const dirty = name !== category.name || imgUrl !== category.imgUrl

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, imgUrl }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to save category.')
      }

      onSaved(data.category)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={cardStyle}>
      {error && (
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
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl || '/images/placeholder.jpg'}
          alt={`${category.name} category image`}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '14px',
            objectFit: 'cover',
            border: '1px solid #fce4e6',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <label
            htmlFor={`cat-name-${category.id}`}
            style={{ display: 'block', fontWeight: '600', color: '#3d2c2a', fontSize: '0.85rem', marginBottom: '6px' }}
          >
            Category name
          </label>
          <input
            id={`cat-name-${category.id}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '10px',
              border: '1px solid #f0dbd9',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              background: '#fef9f7',
            }}
          />
        </div>
      </div>

      <ImageCropUploader value={imgUrl} onChange={setImgUrl} label="Category image" folder="categories" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <Link
          href={`/${category.slug}`}
          target="_blank"
          style={{ fontSize: '0.78rem', color: '#5f4a47', textDecoration: 'none' }}
        >
          View page ↗
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          style={{
            padding: '8px 20px',
            borderRadius: '40px',
            border: 'none',
            background: dirty ? '#d49b9f' : '#e8d3d1',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.82rem',
            fontFamily: 'inherit',
            cursor: saving || !dirty ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
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

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#3d2c2a', margin: 0 }}>Categories</h1>
        <p style={{ color: '#5f4a47', fontSize: '0.85rem', margin: 0 }}>
          These images appear on the Collections page
        </p>
      </div>

      {loadError && (
        <div role="alert" style={{ background: '#fff0f0', border: '1px solid #ffb3b3', color: '#8a2f2f', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
          {loadError}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#5f4a47' }}>Loading categories…</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onSaved={(updated) =>
                setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
