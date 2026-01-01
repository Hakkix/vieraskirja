/**
 * Simple in-memory rate limiter
 *
 * For production use with multiple instances, consider using Redis-based
 * rate limiting like @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up old entries every minute to prevent memory leaks
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (e.g., IP address)
   * @returns Object with success status and remaining requests
   */
  check(identifier: string): {
    success: boolean;
    remaining: number;
    resetAt: number;
  } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // If no entry or entry has expired, create a new one
    if (!entry || now >= entry.resetAt) {
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });

      return {
        success: true,
        remaining: this.maxRequests - 1,
        resetAt: now + this.windowMs,
      };
    }

    // Check if limit has been exceeded
    if (entry.count >= this.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    // Increment counter
    entry.count += 1;

    return {
      success: true,
      remaining: this.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now >= entry.resetAt) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for a specific identifier (useful for testing)
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Clear all rate limit entries
   */
  clear(): void {
    this.requests.clear();
  }
}

// Create rate limiter instances
// Post creation: 5 posts per 15 minutes per IP
export const postCreationLimiter = new RateLimiter(5, 15 * 60 * 1000);

// General API: 100 requests per minute per IP (for other endpoints if needed)
export const generalLimiter = new RateLimiter(100, 60 * 1000);

/**
 * Get client IP from request headers
 * Checks common headers used by proxies and load balancers
 */
export function getClientIp(headers: Headers): string {
  // Check common headers in order of preference
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get("cf-connecting-ip"); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback
  return "unknown";
}
