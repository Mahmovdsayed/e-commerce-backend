// No-op Redis implementation for Vercel deployment
// Redis is not available on Vercel's serverless functions
// This provides a compatible interface that does nothing

class NoOpRedis {
  async get(key: string): Promise<string | null> {
    return null; // Always return cache miss
  }

  async set(key: string, value: string): Promise<"OK"> {
    return "OK"; // Pretend it worked
  }

  async setex(key: string, seconds: number, value: string): Promise<"OK"> {
    return "OK"; // Pretend it worked
  }

  async del(...keys: string[]): Promise<number> {
    return keys.length; // Pretend we deleted them
  }

  on(event: string, callback: Function): this {
    // No-op event listener
    return this;
  }
}

const redis = new NoOpRedis();

export default redis;
