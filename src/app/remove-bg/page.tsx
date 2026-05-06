import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RemoveBgTool from "@/components/RemoveBgTool";
import { toolJsonLd } from "@/lib/jsonLd";

export const metadata: Metadata = {
  title: "在线AI抠图 — 自动去除图片背景，免费透明PNG",
  description:
    "AI 智能抠图工具，自动识别人像/物体，一键去除背景，输出透明 PNG。免费无限使用，图片隐私安全。",
  keywords: ["AI抠图", "去除背景", "抠图在线", "透明背景", "免费抠图"],
  alternates: { canonical: "https://pickerme.cn/remove-bg" },
};

const jsonLd = toolJsonLd("在线AI抠图", "https://pickerme.cn/remove-bg", "AI智能抠图，自动去除图片背景，输出透明PNG");

const seoText = (
  <>
    <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", marginBottom: 10 }}>
      AI 抠图使用说明
    </h2>
    <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.8, margin: 0 }}>
      上传任意图片，AI 自动识别前景（人像、商品、动物等）并去除背景，输出透明背景的 PNG 文件。
      透明 PNG 可直接叠加到任意背景上，常用于：电商商品主图、证件照换底色、
      个人头像抠图、海报素材制作等场景。处理结果可搭配本站
      <a href="/change-bg">换底色工具</a>快速替换为白底、蓝底等标准证件照背景。
    </p>
  </>
);

export default function RemoveBgPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="AI 智能抠图"
        desc="自动识别前景，一键去除背景，输出透明 PNG。支持人像、商品、动物等各类图片。"
        seoText={seoText}
      >
        <RemoveBgTool />
      </ToolLayout>
    </>
  );
}
