"use client";

import type { RemoveBgProgress, RemoveBgStatus } from "@/lib/onnx/useRemoveBg";

interface ModelProgressProps {
  status: RemoveBgStatus;
  progress: RemoveBgProgress;
}

export default function ModelProgress({ status, progress }: ModelProgressProps) {
  if (status === "idle" || status === "done") return null;

  const isError = status === "error";
  const barColor = isError ? "#ef4444" : "#2563eb";
  const bgColor = isError ? "#fee2e2" : "#eff6ff";
  const textColor = isError ? "#991b1b" : "#2563eb";

  return (
    <div
      style={{
        padding: "12px 20px",
        borderRadius: "var(--radius-md)",
        background: bgColor,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: textColor,
          textAlign: "center",
        }}
      >
        {progress.text}
      </div>

      {!isError && progress.pct > 0 && progress.pct < 100 && (
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress.pct}%`,
              background: barColor,
              borderRadius: 3,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}
    </div>
  );
}
