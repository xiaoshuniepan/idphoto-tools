/**
 * ONNX model registry — only Apache-2.0 / MIT licensed models.
 *
 * Models are downloaded from HuggingFace on first use and cached in IndexedDB.
 * The WASM runtime is loaded from jsdelivr CDN (not bundled).
 */

export interface ModelConfig {
  url: string;
  cacheKey: string;
  label: string;
  description: string;
  size: string;
  license: string;
  /** Name of the input tensor — varies by model architecture */
  inputType: string;
}

export type ModelKey =
  | "ormbg_quantized"
  | "modnet_quantized"
  | "birefnet_lite_fp16";

export const MODELS: Record<ModelKey, ModelConfig> = {
  ormbg_quantized: {
    url: "https://huggingface.co/onnx-community/ormbg-ONNX/resolve/main/onnx/model_quantized.onnx",
    cacheKey: "ormbg_quantized_v1",
    label: "ORMBG（推荐）",
    description: "速度与质量的最佳平衡，适合绝大多数场景",
    size: "~44 MB",
    license: "Apache-2.0",
    inputType: "pixel_values",
  },
  modnet_quantized: {
    url: "https://huggingface.co/Xenova/modnet/resolve/main/onnx/model_quantized.onnx",
    cacheKey: "modnet_quantized_v1",
    label: "MODNet（轻量）",
    description: "最小最快，专为人像优化，适合低端设备",
    size: "~25 MB",
    license: "Apache-2.0",
    inputType: "pixel_values",
  },
  birefnet_lite_fp16: {
    url: "https://huggingface.co/onnx-community/BiRefNet_lite-ONNX/resolve/main/onnx/model_fp16.onnx",
    cacheKey: "birefnet_lite_fp16_v2",
    label: "BiRefNet Lite（高精度）",
    description: "边缘精度最高，适合复杂背景和细节要求高的场景",
    size: "~115 MB",
    license: "MIT",
    inputType: "input_image",
  },
};

export const DEFAULT_MODEL: ModelKey = "ormbg_quantized";

/** All models use 1024×1024 input */
export const INFERENCE_SIZE = 1024;

export const IDB_NAME = "IDPhotoModelDB";
export const IDB_STORE = "models";
export const IDB_VERSION = 1;

export const WASM_CDN_BASE =
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/";
