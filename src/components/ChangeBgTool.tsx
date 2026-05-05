"use client";

import { useState, useRef, useCallback } from "react";
import UploadZone from "./UploadZone";
import DownloadBtn from "./DownloadBtn";

type Status = "idle" | "removing_bg" | "done" | "error";

const PRESET_COLORS = [
  { label: "白色", value: "#FFFFFF", textColor: "#333" },
  { label: "蓝色", value: "#438EDB", textColor: "#fff" },
  { label: "红色", value: "#FF0000", textColor: "#fff" },
  { label: "深蓝", value: "#1A5099", textColor: "#fff" },
  { label: "浅蓝", value: "#C7DEFF", textColor: "#333" },
  { label: "浅红", value: "#FFCCCC", textColor: "#333" },
];

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { text: string; color: string } | null> = {
    idle: null,
    removing_bg: { text: "🤖 AI 抠图中，请稍候…", color: "#2563eb" },
    done: { text: "✅ 处理完成", color: "#16a34a" },
    error: { text: "❌ 处理失败，请重试", color: "#dc2626" },
  };
  const info = map[status];
  if (!info) return null;
  return (
    <div
      style={{
        textAlign: "center",
        padding: "10px 20px",
        borderRadius: "var(--radius-md)",
        background: info.color + "15",
        color: info.color,
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {info.text}
    </div>
  );
}

export default function ChangeBgTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [fgBlob, setFgBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Apply bg color onto transparent foreground blob → JPEG data URL
  const applyBackground = useCallback(
    async (blob: Blob, color: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("no ctx")); return; }
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL("image/jpeg", 0.95));
        };
        img.onerror = reject;
        img.src = url;
      });
    },
    []
  );

  const handleFile = useCallback(
    async (file: File) => {
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setFgBlob(null);
      setErrorMsg(null);
      setStatus("removing_bg");

      try {
        const form = new FormData();
        form.append("image", file);

        const res = await fetch("/api/remove-bg", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `服务器错误 ${res.status}`);
        }

        const blob = await res.blob();
        setFgBlob(blob);
        setStatus("done");

        const result = await applyBackground(blob, bgColor);
        setResultUrl(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "未知错误";
        setErrorMsg(msg);
        setStatus("error");
      }
    },
    [bgColor, applyBackground]
  );

  const handleColorChange = useCallback(
    async (color: string) => {
      setBgColor(color);
      if (!fgBlob) return;
      const result = await applyBackground(fgBlob, color);
      setResultUrl(result);
    },
    [fgBlob, applyBackground]
  );

  const reuploadInput = (
    <input
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = "";
      }}
    />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Upload zone (first visit) */}
      {!originalUrl && <UploadZone onFile={handleFile} />}

      {/* Re-upload link */}
      {originalUrl && (
        <div style={{ textAlign: "center" }}>
          <label
            style={{
              cursor: "pointer",
              fontSize: 13,
              color: "var(--color-primary)",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            重新上传 {reuploadInput}
          </label>
        </div>
      )}

      <StatusBadge status={status} />

      {/* Error detail */}
      {status === "error" && errorMsg && (
        <div
          style={{
            padding: "10px 16px",
            borderRadius: "var(--radius-md)",
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            fontSize: 13,
            color: "#991b1b",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Before / After */}
      {originalUrl && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {/* Original */}
          <div
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid var(--color-border)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-text-muted)",
                background: "var(--color-bg-subtle)",
              }}
            >
              原图
            </div>
            <div
              style={{
                padding: 12,
                backgroundImage:
                  "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
              }}
            >
              <img
                src={originalUrl}
                alt="原图"
                style={{ width: "100%", maxHeight: 320, objectFit: "contain", display: "block" }}
              />
            </div>
          </div>

          {/* Result */}
          <div
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid var(--color-border)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-text-muted)",
                background: "var(--color-bg-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>处理后</span>
              {resultUrl && (
                <DownloadBtn url={resultUrl} filename="证件照换底色.jpg" label="下载" />
              )}
            </div>
            <div style={{ padding: 12, background: bgColor, minHeight: 120 }}>
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="处理后"
                  style={{ width: "100%", maxHeight: 320, objectFit: "contain", display: "block" }}
                />
              ) : (
                <div
                  style={{
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-muted)",
                    fontSize: 14,
                  }}
                >
                  {status === "removing_bg" ? "处理中…" : "上传照片后显示结果"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Color picker (only after fg is ready) */}
      {fgBlob && (
        <div
          style={{
            background: "var(--color-bg-subtle)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <div
            style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", marginBottom: 14 }}
          >
            选择底色
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => handleColorChange(c.value)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: c.value,
                  border:
                    bgColor === c.value
                      ? "3px solid var(--color-primary)"
                      : "2px solid var(--color-border)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  color: c.textColor,
                  fontWeight: 700,
                  transform: bgColor === c.value ? "scale(1.12)" : "scale(1)",
                  transition: "transform .1s",
                }}
              >
                {bgColor === c.value ? "✓" : ""}
              </button>
            ))}
            {/* Custom */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  handleColorChange(e.target.value);
                }}
                title="自定义颜色"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  border: "2px solid var(--color-border)",
                  cursor: "pointer",
                  padding: 2,
                }}
              />
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>自定义</span>
            </div>
          </div>
        </div>
      )}

      {/* Download CTA */}
      {resultUrl && (
        <div style={{ textAlign: "center" }}>
          <DownloadBtn
            url={resultUrl}
            filename="证件照换底色.jpg"
            label="下载处理后的证件照"
          />
        </div>
      )}
    </div>
  );
}
