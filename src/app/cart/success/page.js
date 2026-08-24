'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('No order ID provided.')
      setLoading(false)
      return
    }

    async function loadOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}/confirmation`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Could not load order confirmation.')
        }

        setOrder(data.order)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 16px 64px' }}>
        {loading ? (
          <p style={{ color: '#5f4a47', textAlign: 'center' }}>Loading confirmation...</p>
        ) : error ? (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#3d2c2a', marginBottom: '12px' }}>Confirmation unavailable</h1>
            <p style={{ color: '#5f4a47', marginBottom: '24px' }}>{error}</p>
            <Link href="/" className="btn-solid-pink" style={primaryLinkStyle}>
              Back to shop
            </Link>
          </div>
        ) : (
          <div
            style={{
              background: 'white',
              borderRadius: '28px',
              padding: '32px 24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '12px' }} aria-hidden="true">
              <Heart size={48} strokeWidth={1.5} color="#d49b9f" fill="#f5c6cb" />
            </div>
            <h1 style={{ fontSize: '2rem', color: '#3d2c2a', marginBottom: '8px' }}>
              Order Confirmed
            </h1>
            <p style={{ color: '#5f4a47', lineHeight: '1.8', marginBottom: '24px' }}>
              Thank you, {order.customerName}. Your order has been received and is being prepared.
            </p>

            <div
              style={{
                background: '#fef9f7',
                borderRadius: '20px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px',
              }}
            >
              <dl style={{ margin: 0, color: '#5f4a47', lineHeight: '2' }}>
                <div>
                  <dt style={{ fontWeight: '600', display: 'inline' }}>Order ID: </dt>
                  <dd style={{ display: 'inline', wordBreak: 'break-all' }}>{order.id}</dd>
                </div>
                <div>
                  <dt style={{ fontWeight: '600', display: 'inline' }}>Total: </dt>
                  <dd style={{ display: 'inline' }}>Rs. {order.total.toLocaleString()}</dd>
                </div>
                <div>
                  <dt style={{ fontWeight: '600', display: 'inline' }}>Delivery city: </dt>
                  <dd style={{ display: 'inline' }}>{order.customerCity}</dd>
                </div>
                <div>
                  <dt style={{ fontWeight: '600', display: 'inline' }}>Payment: </dt>
                  <dd style={{ display: 'inline' }}>{order.paymentMethod}</dd>
                </div>
                <div>
                  <dt style={{ fontWeight: '600', display: 'inline' }}>Status: </dt>
                  <dd style={{ display: 'inline', textTransform: 'capitalize' }}>{order.status}</dd>
                </div>
              </dl>
            </div>

            {order.items?.length > 0 && (
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', color: '#3d2c2a', marginBottom: '12px' }}>
                  Items ordered
                </h2>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '10px 0',
                      borderBottom: '1px solid #fce4e6',
                      color: '#5f4a47',
                      fontSize: '0.95rem',
                    }}
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <p style={{ color: '#5f4a47', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '24px' }}>
              Standard orders are typically fulfilled within 3–5 business days. If we need to confirm
              anything, we will contact you using the phone number provided at checkout.
            </p>

            <Link href="/" className="btn-solid-pink" style={primaryLinkStyle}>
              Continue Shopping
            </Link>
          </div>
        )}
      </main>
      <Footer />
      <style jsx global>{`
        .btn-solid-pink:hover {
          background: #a34d54 !important;
          color: white !important;
        }
      `}</style>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div>
          <Navbar />
          <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 16px', color: '#5f4a47' }}>
            Loading confirmation...
          </main>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  )
}

const primaryLinkStyle = {
  display: 'inline-block',
  background: '#d49b9f',
  color: 'white',
  padding: '12px 28px',
  borderRadius: '60px',
  textDecoration: 'none',
  fontWeight: '600',
}
