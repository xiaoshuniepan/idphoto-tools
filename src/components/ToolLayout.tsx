interface ToolLayoutProps {
  title: string;
  desc: string;
  children: React.ReactNode;
  seoText?: React.ReactNode;
}

export default function ToolLayout({
  title,
  desc,
  children,
  seoText,
}: ToolLayoutProps) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      {/* Page header */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800,
            color: "var(--color-text)",
            marginBottom: 8,
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--color-text-muted)",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {desc}
        </p>
      </div>

      {/* Tool content */}
      {children}

      {/* SEO text section */}
      {seoText && (
        <div
          style={{
            marginTop: 56,
            padding: "28px 32px",
            background: "var(--color-bg-subtle)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
          }}
        >
          {seoText}
        </div>
      )}
    </div>
  );
}
