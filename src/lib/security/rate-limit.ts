/**
 * Rate Limiting and Anti-Bot Safeguards for DPGU ACM Student Chapter.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter(t => now - t < 15 * 60 * 1000);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 15 * 60 * 1000).unref();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * In-memory sliding window rate limiter per client key (e.g. IP).
 * @param key Identifier such as client IP address
 * @param limit Max allowed requests within window (default: 5)
 * @param windowMs Time window in milliseconds (default: 10 minutes)
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter out timestamps outside the active sliding window
  record.timestamps = record.timestamps.filter(t => t > windowStart);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetTime = oldest + windowMs;
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetTime,
    };
  }

  // Record new attempt
  record.timestamps.push(now);
  const remaining = Math.max(0, limit - record.timestamps.length);
  const resetTime = now + windowMs;

  return {
    allowed: true,
    limit,
    remaining,
    resetTime,
  };
}

/**
 * Resets rate limit records for testing purposes.
 */
export function resetRateLimits() {
  rateLimitStore.clear();
}

/**
 * Anti-Bot Honeypot validator.
 * Legitimate users leave the hidden honeypot field blank.
 * Bots auto-populating all form fields will trigger rejection.
 */
export function validateHoneypot(honeypotValue?: string | null): boolean {
  if (!honeypotValue) return true;
  return honeypotValue.trim() === '';
}

/**
 * Normalizes email address by trimming whitespace and converting to lowercase.
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Extracts client IP address from standard Next.js request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  return '127.0.0.1';
}
