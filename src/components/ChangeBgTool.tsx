"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import UploadZone from "./UploadZone";
import DownloadBtn from "./DownloadBtn";
import ModelProgress from "./ModelProgress";
import { useRemoveBg } from "@/lib/onnx";
import { compressImageIfNeeded } from "@/lib/compressImage";
import { checkerboard } from "@/lib/styles";

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
    removing_bg: null, // Handled by ModelProgress instead
    done: { text: "✅ 处理完成", color: "#16a34a" },
    error: null, // Handled by ModelProgress
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
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Cache decoded foreground as ImageBitmap for instant color changes
  const fgBitmap = useRef<ImageBitmap | null>(null);

  const onnx = useRemoveBg();

  useEffect(() => {
    onnx.checkCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      fgBitmap.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyBackground = useCallback(
    (bitmap: ImageBitmap, color: string): string => {
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas ctx");
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0);
      return canvas.toDataURL("image/jpeg", 0.95);
    },
    [],
  );

  const handleFile = useCallback(
    async (file: File) => {
      setOriginalUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setResultUrl(null);
      fgBitmap.current?.close();
      fgBitmap.current = null;
      setStatus("removing_bg");

      try {
        const compressed = await compressImageIfNeeded(file);
        const blob = await onnx.removeBg(compressed);
        const bitmap = await createImageBitmap(blob);
        fgBitmap.current = bitmap;
        setStatus("done");
        const dataUrl = applyBackground(bitmap, bgColor);
        setResultUrl(dataUrl);
      } catch {
        setStatus("error");
      }
    },
    [bgColor, applyBackground, onnx],
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setBgColor(color);
      if (!fgBitmap.current) return;
      setResultUrl(applyBackground(fgBitmap.current, color));
    },
    [applyBackground],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {!originalUrl && <UploadZone onFile={handleFile} />}

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
            重新上传
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
          </label>
        </div>
      )}

      <StatusBadge status={status} />

      {/* ONNX progress (model download + inference) */}
      <ModelProgress status={onnx.status} progress={onnx.progress} />

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
            <div style={{ padding: 12, ...checkerboard(16) }}>
              <img
                src={originalUrl}
                alt="原图"
                style={{
                  width: "100%",
                  maxHeight: 320,
                  objectFit: "contain",
                  display: "block",
                }}
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
                <DownloadBtn
                  url={resultUrl}
                  filename="证件照换底色.jpg"
                  label="下载"
                />
              )}
            </div>
            <div style={{ padding: 12, background: bgColor, minHeight: 120 }}>
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="处理后"
                  style={{
                    width: "100%",
                    maxHeight: 320,
                    objectFit: "contain",
                    display: "block",
                  }}
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

      {fgBitmap.current && (
        <div
          style={{
            background: "var(--color-bg-subtle)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: 14,
            }}
          >
            选择底色
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
            }}
          >
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => handleColorChange(e.target.value)}
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
              <span
                style={{ fontSize: 12, color: "var(--color-text-muted)" }}
              >
                自定义
              </span>
            </div>
          </div>
        </div>
      )}

      {resultUrl && (
        <div style={{ textAlign: "center" }}>
          <DownloadBtn
            url={resultUrl}
            filename="证件照换底色.jpg"
            label="下载处理后的证件照"
          />
        </div>
      )}

      <p
        style={{
          fontSize: 12,
          color: "var(--color-text-muted)",
          margin: 0,
          textAlign: "center",
        }}
      >
        💡 全程浏览器本地 AI 处理，图片不会上传到任何服务器
      </p>
    </div>
  );
}
