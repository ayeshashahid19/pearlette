'use client'
import { useEffect, useState } from 'react'
import { ORDER_STATUSES } from '../../../../lib/validation.js'

const STATUS_COLORS = {
  pending: '#d9a441',
  confirmed: '#7ba3d4',
  processing: '#9b7fd1',
  shipped: '#5fa8a0',
  delivered: '#9fc7a9',
  cancelled: '#c9b6b4',
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

function OrderCard({ order, onStatusChange, busy }) {
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
            {order.customerName} — Rs. {Number(order.total).toLocaleString('en-PK')}
          </p>
          <p style={{ margin: '2px 0 0', color: '#b58d8a', fontSize: '0.78rem' }}>
            {formatDateTime(order.createdAt)} · {order.customerCity} · {order.items.length} item{order.items.length === 1 ? '' : 's'}
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
            textTransform: 'capitalize',
          }}>
            {order.status}
          </span>
          <select
            aria-label={`Update status for order ${order.id}`}
            value={order.status}
            disabled={busy}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            style={selectStyle}
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
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
          <h4 style={{ margin: '0 0 8px', color: '#3d2c2a', fontSize: '0.88rem' }}>Items</h4>
          <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0 }}>
            {order.items.map((item) => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #f0dbd9', color: '#5f4a47', fontSize: '0.85rem' }}>
                <span>{item.name} × {item.quantity}</span>
                <span>Rs. {(Number(item.price) * item.quantity).toLocaleString('en-PK')}</span>
              </li>
            ))}
          </ul>

          <h4 style={{ margin: '0 0 8px', color: '#3d2c2a', fontSize: '0.88rem' }}>Delivery Details</h4>
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '4px 16px', fontSize: '0.85rem', color: '#5f4a47' }}>
            <dt style={{ fontWeight: '600' }}>Phone</dt><dd style={{ margin: 0 }}>{order.customerPhone}</dd>
            <dt style={{ fontWeight: '600' }}>Email</dt><dd style={{ margin: 0 }}>{order.customerEmail || '—'}</dd>
            <dt style={{ fontWeight: '600' }}>Address</dt><dd style={{ margin: 0 }}>{order.customerAddress}, {order.customerCity}</dd>
            <dt style={{ fontWeight: '600' }}>Payment</dt><dd style={{ margin: 0 }}>{order.paymentMethod}</dd>
            <dt style={{ fontWeight: '600' }}>Instructions</dt><dd style={{ margin: 0 }}>{order.customerInstructions || '—'}</dd>
          </dl>
        </div>
      )}
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    let active = true

    async function fetchOrders() {
      try {
        const response = await fetch(`/api/admin/orders${statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ''}`)
        if (!response.ok) throw new Error('Failed to load orders.')
        const data = await response.json()

        if (!active) return
        setOrders(data.orders)
        setLoadError('')
      } catch {
        if (!active) return
        setLoadError("We couldn't load the orders. Please try again.")
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchOrders()

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
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update status.')
      }

      setOrders((prev) =>
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
          <h1 style={{ color: '#3d2c2a', fontSize: '1.8rem', fontWeight: '600', margin: 0 }}>Orders</h1>
          <p style={{ color: '#b58d8a', margin: '2px 0 0' }}>{orders.length} shown</p>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#5f4a47' }}>
          Filter by status
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            style={selectStyle}
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p style={{ color: '#5f4a47' }}>Loading orders...</p>}

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

      {!loading && !loadError && orders.length === 0 && (
        <p style={{ color: '#5f4a47' }}>No orders found.</p>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {orders.map((order) => (
          <OrderCard
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
