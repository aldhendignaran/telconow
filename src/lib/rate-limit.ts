// Rate limiting for login attempts — keyed by email.
// When UPSTASH_REDIS_REST_URL is not set (local dev), all requests pass through.
// Wire Upstash env vars before deploying to production.

export async function checkLoginRateLimit(email: string): Promise<boolean> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return true;
  }

  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "15 m"),
  });

  const { success } = await ratelimit.limit(`login:${email.toLowerCase()}`);
  return success;
}
