"use client";
import Link from "next/link";
import { Camera } from "lucide-react";

const quickLinks = [
  { href: "/necklace", label: "Necklaces" },
  { href: "/bracelets", label: "Bracelets" },
  { href: "/earrings", label: "Earrings" },
  { href: "/rings", label: "Rings" },
  { href: "/armcuffs", label: "Arm Cuffs" },
  { href: "/charms", label: "Charms" },
  { href: "/custom", label: "Custom Orders" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/shipping-policy", label: "Shipping Policy" },
];

const linkStyle = {
  color: "#5f4a47",
  textDecoration: "none",
  fontSize: "0.75rem",
  transition: "color 0.2s ease",
};

const headingStyle = {
  color: "#3d2c2a",
  margin: 0,
  marginBottom: "8px",
  fontSize: "0.85rem",
  fontWeight: "600",
};

const Footer = () => {
  return (
    <footer
      className="site-footer"
      style={{
        background: "white",
        padding: "18px 16px",
        borderTop: "1px solid #fce4e6",
        marginTop: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 1.5fr 1fr 0.9fr",
          gap: "20px",
        }}
        className="footer-grid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "6px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt=""
              width="26"
              height="26"
              style={{
                width: "26px",
                height: "26px",
                objectFit: "contain",
                borderRadius: "50%",
              }}
            />
            <h3 style={headingStyle}>Pearlette.pk</h3>
          </div>
          <p
            style={{
              color: "#5f4a47",
              lineHeight: "1.5",
              fontSize: "0.75rem",
              margin: 0,
            }}
          >
            Handcrafted jewelry made with love.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={headingStyle}>Quick Links</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3px 12px",
            }}
          >
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="footer-link"
                style={linkStyle}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 style={headingStyle}>Contact</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              fontSize: "0.75rem",
            }}
          >
            <a
              href="mailto:hello@pearlette.pk"
              className="footer-link"
              style={linkStyle}
            >
              pearlette.pk@gmail.com
            </a>
            <a
              href="tel:+923001234567"
              className="footer-link"
              style={linkStyle}
            >
              +92 334 2024462
            </a>
            <span style={{ color: "#5f4a47", fontSize: "0.75rem" }}>
              Multan, Pakistan
            </span>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 style={headingStyle}>Follow Us</h3>
          <a
            href="https://www.instagram.com/pearlette.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
            style={{
              color: "#5f4a47",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "40px",
              border: "1px solid #f0dbd9",
              transition: "color 0.2s ease, border-color 0.2s ease",
              fontWeight: "500",
              fontSize: "0.75rem",
            }}
          >
            <Camera size={13} aria-hidden="true" />
            Instagram
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "14px auto 0",
          paddingTop: "10px",
          borderTop: "1px solid #fce4e6",
          textAlign: "center",
          color: "#b58d8a",
          fontSize: "0.68rem",
        }}
      >
        © 2026 Pearlette.pk — Made with love in Pakistan
      </div>

      <style jsx global>{`
        .footer-link:hover {
          color: #a34d54 !important;
        }
        .instagram-link:hover {
          color: #a34d54 !important;
          border-color: #a34d54 !important;
        }
        /* Tablet: 2 columns */
        @media (max-width: 900px) {
          .site-footer {
            padding: 16px 14px !important;
            margin-top: 18px !important;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
        }

        /* Mobile: keep 2 columns, tighter */
        @media (max-width: 480px) {
          .site-footer {
            padding: 14px 12px !important;
            margin-top: 14px !important;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .footer-grid h3 {
            font-size: 0.78rem !important;
            margin-bottom: 5px !important;
          }
          .footer-grid p,
          .footer-grid a,
          .footer-grid span {
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
