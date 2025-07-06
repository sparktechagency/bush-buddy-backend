/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { ObjectId } from "mongoose";
import redis from "../../../common/utils/redis/redis";
import AppError from "../../../core/error/AppError";
import { User } from "../user/user.model";
import { stripe, subscription_payment } from "./subscription.payment";
import { ISubscription } from "./subscriptions.interface";
import { Subscription } from "./subscriptions.model";

const cacheKey = "subscriptions:active";
const getSubscriptionKey = (id: mongoose.Types.ObjectId) =>
  `subscription:${id.toString()}`;
const EXPIRE_TIME = 3600; // 1 hour

const createSubscription = async (payload: ISubscription) => {
  const result = await Subscription.create(payload);

  // Cache single item
  await redis.setWithExpiry(
    getSubscriptionKey(result._id),
    JSON.stringify(result),
    EXPIRE_TIME
  );

  // Invalidate the list cache
  await redis.del(cacheKey);

  return result;
};

const updateSubscription = async (
  subId: mongoose.Types.ObjectId,
  payload: ISubscription
) => {
  const result = await Subscription.findByIdAndUpdate(subId, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found!");
  }

  // Update individual cache and invalidate list
  await redis.del(cacheKey);
  await redis.setWithExpiry(
    getSubscriptionKey(subId),
    JSON.stringify(result),
    EXPIRE_TIME
  );

  return result;
};

const getSubscription = async () => {
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const result = await Subscription.find({
    isDeleted: false,
    status: "active",
  });

  await redis.setWithExpiry(cacheKey, JSON.stringify(result), EXPIRE_TIME);

  return result;
};

const deleteSubscription = async (subId: mongoose.Types.ObjectId) => {
  const hunt = await Subscription.findOne({
    _id: subId,
    isDeleted: false,
  });

  if (!hunt) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Subscription is not found in database!"
    );
  }

  const result = await Subscription.findByIdAndUpdate(
    subId,
    { isDeleted: true }, // ✅ Fixed field name
    { new: true }
  );

  // Invalidate caches
  await redis.del(cacheKey);
  await redis.del(getSubscriptionKey(subId));

  return result;
};

const paymentASubscription = async (
  serviceId: ObjectId,
  vendorId: ObjectId
) => {
  if (!serviceId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Service ID is required in params"
    );
  }

  const subscription: ISubscription | any = await Subscription.findOne({
    _id: serviceId,
    status: "active",
  });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  const { currency, amount } = subscription;
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  const user: any = await User.isUserExistById(vendorId);

  if (user.payment.status === "paid") {
    throw new AppError(httpStatus.BAD_REQUEST, "User already paid");
  }

  return await subscription_payment.createStripeSubscriptionSession(
    amount,
    {
      id: vendorId as any,
      subscriptionID: serviceId as any,
      deadline: subscription.duration.count,
      deadlineType: subscription.duration.durationType,
      issuedAt: new Date(),
      email: user.email,
      name: user.name,
    },
    currency || "usd"
  );
};

const paymentSuccessStripe = async (payload: any) => {
  if (!payload.session_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
  }

  const session = await stripe.checkout.sessions.retrieve(payload.session_id, {
    expand: ["line_items", "customer"],
  });

  const subscriptionID = session.metadata?.subscriptionID || null;

  if (session.client_reference_id) {
    const userId = session.client_reference_id as string;
    const deadline = Number(session.metadata!.deadline);

    const user = await User.isUserExistById(userId as any);

    if (user?.payment?.status === "paid") {
      throw new AppError(httpStatus.BAD_REQUEST, "User is already paid");
    }

    await User.findByIdAndUpdate(userId, {
      $set: {
        "payment.status": "paid",
        "payment.amount": session.amount_total ?? 0,
        "payment.deadline": deadline || 0,
        "payment.deadlineType": session.metadata!.deadlineType || null,
        "payment.issuedAt": session.metadata!.issuedAt || new Date(),
        "payment.subscription": subscriptionID,
      },
    });
  }

  return session;
};

export const subscriptionsService = {
  createSubscription,
  updateSubscription,
  getSubscription,
  deleteSubscription,
  paymentASubscription,
  paymentSuccessStripe,
};

// import httpStatus from "http-status";
// import { ObjectId } from "mongoose";
// import redis from "../../../common/utils/redis/redis";
// import AppError from "../../../core/error/AppError";
// import { ISubscription } from "./subscriptions.interface";
// import { Subscription } from "./subscriptions.model";

// // Updated cache key name to match the filtered data
// const cacheKey = "subscriptions:active";

// const createSubscription = async (payload: ISubscription) => {
//   const result = await Subscription.create(payload);

//   // Cache individual subscription
//   await redis.set(`subscription:${result._id}`, JSON.stringify(result));

//   // Invalidate list cache
//   await redis.del(cacheKey);

//   return result;
// };

// const updateSubscription = async (subId: ObjectId, payload: ISubscription) => {
//   const result = await Subscription.findByIdAndUpdate(subId, payload, {
//     new: true,
//   });

//   // Invalidate cache for all and individual item
//   await redis.del(cacheKey);
//   await redis.del(`subscription:${subId}`);

//   return result;
// };

// const getSubscription = async () => {
//   // Try from Redis
//   const cachedData = await redis.get(cacheKey);
//   if (cachedData) {
//     return JSON.parse(cachedData);
//   }

//   // Fetch from DB
//   const result = await Subscription.find({
//     isDeleted: false,
//     status: "active",
//   });

//   // Save to Redis
//   await redis.set(cacheKey, JSON.stringify(result)); // expire after 1 hour (optional)

//   return result;
// };

// const deleteSubscription = async (subId: ObjectId) => {
//   const hunt = await Subscription.findOne({
//     _id: subId,
//     isDeleted: false, // fixed the field name here
//   });

//   if (!hunt) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "Subscription is not found in database!"
//     );
//   }

//   const result = await Subscription.findByIdAndUpdate(
//     subId,
//     { isDelete: true }, // fixed field name
//     { new: true }
//   );

//   // Invalidate caches
//   await redis.del(cacheKey);
//   await redis.del(`subscription:${subId}`);

//   return result;
// };

// export const subscriptionsService = {
//   createSubscription,
//   updateSubscription,
//   getSubscription,
//   deleteSubscription,
// };
