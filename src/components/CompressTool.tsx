"use client";

import { useState, useCallback } from "react";
import UploadZone from "./UploadZone";
import DownloadBtn from "./DownloadBtn";

type Status = "idle" | "compressing" | "done" | "error";

const PRESETS = [
  { label: "20 KB", value: 20 },
  { label: "30 KB", value: 30 },
  { label: "50 KB", value: 50 },
  { label: "100 KB", value: 100 },
  { label: "200 KB", value: 200 },
  { label: "500 KB", value: 500 },
];

function formatKB(bytes: number) {
  return (bytes / 1024).toFixed(1) + " KB";
}

async function compressToTarget(
  file: File,
  targetKB: number
): Promise<{ dataUrl: string; finalKB: number }> {
  const targetBytes = targetKB * 1024;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      // Iterative quality reduction
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("no ctx")); return; }

      const tryCompress = (quality: number, scale: number): string => {
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", quality);
      };

      // First try at full resolution, progressively lower quality
      let lo = 0.01, hi = 0.95, best = "";
      for (let i = 0; i < 15; i++) {
        const mid = (lo + hi) / 2;
        const result = tryCompress(mid, 1.0);
        const bytes = Math.round((result.length * 3) / 4);
        if (bytes <= targetBytes) {
          lo = mid;
          best = result;
        } else {
          hi = mid;
        }
      }

      // If even minimum quality is too large, scale down image
      if (!best) {
        let scale = 1.0;
        while (scale > 0.1) {
          scale -= 0.05;
          const result = tryCompress(0.5, scale);
          const bytes = Math.round((result.length * 3) / 4);
          if (bytes <= targetBytes) {
            best = result;
            break;
          }
        }
      }

      if (!best) best = tryCompress(0.01, 0.1);

      const finalBytes = Math.round((best.length * 3) / 4);
      resolve({ dataUrl: best, finalKB: finalBytes / 1024 });
    };

    img.onerror = reject;
    img.src = url;
  });
}

export default function CompressTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [targetKB, setTargetKB] = useState(100);
  const [customKB, setCustomKB] = useState("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalKB, setOriginalKB] = useState(0);
  const [resultKB, setResultKB] = useState(0);

  const handleFile = useCallback(
    async (file: File) => {
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setOriginalKB(file.size / 1024);
      setResultUrl(null);
      setStatus("compressing");

      try {
        const { dataUrl, finalKB } = await compressToTarget(file, targetKB);
        setResultUrl(dataUrl);
        setResultKB(finalKB);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    },
    [targetKB]
  );

  const recompress = useCallback(
    async (kb: number) => {
      if (!originalFile) return;
      setStatus("compressing");
      setResultUrl(null);
      try {
        const { dataUrl, finalKB } = await compressToTarget(originalFile, kb);
        setResultUrl(dataUrl);
        setResultKB(finalKB);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    },
    [originalFile]
  );

  const handlePreset = useCallback(
    (kb: number) => {
      setTargetKB(kb);
      setCustomKB("");
      recompress(kb);
    },
    [recompress]
  );

  const handleCustom = useCallback(() => {
    const kb = parseInt(customKB, 10);
    if (!kb || kb < 1) return;
    setTargetKB(kb);
    recompress(kb);
  }, [customKB, recompress]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Target selector (always visible) */}
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
          目标大小
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePreset(p.value)}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                border:
                  targetKB === p.value && !customKB
                    ? "2px solid var(--color-primary)"
                    : "1px solid var(--color-border)",
                background:
                  targetKB === p.value && !customKB
                    ? "var(--color-primary-light)"
                    : "var(--color-bg)",
                color:
                  targetKB === p.value && !customKB
                    ? "var(--color-primary)"
                    : "var(--color-text)",
                fontSize: 14,
                fontWeight: targetKB === p.value && !customKB ? 700 : 400,
                cursor: "pointer",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="number"
            min={1}
            max={10240}
            placeholder="自定义"
            value={customKB}
            onChange={(e) => setCustomKB(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustom()}
            style={{
              width: 100,
              padding: "8px 12px",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <span style={{ fontSize: 14, color: "var(--color-text-muted)" }}>KB</span>
          <button
            onClick={handleCustom}
            disabled={!customKB || !originalFile}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "var(--color-primary)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              opacity: !customKB || !originalFile ? 0.5 : 1,
            }}
          >
            确定
          </button>
        </div>
      </div>

      {/* Upload */}
      {!originalUrl && (
        <UploadZone
          onFile={handleFile}
          label="点击上传照片，将自动压缩到目标大小"
        />
      )}

      {/* Re-upload */}
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
              }}
            />
          </label>
        </div>
      )}

      {/* Status */}
      {status === "compressing" && (
        <div
          style={{
            textAlign: "center",
            padding: "12px 20px",
            borderRadius: "var(--radius-md)",
            background: "#dbeafe",
            color: "var(--color-primary)",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ⏳ 压缩中…
        </div>
      )}
      {status === "error" && (
        <div
          style={{
            textAlign: "center",
            padding: "12px 20px",
            borderRadius: "var(--radius-md)",
            background: "#fee2e2",
            color: "var(--color-error)",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ❌ 压缩失败，请重试
        </div>
      )}

      {/* Comparison */}
      {originalUrl && resultUrl && status === "done" && (
        <>
          {/* Stats banner */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              {
                label: "原始大小",
                value: formatKB(originalKB * 1024),
                color: "var(--color-error)",
              },
              {
                label: "压缩后",
                value: formatKB(resultKB * 1024),
                color: "var(--color-success)",
              },
              {
                label: "压缩率",
                value:
                  Math.round((1 - resultKB / originalKB) * 100) + "%",
                color: "var(--color-primary)",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: "1 1 100px",
                  textAlign: "center",
                  padding: "16px 20px",
                  borderRadius: "var(--radius-lg)",
                  background: s.color + "12",
                  border: `1px solid ${s.color}30`,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: s.color,
                    marginBottom: 4,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--color-text-muted)" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {resultKB > targetKB && (
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                background: "#fef3c7",
                border: "1px solid #fcd34d",
                fontSize: 13,
                color: "#92400e",
              }}
            >
              ⚠️ 图片已尽力压缩，最终大小（{formatKB(resultKB * 1024)}）略超目标。
              如需进一步压缩，请先用裁剪工具缩小图片尺寸。
            </div>
          )}

          {/* Preview */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {[
              { label: `原图 · ${formatKB(originalKB * 1024)}`, src: originalUrl },
              {
                label: `压缩后 · ${formatKB(resultKB * 1024)}`,
                src: resultUrl,
                isResult: true,
              },
            ].map((item) => (
              <div
                key={item.label}
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{item.label}</span>
                  {item.isResult && (
                    <DownloadBtn
                      url={item.src}
                      filename={`证件照_${targetKB}KB.jpg`}
                      label="下载"
                    />
                  )}
                </div>
                <div
                  style={{
                    padding: 12,
                    background: "var(--color-bg-subtle)",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    style={{ maxWidth: "100%", maxHeight: 260, display: "inline-block" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <DownloadBtn
              url={resultUrl}
              filename={`证件照_${targetKB}KB.jpg`}
              label={`下载压缩后的图片（${formatKB(resultKB * 1024)}）`}
            />
          </div>
        </>
      )}
    </div>
  );
}
