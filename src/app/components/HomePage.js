'use client'

import Link from 'next/link'
import Navbar from './Navbar'
import Footer from './Footer'
import HomeFeatured from './HomeFeatured'

export default function HomePage({ featuredProducts = [] }) {
  return (
    <div>
      <Navbar />
      <main>
        <section
          style={{
            position: 'relative',
            minHeight: '70vh',
            height: 'auto',
            padding: '40px 0',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #fce4e6 0%, #fef9f7 100%)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 80% 20%, rgba(245, 198, 203, 0.35), transparent 50%), radial-gradient(circle at 20% 80%, rgba(212, 155, 159, 0.2), transparent 45%)',
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '1300px',
              margin: '0 auto',
              padding: '0 16px',
              width: '100%',
            }}
          >
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(245, 198, 203, 0.2)',
                  padding: '6px 16px',
                  borderRadius: '40px',
                  marginBottom: '15px',
                  fontSize: '0.8rem',
                  color: '#d49b9f',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Handcrafted with Love
              </div>
              <h1
                style={{
                  fontSize: '2.5rem',
                  lineHeight: '1.2',
                  color: '#3d2c2a',
                  marginBottom: '15px',
                  fontWeight: '600',
                }}
              >
                Premium
                <br />
                <span style={{ color: '#d49b9f' }}>Handmade</span> Jewelry
              </h1>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#5f4a47',
                  lineHeight: '1.8',
                  marginBottom: '25px',
                  maxWidth: '500px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Each piece is meticulously handcrafted with love and attention to detail.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Link
                  href="/necklace"
                  style={{
                    background: '#d49b9f',
                    color: 'white',
                    padding: '14px 30px',
                    borderRadius: '60px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    display: 'inline-block',
                    flex: '1 1 auto',
                    minWidth: '140px',
                    textAlign: 'center',
                  }}
                >
                  Explore Collection →
                </Link>
                <Link
                  href="/custom"
                  style={{
                    background: 'white',
                    color: '#3d2c2a',
                    padding: '14px 30px',
                    borderRadius: '60px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    border: '2px solid #f5c6cb',
                    display: 'inline-block',
                    flex: '1 1 auto',
                    minWidth: '140px',
                    textAlign: 'center',
                  }}
                >
                  Custom Order
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '60px 16px', maxWidth: '1300px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '50px',
              alignItems: 'center',
            }}
            className="story-grid"
          >
            <div>
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(212, 155, 159, 0.15)',
                  aspectRatio: '16/9',
                  background: 'linear-gradient(135deg, #fce4e6, #f5c6cb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a77a78',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                }}
              >
                Brand media placeholder
              </div>
            </div>

            <div>
              <h2
                style={{
                  fontSize: '2.5rem',
                  color: '#3d2c2a',
                  marginBottom: '15px',
                  fontWeight: '600',
                  lineHeight: '1.2',
                }}
              >
                The Art of <span style={{ color: '#d49b9f' }}>Handcrafted</span> Jewelry
              </h2>
              <div
                style={{
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(to right, #d49b9f, #f5c6cb)',
                  marginBottom: '20px',
                }}
              />
              <p style={{ fontSize: '1.05rem', color: '#5f4a47', lineHeight: '2', marginBottom: '20px' }}>
                Every piece of Pearlette jewelry is a labor of love. I personally hand-select each material,
                carefully craft every detail, and pour my heart into creating pieces that tell a story.
              </p>
              <p style={{ fontSize: '1.05rem', color: '#5f4a47', lineHeight: '2', marginBottom: '30px' }}>
                From the initial design sketch to the final polish, each piece is crafted with the same care
                and attention I would give to a gift for someone I love. That is the Pearlette promise.
              </p>
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '2rem', color: '#d49b9f', fontWeight: '600' }}>100%</div>
                  <div style={{ color: '#5f4a47', fontSize: '0.9rem' }}>Handcrafted</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', color: '#d49b9f', fontWeight: '600' }}>✨</div>
                  <div style={{ color: '#5f4a47', fontSize: '0.9rem' }}>Premium Quality</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', color: '#d49b9f', fontWeight: '600' }}>❤️</div>
                  <div style={{ color: '#5f4a47', fontSize: '0.9rem' }}>Made with Love</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HomeFeatured products={featuredProducts} />

        <section
          style={{
            padding: '40px 16px',
            background: 'linear-gradient(135deg, #fce4e6 0%, #fef9f7 100%)',
          }}
        >
          <div style={{ maxWidth: '1300px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: '#3d2c2a', marginBottom: '15px', fontWeight: '600' }}>
              Custom <span style={{ color: '#d49b9f' }}>Creations</span>
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: '#5f4a47',
                maxWidth: '600px',
                margin: '0 auto 25px',
                lineHeight: '1.8',
              }}
            >
              Have a unique vision? Share your inspiration and we will bring it to life. Custom pieces
              typically take 7–14 days with a 50% advance to begin crafting.
            </p>
            <Link
              href="/custom"
              style={{
                background: '#d49b9f',
                color: 'white',
                padding: '14px 40px',
                borderRadius: '60px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'inline-block',
              }}
            >
              Start Your Custom Order
            </Link>
          </div>
        </section>

        <Footer />
      </main>

      <style jsx>{`
        .story-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 50px !important;
        }

        @media (max-width: 768px) {
          .story-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  )
}
