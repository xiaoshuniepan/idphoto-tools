import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "证件照快手隐私政策 — 我们如何保护您的隐私和数据安全。",
  robots: { index: false },
  alternates: { canonical: "https://pickerme.cn/privacy" },
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "数据处理方式",
      content:
        "证件照快手的所有图片处理功能均在您的浏览器本地完成，使用 Canvas API 和 WebAssembly 技术。您上传的照片不会被发送至任何服务器，不会被存储，也不会被我们访问。",
    },
    {
      title: "我们收集的信息",
      content:
        "我们使用百度统计分析工具收集匿名访问统计数据，包括页面浏览量、访问来源等聚合信息，用于改善产品体验。这些数据不包含任何个人身份信息，也与您的照片无关。",
    },
    {
      title: "Cookie 使用",
      content:
        "我们使用必要的 Cookie 来保证网站正常运行（如统计访问来源）。我们不使用 Cookie 追踪您的个人信息，也不会将 Cookie 数据出售给第三方。",
    },
    {
      title: "广告",
      content:
        "本网站可能展示百度联盟广告。广告服务商可能根据您的浏览行为（通过其自己的 Cookie）展示相关广告。这一行为受广告服务商的隐私政策约束，与本站无关。",
    },
    {
      title: "第三方服务",
      content:
        "换底色功能使用了 @imgly/background-removal 开源库，该库的 AI 模型文件在首次使用时从 CDN 加载到您的浏览器缓存中，后续使用不需要重新下载。整个推理过程完全在本地执行。",
    },
    {
      title: "未成年人保护",
      content:
        "本网站不专门面向未成年人提供服务，也不主动收集未成年人的个人信息。",
    },
    {
      title: "政策更新",
      content:
        "如果本隐私政策发生变更，我们将在本页面更新内容并注明更新日期。建议您定期查阅本页面。",
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "var(--color-text)",
          marginBottom: 8,
        }}
      >
        隐私政策
      </h1>
      <p
        style={{
          fontSize: 13,
          color: "var(--color-text-muted)",
          marginBottom: 32,
        }}
      >
        最后更新：2025年1月
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {sections.map((s) => (
          <div key={s.title}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: 8,
              }}
            >
              {s.title}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-muted)",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {s.content}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 40,
          padding: "20px 24px",
          background: "var(--color-primary-light)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-primary)",
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: "var(--color-primary-dark)",
            margin: 0,
            fontWeight: 600,
          }}
        >
          📌 核心承诺：您的照片永远不会离开您的设备。
          所有处理在浏览器本地完成，我们无法访问您的任何图片内容。
        </p>
      </div>
    </div>
  );
}
