'use client'
import { useEffect, useState } from 'react'
import { CUSTOM_ORDER_STATUSES } from '../../../../lib/validation.js'

const STATUS_COLORS = {
  pending: '#d9a441',
  reviewing: '#7ba3d4',
  quoted: '#9b7fd1',
  approved: '#5fa8a0',
  in_progress: '#c4848a',
  completed: '#9fc7a9',
  cancelled: '#c9b6b4',
}

const STATUS_LABELS = {
  in_progress: 'In Progress',
}

const selectStyle = {
  padding: '9px 12px',
  borderRadius: '10px',
  border: '1px solid #f0dbd9',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  background: 'white',
  color: '#5f4a47',
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status
}

function CustomOrderCard({ order, onStatusChange, busy }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background: 'white',
      borderRadius: '18px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
      border: '1px solid #fce4e6',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        padding: '16px',
      }}>
        <div>
          <p style={{ margin: 0, color: '#3d2c2a', fontWeight: '600', fontSize: '0.95rem' }}>
            {order.customerName} — <span style={{ textTransform: 'capitalize' }}>{order.jewelryType}</span>
          </p>
          <p style={{ margin: '2px 0 0', color: '#b58d8a', fontSize: '0.78rem' }}>
            {formatDateTime(order.createdAt)}
            {order.budget ? ` · Budget: Rs. ${order.budget}` : ''}
            {order.timeline ? ` · Needed: ${order.timeline}` : ''}
          </p>
          <p style={{ margin: '2px 0 0', color: '#b58d8a', fontSize: '0.72rem', wordBreak: 'break-all' }}>
            #{order.id}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: '40px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'white',
            background: STATUS_COLORS[order.status] || '#c9b6b4',
          }}>
            {statusLabel(order.status)}
          </span>
          <select
            aria-label={`Update status for request ${order.id}`}
            value={order.status}
            disabled={busy}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            style={selectStyle}
          >
            {CUSTOM_ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>{statusLabel(status)}</option>
            ))}
          </select>
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            style={{
              padding: '6px 16px',
              borderRadius: '40px',
              border: '1px solid #d49b9f',
              background: 'white',
              color: '#d49b9f',
              fontWeight: '600',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {expanded ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #fce4e6', padding: '16px', background: '#fef9f7' }}>
          <h4 style={{ margin: '0 0 8px', color: '#3d2c2a', fontSize: '0.88rem' }}>Vision</h4>
          <p style={{ margin: '0 0 14px', color: '#5f4a47', fontSize: '0.88rem', lineHeight: 1.7 }}>
            {order.description}
          </p>

          <h4 style={{ margin: '0 0 8px', color: '#3d2c2a', fontSize: '0.88rem' }}>Customer</h4>
          <dl style={{ margin: '0 0 14px', display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '4px 16px', fontSize: '0.85rem', color: '#5f4a47' }}>
            <dt style={{ fontWeight: '600' }}>Phone</dt><dd style={{ margin: 0 }}>{order.customerPhone}</dd>
            <dt style={{ fontWeight: '600' }}>Email</dt><dd style={{ margin: 0 }}>{order.customerEmail || '—'}</dd>
            <dt style={{ fontWeight: '600' }}>Budget</dt><dd style={{ margin: 0 }}>{order.budget || '—'}</dd>
            <dt style={{ fontWeight: '600' }}>Timeline</dt><dd style={{ margin: 0 }}>{order.timeline || '—'}</dd>
          </dl>

          {order.inspirationImages?.length > 0 && (
            <>
              <h4 style={{ margin: '0 0 8px', color: '#3d2c2a', fontSize: '0.88rem' }}>
                Inspiration Images ({order.inspirationImages.length})
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {order.inspirationImages.map((src, index) => (
                  <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Inspiration ${index + 1}`}
                      width="72"
                      height="72"
                      style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #fce4e6' }}
                    />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminCustomOrdersPage() {
  const [customOrders, setCustomOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    let active = true

    async function fetchCustomOrders() {
      try {
        const response = await fetch(`/api/admin/custom-orders${statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ''}`)
        if (!response.ok) throw new Error('Failed to load custom orders.')
        const data = await response.json()

        if (!active) return
        setCustomOrders(data.customOrders)
        setLoadError('')
      } catch {
        if (!active) return
        setLoadError("We couldn't load the custom requests. Please try again.")
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchCustomOrders()

    return () => {
      active = false
    }
  }, [statusFilter])

  const handleFilterChange = (status) => {
    setStatusFilter(status)
    setLoading(true)
  }

  const handleStatusChange = async (orderId, status) => {
    setBusyId(orderId)

    try {
      const response = await fetch(`/api/admin/custom-orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update status.')
      }

      setCustomOrders((prev) =>
        statusFilter
          ? prev.map((o) => (o.id === orderId ? { ...o, status } : o))
          : prev.filter((o) => o.id !== orderId)
      )
    } catch (error) {
      window.alert(error.message)
      handleFilterChange(statusFilter)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#3d2c2a', fontSize: '1.8rem', fontWeight: '600', margin: 0 }}>Custom Requests</h1>
          <p style={{ color: '#b58d8a', margin: '2px 0 0' }}>{customOrders.length} shown</p>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#5f4a47' }}>
          Filter by status
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            style={selectStyle}
          >
            <option value="">All statuses</option>
            {CUSTOM_ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>{statusLabel(status)}</option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p style={{ color: '#5f4a47' }}>Loading custom requests...</p>}

      {loadError && (
        <div role="alert" style={{
          background: '#fff0f0',
          border: '1px solid #ffb3b3',
          color: '#8a2f2f',
          padding: '14px',
          borderRadius: '12px',
        }}>
          {loadError}
        </div>
      )}

      {!loading && !loadError && customOrders.length === 0 && (
        <p style={{ color: '#5f4a47' }}>No custom requests found.</p>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {customOrders.map((order) => (
          <CustomOrderCard
            key={order.id}
            order={order}
            busy={busyId === order.id}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  )
}
