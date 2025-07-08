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

const sendSosMail = async (myId: ObjectId, location: string) => {
  if (!location) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "location is missing in query url"
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

  // Example: extract emails to send
  const emails = sosList
    .map((sos: any) => sos?.email)
    .filter((email: string | undefined) => !!email);

  emails.map((email) => {
    sendEmail(
      email,
      `Urgent Alert: ${sosList[0]?.user?.name} May Be in Danger at ${location}`,
      `Dear Concern,

We would like to inform you that ${sosList[0]?.user?.name} may be in a potentially risky situation at the following location: ${location}.

This alert has been triggered for safety purposes, and immediate attention may be required. If you are able to reach out or assist in any way, please do so promptly.

We are continuously monitoring the situation and will keep you updated if more information becomes available.

Stay safe,
The Security Monitoring Team`
    );
  });
};

export const sos_service = {
  createSos,
  getSos,
  getMySos,
  updateSos,
  deactivateSos,
  sendSosMail,
};
