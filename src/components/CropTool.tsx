"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import UploadZone from "./UploadZone";
import DownloadBtn from "./DownloadBtn";
import { PHOTO_SIZES, SIZE_GROUPS, type PhotoSize } from "@/lib/photoSizes";

interface DragState {
  dragging: boolean;
  startX: number;
  startY: number;
  boxX: number;
  boxY: number;
}

export default function CropTool() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgNaturalW, setImgNaturalW] = useState(0);
  const [imgNaturalH, setImgNaturalH] = useState(0);
  const [displayW, setDisplayW] = useState(0);
  const [displayH, setDisplayH] = useState(0);
  const [selectedSize, setSelectedSize] = useState<PhotoSize>(PHOTO_SIZES[0]);
  const [activeGroup, setActiveGroup] = useState(SIZE_GROUPS[0]);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, w: 0, h: 0 }); // in display px
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({
    dragging: false,
    startX: 0,
    startY: 0,
    boxX: 0,
    boxY: 0,
  });

  // Compute initial crop box when image loads or size changes
  const computeCropBox = useCallback(
    (dW: number, dH: number, size: PhotoSize) => {
      const ratio = size.widthPx / size.heightPx;
      let boxW: number, boxH: number;
      if (dW / dH > ratio) {
        boxH = Math.min(dH * 0.85, dH);
        boxW = boxH * ratio;
      } else {
        boxW = Math.min(dW * 0.85, dW);
        boxH = boxW / ratio;
      }
      const x = (dW - boxW) / 2;
      const y = (dH - boxH) / 2;
      setCropBox({ x, y, w: boxW, h: boxH });
      setResultUrl(null);
    },
    []
  );

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    setResultUrl(null);
  }, []);

  const handleImgLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    setImgNaturalW(img.naturalWidth);
    setImgNaturalH(img.naturalHeight);
    setDisplayW(img.clientWidth);
    setDisplayH(img.clientHeight);
    computeCropBox(img.clientWidth, img.clientHeight, selectedSize);
  }, [selectedSize, computeCropBox]);

  useEffect(() => {
    if (displayW && displayH) {
      computeCropBox(displayW, displayH, selectedSize);
    }
  }, [selectedSize, displayW, displayH, computeCropBox]);

  // Drag to reposition crop box
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      dragRef.current = {
        dragging: true,
        startX: e.clientX,
        startY: e.clientY,
        boxX: cropBox.x,
        boxY: cropBox.y,
      };

      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current.dragging) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        const newX = Math.max(
          0,
          Math.min(dragRef.current.boxX + dx, displayW - cropBox.w)
        );
        const newY = Math.max(
          0,
          Math.min(dragRef.current.boxY + dy, displayH - cropBox.h)
        );
        setCropBox((prev) => ({ ...prev, x: newX, y: newY }));
      };

      const onUp = () => {
        dragRef.current.dragging = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [cropBox, displayW, displayH]
  );

  const handleCrop = useCallback(() => {
    if (!imgUrl || !imgNaturalW || !imgNaturalH) return;
    const scaleX = imgNaturalW / displayW;
    const scaleY = imgNaturalH / displayH;

    const canvas = document.createElement("canvas");
    canvas.width = selectedSize.widthPx;
    canvas.height = selectedSize.heightPx;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(
        img,
        cropBox.x * scaleX,
        cropBox.y * scaleY,
        cropBox.w * scaleX,
        cropBox.h * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      setResultUrl(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.src = imgUrl;
  }, [imgUrl, imgNaturalW, imgNaturalH, displayW, displayH, cropBox, selectedSize]);

  const sizesInGroup = PHOTO_SIZES.filter((s) => s.group === activeGroup);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {!imgUrl && <UploadZone onFile={handleFile} />}

      {imgUrl && (
        <>
          {/* Re-upload */}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 20,
              alignItems: "start",
            }}
          >
            {/* Image + crop overlay */}
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  marginBottom: 8,
                }}
              >
                拖动框选区域调整位置
              </div>
              <div
                ref={containerRef}
                style={{ position: "relative", display: "inline-block", lineHeight: 0 }}
              >
                <img
                  ref={imgRef}
                  src={imgUrl}
                  alt="原图"
                  onLoad={handleImgLoad}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 400,
                    display: "block",
                    userSelect: "none",
                  }}
                />
                {/* Dark overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,.5)",
                    pointerEvents: "none",
                  }}
                />
                {/* Crop box */}
                <div
                  onMouseDown={handleMouseDown}
                  style={{
                    position: "absolute",
                    left: cropBox.x,
                    top: cropBox.y,
                    width: cropBox.w,
                    height: cropBox.h,
                    border: "2px solid #fff",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,.5)",
                    cursor: "move",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Rule-of-thirds lines */}
                  {[1, 2].map((i) => (
                    <div
                      key={`v${i}`}
                      style={{
                        position: "absolute",
                        left: `${(i / 3) * 100}%`,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        background: "rgba(255,255,255,.35)",
                      }}
                    />
                  ))}
                  {[1, 2].map((i) => (
                    <div
                      key={`h${i}`}
                      style={{
                        position: "absolute",
                        top: `${(i / 3) * 100}%`,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: "rgba(255,255,255,.35)",
                      }}
                    />
                  ))}
                  {/* Corner handles */}
                  {["tl", "tr", "bl", "br"].map((c) => (
                    <div
                      key={c}
                      style={{
                        position: "absolute",
                        width: 10,
                        height: 10,
                        background: "#fff",
                        borderRadius: 2,
                        ...(c.includes("t") ? { top: -1 } : { bottom: -1 }),
                        ...(c.includes("l") ? { left: -1 } : { right: -1 }),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Size selector (right panel) */}
            <div
              style={{
                width: 200,
                background: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {/* Group tabs */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {SIZE_GROUPS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g)}
                    style={{
                      flex: "1 1 auto",
                      padding: "8px 4px",
                      fontSize: 11,
                      fontWeight: 600,
                      border: "none",
                      borderBottom:
                        activeGroup === g
                          ? "2px solid var(--color-primary)"
                          : "2px solid transparent",
                      background: "transparent",
                      color:
                        activeGroup === g
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Sizes list */}
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {sizesInGroup.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      background:
                        selectedSize.id === s.id
                          ? "var(--color-primary-light)"
                          : "transparent",
                      color:
                        selectedSize.id === s.id
                          ? "var(--color-primary)"
                          : "var(--color-text)",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: selectedSize.id === s.id ? 700 : 400,
                    }}
                  >
                    <div>{s.label}</div>
                    <div
                      style={{
                        fontSize: 11,
                        color:
                          selectedSize.id === s.id
                            ? "var(--color-primary)"
                            : "var(--color-text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {s.widthMm}×{s.heightMm}mm · {s.widthPx}×{s.heightPx}px
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Crop action */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={handleCrop}
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "12px 32px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(37,99,235,.3)",
              }}
            >
              ✂️ 确认裁剪
            </button>
            <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              将输出 {selectedSize.widthPx}×{selectedSize.heightPx}px（
              {selectedSize.widthMm}×{selectedSize.heightMm}mm，300dpi）
            </span>
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
              padding: "10px 16px",
              borderBottom: "1px solid var(--color-border)",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              裁剪结果 — {selectedSize.label}（{selectedSize.widthPx}×
              {selectedSize.heightPx}px）
            </span>
            <DownloadBtn
              url={resultUrl}
              filename={`证件照_${selectedSize.label}.jpg`}
              label="下载"
            />
          </div>
          <div style={{ padding: 16, background: "var(--color-bg-subtle)", textAlign: "center" }}>
            <img
              src={resultUrl}
              alt="裁剪结果"
              style={{ maxWidth: "100%", maxHeight: 300, border: "1px solid var(--color-border)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
