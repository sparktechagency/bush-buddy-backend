/* eslint-disable no-console */
// src/common/utils/redis/redis.ts

import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

const redis = {
  /**
   * Get value from Redis by key
   * @param key Redis key
   */
  get: async (key: string): Promise<string | null> => {
    return await redisClient.get(key);
  },

  /**
   * Set value to Redis (without expiry)
   * @param key Redis key
   * @param value Value as string
   */
  set: async (key: string, value: string): Promise<void> => {
    await redisClient.set(key, value);
  },

  /**
   * Set value to Redis with expiration time
   * @param key Redis key
   * @param value Value as string
   * @param ttlInSeconds Time to live in seconds
   */
  setWithExpiry: async (
    key: string,
    value: string,
    ttlInSeconds: number
  ): Promise<void> => {
    await redisClient.set(key, value, {
      EX: ttlInSeconds, // Set expiration
    });
  },

  /**
   * Delete key from Redis
   * @param key Redis key
   */
  del: async (key: string): Promise<void> => {
    await redisClient.del(key);
  },

  /**
   * Disconnect the Redis client (optional for graceful shutdown)
   */
  disconnect: async () => {
    await redisClient.disconnect();
  },
};

export default redis;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import crypto from "crypto";
// import redis from "./redis";

// export const generateCacheKey = (
//   baseKey: string,
//   query: Record<string, any>
// ) => {
//   const queryString = JSON.stringify(query);
//   const hash = crypto.createHash("md5").update(queryString).digest("hex");
//   return `${baseKey}:${hash}`;
// };

// // utility to delete cache by pattern
// export const deleteCacheByPattern = async (pattern: string) => {
//   const keys = await redis.keys(pattern);
//   if (keys.length > 0) {
//     await redis.del(keys);
//   }
// };
