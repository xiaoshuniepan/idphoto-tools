import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import { toolJsonLd } from "@/lib/jsonLd";
import PrintLayoutTool from "@/components/PrintLayoutTool";

export const metadata: Metadata = {
  title: "证件照排版打印 — 一寸8张/二寸4张/A4排版",
  description:
    "在线证件照排版工具，支持一寸8张、二寸4张、护照照片等多种排版方案，输出300dpi高清图片，发给打印店直接打印。",
  keywords: [
    "证件照排版",
    "一寸照片排版",
    "证件照打印",
    "一寸照片8张",
    "二寸照片4张",
    "证件照A4排版",
    "护照照片排版",
  ],
  alternates: { canonical: "https://pickerme.cn/print-layout" },
};

const jsonLd = toolJsonLd("证件照排版打印", "https://pickerme.cn/print-layout", "一寸8张、二寸4张自动排版，输出300dpi高清图，直接发打印店");

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
      如何打印证件照？
    </h2>
    <p
      style={{
        fontSize: 13,
        color: "var(--color-text-muted)",
        lineHeight: 1.8,
        margin: "0 0 10px",
      }}
    >
      使用本工具排版后，将图片发给打印店或使用自助打印机输出即可。
      常见选择：<strong>5寸相纸</strong>（127×89mm）适合冲洗一寸8张或二寸4张，
      <strong>A4纸</strong>适合激光打印机打印大量证件照。
      打印时请选择「100%实际尺寸」，不要勾选「适应页面」，否则会导致尺寸不准确。
    </p>
    <p
      style={{
        fontSize: 13,
        color: "var(--color-text-muted)",
        lineHeight: 1.8,
        margin: 0,
      }}
    >
      本工具输出的图片分辨率为300dpi，满足照相馆印刷标准，裁切后的成品尺寸与标准证件照完全一致。
    </p>
  </>
);

export default function PrintLayoutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
      title="证件照排版打印"
      desc="选择排版方案，上传证件照，自动生成可打印的高清排版图。支持一寸8张、二寸4张、A4排版等多种规格。"
      seoText={seoText}
    >
      <PrintLayoutTool />
    </ToolLayout>
    </>
  );
}
