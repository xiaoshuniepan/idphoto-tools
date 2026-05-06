import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolJsonLd } from "@/lib/jsonLd";
import BeautyTool from "@/components/BeautyTool";

export const metadata: Metadata = {
  title: "证件照美颜 — 磨皮美白亮度调整",
  description:
    "在线证件照美颜工具，支持磨皮、美白、亮度、对比度、饱和度调整，一键预设自然美肤效果。全程浏览器端处理，隐私安全。",
  keywords: [
    "证件照美颜",
    "证件照磨皮",
    "证件照美白",
    "证件照亮度调整",
    "证件照优化",
    "在线美颜",
  ],
  alternates: { canonical: "https://pickerme.cn/beauty" },
};

const jsonLd = toolJsonLd("证件照美颜", "https://pickerme.cn/beauty", "磨皮、美白、亮度、对比度一键调整，证件照美颜处理");

const seoText = (
  <>
    <h2
      style={{
        fontSize: 16,
        fontWeight: 700,
        color: "var(--color-text)",
        marginBottom: 10,
      }}
    >
      证件照美颜注意事项
    </h2>
    <p
      style={{
        fontSize: 13,
        color: "var(--color-text-muted)",
        lineHeight: 1.8,
        margin: 0,
      }}
    >
      证件照美颜需适度，过度修图可能导致与本人相貌差异过大而被拒。
      建议优先调整<strong>亮度和对比度</strong>改善曝光问题，
      适度<strong>磨皮</strong>减少瑕疵，轻微<strong>美白</strong>提升肤色。
      正式证件（护照、身份证）对照片的真实性要求较高，请以自然效果为主。
    </p>
  </>
);

export default function BeautyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="证件照美颜"
        desc="磨皮、美白、亮度、对比度一键调整，内置多种预设效果，实时预览对比。"
        seoText={seoText}
      >
        <BeautyTool />
      </ToolLayout>
    </>
  );
}
