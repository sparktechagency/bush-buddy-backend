import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import redis from "../../../common/utils/redis/redis";
import AppError from "../../../core/error/AppError";
import { ISubscription } from "./subscriptions.interface";
import { Subscription } from "./subscriptions.model";

// Updated cache key name to match the filtered data
const cacheKey = "subscriptions:active";

const createSubscription = async (payload: ISubscription) => {
  const result = await Subscription.create(payload);

  // Cache individual subscription
  await redis.set(`subscription:${result._id}`, JSON.stringify(result));

  // Invalidate list cache
  await redis.del(cacheKey);

  return result;
};

const updateSubscription = async (subId: ObjectId, payload: ISubscription) => {
  const result = await Subscription.findByIdAndUpdate(subId, payload, {
    new: true,
  });

  // Invalidate cache for all and individual item
  await redis.del(cacheKey);
  await redis.del(`subscription:${subId}`);

  return result;
};

const getSubscription = async () => {
  // Try from Redis
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Fetch from DB
  const result = await Subscription.find({
    isDeleted: false,
    status: "active",
  });

  // Save to Redis
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600); // expire after 1 hour (optional)

  return result;
};

const deleteSubscription = async (subId: ObjectId) => {
  const hunt = await Subscription.findOne({
    _id: subId,
    isDeleted: false, // fixed the field name here
  });

  if (!hunt) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Subscription is not found in database!"
    );
  }

  const result = await Subscription.findByIdAndUpdate(
    subId,
    { isDelete: true }, // fixed field name
    { new: true }
  );

  // Invalidate caches
  await redis.del(cacheKey);
  await redis.del(`subscription:${subId}`);

  return result;
};

export const subscriptionsService = {
  createSubscription,
  updateSubscription,
  getSubscription,
  deleteSubscription,
};
