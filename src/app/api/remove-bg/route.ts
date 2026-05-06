import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const API_KEY = process.env.BAIDU_API_KEY;
const SECRET_KEY = process.env.BAIDU_SECRET_KEY;

const MAX_BYTES = 4 * 1024 * 1024;

function toBase64(buf: ArrayBuffer): string {
  if (buf.byteLength > MAX_BYTES) {
    throw new Error("图片超过 4MB，请先压缩后再上传");
  }
  return Buffer.from(buf).toString("base64");
}

// Module-level token cache — reused within the same warm serverless instance
let tokenCache: { token: string; expiresAt: number } | null = null;
let inflightToken: Promise<string> | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token;
  // Coalesce concurrent cold-start requests into a single token fetch
  if (inflightToken) return inflightToken;

  inflightToken = (async () => {
    const res = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token` +
        `?grant_type=client_credentials` +
        `&client_id=${API_KEY}` +
        `&client_secret=${SECRET_KEY}`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(`Baidu auth error: ${data.error_description}`);
    tokenCache = {
      token: data.access_token,
      // Tokens are valid 30 days; refresh 1 day early
      expiresAt: Date.now() + (data.expires_in - 86400) * 1000,
    };
    inflightToken = null;
    return tokenCache.token;
  })();

  return inflightToken;
}

export async function POST(req: NextRequest) {
  // Config check
  if (!API_KEY || !SECRET_KEY) {
    return NextResponse.json(
      { error: "BAIDU_API_KEY / BAIDU_SECRET_KEY 未配置" },
      { status: 500 }
    );
  }

  // Rate limit by IP — protect Baidu API quota from abuse
  const ip = getClientIp(req);
  const rl = await checkRateLimit(ip);
  if (!rl.success) {
    const retryAfter = Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000));
    return NextResponse.json(
      { error: `请求过于频繁，请 ${retryAfter} 秒后再试` },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(rl.reset),
          "Retry-After": String(retryAfter),
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    // Accept either multipart/form-data or raw binary
    let imageBase64: string;

    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("image") as File | null;
      if (!file) {
        return NextResponse.json({ error: "缺少 image 字段" }, { status: 400 });
      }
      imageBase64 = toBase64(await file.arrayBuffer());
    } else {
      // Raw binary — for mini-program POST
      imageBase64 = toBase64(await req.arrayBuffer());
    }

    const token = await getAccessToken();

    // Call Baidu 人像分割
    const baiduRes = await fetch(
      `https://aip.baidubce.com/rest/2.0/image-classify/v1/body_seg?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `image=${encodeURIComponent(imageBase64)}`,
      }
    );

    if (!baiduRes.ok) {
      return NextResponse.json(
        { error: `百度 API 请求失败: ${baiduRes.status}` },
        { status: 502 }
      );
    }

    const baiduData = await baiduRes.json();

    if (baiduData.error_code) {
      // Baidu error codes: https://ai.baidu.com/ai-doc/BODY/Fk3cpyt9z
      return NextResponse.json(
        { error: `百度 API 错误 ${baiduData.error_code}: ${baiduData.error_msg}` },
        { status: 502 }
      );
    }

    // `foreground` is a base64-encoded PNG with transparent background
    const foregroundBase64: string = baiduData.foreground;
    if (!foregroundBase64) {
      return NextResponse.json(
        { error: "百度 API 未返回前景图" },
        { status: 502 }
      );
    }

    const pngBuf = Buffer.from(foregroundBase64, "base64");

    return new NextResponse(pngBuf, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(pngBuf.byteLength),
        "Cache-Control": "no-store",
        // Allow mini-program cross-origin
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "未知错误";
    console.error("[remove-bg]", msg);
    const status = msg.includes("超过 4MB") ? 413 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

// Mini-program preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
