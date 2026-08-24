'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.')
      }

      router.replace('/admin')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fef9f7 0%, #fce4e6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '28px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        border: '1px solid #fce4e6',
        padding: '40px 28px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Pearlette.pk logo"
            width="64"
            height="64"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fce4e6, #f5c6cb)',
              boxShadow: '0 0 0 2px #f5c6cb',
              marginBottom: '12px',
            }}
          />
          <div style={{
            width: '60px',
            height: '3px',
            background: 'linear-gradient(to right, #d49b9f, #f5c6cb)',
            margin: '0 auto 16px',
            borderRadius: '2px',
          }} />
          <h1 style={{
            fontSize: '1.8rem',
            color: '#3d2c2a',
            fontWeight: '600',
            marginBottom: '6px',
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #d49b9f, #f5c6cb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Pearlette.pk
            </span>
          </h1>
          <p style={{ color: '#b58d8a', fontSize: '0.9rem' }}>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              role="alert"
              style={{
                background: '#fff0f0',
                border: '1px solid #ffb3b3',
                color: '#8a2f2f',
                padding: '12px 14px',
                borderRadius: '12px',
                marginBottom: '14px',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label htmlFor="admin-email" style={{
              display: 'block',
              color: '#3d2c2a',
              fontWeight: '500',
              marginBottom: '4px',
              fontSize: '0.85rem',
            }}>Email</label>
            <input
              id="admin-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #f0dbd9',
                fontFamily: 'inherit',
                fontSize: '1rem',
                background: '#fef9f7',
                transition: '0.3s',
              }}
              placeholder="admin@pearlette.pk"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="admin-password" style={{
              display: 'block',
              color: '#3d2c2a',
              fontWeight: '500',
              marginBottom: '4px',
              fontSize: '0.85rem',
            }}>Password</label>
            <input
              id="admin-password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #f0dbd9',
                fontFamily: 'inherit',
                fontSize: '1rem',
                background: '#fef9f7',
                transition: '0.3s',
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '60px',
              border: 'none',
              background: submitting ? '#d9b3b6' : 'linear-gradient(135deg, #d49b9f, #c4848a)',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: '0.3s',
              boxShadow: '0 4px 15px rgba(212, 155, 159, 0.3)',
            }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
