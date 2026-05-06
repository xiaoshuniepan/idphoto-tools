import type { FaqItem } from "@/lib/jsonLd";

/**
 * Visible FAQ accordion + paired with FAQPage JSON-LD on the same page.
 * Uses native <details>/<summary> for zero-JS accessibility and SEO.
 */
export default function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section
      aria-labelledby="faq-heading"
      style={{
        marginTop: 40,
        padding: "32px 28px",
        background: "var(--color-bg-subtle)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h2
        id="faq-heading"
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "var(--color-text)",
          margin: "0 0 20px",
        }}
      >
        常见问题
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <details
            key={item.q}
            style={{
              padding: "14px 16px",
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--color-text)",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span>{item.q}</span>
              <span
                aria-hidden
                style={{ fontSize: 18, color: "var(--color-text-muted)", flexShrink: 0 }}
              >
                +
              </span>
            </summary>
            <p
              style={{
                marginTop: 12,
                marginBottom: 0,
                fontSize: 14,
                lineHeight: 1.75,
                color: "var(--color-text-muted)",
              }}
            >
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
