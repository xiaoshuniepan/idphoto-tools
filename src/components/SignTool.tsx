"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import DownloadBtn from "./DownloadBtn";

interface Point { x: number; y: number; }

const PEN_COLORS = [
  { label: "黑色", value: "#000000" },
  { label: "蓝色", value: "#1a56db" },
  { label: "红色", value: "#e02424" },
];

export default function SignTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(3);
  const [isEmpty, setIsEmpty] = useState(true);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const lastPoint = useRef<Point | null>(null);

  // Set canvas size on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    setIsEmpty(false);
    setResultUrl(null);
    lastPoint.current = pos;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, penSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = penColor;
    ctx.fill();
  }, [getPos, penColor, penSize]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    if (!pos || !lastPoint.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPoint.current = pos;
  }, [isDrawing, getPos, penColor, penSize]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
    lastPoint.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    setResultUrl(null);
  }, []);

  const exportSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Export with transparent background
    setResultUrl(canvas.toDataURL("image/png"));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          padding: 16,
          background: "var(--color-bg-subtle)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        {/* Pen color */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
            颜色
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {PEN_COLORS.map((c) => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => setPenColor(c.value)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: c.value,
                  border: penColor === c.value ? "3px solid var(--color-primary)" : "2px solid var(--color-border)",
                  cursor: "pointer",
                  transform: penColor === c.value ? "scale(1.15)" : "scale(1)",
                  transition: "transform .1s",
                }}
              />
            ))}
            <input
              type="color"
              value={penColor}
              onChange={(e) => setPenColor(e.target.value)}
              title="自定义颜色"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "2px solid var(--color-border)",
                cursor: "pointer",
                padding: 2,
              }}
            />
          </div>
        </div>

        {/* Pen size */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
            粗细
          </span>
          {[2, 3, 5, 8].map((s) => (
            <button
              key={s}
              onClick={() => setPenSize(s)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                border: penSize === s ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                background: penSize === s ? "var(--color-primary-light)" : "var(--color-bg)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: s * 2,
                  height: s * 2,
                  borderRadius: "50%",
                  background: penColor,
                }}
              />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={clearCanvas}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              fontSize: 13,
              color: "var(--color-text-muted)",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            清除
          </button>
          <button
            onClick={exportSignature}
            disabled={isEmpty}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: isEmpty ? "#e2e8f0" : "var(--color-primary)",
              color: isEmpty ? "var(--color-text-muted)" : "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: isEmpty ? "not-allowed" : "pointer",
            }}
          >
            生成签名
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        style={{
          position: "relative",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "2px solid var(--color-border)",
          background: "#fff",
          userSelect: "none",
        }}
      >
        {isEmpty && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>✍️</span>
            <span style={{ fontSize: 14, color: "#cbd5e1" }}>在此处手写签名</span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          style={{
            display: "block",
            width: "100%",
            height: 200,
            cursor: "crosshair",
            touchAction: "none",
          }}
        />
        {/* Baseline guide */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 32,
            right: 32,
            height: 1,
            background: "#e2e8f0",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Tips */}
      <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: 0, textAlign: "center" }}>
        💡 手机用户可直接用手指书写 · 导出为透明背景 PNG，可叠加到文档上
      </p>

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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--color-bg-subtle)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>
              签名预览（透明背景）
            </span>
            <DownloadBtn url={resultUrl} filename="我的签名.png" label="下载 PNG" />
          </div>
          {/* Checkerboard to show transparency */}
          <div
            style={{
              padding: 20,
              backgroundImage:
                "linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0,0 10px,10px -10px,-10px 0px",
              textAlign: "center",
            }}
          >
            <img
              src={resultUrl}
              alt="签名"
              style={{ maxWidth: "100%", maxHeight: 160, display: "inline-block" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
