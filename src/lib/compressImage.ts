/**
 * Client-side image compression — keeps uploads under Baidu API's 4MB ceiling
 * and reduces network/API cost for everyone else.
 *
 * Strategy:
 *   1. If the file is already small enough, return as-is.
 *   2. Otherwise downscale longest edge to MAX_DIMENSION.
 *   3. Re-encode as JPEG, stepping quality down until under TARGET_BYTES.
 */

const TARGET_BYTES = 3.5 * 1024 * 1024; // Stay safely under Baidu's 4MB limit
const MAX_DIMENSION = 2400; // 2400px is plenty for ID photos / portraits
const QUALITY_STEPS = [0.92, 0.85, 0.78, 0.7, 0.6, 0.5];

export async function compressImageIfNeeded(file: File): Promise<File> {
  if (file.size <= TARGET_BYTES) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Some formats (HEIC on non-Safari) can't be decoded — let server reject with a clear error
    return file;
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("浏览器不支持 Canvas 2D");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const outName = file.name.replace(/\.[^./\\]+$/, "") + ".jpg";

  for (const quality of QUALITY_STEPS) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob.size <= TARGET_BYTES) {
      return new File([blob], outName, { type: "image/jpeg" });
    }
  }

  // Fallback: return the most aggressive version even if still oversized —
  // server will return a clear 413 if it actually exceeds 4MB.
  const fallback = await canvasToBlob(canvas, QUALITY_STEPS[QUALITY_STEPS.length - 1]);
  return new File([fallback], outName, { type: "image/jpeg" });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("图片压缩失败"))),
      "image/jpeg",
      quality
    );
  });
}
