/**
 * React hook for browser-side background removal via ONNX Runtime Web.
 *
 * Manages: ORT initialization → model download → inference → result blob.
 * Falls back to server API (/api/remove-bg) if WASM is unavailable.
 */

"use client";

import { useCallback, useRef, useState } from "react";
import {
  MODELS,
  DEFAULT_MODEL,
  WASM_CDN_BASE,
  type ModelKey,
} from "./constants";
import { downloadModel, isModelCached } from "./idb";
import { preprocessImage, applyMaskAsAlpha, loadImage } from "./pipeline";

export type RemoveBgStatus =
  | "idle"
  | "loading-model"
  | "processing"
  | "done"
  | "error";

export interface RemoveBgProgress {
  text: string;
  pct: number;
}

interface UseRemoveBgReturn {
  /** Run background removal on a File, returns transparent PNG Blob */
  removeBg: (file: File) => Promise<Blob>;
  status: RemoveBgStatus;
  progress: RemoveBgProgress;
  /** Whether the selected model is already cached in IndexedDB */
  modelCached: boolean;
  /** Check cache status (call on mount) */
  checkCache: () => Promise<void>;
  /** Current model key */
  modelKey: ModelKey;
  /** Switch model */
  setModelKey: (key: ModelKey) => void;
}

export function useRemoveBg(): UseRemoveBgReturn {
  const [status, setStatus] = useState<RemoveBgStatus>("idle");
  const [progress, setProgress] = useState<RemoveBgProgress>({ text: "", pct: 0 });
  const [modelCached, setModelCached] = useState(false);
  const [modelKey, setModelKeyState] = useState<ModelKey>(DEFAULT_MODEL);

  // Cache the ORT module and inference session across calls.
  // We use `any` for the session ref because InferenceSession is a factory
  // type (not a class constructor) and extracting its return type is unwieldy.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ortRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionRef = useRef<any>(null);
  const sessionModelRef = useRef<ModelKey | null>(null);

  const checkCache = useCallback(async () => {
    const cached = await isModelCached(modelKey);
    setModelCached(cached);
  }, [modelKey]);

  const setModelKey = useCallback((key: ModelKey) => {
    setModelKeyState(key);
    // Invalidate session if model changed
    if (sessionModelRef.current !== key) {
      sessionRef.current = null;
      sessionModelRef.current = null;
    }
    // Check cache for new model
    isModelCached(key).then(setModelCached).catch(() => setModelCached(false));
  }, []);

  const removeBg = useCallback(
    async (file: File): Promise<Blob> => {
      const startTime = performance.now();

      try {
        // ── 1. Initialize ONNX Runtime ──────────────────────────────
        if (!ortRef.current) {
          setStatus("loading-model");
          setProgress({ text: "正在加载推理引擎…", pct: 5 });

          const ort = await import("onnxruntime-web");
          ort.env.wasm.wasmPaths = WASM_CDN_BASE;
          ort.env.wasm.numThreads = 1;
          ortRef.current = ort;
        }

        const ort = ortRef.current;

        // ── 2. Get or create inference session ──────────────────────
        if (!sessionRef.current || sessionModelRef.current !== modelKey) {
          setStatus("loading-model");
          setProgress({ text: "正在下载 AI 模型…", pct: 10 });

          const modelBuffer = await downloadModel(modelKey, (pct) => {
            setProgress({
              text: pct < 100 ? `正在下载模型（${pct}%）…` : "模型下载完成",
              pct: 10 + Math.round(pct * 0.4), // 10-50%
            });
          });

          setProgress({ text: "正在初始化模型…", pct: 55 });

          const session = await ort.InferenceSession.create(modelBuffer, {
            executionProviders: ["wasm"],
          });

          sessionRef.current = session;
          sessionModelRef.current = modelKey;
          setModelCached(true);
        }

        // ── 3. Preprocess ───────────────────────────────────────────
        setStatus("processing");
        setProgress({ text: "正在预处理图片…", pct: 60 });

        const objectUrl = URL.createObjectURL(file);
        let img: HTMLImageElement;
        try {
          img = await loadImage(objectUrl);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }

        const { data, width, height } = preprocessImage(img);

        // ── 4. Run inference ────────────────────────────────────────
        setProgress({ text: "🤖 AI 抠图中…", pct: 70 });

        const inputName = MODELS[modelKey].inputType;
        const tensor = new ort.Tensor("float32", data, [1, 3, 1024, 1024]);
        const feeds: Record<string, typeof tensor> = { [inputName]: tensor };

        const results = await sessionRef.current!.run(feeds);

        // Get first output tensor (mask)
        const outputKey = Object.keys(results)[0];
        const maskTensor = results[outputKey];
        const maskData = maskTensor.data as Float32Array;

        // ── 5. Apply mask as alpha ──────────────────────────────────
        setProgress({ text: "正在生成透明图…", pct: 90 });

        const blob = await applyMaskAsAlpha(maskData, img, width, height);

        const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
        setProgress({ text: `✅ 完成（${elapsed}s）`, pct: 100 });
        setStatus("done");

        return blob;
      } catch (err) {
        setStatus("error");
        const msg = err instanceof Error ? err.message : "未知错误";
        setProgress({ text: `❌ ${msg}`, pct: 0 });
        throw err;
      }
    },
    [modelKey],
  );

  return {
    removeBg,
    status,
    progress,
    modelCached,
    checkCache,
    modelKey,
    setModelKey,
  };
}
