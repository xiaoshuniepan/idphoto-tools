import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ChangeBgTool from "@/components/ChangeBgTool";
import JsonLd from "@/components/JsonLd";
import { toolJsonLd } from "@/lib/jsonLd";
import { changeBgFaqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "证件照换底色 — 一键换白底蓝底红底",
  description:
    "在线证件照换底色工具，AI智能抠图，支持白底、蓝底、红底及自定义颜色。无需安装软件，隐私安全，完全免费。",
  keywords: ["证件照换底色", "证件照白底", "证件照蓝底", "证件照红底", "证件照背景换色", "在线抠图"],
  alternates: { canonical: "https://pickerme.cn/change-bg" },
};

const jsonLd = toolJsonLd("证件照换底色", "https://pickerme.cn/change-bg", "AI智能抠图，一键更换证件照白底、蓝底、红底，支持自定义颜色");

const seoText = (
  <>
    <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text)", marginBottom: 10 }}>
      如何在线更换证件照底色？
    </h2>
    <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.8, margin: 0 }}>
      使用证件照快手的换底色工具，只需三步：①上传您的证件照；
      ②AI 自动识别人像并去除背景；③选择白色、蓝色、红色或自定义颜色，点击即可预览和下载。
      适用于各类证件照要求：白底（二代身份证、教师资格证）、
      蓝底（驾照、毕业证）、红底（社保卡）等。
    </p>
  </>
);

export default function ChangeBgPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolLayout
        title="证件照换底色"
        desc="AI 智能抠图，一键更换白底、蓝底、红底，支持自定义颜色。"
        slug="/change-bg"
        seoText={seoText}
        faqs={changeBgFaqs}
      >
        <ChangeBgTool />
      </ToolLayout>
    </>
  );
}
