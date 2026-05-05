"use client";

import { useState, useRef, useCallback } from "react";
import UploadZone from "./UploadZone";
import DownloadBtn from "./DownloadBtn";

// Paper & photo layout configs
interface LayoutPreset {
  id: string;
  label: string;
  desc: string;
  // Photo size in mm
  photoW: number;
  photoH: number;
  cols: number;
  rows: number;
  // Paper size in mm (print at 300dpi)
  paperW: number;
  paperH: number;
  gapMm: number; // gap between photos
  marginMm: number; // paper margin
}

const MM2PX = (mm: number) => Math.round((mm / 25.4) * 300);

const PRESETS: LayoutPreset[] = [
  {
    id: "1cun_5x7",
    label: "一寸 × 8张",
    desc: "5寸相纸（127×89mm），8张一寸",
    photoW: 25, photoH: 35,
    cols: 4, rows: 2,
    paperW: 127, paperH: 89,
    gapMm: 2, marginMm: 3,
  },
  {
    id: "2cun_5x7",
    label: "二寸 × 4张",
    desc: "5寸相纸（127×89mm），4张二寸",
    photoW: 35, photoH: 49,
    cols: 2, rows: 2,
    paperW: 127, paperH: 89,
    gapMm: 2, marginMm: 3,
  },
  {
    id: "1cun_a4",
    label: "一寸 × 16张",
    desc: "A4纸（210×297mm），16张一寸",
    photoW: 25, photoH: 35,
    cols: 4, rows: 4,
    paperW: 210, paperH: 297,
    gapMm: 3, marginMm: 10,
  },
  {
    id: "2cun_a4",
    label: "二寸 × 8张",
    desc: "A4纸（210×297mm），8张二寸",
    photoW: 35, photoH: 49,
    cols: 4, rows: 2,
    paperW: 210, paperH: 297,
    gapMm: 3, marginMm: 10,
  },
  {
    id: "passport_a4",
    label: "护照 × 8张",
    desc: "A4纸（210×297mm），8张护照照片",
    photoW: 33, photoH: 48,
    cols: 4, rows: 2,
    paperW: 210, paperH: 297,
    gapMm: 3, marginMm: 10,
  },
  {
    id: "visa_us_a4",
    label: "美签 × 6张",
    desc: "A4纸（210×297mm），6张美国签证照片",
    photoW: 51, photoH: 51,
    cols: 3, rows: 2,
    paperW: 210, paperH: 297,
    gapMm: 4, marginMm: 10,
  },
];

// bg color for paper
const BG_WHITE = "#FFFFFF";

function generateLayout(
  imgEl: HTMLImageElement,
  preset: LayoutPreset,
  bgColor: string,
  showCutLine: boolean
): string {
  const paperWpx = MM2PX(preset.paperW);
  const paperHpx = MM2PX(preset.paperH);
  const photoWpx = MM2PX(preset.photoW);
  const photoHpx = MM2PX(preset.photoH);
  const gapPx = MM2PX(preset.gapMm);
  const marginPx = MM2PX(preset.marginMm);

  const canvas = document.createElement("canvas");
  canvas.width = paperWpx;
  canvas.height = paperHpx;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Paper background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, paperWpx, paperHpx);

  // Center the grid
  const gridW = preset.cols * photoWpx + (preset.cols - 1) * gapPx;
  const gridH = preset.rows * photoHpx + (preset.rows - 1) * gapPx;
  const startX = Math.round((paperWpx - gridW) / 2);
  const startY = Math.round((paperHpx - gridH) / 2);

  for (let row = 0; row < preset.rows; row++) {
    for (let col = 0; col < preset.cols; col++) {
      const x = startX + col * (photoWpx + gapPx);
      const y = startY + row * (photoHpx + gapPx);

      // Draw photo (cover fit)
      const srcRatio = imgEl.naturalWidth / imgEl.naturalHeight;
      const dstRatio = photoWpx / photoHpx;
      let sx = 0, sy = 0, sw = imgEl.naturalWidth, sh = imgEl.naturalHeight;
      if (srcRatio > dstRatio) {
        sw = imgEl.naturalHeight * dstRatio;
        sx = (imgEl.naturalWidth - sw) / 2;
      } else {
        sh = imgEl.naturalWidth / dstRatio;
        sy = (imgEl.naturalHeight - sh) / 2;
      }
      ctx.drawImage(imgEl, sx, sy, sw, sh, x, y, photoWpx, photoHpx);

      // Cut lines
      if (showCutLine) {
        ctx.strokeStyle = "rgba(180,180,180,0.8)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x, y, photoWpx, photoHpx);
        ctx.setLineDash([]);
      }
    }
  }

  return canvas.toDataURL("image/jpeg", 0.95);
}

export default function PrintLayoutTool() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [showCutLine, setShowCutLine] = useState(true);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    setResultUrl(null);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!imgRef.current) return;
    const url = generateLayout(imgRef.current, selectedPreset, BG_WHITE, showCutLine);
    setResultUrl(url);
  }, [selectedPreset, showCutLine]);

  const handlePresetChange = useCallback(
    (preset: LayoutPreset) => {
      setSelectedPreset(preset);
      setResultUrl(null);
    },
    []
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Preset selector */}
      <div
        style={{
          background: "var(--color-bg-subtle)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: 20,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", marginBottom: 14 }}>
          排版方案
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 10,
          }}
        >
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetChange(p)}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                border:
                  selectedPreset.id === p.id
                    ? "2px solid var(--color-primary)"
                    : "1px solid var(--color-border)",
                background:
                  selectedPreset.id === p.id
                    ? "var(--color-primary-light)"
                    : "var(--color-bg)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color:
                    selectedPreset.id === p.id
                      ? "var(--color-primary)"
                      : "var(--color-text)",
                  marginBottom: 4,
                }}
              >
                {p.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color:
                    selectedPreset.id === p.id
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                {p.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Options */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            id="cutline"
            checked={showCutLine}
            onChange={(e) => {
              setShowCutLine(e.target.checked);
              setResultUrl(null);
            }}
            style={{ width: 16, height: 16, cursor: "pointer" }}
          />
          <label
            htmlFor="cutline"
            style={{ fontSize: 13, color: "var(--color-text)", cursor: "pointer" }}
          >
            显示裁切线（打印后按线剪切）
          </label>
        </div>
      </div>

      {/* Upload */}
      {!imgUrl && <UploadZone onFile={handleFile} label="上传证件照（建议先换好底色再排版）" />}

      {/* Hidden img for canvas drawing */}
      {imgUrl && (
        <img
          ref={imgRef}
          src={imgUrl}
          alt=""
          crossOrigin="anonymous"
          onLoad={() => setResultUrl(null)}
          style={{ display: "none" }}
        />
      )}

      {/* Preview + controls */}
      {imgUrl && (
        <>
          <div style={{ textAlign: "center" }}>
            <label
              style={{
                cursor: "pointer",
                fontSize: 13,
                color: "var(--color-primary)",
                fontWeight: 600,
                textDecoration: "underline",
                marginRight: 20,
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

          {/* Photo preview */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 16,
              background: "var(--color-bg-subtle)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
            }}
          >
            <img
              src={imgUrl}
              alt="已上传"
              style={{
                width: 60,
                height: 84,
                objectFit: "cover",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", marginBottom: 4 }}>
                已上传证件照
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                将按「{selectedPreset.label}」方案排版，共 {selectedPreset.cols * selectedPreset.rows} 张
              </div>
            </div>
            <button
              onClick={handleGenerate}
              style={{
                marginLeft: "auto",
                background: "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(37,99,235,.3)",
              }}
            >
              🖨️ 生成排版
            </button>
          </div>
        </>
      )}

      {/* Result */}
      {resultUrl && (
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>
                排版结果 — {selectedPreset.label}
              </span>
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                }}
              >
                {MM2PX(selectedPreset.paperW)} × {MM2PX(selectedPreset.paperH)} px，300dpi
              </span>
            </div>
            <DownloadBtn
              url={resultUrl}
              filename={`证件照排版_${selectedPreset.label}.jpg`}
              label="下载高清排版图"
            />
          </div>
          <div
            style={{
              padding: 20,
              background: "#e5e5e5",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={resultUrl}
              alt="排版结果"
              style={{
                maxWidth: "100%",
                maxHeight: 480,
                boxShadow: "0 4px 20px rgba(0,0,0,.2)",
                display: "block",
              }}
            />
          </div>
          <div
            style={{
              padding: "12px 16px",
              background: "var(--color-bg-subtle)",
              fontSize: 12,
              color: "var(--color-text-muted)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            💡 打印建议：下载后发送至打印店，选择「{selectedPreset.paperW > 150 ? "A4纸" : "5寸相纸"}」，
            打印比例选「100%（实际尺寸）」，不要缩放。
          </div>
        </div>
      )}
    </div>
  );
}
