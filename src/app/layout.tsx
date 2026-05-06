import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://pickerme.cn"),
  title: {
    default: "证件照快手 — 免费在线证件照制作工具",
    template: "%s | 证件照快手",
  },
  description:
    "免费在线证件照工具：一键换底色、标准尺寸裁剪、压缩到指定KB。全程浏览器端处理，无需上传，隐私安全。",
  keywords: [
    "证件照在线制作",
    "证件照换底色",
    "证件照尺寸",
    "证件照压缩",
    "一寸照片",
    "二寸照片",
    "护照照片",
    "证件照制作",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://pickerme.cn",
    siteName: "证件照快手",
    title: "证件照快手 — 免费在线证件照制作工具",
    description:
      "免费在线证件照工具：一键换底色、标准尺寸裁剪、压缩到指定KB。全程浏览器端处理，无需上传，隐私安全。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://pickerme.cn",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main style={{ minHeight: "calc(100vh - 60px - 220px)" }}>
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
