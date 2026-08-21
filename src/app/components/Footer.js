'use client'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer style={{
      background: 'white',
      padding: '25px 16px',
      borderTop: '1px solid #fce4e6',
      marginTop: '30px',
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
      }} className="footer-grid">
        {/* Brand */}
        <div>
          <h3 style={{ 
            color: '#3d2c2a', 
            marginBottom: '8px',
            fontSize: '1rem',
            fontWeight: '600',
          }}>
            Pearlette.pk
          </h3>
          <p style={{ 
            color: '#5f4a47', 
            lineHeight: '1.6',
            fontSize: '0.85rem',
          }}>
            Handcrafted jewelry made with love.
          </p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 style={{ 
            color: '#3d2c2a', 
            marginBottom: '8px',
            fontSize: '1rem',
            fontWeight: '600',
          }}>
            Quick Links
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 12px',
          }}>
            <Link href="/necklace" style={{ color: '#5f4a47', textDecoration: 'none', fontSize: '0.8rem' }}>Necklaces</Link>
            <Link href="/bracelets" style={{ color: '#5f4a47', textDecoration: 'none', fontSize: '0.8rem' }}>Bracelets</Link>
            <Link href="/earrings" style={{ color: '#5f4a47', textDecoration: 'none', fontSize: '0.8rem' }}>Earrings</Link>
            <Link href="/rings" style={{ color: '#5f4a47', textDecoration: 'none', fontSize: '0.8rem' }}>Rings</Link>
            <Link href="/armcuffs" style={{ color: '#5f4a47', textDecoration: 'none', fontSize: '0.8rem' }}>Arm Cuffs</Link>
            <Link href="/charms" style={{ color: '#5f4a47', textDecoration: 'none', fontSize: '0.8rem' }}>Charms</Link>
            <Link href="/custom" style={{ color: '#5f4a47', textDecoration: 'none', fontSize: '0.8rem' }}>Custom Orders</Link>
          </div>
        </div>
        
        {/* Contact */}
        <div>
          <h3 style={{ 
            color: '#3d2c2a', 
            marginBottom: '8px',
            fontSize: '1rem',
            fontWeight: '600',
          }}>
            Contact
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#5f4a47', fontSize: '0.85rem' }}>
            <a href="mailto:hello@pearlette.pk" style={{ color: '#5f4a47', textDecoration: 'none' }}>
              hello@pearlette.pk
            </a>
            <a href="tel:+923001234567" style={{ color: '#5f4a47', textDecoration: 'none' }}>
              +92 300 123 4567
            </a>
            <span>Lahore, Pakistan</span>
          </div>
        </div>
        
        {/* Social Media & Delivery */}
        <div>
          <h3 style={{ 
            color: '#3d2c2a', 
            marginBottom: '8px',
            fontSize: '1rem',
            fontWeight: '600',
          }}>
            Follow Us
          </h3>
          
          <a 
            href="https://www.instagram.com/pearlette.pk" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#5f4a47', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '40px',
              background: 'linear-gradient(135deg, #fce4e6, #f5c6cb)',
              transition: '0.3s',
              marginBottom: '12px',
              fontWeight: '500',
              fontSize: '0.85rem',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '1rem' }}>📸</span>
            Instagram
          </a>
          
          <div>
            <div style={{ 
              background: 'linear-gradient(135deg, #fce4e6, #f5c6cb)', 
              padding: '8px 14px', 
              borderRadius: '40px',
              display: 'inline-block',
              fontWeight: '500',
              color: '#3d2c2a',
              marginBottom: '6px',
              fontSize: '0.8rem',
              width: '100%',
              textAlign: 'center',
            }}>
              Cash on Delivery
            </div>
            <p style={{ color: '#5f4a47', fontSize: '0.75rem', textAlign: 'center' }}>
              Free shipping on all orders
            </p>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div style={{
        maxWidth: '1300px',
        margin: '20px auto 0',
        paddingTop: '12px',
        borderTop: '1px solid #fce4e6',
        textAlign: 'center',
        color: '#b58d8a',
        fontSize: '0.75rem',
      }}>
        © 2026 Pearlette.pk — Made with love in Pakistan
      </div>

      <style jsx>{`
        /* Tablet: 2 columns */
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
          }
          footer {
            padding: 20px 14px !important;
            margin-top: 20px !important;
          }
          .footer-grid h3 {
            font-size: 0.9rem !important;
          }
          .footer-grid p, 
          .footer-grid a, 
          .footer-grid span {
            font-size: 0.8rem !important;
          }
          .footer-grid div div {
            gap: 3px !important;
          }
        }

        /* Mobile: 1 column */
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          footer {
            padding: 16px 12px !important;
            margin-top: 15px !important;
          }
          .footer-grid h3 {
            font-size: 0.85rem !important;
            margin-bottom: 6px !important;
          }
          .footer-grid p, 
          .footer-grid a, 
          .footer-grid span {
            font-size: 0.75rem !important;
          }
          .footer-grid div div {
            grid-template-columns: 1fr 1fr !important;
            gap: 2px 10px !important;
          }
          .footer-grid div div a {
            font-size: 0.75rem !important;
            padding: 4px 0 !important;
          }
          .footer-grid div:last-child a {
            padding: 6px 12px !important;
            font-size: 0.75rem !important;
          }
          .footer-grid div:last-child div div {
            padding: 6px 12px !important;
            font-size: 0.75rem !important;
          }
          .footer-grid div:last-child p {
            font-size: 0.7rem !important;
          }
          .copyright {
            font-size: 0.65rem !important;
            margin-top: 15px !important;
            padding-top: 10px !important;
          }
        }

        /* Small phones */
        @media (max-width: 360px) {
          .footer-grid div div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer