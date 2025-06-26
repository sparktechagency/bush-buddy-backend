/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import redis from "./redis";

export const generateCacheKey = (
  baseKey: string,
  query: Record<string, any>
) => {
  const queryString = JSON.stringify(query);
  const hash = crypto.createHash("md5").update(queryString).digest("hex");
  return `${baseKey}:${hash}`;
};

// utility to delete cache by pattern
export const deleteCacheByPattern = async (pattern: string) => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(keys);
  }
};
