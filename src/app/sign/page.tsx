import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SignTool from "@/components/SignTool";
import JsonLd from "@/components/JsonLd";
import { toolJsonLd } from "@/lib/jsonLd";
import { signFaqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "电子签名生成 — 手写签名导出透明PNG",
  description:
    "在线手写电子签名工具，支持鼠标和触屏书写，导出透明背景PNG图片，可叠加到合同、文件、证件照上。免费无限使用。",
  keywords: ["电子签名", "手写签名", "在线签名", "签名生成器", "透明签名PNG"],
  alternates: { canonical: "https://pickerme.cn/sign" },
};

const jsonLd = toolJsonLd("电子签名生成", "https://pickerme.cn/sign", "鼠标或手指书写签名，导出透明背景PNG，可叠加到合同、文件上");

const seoText = (
  <>
    <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", marginBottom: 10 }}>
      电子签名使用场景
    </h2>
    <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.8, margin: 0 }}>
      本工具生成透明背景的 PNG 签名图片，常见用途：在 PDF 合同上添加手写签名、
      在证件照上方叠加个人签名、邮件签名图片、线上表格签名栏等。
      手机用户可直接用手指书写，效果与触控笔接近。
      所有处理在浏览器本地完成，签名内容不会上传至任何服务器。
    </p>
  </>
);

export default function SignPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolLayout
        title="电子签名生成"
        desc="鼠标或手指书写签名，一键导出透明背景 PNG，可直接叠加到文件、合同、证件上。"
        slug="/sign"
        seoText={seoText}
        faqs={signFaqs}
      >
        <SignTool />
      </ToolLayout>
    </>
  );
}
