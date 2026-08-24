import Link from 'next/link'

export default function PolicyPage({ title, updated = '—', children }) {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 16px' }}>
      <h1 style={{ color: '#3d2c2a', fontWeight: '300', fontSize: '2rem', marginBottom: '4px' }}>
        {title}
      </h1>
      <p style={{ color: '#b58d8a', fontSize: '0.85rem', marginBottom: '24px' }}>
        Last updated: {updated}
      </p>

      <div style={{ color: '#5f4a47', lineHeight: 1.9, fontSize: '0.95rem' }}>{children}</div>

      <p style={{ marginTop: '32px' }}>
        <Link href="/" style={{ color: '#d49b9f', textDecoration: 'none', fontWeight: '600' }}>
          ← Back to Home
        </Link>
      </p>
    </div>
  )
}

export function policySection(title, paragraphs) {
  return (
    <section style={{ marginBottom: '24px' }}>
      <h2 style={{ color: '#3d2c2a', fontSize: '1.15rem', fontWeight: '600', marginBottom: '8px' }}>
        {title}
      </h2>
      {paragraphs.map((text, index) => (
        <p key={index} style={{ margin: '0 0 10px' }}>{text}</p>
      ))}
    </section>
  )
}
