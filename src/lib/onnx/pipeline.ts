/**
 * ONNX inference pipeline for background removal.
 *
 * Handles the full cycle: image → tensor → inference → mask → alpha composite.
 * Runs entirely in the browser via onnxruntime-web (WASM backend).
 */

import { INFERENCE_SIZE } from "./constants";

/* ── Preprocessing ─────────────────────────────────────────────────── */

/**
 * Resize image to INFERENCE_SIZE² and normalize pixel values to [0, 1].
 * Returns a Float32Array in CHW format (channels-first) shaped [1, 3, H, W].
 */
export function preprocessImage(
  img: HTMLImageElement | ImageBitmap,
): { data: Float32Array; width: number; height: number } {
  const canvas = document.createElement("canvas");
  canvas.width = INFERENCE_SIZE;
  canvas.height = INFERENCE_SIZE;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(img, 0, 0, INFERENCE_SIZE, INFERENCE_SIZE);
  const { data: rgba } = ctx.getImageData(0, 0, INFERENCE_SIZE, INFERENCE_SIZE);

  const pixelCount = INFERENCE_SIZE * INFERENCE_SIZE;
  const float32 = new Float32Array(3 * pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    const ri = i * 4;
    float32[i] = rgba[ri] / 255;                    // R
    float32[i + pixelCount] = rgba[ri + 1] / 255;   // G
    float32[i + 2 * pixelCount] = rgba[ri + 2] / 255; // B
  }

  return {
    data: float32,
    width: "naturalWidth" in img ? img.naturalWidth : img.width,
    height: "naturalHeight" in img ? img.naturalHeight : img.height,
  };
}

/* ── Postprocessing ────────────────────────────────────────────────── */

/**
 * Take the raw model output (mask), apply sigmoid if needed, and composite
 * with the original image as an alpha channel.
 *
 * Returns a Blob (PNG with transparency).
 */
export function applyMaskAsAlpha(
  maskData: Float32Array,
  originalImg: HTMLImageElement | ImageBitmap,
  originalWidth: number,
  originalHeight: number,
): Promise<Blob> {
  // Draw original at native resolution
  const canvas = document.createElement("canvas");
  canvas.width = originalWidth;
  canvas.height = originalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(originalImg, 0, 0, originalWidth, originalHeight);

  const imageData = ctx.getImageData(0, 0, originalWidth, originalHeight);
  const pixels = imageData.data;

  // Resize mask from INFERENCE_SIZE² to original dimensions
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = INFERENCE_SIZE;
  maskCanvas.height = INFERENCE_SIZE;
  const maskCtx = maskCanvas.getContext("2d")!;

  // Write mask values as grayscale pixels
  const maskImageData = maskCtx.createImageData(INFERENCE_SIZE, INFERENCE_SIZE);
  const maskPixels = maskImageData.data;
  const maskLen = INFERENCE_SIZE * INFERENCE_SIZE;

  // Detect if sigmoid is needed (values outside [0, 1])
  let needsSigmoid = false;
  for (let i = 0; i < Math.min(1000, maskData.length); i++) {
    if (maskData[i] < -0.01 || maskData[i] > 1.01) {
      needsSigmoid = true;
      break;
    }
  }

  for (let i = 0; i < maskLen; i++) {
    let v = maskData[i];
    if (needsSigmoid) v = 1 / (1 + Math.exp(-v));
    const byte = Math.round(Math.max(0, Math.min(1, v)) * 255);
    const j = i * 4;
    maskPixels[j] = byte;
    maskPixels[j + 1] = byte;
    maskPixels[j + 2] = byte;
    maskPixels[j + 3] = 255;
  }
  maskCtx.putImageData(maskImageData, 0, 0);

  // Scale mask to original resolution
  const scaledMaskCanvas = document.createElement("canvas");
  scaledMaskCanvas.width = originalWidth;
  scaledMaskCanvas.height = originalHeight;
  const scaledCtx = scaledMaskCanvas.getContext("2d")!;
  scaledCtx.drawImage(maskCanvas, 0, 0, originalWidth, originalHeight);

  const scaledMask = scaledCtx.getImageData(0, 0, originalWidth, originalHeight);
  const scaledData = scaledMask.data;

  // Apply mask as alpha channel
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i + 3] = scaledData[i]; // R channel of grayscale mask = alpha
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
    );
  });
}

/* ── Load image helper ─────────────────────────────────────────────── */

export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = src;
  });
