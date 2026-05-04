import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "证件照使用教程",
  description:
    "证件照制作教程：证件照尺寸大全、如何在家拍出标准证件照、各国签证照片要求、照片压缩技巧等实用指南。",
  alternates: { canonical: "https://pickerme.cn/blog" },
};

const articles = [
  {
    slug: "id-photo-size-guide",
    title: "2025年证件照尺寸大全（一寸、二寸、护照、签证）",
    desc: "整理国内外常用证件照的标准尺寸，包括mm和像素规格，以及各类证件对照片的具体要求。",
    date: "2025-01-15",
    tag: "尺寸规范",
  },
  {
    slug: "how-to-take-id-photo-at-home",
    title: "如何在家拍出标准证件照？手机拍摄完整教程",
    desc: "分步骤教你用手机在家拍出符合标准的证件照，从背景布置、光线控制到后期处理，全流程详解。",
    date: "2025-01-10",
    tag: "拍摄技巧",
  },
  {
    slug: "visa-photo-requirements",
    title: "各国签证照片要求汇总（美国、英国、申根、日本）",
    desc: "汇总美国、英国、欧洲申根区、日本等主要国家签证对照片的尺寸、背景颜色、拍摄要求的详细规定。",
    date: "2025-01-05",
    tag: "签证攻略",
  },
  {
    slug: "compress-photo-for-exam",
    title: "考试报名照片怎么压缩？完整解决方案",
    desc: "解决报名系统「照片大小超出限制」问题，详解如何将证件照压缩到200KB/100KB/30KB等指定大小。",
    date: "2024-12-28",
    tag: "考试必备",
  },
];

export default function BlogPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "var(--color-text)",
            marginBottom: 8,
          }}
        >
          使用教程
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-text-muted)" }}>
          证件照制作指南，从拍摄到提交，每步都有详细说明
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            style={{
              display: "block",
              padding: 24,
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
              transition: "box-shadow .15s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                  padding: "2px 10px",
                  borderRadius: 999,
                }}
              >
                {a.tag}
              </span>
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                {a.date}
              </span>
            </div>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: 8,
                lineHeight: 1.4,
              }}
            >
              {a.title}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {a.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Coming soon note */}
      <div
        style={{
          marginTop: 32,
          padding: "20px 24px",
          background: "var(--color-bg-subtle)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          更多教程持续更新中…
        </p>
      </div>
    </div>
  );
}
