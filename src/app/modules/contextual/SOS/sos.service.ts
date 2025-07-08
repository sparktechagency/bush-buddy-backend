/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import redis from "../../../common/utils/redis/redis";
import { sendEmail } from "../../../common/utils/sendEmail/sendEmail";
import AppError from "../../../core/error/AppError";
import { ISos } from "./sos.interface";
import { Sos } from "./sos.model";

const SOS_CACHE_KEY = "sos:all";

const createSos = async (payload: ISos) => {
  const sos = await Sos.find({
    user: new mongoose.Types.ObjectId(String(payload.user)),
  });

  if (sos.length >= 3) {
    throw new AppError(httpStatus.BAD_REQUEST, "You already have 3 SOS!!");
  }

  const res = await Sos.create(payload);

  await redis.set(`sos:${res._id}`, JSON.stringify(res), "EX", 3600);
  await redis.del(SOS_CACHE_KEY);
  await redis.del(`sos:${payload.user.toString()}`); // ইউজার ক্যাশ মুছে ফেলা

  return res;
};

const getSos = async () => {
  const cached: any = await redis.get(SOS_CACHE_KEY);
  if (JSON.parse(cached)?.length !== 0) {
    return JSON.parse(cached);
  }

  const res = await Sos.find({ isActive: true });

  await redis.set(SOS_CACHE_KEY, JSON.stringify(res), "EX", 3600);

  return res;
};

const getMySos = async (myId: ObjectId) => {
  const cacheKey = `sos:${myId.toString()}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const result = await Sos.find({
    user: new mongoose.Types.ObjectId(String(myId)),
    isActive: true, // Ensure only active ones are returned
  });

  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  return result;
};

const updateSos = async (sosId: ObjectId, payload: Partial<ISos>) => {
  const res = await Sos.findByIdAndUpdate(sosId, payload, { new: true });

  if (res) {
    await redis.del(SOS_CACHE_KEY);
    await redis.del(`sos:${res.user.toString()}`); // ইউজার স্পেসিফিক ক্যাশ ডিলিট
  }

  return res;
};

const deactivateSos = async (sosId: ObjectId, userId: ObjectId) => {
  const existingSos = await Sos.findOne({ _id: sosId, user: userId });

  if (!existingSos) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "SOS not found for the given user"
    );
  }

  const res = await Sos.findOneAndUpdate(
    { _id: sosId, user: userId },
    { isActive: false },
    { new: true }
  );

  if (res) {
    const userCacheKey = `sos:${userId.toString()}`;
    await redis.del(SOS_CACHE_KEY); // delete general cache
    await redis.del(userCacheKey); // delete user-specific cache
  }

  return res;
};

const sendSosMail = async (myId: ObjectId, location: string) => {
  if (!location) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Location is missing in query URL"
    );
  }

  const sosList: any[] = await Sos.find({
    user: myId,
    isActive: true,
  })
    .populate({
      path: "user",
    })
    .select("email user -_id");

  const emails = sosList
    .map((sos: any) => sos?.email)
    .filter((email: string | undefined) => !!email);

  const userName = sosList[0]?.user?.name || "Your Contact";

  await Promise.all(
    emails.map((email) =>
      sendEmail(
        email,
        `Urgent Alert: ${userName} May Be in Danger at ${location}`,
        `Dear Concern,

We would like to inform you that ${userName} may be in a potentially risky situation at the following location: ${location}.

This alert has been triggered for safety purposes, and immediate attention may be required. If you are able to reach out or assist in any way, please do so promptly.

We are continuously monitoring the situation and will keep you updated if more information becomes available.

Stay safe,
The Security Monitoring Team`
      )
    )
  );
};

export const sos_service = {
  createSos,
  getSos,
  getMySos,
  updateSos,
  deactivateSos,
  sendSosMail,
};
