import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolJsonLd } from "@/lib/jsonLd";
import CompressTool from "@/components/CompressTool";

export const metadata: Metadata = {
  title: "证件照压缩 — 压缩到30KB/100KB/200KB指定大小",
  description:
    "在线证件照压缩工具，快速将照片压缩到30KB、100KB、200KB等指定大小，满足各类报名网站的照片大小限制要求。免费无限次使用。",
  keywords: [
    "证件照压缩",
    "照片压缩到200kb",
    "照片压缩到100kb",
    "照片压缩到30kb",
    "证件照文件大小",
    "压缩图片KB",
    "报名照片大小",
  ],
  alternates: { canonical: "https://pickerme.cn/compress" },
};

const jsonLd = toolJsonLd("证件照压缩", "https://pickerme.cn/compress", "快速压缩照片到30KB、100KB、200KB等指定大小，满足报名网站照片大小限制");

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
      为什么需要压缩证件照？
    </h2>
    <p
      style={{
        fontSize: 13,
        color: "var(--color-text-muted)",
        lineHeight: 1.8,
        margin: "0 0 10px",
      }}
    >
      国内各类考试和证件办理的网上报名系统普遍对照片文件大小有严格限制：
      公务员考试一般要求<strong>不超过200KB</strong>，
      教师资格证报名要求<strong>不超过100KB</strong>，
      部分地区社保系统要求<strong>不超过30KB</strong>。
      手机拍摄的照片通常有几MB，直接上传往往被拒。
    </p>
    <p
      style={{
        fontSize: 13,
        color: "var(--color-text-muted)",
        lineHeight: 1.8,
        margin: 0,
      }}
    >
      本工具采用二分法自动寻找最优JPEG质量参数，
      在保证画质的前提下将文件大小精确压缩到您指定的目标范围内，
      全程浏览器端处理，无需上传至服务器，安全放心。
    </p>
  </>
);

export default function CompressPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
      title="证件照压缩到指定KB"
      desc="选择目标大小（30KB/100KB/200KB等），上传照片，一键压缩。满足各类报名系统的照片大小限制。"
      seoText={seoText}
    >
      <CompressTool />
    </ToolLayout>
    </>
  );
}
