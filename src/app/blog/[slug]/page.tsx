import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Article registry — add new articles here
import { meta as sizeGuideMeta, default as SizeGuideContent } from "@/content/blog/id-photo-size-guide";
import { meta as compressMeta, default as CompressContent } from "@/content/blog/compress-photo-for-exam";
import { meta as homeTakeMeta, default as HomeTakeContent } from "@/content/blog/how-to-take-id-photo-at-home";
import { meta as visaMeta, default as VisaContent } from "@/content/blog/visa-photo-requirements";

const articleMap: Record<
  string,
  {
    meta: { title: string; description: string; date: string; tag: string; keywords: string[] };
    Content: React.ComponentType;
  }
> = {
  "id-photo-size-guide": { meta: sizeGuideMeta, Content: SizeGuideContent },
  "compress-photo-for-exam": { meta: compressMeta, Content: CompressContent },
  "how-to-take-id-photo-at-home": { meta: homeTakeMeta, Content: HomeTakeContent },
  "visa-photo-requirements": { meta: visaMeta, Content: VisaContent },
};

export async function generateStaticParams() {
  return Object.keys(articleMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleMap[slug];
  if (!article) return { title: "文章不存在" };
  return {
    title: article.meta.title,
    description: article.meta.description,
    keywords: article.meta.keywords,
    alternates: { canonical: `https://pickerme.cn/blog/${slug}` },
    openGraph: {
      title: article.meta.title,
      description: article.meta.description,
      type: "article",
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleMap[slug];
  if (!article) notFound();

  const { meta, Content } = article;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <Link
        href="/blog"
        style={{
          fontSize: 13,
          color: "var(--color-primary)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 28,
        }}
      >
        ← 返回教程列表
      </Link>

      {/* Article header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              background: "var(--color-primary-light)",
              color: "var(--color-primary)",
              padding: "3px 10px",
              borderRadius: 999,
            }}
          >
            {meta.tag}
          </span>
          <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{meta.date}</span>
        </div>
        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800,
            color: "var(--color-text)",
            lineHeight: 1.3,
            marginBottom: 12,
          }}
        >
          {meta.title}
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-text-muted)", lineHeight: 1.7 }}>
          {meta.description}
        </p>
      </div>

      {/* Article body */}
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.85,
          color: "var(--color-text)",
        }}
        className="article-body"
      >
        <Content />
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 48,
          padding: "24px 28px",
          background: "var(--color-primary-light)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid #bfdbfe",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-primary)", marginBottom: 8 }}>
          立即使用证件照工具
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { href: "/change-bg", label: "🎨 换底色" },
            { href: "/crop", label: "✂️ 尺寸裁剪" },
            { href: "/compress", label: "📦 压缩KB" },
            { href: "/print-layout", label: "🖨️ 排版打印" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              style={{
                padding: "8px 16px",
                background: "#fff",
                border: "1px solid #bfdbfe",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .article-body h2 {
          font-size: 20px;
          font-weight: 700;
          color: var(--color-text);
          margin: 32px 0 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--color-border);
        }
        .article-body h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 24px 0 8px;
        }
        .article-body p {
          margin: 0 0 16px;
          color: var(--color-text-muted);
        }
        .article-body ul, .article-body ol {
          margin: 0 0 16px;
          padding-left: 24px;
          color: var(--color-text-muted);
        }
        .article-body li {
          margin-bottom: 6px;
        }
        .article-body strong {
          color: var(--color-text);
          font-weight: 700;
        }
        .article-body a {
          color: var(--color-primary);
          text-decoration: underline;
        }
        .article-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 0 20px;
          font-size: 14px;
          overflow-x: auto;
          display: block;
        }
        .article-body th {
          background: var(--color-bg-subtle);
          padding: 10px 14px;
          text-align: left;
          font-weight: 700;
          border: 1px solid var(--color-border);
          white-space: nowrap;
          color: var(--color-text);
        }
        .article-body td {
          padding: 9px 14px;
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
        }
        .article-body tr:nth-child(even) td {
          background: var(--color-bg-subtle);
        }
      `}</style>
    </div>
  );
}
