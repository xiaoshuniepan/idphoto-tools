"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/change-bg", label: "换底色" },
  { href: "/crop", label: "尺寸裁剪" },
  { href: "/compress", label: "压缩KB" },
  { href: "/print-layout", label: "排版打印" },
  { href: "/beauty", label: "美颜" },
  { href: "/sign", label: "电子签名" },
  { href: "/blog", label: "使用教程" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open — restore previous value on cleanup
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/blog" ? pathname.startsWith("/blog") : pathname === href;

  return (
    <>
      <header
        style={{
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 3px rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--color-primary)",
              letterSpacing: "-0.3px",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 22 }}>🪪</span>
            证件照快手
          </Link>

          {/* Desktop nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
            className="desktop-nav"
          >
            {navLinks.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                style={{
                  padding: "6px 11px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive(t.href)
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
                  background: isActive(t.href)
                    ? "var(--color-primary-light)"
                    : "transparent",
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </Link>
            ))}
          </nav>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
            className="hamburger-btn"
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              width: 40,
              height: 40,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "var(--radius-md)",
              padding: 8,
            }}
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "var(--color-text)",
                borderRadius: 2,
                transition: "transform .2s, opacity .2s",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "var(--color-text)",
                borderRadius: 2,
                transition: "opacity .2s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "var(--color-text)",
                borderRadius: 2,
                transition: "transform .2s, opacity .2s",
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              background: "rgba(0,0,0,.4)",
            }}
          />
          {/* Drawer */}
          <nav
            style={{
              position: "fixed",
              top: 60,
              left: 0,
              right: 0,
              zIndex: 45,
              background: "var(--color-bg)",
              borderBottom: "1px solid var(--color-border)",
              padding: "12px 20px 20px",
              boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--color-text-muted)",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              工具
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 8,
              }}
            >
              {navLinks.filter((t) => t.href !== "/blog").map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  style={{
                    display: "block",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    fontSize: 14,
                    fontWeight: isActive(t.href) ? 700 : 500,
                    textDecoration: "none",
                    color: isActive(t.href)
                      ? "var(--color-primary)"
                      : "var(--color-text)",
                    background: isActive(t.href)
                      ? "var(--color-primary-light)"
                      : "var(--color-bg-subtle)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {t.label}
                </Link>
              ))}
            </div>
            <Link
              href="/blog"
              style={{
                display: "block",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                fontWeight: isActive("/blog") ? 700 : 500,
                textDecoration: "none",
                color: isActive("/blog") ? "var(--color-primary)" : "var(--color-text)",
                background: isActive("/blog")
                  ? "var(--color-primary-light)"
                  : "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
              }}
            >
              📖 使用教程
            </Link>
          </nav>
        </>
      )}

      <style>{`
        @media (max-width: 720px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
