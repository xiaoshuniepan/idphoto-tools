import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CropTool from "@/components/CropTool";

export const metadata: Metadata = {
  title: "证件照裁剪 — 一寸二寸护照签证标准尺寸",
  description:
    "在线证件照裁剪工具，支持一寸、二寸、护照、驾照、美国签证等20+标准尺寸。输出300dpi高清图片，满足打印和电子报名要求。",
  keywords: [
    "证件照裁剪",
    "一寸照片尺寸",
    "二寸照片尺寸",
    "护照照片",
    "签证照片",
    "证件照像素",
    "证件照尺寸大全",
  ],
  alternates: { canonical: "https://pickerme.cn/crop" },
};

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
      证件照标准尺寸说明
    </h2>
    <p
      style={{
        fontSize: 13,
        color: "var(--color-text-muted)",
        lineHeight: 1.8,
        margin: "0 0 10px",
      }}
    >
      常用证件照尺寸：<strong>一寸（25×35mm，295×413px）</strong>用于简历、学生证；
      <strong>二寸（35×49mm，413×579px）</strong>用于护照、毕业证；
      <strong>护照照片（33×48mm）</strong>符合中国护照标准；
      <strong>美国签证（51×51mm）</strong>为2×2英寸正方形。
    </p>
    <p
      style={{
        fontSize: 13,
        color: "var(--color-text-muted)",
        lineHeight: 1.8,
        margin: 0,
      }}
    >
      本工具输出分辨率为 300dpi，满足照相馆印刷标准。
      如需提交电子版报名照片，请根据要求选择合适的尺寸，
      并配合压缩工具将文件大小压缩到规定范围内。
    </p>
  </>
);

export default function CropPage() {
  return (
    <ToolLayout
      title="证件照裁剪"
      desc="支持一寸、二寸、护照、驾照、美签等 20+ 标准尺寸，拖动选框调整位置，输出 300dpi 高清图片。"
      seoText={seoText}
    >
      <CropTool />
    </ToolLayout>
  );
}
