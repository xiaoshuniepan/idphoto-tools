import type { NextConfig } from "next";

// 证件照快手已并入 FileKit（pickerme.com）。为集中流量与 SEO 权重，
// 把所有旧路径 301（Next 用 308，Google 同等处理）跳转到主站对应的中文工具页。
const TO = (path: string) => `https://www.pickerme.com${path}`;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/change-bg", destination: TO("/zh/id-photo/change-background"), permanent: true },
      { source: "/remove-bg", destination: TO("/zh/id-photo/remove-background"), permanent: true },
      { source: "/crop", destination: TO("/zh/id-photo/crop"), permanent: true },
      { source: "/compress", destination: TO("/zh/id-photo/compress"), permanent: true },
      { source: "/print-layout", destination: TO("/zh/id-photo/print-layout"), permanent: true },
      // 主站暂无对应工具，跳到证件照总入口
      { source: "/beauty", destination: TO("/zh/id-photo"), permanent: true },
      { source: "/sign", destination: TO("/zh/id-photo"), permanent: true },
      { source: "/blog", destination: TO("/zh/blog"), permanent: true },
      { source: "/blog/:slug*", destination: TO("/zh/blog"), permanent: true },
      { source: "/privacy", destination: TO("/zh/privacy"), permanent: true },
      // 兜底：其余所有路径（含首页）跳到证件照总入口
      { source: "/:path*", destination: TO("/zh/id-photo"), permanent: true },
    ];
  },
};

export default nextConfig;
