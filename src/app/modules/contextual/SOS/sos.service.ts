import { ObjectId } from "mongoose";
import redis from "../../../common/utils/redis/redis";
import { ISos } from "./sos.interface";
import { Sos } from "./sos.model";

const SOS_CACHE_KEY = "sos:all";

const createSos = async (payload: ISos) => {
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
  updateSos,
  deactivateSos,
};
