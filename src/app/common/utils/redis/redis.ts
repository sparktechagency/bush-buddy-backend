// // redis.ts
// import Redis from "ioredis";

// const redis = new Redis({ host: "127.0.0.1", port: 6379 }); // Default port

// export default redis;

import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

const redis = {
  get: async (key: string) => await redisClient.get(key),

  set: async (key: string, value: string) => {
    await redisClient.set(key, value);
  },

  setWithExpiry: async (key: string, value: string, ttlInSeconds: number) => {
    await redisClient.set(key, value, { EX: ttlInSeconds });
  },

  del: async (key: string) => {
    await redisClient.del(key);
  },

  disconnect: async () => {
    await redisClient.disconnect();
  },
};

export default redis;
