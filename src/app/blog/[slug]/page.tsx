import type { Metadata } from "next";
import Link from "next/link";

// Placeholder — will be replaced with real MDX/CMS content
const articles: Record<string, { title: string; desc: string; content: string }> = {
  "id-photo-size-guide": {
    title: "2025年证件照尺寸大全",
    desc: "整理国内外常用证件照标准尺寸。",
    content: "内容即将发布，敬请期待。",
  },
  "how-to-take-id-photo-at-home": {
    title: "如何在家拍出标准证件照",
    desc: "手机拍摄证件照完整教程。",
    content: "内容即将发布，敬请期待。",
  },
  "visa-photo-requirements": {
    title: "各国签证照片要求汇总",
    desc: "美国、英国、申根、日本签证照片规格。",
    content: "内容即将发布，敬请期待。",
  },
  "compress-photo-for-exam": {
    title: "考试报名照片怎么压缩",
    desc: "将证件照压缩到指定KB的完整解决方案。",
    content: "内容即将发布，敬请期待。",
  },
};

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return { title: "文章不存在" };
  return {
    title: article.title,
    description: article.desc,
    alternates: { canonical: `https://pickerme.cn/blog/${slug}` },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return (
      <div style={{ maxWidth: 800, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>文章不存在</h1>
        <Link href="/blog" style={{ color: "var(--color-primary)" }}>
          返回教程列表
        </Link>
      </div>
    );
  }

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
          marginBottom: 24,
        }}
      >
        ← 返回教程列表
      </Link>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "var(--color-text)",
          marginBottom: 16,
          lineHeight: 1.3,
        }}
      >
        {article.title}
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--color-text-muted)",
          lineHeight: 1.8,
          padding: "24px",
          background: "var(--color-bg-subtle)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        {article.content}
      </p>
    </div>
  );
}
