import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-bg-subtle)",
        borderTop: "1px solid var(--color-border)",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "var(--color-primary)",
                marginBottom: 8,
              }}
            >
              🪪 证件照快手
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              免费在线证件照工具，全部处理在浏览器端完成，
              不上传服务器，安全保护您的隐私。
            </p>
          </div>

          {/* Tools */}
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                color: "var(--color-text)",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              工具
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/change-bg", label: "证件照换底色" },
                { href: "/crop", label: "证件照裁剪尺寸" },
                { href: "/compress", label: "证件照压缩" },
              ].map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-muted)",
                    textDecoration: "none",
                  }}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                color: "var(--color-text)",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              其他
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/blog", label: "使用教程" },
                { href: "/privacy", label: "隐私政策" },
              ].map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-muted)",
                    textDecoration: "none",
                  }}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} 证件照快手 · pickerme.cn
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              margin: 0,
            }}
          >
            所有图片处理均在您的浏览器本地完成，不会上传至任何服务器
          </p>
        </div>
      </div>
    </footer>
  );
}
