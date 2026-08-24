import Link from 'next/link'
import { prisma } from '../../../lib/prisma.js'

export const dynamic = 'force-dynamic'

const CARD_STYLES = {
  background: 'white',
  padding: '22px',
  borderRadius: '20px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
  border: '1px solid #fce4e6',
  textAlign: 'center',
}

function StatCard({ label, value, accent }) {
  return (
    <div style={CARD_STYLES}>
      <p style={{
        margin: 0,
        fontSize: '2rem',
        fontWeight: '700',
        color: accent || '#d49b9f',
      }}>
        {value}
      </p>
      <p style={{ margin: '4px 0 0', color: '#5f4a47', fontSize: '0.9rem' }}>{label}</p>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    activeProducts,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    pendingCustomOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.count({ where: { status: 'confirmed' } }),
    prisma.customOrder.count({ where: { status: 'pending' } }),
  ])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#3d2c2a', fontSize: '1.8rem', fontWeight: '600', marginBottom: '4px' }}>
        Dashboard
      </h1>
      <p style={{ color: '#b58d8a', marginBottom: '24px' }}>Overview of your store</p>

      <section
        aria-label="Store statistics"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatCard label="Total Products" value={totalProducts} />
        <StatCard label="Active Products" value={activeProducts} />
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Pending Orders" value={pendingOrders} accent="#c4848a" />
        <StatCard label="Confirmed Orders" value={confirmedOrders} />
        <StatCard label="Pending Custom Requests" value={pendingCustomOrders} accent="#c4848a" />
      </section>

      <section aria-label="Quick actions" style={CARD_STYLES}>
        <h2 style={{ color: '#3d2c2a', fontSize: '1.1rem', fontWeight: '600', marginTop: 0 }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/admin/products" style={{
            padding: '10px 22px',
            borderRadius: '40px',
            background: 'linear-gradient(135deg, #d49b9f, #c4848a)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
          }}>
            Manage Products
          </Link>
          <Link href="/admin/orders" style={{
            padding: '10px 22px',
            borderRadius: '40px',
            border: '1px solid #d49b9f',
            color: '#d49b9f',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
          }}>
            View Orders
          </Link>
          <Link href="/admin/custom-orders" style={{
            padding: '10px 22px',
            borderRadius: '40px',
            border: '1px solid #d49b9f',
            color: '#d49b9f',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
          }}>
            Review Custom Requests
          </Link>
        </div>
      </section>
    </div>
  )
}
