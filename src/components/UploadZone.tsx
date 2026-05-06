"use client";

import { useCallback, useState } from "react";

interface UploadZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  label?: string;
}

export default function UploadZone({
  onFile,
  accept = "image/*",
  label = "点击上传照片 或 拖拽到此处",
}: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onFile(file);
    },
    [onFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "48px 24px",
        border: `2px dashed ${dragging ? "var(--color-primary)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        background: dragging ? "var(--color-primary-light)" : "var(--color-bg-subtle)",
        cursor: "pointer",
        transition: "all .2s",
        userSelect: "none",
      }}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <div style={{ fontSize: 40 }}>📷</div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: dragging ? "var(--color-primary)" : "var(--color-text)",
          textAlign: "center",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
        支持 JPG、PNG、WEBP 格式 · 大图自动压缩
      </div>
    </label>
  );
}
