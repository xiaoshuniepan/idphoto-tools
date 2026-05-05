"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import UploadZone from "./UploadZone";
import DownloadBtn from "./DownloadBtn";

interface Adjustments {
  brightness: number;  // -100 to 100
  contrast: number;    // -100 to 100
  saturation: number;  // -100 to 100
  sharpness: number;   // 0 to 100
  smooth: number;      // 0 to 100 (blur radius)
  whiten: number;      // 0 to 100
}

const DEFAULT_ADJ: Adjustments = {
  brightness: 10,
  contrast: 5,
  saturation: 5,
  sharpness: 0,
  smooth: 0,
  whiten: 0,
};

const PRESETS = [
  {
    label: "自然美肤",
    icon: "✨",
    adj: { brightness: 12, contrast: 5, saturation: 8, sharpness: 10, smooth: 15, whiten: 10 },
  },
  {
    label: "证件照优化",
    icon: "🪪",
    adj: { brightness: 8, contrast: 10, saturation: 5, sharpness: 20, smooth: 8, whiten: 5 },
  },
  {
    label: "白皙亮肤",
    icon: "🌸",
    adj: { brightness: 20, contrast: 0, saturation: -5, sharpness: 5, smooth: 20, whiten: 25 },
  },
  {
    label: "清晰锐化",
    icon: "🔍",
    adj: { brightness: 5, contrast: 15, saturation: 10, sharpness: 40, smooth: 0, whiten: 0 },
  },
  {
    label: "重置",
    icon: "↩️",
    adj: { brightness: 0, contrast: 0, saturation: 0, sharpness: 0, smooth: 0, whiten: 0 },
  },
];

function applyAdjustments(
  src: HTMLImageElement,
  adj: Adjustments
): string {
  const w = src.naturalWidth;
  const h = src.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // CSS filter string handles brightness/contrast/saturation/blur
  const brightF = 1 + adj.brightness / 100;
  const contrastF = 1 + adj.contrast / 100;
  const saturateF = 1 + adj.saturation / 100;
  const blurPx = (adj.smooth / 100) * 2; // max ~2px blur for skin smooth

  ctx.filter = [
    `brightness(${brightF})`,
    `contrast(${contrastF})`,
    `saturate(${saturateF})`,
    blurPx > 0 ? `blur(${blurPx.toFixed(2)}px)` : "",
  ]
    .filter(Boolean)
    .join(" ");

  ctx.drawImage(src, 0, 0);
  ctx.filter = "none";

  // Whiten: overlay white with low opacity
  if (adj.whiten > 0) {
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = `rgba(255,255,255,${adj.whiten / 400})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }

  // Sharpness: unsharp-mask approximation
  // Draw original on top with hard-light at low opacity after blur
  if (adj.sharpness > 0) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCtx.filter = "blur(1px)";
      tempCtx.drawImage(src, 0, 0);
      tempCtx.filter = "none";

      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = (adj.sharpness / 100) * 0.4;
      ctx.drawImage(src, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
  }

  return canvas.toDataURL("image/jpeg", 0.95);
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, onChange }: SliderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontSize: 13,
          color: "var(--color-text-muted)",
          width: 60,
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: "var(--color-primary)", cursor: "pointer" }}
      />
      <span
        style={{
          fontSize: 13,
          color: "var(--color-text)",
          width: 36,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value > 0 ? `+${value}` : value}
      </span>
    </div>
  );
}

export default function BeautyTool() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [adj, setAdj] = useState<Adjustments>(DEFAULT_ADJ);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-apply on adjustment change (debounced)
  const scheduleApply = useCallback((newAdj: Adjustments) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!imgRef.current) return;
      const url = applyAdjustments(imgRef.current, newAdj);
      setResultUrl(url);
    }, 150);
  }, []);

  const updateAdj = useCallback(
    (key: keyof Adjustments, value: number) => {
      setAdj((prev) => {
        const next = { ...prev, [key]: value };
        scheduleApply(next);
        return next;
      });
    },
    [scheduleApply]
  );

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    setResultUrl(null);
  }, []);

  const handleImgLoad = useCallback(() => {
    if (!imgRef.current) return;
    const url = applyAdjustments(imgRef.current, DEFAULT_ADJ);
    setResultUrl(url);
    setAdj(DEFAULT_ADJ);
  }, []);

  const applyPreset = useCallback(
    (presetAdj: Partial<Adjustments>) => {
      const next = { ...DEFAULT_ADJ, ...presetAdj } as Adjustments;
      setAdj(next);
      scheduleApply(next);
    },
    [scheduleApply]
  );

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const sliders: { key: keyof Adjustments; label: string; min: number; max: number }[] = [
    { key: "brightness", label: "亮度", min: -50, max: 80 },
    { key: "contrast", label: "对比度", min: -50, max: 80 },
    { key: "saturation", label: "饱和度", min: -50, max: 80 },
    { key: "smooth", label: "磨皮", min: 0, max: 100 },
    { key: "whiten", label: "美白", min: 0, max: 100 },
    { key: "sharpness", label: "锐化", min: 0, max: 100 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {!imgUrl && <UploadZone onFile={handleFile} />}

      {imgUrl && (
        <img
          ref={imgRef}
          src={imgUrl}
          alt=""
          crossOrigin="anonymous"
          onLoad={handleImgLoad}
          style={{ display: "none" }}
        />
      )}

      {imgUrl && (
        <>
          {/* Re-upload */}
          <div style={{ textAlign: "center" }}>
            <label style={{ cursor: "pointer", fontSize: 13, color: "var(--color-primary)", fontWeight: 600, textDecoration: "underline" }}>
              重新上传
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              alignItems: "start",
            }}
          >
            {/* Previews */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  { label: "原图", src: imgUrl },
                  { label: "美颜后", src: resultUrl ?? imgUrl },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--color-border)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--color-text-muted)",
                        background: "var(--color-bg-subtle)",
                      }}
                    >
                      {item.label}
                    </div>
                    <img
                      src={item.src}
                      alt={item.label}
                      style={{ width: "100%", display: "block", maxHeight: 220, objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>

              {resultUrl && (
                <DownloadBtn
                  url={resultUrl}
                  filename="证件照美颜.jpg"
                  label="下载美颜后的照片"
                />
              )}
            </div>

            {/* Controls */}
            <div
              style={{
                background: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Presets */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", marginBottom: 10 }}>
                  一键预设
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p.adj)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg)",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "var(--color-text)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  height: 1,
                  background: "var(--color-border)",
                }}
              />

              {/* Sliders */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {sliders.map((s) => (
                  <Slider
                    key={s.key}
                    label={s.label}
                    value={adj[s.key]}
                    min={s.min}
                    max={s.max}
                    onChange={(v) => updateAdj(s.key, v)}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
