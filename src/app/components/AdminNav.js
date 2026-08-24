'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/custom-orders', label: 'Custom Requests' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.replace('/admin/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #fce4e6',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            href="/admin"
            style={{
              fontWeight: '700',
              fontSize: '1.05rem',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #d49b9f, #f5c6cb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Pearlette Admin
          </Link>
          <nav aria-label="Admin navigation" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {NAV_LINKS.map((link) => {
              const active = link.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '40px',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    color: active ? 'white' : '#5f4a47',
                    background: active ? 'linear-gradient(135deg, #d49b9f, #c4848a)' : 'transparent',
                    fontWeight: active ? '600' : '400',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            padding: '7px 18px',
            borderRadius: '40px',
            border: '1px solid #d49b9f',
            background: 'white',
            color: '#d49b9f',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: loggingOut ? 'not-allowed' : 'pointer',
          }}
        >
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </header>
  )
}
