import redis from "../../../../common/utils/redis/redis";

// Cache busting function - delete all keys with prefix
export const bustProductCategoryCache = async () => {
  const keys = await redis.keys("productCategories:*");
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};
