"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tools = [
  { href: "/change-bg", label: "换底色" },
  { href: "/crop", label: "尺寸裁剪" },
  { href: "/compress", label: "压缩KB" },
  { href: "/print-layout", label: "排版打印" },
  { href: "/beauty", label: "美颜" },
];

export default function Header() {
  const pathname = usePathname();

  return (
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
          }}
        >
          <span style={{ fontSize: 22 }}>🪪</span>
          证件照快手
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                color:
                  pathname === t.href
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
                background:
                  pathname === t.href ? "var(--color-primary-light)" : "transparent",
                transition: "all .15s",
              }}
            >
              {t.label}
            </Link>
          ))}
          <Link
            href="/blog"
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              color:
                pathname.startsWith("/blog")
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              background: pathname.startsWith("/blog")
                ? "var(--color-primary-light)"
                : "transparent",
            }}
          >
            使用教程
          </Link>
        </nav>
      </div>
    </header>
  );
}
