"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles, Heart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { getItemCount, isHydrated } = useCart();
  const cartCount = isHydrated ? getItemCount() : 0;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="nav-spacer" aria-hidden="true" />
      <nav
        style={{
          background: "white",
          padding: "10px 0",
          boxShadow: "0 2px 20px rgba(245, 198, 203, 0.15)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          width: "100%",
        }}
      >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          position: "relative",
        }}
      >
        {/* Logo - Smaller on mobile */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Pearlette.pk logo"
            className="nav-logo"
            style={{
              width: "36px",
              height: "36px",
              objectFit: "contain",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fce4e6, #f5c6cb)",
              boxShadow: "0 0 0 2px #f5c6cb",
            }}
          />
          <div
            className="nav-wordmark"
            style={{
              fontWeight: "600",
              fontSize: "1.2rem",
              letterSpacing: "-0.5px",
              color: "#3d2c2a",
            }}
          >
            pearlette
            <span style={{ color: "#d49b9f", fontWeight: "300" }}>.pk</span>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontWeight: "500",
            flexWrap: "wrap",
          }}
          className="desktop-nav"
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.85rem",
              transition: "0.2s",
              borderBottom: "2px solid transparent",
              paddingBottom: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              lineHeight: "1",
            }}
          >
            <Heart
              size={14}
              color="#d49b9f"
              style={{ display: "inline-block" }}
            />
            <span style={{ display: "inline-block", lineHeight: "1" }}>
              Home
            </span>
          </Link>
          <Link
            href="/necklace"
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.85rem",
              transition: "0.2s",
              borderBottom: "2px solid transparent",
              paddingBottom: "4px",
              display: "inline-flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <span style={{ display: "inline-block", lineHeight: "1" }}>
              Necklace
            </span>
          </Link>
          <Link
            href="/bracelets"
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.85rem",
              transition: "0.2s",
              borderBottom: "2px solid transparent",
              paddingBottom: "4px",
              display: "inline-flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <span style={{ display: "inline-block", lineHeight: "1" }}>
              Bracelets
            </span>
          </Link>
          <Link
            href="/earrings"
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.85rem",
              transition: "0.2s",
              borderBottom: "2px solid transparent",
              paddingBottom: "4px",
              display: "inline-flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <span style={{ display: "inline-block", lineHeight: "1" }}>
              Earrings
            </span>
          </Link>
          <Link
            href="/rings"
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.85rem",
              transition: "0.2s",
              borderBottom: "2px solid transparent",
              paddingBottom: "4px",
              display: "inline-flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <span style={{ display: "inline-block", lineHeight: "1" }}>
              Rings
            </span>
          </Link>
          <Link
            href="/armcuffs"
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.85rem",
              transition: "0.2s",
              borderBottom: "2px solid transparent",
              paddingBottom: "4px",
              display: "inline-flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <span style={{ display: "inline-block", lineHeight: "1" }}>
              Arm Cuffs
            </span>
          </Link>
          <Link
            href="/charms"
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.85rem",
              transition: "0.2s",
              borderBottom: "2px solid transparent",
              paddingBottom: "4px",
              display: "inline-flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <span style={{ display: "inline-block", lineHeight: "1" }}>
              Charms
            </span>
          </Link>
          <Link
            href="/custom"
            style={{
              textDecoration: "none",
              color: "#d49b9f",
              fontSize: "0.85rem",
              fontWeight: "600",
              background: "linear-gradient(135deg, #fce4e6, #f5c6cb)",
              padding: "6px 14px",
              borderRadius: "40px",
              transition: "0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              lineHeight: "1",
            }}
            className="nav-pill nav-pill-custom"
          >
            <Sparkles size={14} style={{ display: "inline-block" }} />
            <span style={{ display: "inline-block", lineHeight: "1" }}>
              Custom
            </span>
          </Link>
        </div>

        {/* Cart & Mobile Menu */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <Link
            href="/cart"
            style={{
              fontSize: "1rem",
              background: "linear-gradient(135deg, #fce4e6, #f5c6cb)",
              padding: "6px 10px",
              borderRadius: "40px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              textDecoration: "none",
              color: "#3d2c2a",
              lineHeight: "1",
            }}
            className="nav-pill nav-pill-cart"
          >
            <ShoppingBag size={16} style={{ display: "inline-block" }} />
            <span
              style={{
                fontSize: "0.8rem",
                display: "inline-block",
                lineHeight: "1",
              }}
            >
              {cartCount}
            </span>
          </Link>

          {/* Mobile Menu Toggle - Always visible on mobile */}
          <button
            onClick={toggleMenu}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              color: "#3d2c2a",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Shows when open */}
      {isMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            padding: "12px 16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            borderTop: "1px solid #fce4e6",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            zIndex: 99,
          }}
          className="mobile-menu"
        >
          <Link
            href="/"
            onClick={closeMenu}
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.95rem",
              padding: "10px 0",
              borderBottom: "1px solid #fce4e6",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Heart size={16} color="#d49b9f" /> Home
          </Link>
          <Link
            href="/necklace"
            onClick={closeMenu}
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.95rem",
              padding: "10px 0",
              borderBottom: "1px solid #fce4e6",
            }}
          >
            Necklace
          </Link>
          <Link
            href="/bracelets"
            onClick={closeMenu}
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.95rem",
              padding: "10px 0",
              borderBottom: "1px solid #fce4e6",
            }}
          >
            Bracelets
          </Link>
          <Link
            href="/earrings"
            onClick={closeMenu}
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.95rem",
              padding: "10px 0",
              borderBottom: "1px solid #fce4e6",
            }}
          >
            Earrings
          </Link>
          <Link
            href="/rings"
            onClick={closeMenu}
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.95rem",
              padding: "10px 0",
              borderBottom: "1px solid #fce4e6",
            }}
          >
            Rings
          </Link>
          <Link
            href="/armcuffs"
            onClick={closeMenu}
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.95rem",
              padding: "10px 0",
              borderBottom: "1px solid #fce4e6",
            }}
          >
            Arm Cuffs
          </Link>
          <Link
            href="/charms"
            onClick={closeMenu}
            style={{
              textDecoration: "none",
              color: "#3d2c2a",
              fontSize: "0.95rem",
              padding: "10px 0",
              borderBottom: "1px solid #fce4e6",
            }}
          >
            Charms
          </Link>
          <Link
            href="/custom"
            onClick={closeMenu}
            style={{
              textDecoration: "none",
              color: "#d49b9f",
              fontSize: "0.95rem",
              fontWeight: "600",
              padding: "10px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={16} /> Custom Orders
          </Link>
        </div>
      )}

      <style jsx global>{`
        /* Spacer reserves the navbar's height in the page flow (nav itself is fixed) */
        .nav-spacer {
          height: 57px;
        }
        @media (max-width: 768px) {
          .nav-spacer {
            height: 51px;
          }
        }
        @media (max-width: 480px) {
          .nav-spacer {
            height: 41px;
          }
        }

        /* Dark pink hover states */
        .nav-pill-custom:hover,
        .nav-pill-cart:hover {
          background: #a34d54 !important;
          color: white !important;
        }
        .nav-pill-custom:hover svg,
        .nav-pill-cart:hover svg {
          color: white !important;
        }
        .desktop-nav > a:not(.nav-pill):hover {
          color: #a34d54 !important;
        }
        .mobile-menu > a:hover {
          color: #a34d54 !important;
        }
        .mobile-menu-btn:hover {
          color: #a34d54 !important;
        }

        /* Desktop: Show all links */
        @media (min-width: 1025px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-menu {
            display: none !important;
          }
        }

        /* Tablet: Show all links, slightly smaller */
        @media (max-width: 1024px) and (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
            gap: 10px !important;
          }
          .desktop-nav a {
            font-size: 0.75rem !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-menu {
            display: none !important;
          }
        }

        /* Mobile: Hide desktop nav, show hamburger */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .mobile-menu {
            display: flex !important;
          }

          /* Make logo smaller on mobile */
          .nav-logo {
            width: 30px !important;
            height: 30px !important;
          }
          .nav-wordmark {
            font-size: 1rem !important;
          }
        }

        /* Small phones - even smaller */
        @media (max-width: 480px) {
          nav {
            padding: 6px 0 !important;
          }
          .nav-logo {
            width: 28px !important;
            height: 28px !important;
          }
          .nav-wordmark {
            font-size: 0.85rem !important;
          }
          .mobile-menu-btn {
            padding: 4px !important;
          }
          .mobile-menu-btn svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
      `}      </style>
    </nav>
    </>
  );
}
