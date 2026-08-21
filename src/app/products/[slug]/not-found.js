import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function ProductNotFound() {
  return (
    <div>
      <Navbar />
      <main
        style={{
          maxWidth: '600px',
          margin: '80px auto',
          padding: '0 16px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '2rem', color: '#3d2c2a', marginBottom: '12px' }}>Product not found</h1>
        <p style={{ color: '#5f4a47', marginBottom: '24px' }}>
          This piece may have been removed or is no longer available.
        </p>
        <Link
          href="/"
          style={{
            background: '#d49b9f',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '60px',
            textDecoration: 'none',
            fontWeight: '600',
          }}
        >
          Back to shop
        </Link>
      </main>
      <Footer />
    </div>
  )
}
