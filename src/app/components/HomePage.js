'use client'

import Link from 'next/link'
import { Gem, Heart } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import HomeFeatured from './HomeFeatured'

export default function HomePage({ featuredProducts = [], brandVideoUrl = null, brandVideoPoster = null }) {
  const statValueStyle = {
    fontSize: '2rem',
    color: '#d49b9f',
    fontWeight: '600',
    lineHeight: 1,
    height: '2.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: '6px',
  }
  const statLabelStyle = {
    color: '#5f4a47',
    fontSize: '0.9rem',
  }

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
          {/* Hero photo backdrop */}
          <div
            aria-hidden="true"
            className="hero-bg"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/images/hero.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
              zIndex: 0,
            }}
          />

          {/* Soft veil keeps text readable over any photo */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(180deg, rgba(254,249,247,0.72) 0%, rgba(254,249,247,0.5) 50%, rgba(254,249,247,0.68) 100%)',
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
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
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '6px 16px',
                  borderRadius: '40px',
                  marginBottom: '15px',
                  fontSize: '0.8rem',
                  color: '#d49b9f',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                }}
                className="hero-badge"
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
                Pretty
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
                  href="/collections"
                  className="btn-solid-pink"
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
                    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  Explore Collection →
                </Link>
                <Link
                  href="/custom"
                  className="btn-outline-pink"
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
                    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
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
                  aspectRatio: '4/3',
                  background: 'linear-gradient(135deg, #fce4e6, #f5c6cb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a77a78',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                }}
              >
                {brandVideoUrl ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={brandVideoUrl}
                    poster={brandVideoPoster || undefined}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      background: '#3d2c2a',
                    }}
                  >
                    Your browser does not support video playback.
                  </video>
                ) : (
                  'Brand media placeholder'
                )}
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
                Pearlette is where your Pinterest inspos turn into reality.
                <br />
                A place for the pieces you saved, the styles you couldn’t stop thinking about and the
                jewelry you wished you could actually wear.
              </p>
              <p style={{ fontSize: '1.05rem', color: '#5f4a47', lineHeight: '2', marginBottom: '20px' }}>
                We take inspiration from the internet’s prettiest corners and turn it into wearable
                little things you’ll want to keep forever.
              </p>
              <p style={{ fontSize: '1.05rem', color: '#5f4a47', lineHeight: '2', marginBottom: '30px' }}>
                Because sometimes, your dream jewelry is just one idea away from becoming real.
              </p>
              <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div>
                  <div style={statValueStyle}>100%</div>
                  <div style={statLabelStyle}>Handcrafted</div>
                </div>
                <div>
                  <div style={{ ...statValueStyle }}>
                    <Gem size={26} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div style={statLabelStyle}>Premium Quality</div>
                </div>
                <div>
                  <div style={{ ...statValueStyle }}>
                    <Heart size={26} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div style={statLabelStyle}>Made with Love</div>
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
              typically take 3-5 days with a 50% advance to begin crafting.
            </p>
            <Link
              href="/custom"
              className="btn-solid-pink"
              style={{
                background: '#d49b9f',
                color: 'white',
                padding: '14px 40px',
                borderRadius: '60px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'inline-block',
                transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
              }}
            >
              Start Your Custom Order
            </Link>
          </div>
        </section>

        <Footer />
      </main>

      <style jsx global>{`
        .btn-solid-pink:hover {
          background: #a34d54 !important;
          color: white !important;
        }
        .btn-outline-pink:hover {
          border-color: #a34d54 !important;
          color: #a34d54 !important;
        }
        .story-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 50px !important;
        }

        @media (max-width: 768px) {
          .story-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .hero-bg {
            background-image: url(/images/hero-mobile.png) !important;
            background-size: cover !important;
            background-position: top center !important;
          }
        }
      `}</style>
    </div>
  )
}
