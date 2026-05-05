import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "证件照快手 — 免费在线证件照制作工具",
  description:
    "免费在线证件照工具集：换底色、尺寸裁剪、压缩到指定KB。全程浏览器端处理，不上传服务器，安全隐私。支持一寸、二寸、护照等标准证件照。",
  alternates: { canonical: "https://pickerme.cn" },
};

const tools = [
  {
    href: "/change-bg",
    icon: "🎨",
    title: "证件照换底色",
    desc: "AI 智能抠图，一键换白底、蓝底、红底，支持自定义颜色",
    tag: "最受欢迎",
    tagColor: "#f97316",
    keywords: ["白底", "蓝底", "红底", "AI抠图"],
  },
  {
    href: "/crop",
    icon: "✂️",
    title: "证件照裁剪",
    desc: "一寸、二寸、护照、签证等20+标准尺寸，精确裁剪证件照",
    tag: "标准尺寸",
    tagColor: "#2563eb",
    keywords: ["一寸", "二寸", "护照", "签证"],
  },
  {
    href: "/compress",
    icon: "📦",
    title: "压缩到指定KB",
    desc: "报名必备！压缩照片到30KB/100KB/200KB等指定大小",
    tag: "考试必备",
    tagColor: "#16a34a",
    keywords: ["30KB", "100KB", "200KB", "压缩"],
  },
  {
    href: "/print-layout",
    icon: "🖨️",
    title: "排版打印",
    desc: "一寸8张/二寸4张自动排版，输出300dpi高清图，直接发打印店",
    tag: "打印必备",
    tagColor: "#7c3aed",
    keywords: ["一寸8张", "二寸4张", "A4排版", "5寸相纸"],
  },
  {
    href: "/beauty",
    icon: "✨",
    title: "证件照美颜",
    desc: "磨皮、美白、亮度、对比度一键调整，多种预设效果实时预览",
    tag: "新上线",
    tagColor: "#db2777",
    keywords: ["磨皮", "美白", "亮度", "对比度"],
  },
];

const features = [
  {
    icon: "🔒",
    title: "隐私安全",
    desc: "所有处理均在浏览器本地完成，照片不会上传至任何服务器",
  },
  {
    icon: "⚡",
    title: "秒速处理",
    desc: "基于 WebAssembly 和 Canvas 技术，本地处理速度极快",
  },
  {
    icon: "🆓",
    title: "完全免费",
    desc: "无需注册、无需付费、无次数限制，随时使用",
  },
  {
    icon: "📱",
    title: "手机可用",
    desc: "支持手机端直接操作，拍完即可处理，方便快捷",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "证件照快手",
  url: "https://pickerme.cn",
  description:
    "免费在线证件照制作工具：换底色、尺寸裁剪、压缩KB，全程浏览器端处理",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #eff6ff 0%, #fff 50%, #fff7ed 100%)",
          padding: "64px 20px 56px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "var(--color-primary-light)",
              color: "var(--color-primary)",
              borderRadius: 999,
              padding: "4px 14px",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            🪪 免费 · 无需注册 · 隐私安全
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              color: "var(--color-text)",
              lineHeight: 1.2,
              marginBottom: 16,
              letterSpacing: "-0.5px",
            }}
          >
            证件照，
            <span style={{ color: "var(--color-primary)" }}>3 秒搞定</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            换底色、裁尺寸、压缩到指定KB，全部免费在线处理。
            <br />
            图片不离开你的浏览器，安全有保障。
          </p>
          <Link
            href="/change-bg"
            style={{
              display: "inline-block",
              background: "var(--color-primary)",
              color: "#fff",
              padding: "14px 36px",
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(37,99,235,.35)",
              transition: "transform .15s, box-shadow .15s",
            }}
          >
            立即使用 →
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 20px 0" }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          全部工具
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--color-text-muted)",
            marginBottom: 36,
            fontSize: 15,
          }}
        >
          覆盖证件照制作全流程，开箱即用
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                display: "block",
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: 28,
                textDecoration: "none",
                boxShadow: "var(--shadow-sm)",
                transition: "transform .15s, box-shadow .15s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Tag */}
              <span
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: tool.tagColor + "15",
                  color: tool.tagColor,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                {tool.tag}
              </span>

              <div style={{ fontSize: 36, marginBottom: 14 }}>{tool.icon}</div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-text)",
                  marginBottom: 8,
                }}
              >
                {tool.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--color-text-muted)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {tool.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {tool.keywords.map((kw) => (
                  <span
                    key={kw}
                    style={{
                      fontSize: 12,
                      background: "var(--color-bg-subtle)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-muted)",
                      padding: "2px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <div
                style={{
                  marginTop: 20,
                  color: "var(--color-primary)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                立即使用 →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "64px 20px 0",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          为什么选择我们
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--color-text-muted)",
            marginBottom: 36,
            fontSize: 15,
          }}
        >
          专注做好一件事：让证件照处理简单、安全、免费
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--color-text)",
                  marginBottom: 8,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Text */}
      <section
        style={{
          maxWidth: 800,
          margin: "64px auto 0",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            background: "var(--color-bg-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "32px 36px",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: 12,
            }}
          >
            在线证件照制作，免费安全
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-muted)",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            证件照快手是一款完全免费的在线证件照制作工具，支持证件照换底色（白底、蓝底、红底）、
            标准尺寸裁剪（一寸、二寸、护照照片、签证照片等）和照片压缩（压缩到30KB、100KB、200KB等指定大小）。
            所有图片处理均在您的浏览器本地完成，无需上传服务器，完全保护您的隐私安全。
            无论是考研报名、公务员考试、教师资格证报名，还是办理护照、签证，都能快速生成符合要求的证件照。
          </p>
        </div>
      </section>
    </>
  );
}
