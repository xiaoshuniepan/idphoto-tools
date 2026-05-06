/**
 * Rate limiting via Upstash Redis (sliding window).
 *
 * Fails open if Upstash is not configured — keeps local dev / setup-in-progress
 * working without surprise 429s. Production should set both env vars.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        // 5 requests per minute per IP — generous for humans, harsh for scripts
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: false,
        prefix: "rl:remove-bg",
      })
    : null;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!ratelimit) {
    // Not configured — fail open with sentinel values
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
  return ratelimit.limit(identifier);
}

/** Extract best-effort client IP from request headers (Vercel sets x-forwarded-for). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
