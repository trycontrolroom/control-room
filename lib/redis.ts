export interface RateLimitConfig {
  key: string
  limit: number
  window: number // in seconds
}

export class RedisService {
  private client: any = null

  constructor() {
    this.client = {
      get: async (key: string) => null,
      set: async (key: string, value: string, ex?: number) => 'OK',
      incr: async (key: string) => 1,
      expire: async (key: string, seconds: number) => 1,
      del: async (key: string) => 1
    }
  }

  async checkRateLimit(config: RateLimitConfig): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const key = `rate_limit:${config.key}`
      const current = await this.client.get(key)
      
      if (!current) {
        await this.client.set(key, '1', config.window)
        return { allowed: true, remaining: config.limit - 1 }
      }
      
      const count = parseInt(current)
      if (count >= config.limit) {
        return { allowed: false, remaining: 0 }
      }
      
      await this.client.incr(key)
      return { allowed: true, remaining: config.limit - count - 1 }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      return { allowed: true, remaining: config.limit }
    }
  }

  async cachePolicy(policyId: string, data: any, ttl: number = 300): Promise<void> {
    try {
      const key = `policy:${policyId}`
      await this.client.set(key, JSON.stringify(data), ttl)
    } catch (error) {
      console.error('Failed to cache policy:', error)
    }
  }

  async getCachedPolicy(policyId: string): Promise<any | null> {
    try {
      const key = `policy:${policyId}`
      const data = await this.client.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to get cached policy:', error)
      return null
    }
  }

  async invalidatePolicy(policyId: string): Promise<void> {
    try {
      const key = `policy:${policyId}`
      await this.client.del(key)
    } catch (error) {
      console.error('Failed to invalidate policy:', error)
    }
  }
}

export const redis = new RedisService()
