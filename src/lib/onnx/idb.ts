/**
 * IndexedDB helpers for caching ONNX model binaries.
 *
 * Flow: first use downloads model from HuggingFace (~25-115 MB),
 * writes to IndexedDB, subsequent uses load instantly from cache.
 */

import { IDB_NAME, IDB_STORE, IDB_VERSION, MODELS, type ModelKey } from "./constants";

const MODEL_FETCH_TIMEOUT_MS = 10 * 60 * 1000; // 10 min
const MODEL_STALL_TIMEOUT_MS = 30 * 1000; // 30s no data = stall

/* ── Low-level IndexedDB operations ────────────────────────────────── */

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const getFromIDB = (
  db: IDBDatabase,
  key: string,
): Promise<ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve((req.result as ArrayBuffer) ?? null);
    req.onerror = () => reject(req.error);
  });

const saveToIDB = (
  db: IDBDatabase,
  key: string,
  buf: ArrayBuffer,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    const req = tx.objectStore(IDB_STORE).put(buf, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

/* ── Public API ────────────────────────────────────────────────────── */

/** Check if a model is already cached (for showing UI status). */
export const isModelCached = async (modelKey: ModelKey): Promise<boolean> => {
  try {
    const db = await openDB();
    const buf = await getFromIDB(db, MODELS[modelKey].cacheKey);
    return buf !== null;
  } catch {
    return false;
  }
};

/**
 * Ensure the ONNX model binary is available locally.
 *
 * 1. Check IndexedDB cache → return immediately on hit.
 * 2. Stream-download from HuggingFace with byte-level progress.
 * 3. Persist to IndexedDB for future use.
 */
export const downloadModel = async (
  modelKey: ModelKey,
  onProgress: (pct: number) => void,
): Promise<ArrayBuffer> => {
  const { url, cacheKey } = MODELS[modelKey];
  const db = await openDB();

  // Cache hit
  const cached = await getFromIDB(db, cacheKey);
  if (cached) {
    onProgress(100);
    return cached;
  }

  // Stream download
  const controller = new AbortController();
  const fetchTimeout = setTimeout(() => controller.abort(), MODEL_FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: { Accept: "*/*" },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`模型下载失败: ${res.status} ${res.statusText}`);
    }

    // Fallback for no streaming support
    if (!res.body) {
      const buf = await res.arrayBuffer();
      await saveToIDB(db, cacheKey, buf);
      onProgress(100);
      return buf;
    }

    const total = parseInt(res.headers.get("Content-Length") ?? "0", 10);
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    const readWithStallDetection = async () => {
      let stallTimer: ReturnType<typeof setTimeout> | undefined;
      try {
        return await Promise.race([
          reader.read(),
          new Promise<never>((_, reject) => {
            stallTimer = setTimeout(
              () => reject(new Error("下载停滞，请检查网络连接")),
              MODEL_STALL_TIMEOUT_MS,
            );
          }),
        ]);
      } finally {
        if (stallTimer) clearTimeout(stallTimer);
      }
    };

    while (true) {
      const { done, value } = await readWithStallDetection();
      if (done) break;

      chunks.push(value);
      received += value.length;

      if (total > 0) {
        onProgress(Math.min(99, Math.round((received / total) * 100)));
      } else {
        onProgress(Math.min(95, Math.round(chunks.length * 1.5)));
      }
    }

    // Assemble
    const merged = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    const arrayBuffer = merged.buffer as ArrayBuffer;
    await saveToIDB(db, cacheKey, arrayBuffer);
    onProgress(100);
    return arrayBuffer;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new Error(`模型下载超时（${Math.round(MODEL_FETCH_TIMEOUT_MS / 1000)}秒）`);
    }
    throw err;
  } finally {
    clearTimeout(fetchTimeout);
  }
};
