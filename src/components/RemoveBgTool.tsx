"use client";

import { useState, useCallback, useEffect } from "react";
import UploadZone from "./UploadZone";
import DownloadBtn from "./DownloadBtn";
import { removeBg } from "@/lib/removeBg";
import { compressImageIfNeeded } from "@/lib/compressImage";
import { checkerboard } from "@/lib/styles";

type Status = "idle" | "processing" | "done" | "error";

export default function RemoveBgTool() {
  const [status, setStatus] = useState<Status>("idle");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setOriginalUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
    setResultUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setErrorMsg(null);
    setStatus("processing");

    try {
      const compressed = await compressImageIfNeeded(file);
      const blob = await removeBg(compressed);
      setResultUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "未知错误");
      setStatus("error");
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {!originalUrl && <UploadZone onFile={handleFile} />}

      {originalUrl && (
        <div style={{ textAlign: "center" }}>
          <label style={{ cursor: "pointer", fontSize: 13, color: "var(--color-primary)", fontWeight: 600, textDecoration: "underline" }}>
            重新上传
            <input type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
          </label>
        </div>
      )}

      {status === "processing" && (
        <div style={{ textAlign: "center", padding: "12px 20px", borderRadius: "var(--radius-md)", background: "#eff6ff", color: "#2563eb", fontSize: 14, fontWeight: 600 }}>
          🤖 AI 抠图中，请稍候…
        </div>
      )}
      {status === "error" && (
        <div style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", background: "#fee2e2", border: "1px solid #fca5a5", fontSize: 13, color: "#991b1b" }}>
          ❌ {errorMsg}
        </div>
      )}

      {originalUrl && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--color-border)", fontSize: 13, fontWeight: 600, color: "var(--color-text-muted)", background: "var(--color-bg-subtle)" }}>
              原图
            </div>
            <div style={{ padding: 12 }}>
              <img src={originalUrl} alt="原图" style={{ width: "100%", maxHeight: 360, objectFit: "contain", display: "block" }} />
            </div>
          </div>

          <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--color-border)", fontSize: 13, fontWeight: 600, color: "var(--color-text-muted)", background: "var(--color-bg-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>去背景后（透明 PNG）</span>
              {resultUrl && <DownloadBtn url={resultUrl} filename="抠图结果.png" label="下载 PNG" />}
            </div>
            <div style={{ padding: 12, minHeight: 120, ...checkerboard() }}>
              {resultUrl ? (
                <img src={resultUrl} alt="抠图结果" style={{ width: "100%", maxHeight: 360, objectFit: "contain", display: "block" }} />
              ) : (
                <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 14 }}>
                  {status === "processing" ? "处理中…" : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {resultUrl && (
        <div style={{ textAlign: "center" }}>
          <DownloadBtn url={resultUrl} filename="抠图结果.png" label="下载透明 PNG" />
        </div>
      )}

      <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: 0, textAlign: "center" }}>
        💡 输出为透明背景 PNG · 可搭配<a href="/change-bg" style={{ color: "var(--color-primary)" }}>换底色工具</a>替换任意背景
      </p>
    </div>
  );
}
