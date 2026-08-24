'use client'
import { useEffect, useState } from 'react'
import { ADMIN_CATEGORY_OPTIONS } from '../../../../lib/categories.js'
import ImageCropUploader from '../../../components/ImageCropUploader'

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '10px',
  border: '1px solid #f0dbd9',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  background: '#fef9f7',
}

const labelStyle = {
  display: 'block',
  color: '#3d2c2a',
  fontWeight: '500',
  marginBottom: '4px',
  fontSize: '0.8rem',
}

const EMPTY_FORM = {
  name: '',
  price: '',
  category: 'necklace',
  description: '',
  material: '',
  stock: '',
  img: '',
  handcrafted: true,
  featured: false,
  isActive: true,
}

function ProductForm({ initial, onSubmit, onCancel, submitting, serverError }) {
  const [form, setForm] = useState(initial)
  const isEdit = Boolean(initial?.id)

  const setField = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
      style={{ display: 'grid', gap: '12px' }}
    >
      {serverError && (
        <div role="alert" style={{
          background: '#fff0f0',
          border: '1px solid #ffb3b3',
          color: '#8a2f2f',
          padding: '10px 12px',
          borderRadius: '10px',
          fontSize: '0.85rem',
        }}>
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="p-name" style={labelStyle}>Name *</label>
        <input id="p-name" style={inputStyle} value={form.name} onChange={setField('name')} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label htmlFor="p-price" style={labelStyle}>Price (PKR) *</label>
          <input id="p-price" type="number" min="0" step="1" style={inputStyle} value={form.price} onChange={setField('price')} required />
        </div>
        <div>
          <label htmlFor="p-category" style={labelStyle}>Category *</label>
          <select id="p-category" style={inputStyle} value={form.category} onChange={setField('category')} required>
            {ADMIN_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="p-description" style={labelStyle}>Description *</label>
        <textarea id="p-description" rows="3" style={{ ...inputStyle, resize: 'vertical' }} value={form.description} onChange={setField('description')} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label htmlFor="p-material" style={labelStyle}>Material</label>
          <input id="p-material" style={inputStyle} value={form.material || ''} onChange={setField('material')} />
        </div>
        <div>
          <label htmlFor="p-stock" style={labelStyle}>Stock (optional)</label>
          <input id="p-stock" type="number" min="0" step="1" style={inputStyle} value={form.stock ?? ''} onChange={setField('stock')} />
        </div>
      </div>

      <ImageCropUploader
        label="Product Image"
        value={form.img || ''}
        onChange={(url) => setForm((prev) => ({ ...prev, img: url }))}
      />

      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#5f4a47' }}>
          <input type="checkbox" checked={form.handcrafted} onChange={setField('handcrafted')} /> Handcrafted
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#5f4a47' }}>
          <input type="checkbox" checked={form.featured} onChange={setField('featured')} /> Featured
        </label>
        {isEdit && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#5f4a47' }}>
            <input type="checkbox" checked={form.isActive} onChange={setField('isActive')} /> Active
          </label>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={{
          padding: '9px 20px',
          borderRadius: '40px',
          border: '1px solid #d49b9f',
          background: 'white',
          color: '#d49b9f',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} style={{
          padding: '9px 26px',
          borderRadius: '40px',
          border: 'none',
          background: submitting ? '#d9b3b6' : 'linear-gradient(135deg, #d49b9f, #c4848a)',
          color: 'white',
          fontWeight: '600',
          cursor: submitting ? 'not-allowed' : 'pointer',
        }}>
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [rowBusyId, setRowBusyId] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?includeInactive=true')
        if (!response.ok) throw new Error('Failed to load products.')
        const data = await response.json()

        if (!active) return
        setProducts(data.products)
        setLoadError('')
      } catch {
        if (!active) return
        setLoadError("We couldn't load the products. Please try again.")
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      active = false
    }
  }, [reloadKey])

  const refresh = () => setReloadKey((key) => key + 1)

  const openCreate = () => {
    setEditingProduct(null)
    setFormError('')
    setShowForm(true)
  }

  const openEdit = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      material: product.material,
      stock: product.stock ?? '',
      img: product.img,
      handcrafted: product.handcrafted,
      featured: product.featured,
      isActive: product.isActive,
    })
    setFormError('')
    setShowForm(true)
  }

  const handleSubmit = async (form) => {
    setSaving(true)
    setFormError('')

    try {
      const payload = {
        name: form.name,
        price: form.price,
        category: form.category,
        description: form.description,
        material: form.material || null,
        stock: form.stock === '' ? null : Number(form.stock),
        img: form.img || undefined,
        handcrafted: form.handcrafted,
        featured: form.featured,
      }

      if (editingProduct) {
        payload.isActive = form.isActive
      }

      const response = await fetch(
        editingProduct ? `/api/products/${editingProduct.id}` : '/api/products',
        {
          method: editingProduct ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save product.')
      }

      setShowForm(false)
      refresh()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (product) => {
    const action = product.isActive ? 'deactivate' : 'reactivate'

    if (
      !window.confirm(
        product.isActive
          ? `Deactivate "${product.name}"? It will be hidden from the store but kept in order history.`
          : `Reactivate "${product.name}"?`
      )
    ) {
      return
    }

    setRowBusyId(product.id)

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !product.isActive }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${action} product.`)
      }

      refresh()
    } catch (error) {
      window.alert(error.message)
    } finally {
      setRowBusyId(null)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#3d2c2a', fontSize: '1.8rem', fontWeight: '600', margin: 0 }}>Products</h1>
          <p style={{ color: '#b58d8a', margin: '2px 0 0' }}>{products.length} total</p>
        </div>
        <button onClick={openCreate} style={{
          padding: '10px 24px',
          borderRadius: '40px',
          border: 'none',
          background: 'linear-gradient(135deg, #d49b9f, #c4848a)',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          + Add Product
        </button>
      </div>

      {loading && <p style={{ color: '#5f4a47' }}>Loading products...</p>}

      {loadError && (
        <div role="alert" style={{
          background: '#fff0f0',
          border: '1px solid #ffb3b3',
          color: '#8a2f2f',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '16px',
        }}>
          {loadError}
        </div>
      )}

      {!loading && !loadError && products.length === 0 && (
        <p style={{ color: '#5f4a47' }}>No products found.</p>
      )}

      {!loading && products.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', minWidth: '760px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#b58d8a', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ padding: '0 12px' }}>Product</th>
                <th style={{ padding: '0 12px' }}>Price</th>
                <th style={{ padding: '0 12px' }}>Category</th>
                <th style={{ padding: '0 12px' }}>Status</th>
                <th style={{ padding: '0 12px' }}>Flags</th>
                <th style={{ padding: '0 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ background: 'white', boxShadow: '0 3px 10px rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '12px', borderRadius: '16px 0 0 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.img || '/images/placeholder.jpg'}
                        alt=""
                        width="44"
                        height="44"
                        style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '10px', background: '#fce4e6' }}
                      />
                      <div>
                        <p style={{ margin: 0, color: '#3d2c2a', fontWeight: '600', fontSize: '0.92rem' }}>{product.name}</p>
                        <p style={{ margin: 0, color: '#b58d8a', fontSize: '0.75rem' }}>/products/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#5f4a47', fontSize: '0.88rem' }}>
                    Rs. {Number(product.price).toLocaleString('en-PK')}
                  </td>
                  <td style={{ padding: '12px', color: '#5f4a47', fontSize: '0.88rem' }}>{product.category}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '40px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'white',
                      background: product.isActive ? '#9fc7a9' : '#c9b6b4',
                    }}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#b58d8a', fontSize: '0.8rem' }}>
                    {[product.featured && 'Featured', product.handcrafted && 'Handmade'].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td style={{ padding: '12px', borderRadius: '0 16px 16px 0', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button onClick={() => openEdit(product)} style={{
                      padding: '6px 16px',
                      marginRight: '8px',
                      borderRadius: '40px',
                      border: '1px solid #d49b9f',
                      background: 'white',
                      color: '#d49b9f',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(product)}
                      disabled={rowBusyId === product.id}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '40px',
                        border: 'none',
                        background: product.isActive ? '#f5c6cb' : '#9fc7a9',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        cursor: rowBusyId === product.id ? 'wait' : 'pointer',
                      }}
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingProduct ? 'Edit product' : 'Add product'}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(61, 44, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false)
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ marginTop: 0, color: '#3d2c2a', fontSize: '1.15rem' }}>
              {editingProduct ? 'Edit Product' : 'New Product'}
            </h2>
            <ProductForm
              initial={editingProduct || EMPTY_FORM}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              submitting={saving}
              serverError={formError}
            />
          </div>
        </div>
      )}
    </div>
  )
}
