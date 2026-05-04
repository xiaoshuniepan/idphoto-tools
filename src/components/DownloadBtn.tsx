"use client";

interface DownloadBtnProps {
  url: string;
  filename?: string;
  label?: string;
}

export default function DownloadBtn({
  url,
  filename = "证件照.png",
  label = "下载图片",
}: DownloadBtnProps) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "var(--color-accent)",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        padding: "12px 32px",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(249,115,22,.35)",
        transition: "transform .15s, box-shadow .15s",
      }}
    >
      ⬇️ {label}
    </button>
  );
}
