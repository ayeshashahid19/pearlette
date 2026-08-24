import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getCategories } from '../../lib/categories-db.js'

export const metadata = {
  title: 'Collections | Pearlette.pk',
  description:
    'Browse all Pearlette.pk collections — handcrafted necklaces, bracelets, earrings, rings, arm cuffs and charms. Cash on delivery nationwide.',
}

export const dynamic = 'force-dynamic'

export default async function CollectionsPage() {
  const categories = await getCategories()

  return (
    <div>
      <Navbar />
      <main
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '40px 16px 64px',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#3d2c2a', fontWeight: '600', margin: 0 }}>
            Our <span style={{ color: '#d49b9f' }}>Collections</span>
          </h1>
          <p style={{ color: '#5f4a47', fontSize: '0.95rem', marginTop: '10px' }}>
            Handcrafted pieces, sorted by what you love
          </p>
          <div
            style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(to right, #d49b9f, #f5c6cb)',
              margin: '16px auto 0',
            }}
          />
        </header>

        <section className="collections-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="collection-card"
              style={{
                display: 'block',
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                border: '1px solid #fce4e6',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <div
                style={{
                  aspectRatio: '4 / 3',
                  background: 'linear-gradient(135deg, #fce4e6, #fef9f7)',
                  overflow: 'hidden',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.imgUrl}
                  alt={`${category.name} collection`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <div
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <span
                  className="collection-card-name"
                  style={{
                    color: '#3d2c2a',
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {category.name}
                </span>
                <span
                  className="collection-card-cta"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#d49b9f',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    transition: 'color 0.2s ease',
                  }}
                >
                  See all
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <style>{`
          .collections-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 22px;
          }
          .collection-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 18px 40px rgba(212, 155, 159, 0.22) !important;
          }
          .collection-card:hover .collection-card-name,
          .collection-card:hover .collection-card-cta {
            color: #a34d54 !important;
          }

          @media (max-width: 900px) {
            .collections-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }
          }

          @media (max-width: 520px) {
            .collections-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
            .collection-card-name {
              font-size: 0.9rem !important;
            }
            .collection-card-cta {
              font-size: 0.75rem !important;
            }
          }
        `}</style>
      </main>
      <Footer />
    </div>
  )
}
