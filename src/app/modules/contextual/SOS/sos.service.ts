import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import redis from "../../../common/utils/redis/redis";
import AppError from "../../../core/error/AppError";
import { ISos } from "./sos.interface";
import { Sos } from "./sos.model";

const SOS_CACHE_KEY = "sos:all";

const createSos = async (payload: ISos) => {
  const sos = await Sos.find({
    user: new mongoose.Types.ObjectId(String(payload.user)),
  });

  if (sos.length >= 3) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have allready 3 sos!!");
  }
  const res = await Sos.create(payload);

  await redis.set(`sos:${res._id}`, JSON.stringify(res), "EX", 3600);

  await redis.del(SOS_CACHE_KEY);

  return res;
};

const getSos = async () => {
  const cached = await redis.get(SOS_CACHE_KEY);

  if (cached) {
    return JSON.parse(cached);
  }
  const res = await Sos.find({ isActive: true });

  await redis.set(SOS_CACHE_KEY, JSON.stringify(res), "EX", 3600);

  return res;
};

const getMySos = async (myId: ObjectId) => {
  const cacheKey = `sos:${myId.toString()}`;

  // 1. Try to get from Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Fetch from MongoDB
  const result = await Sos.find({
    user: new mongoose.Types.ObjectId(String(myId)),
    isActive: true,
  });

  // 3. Save in Redis (5 minutes = 300 seconds)
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  return result;
};

const updateSos = async (sosId: ObjectId, payload: Partial<ISos>) => {
  const res = await Sos.findByIdAndUpdate(sosId, payload, { new: true });

  if (res) {
    await redis.del(SOS_CACHE_KEY);
  }

  return res;
};

const deactivateSos = async (sosId: ObjectId) => {
  const res = await Sos.findByIdAndUpdate(
    sosId,
    { isActive: false },
    { new: true }
  );

  if (res) {
    await redis.del(SOS_CACHE_KEY);
  }

  return res;
};

export const sos_service = {
  createSos,
  getSos,
  getMySos,
  updateSos,
  deactivateSos,
};
