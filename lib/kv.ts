import { Redis } from "@upstash/redis"

// Initialize Upstash Redis client using standard KV environment variables
export const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})
