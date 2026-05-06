import FaqSection from "./FaqSection";
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd, faqJsonLd, type FaqItem } from "@/lib/jsonLd";

interface ToolLayoutProps {
  title: string;
  desc: string;
  children: React.ReactNode;
  seoText?: React.ReactNode;
  /** Slug appended to https://pickerme.cn for canonical breadcrumb (e.g. "/change-bg") */
  slug?: string;
  /** Optional FAQ — renders both visible accordion and FAQPage JSON-LD */
  faqs?: FaqItem[];
}

const SITE_URL = "https://pickerme.cn";

export default function ToolLayout({
  title,
  desc,
  children,
  seoText,
  slug,
  faqs,
}: ToolLayoutProps) {
  const breadcrumb = slug
    ? breadcrumbJsonLd([
        { name: "首页", url: SITE_URL },
        { name: title, url: `${SITE_URL}${slug}` },
      ])
    : null;

  const faqSchema = faqs && faqs.length > 0 ? faqJsonLd(faqs) : null;
  const schemas: object[] = [];
  if (breadcrumb) schemas.push(breadcrumb);
  if (faqSchema) schemas.push(faqSchema);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      {schemas.length > 0 && <JsonLd data={schemas} />}

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

      {faqs && faqs.length > 0 && <FaqSection items={faqs} />}
    </div>
  );
}
