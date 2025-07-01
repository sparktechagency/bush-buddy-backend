import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import AppError from "../../../core/error/AppError";
import { ISubscription } from "./subscriptions.interface";
import { Subscription } from "./subscriptions.model";

const createSubscription = async (payload: ISubscription) => {
  const result = await Subscription.create(payload);

  return result;
};

const updateSubscription = async (subId: ObjectId, payload: ISubscription) => {
  const result = await Subscription.findByIdAndUpdate(subId, payload, {
    new: true,
  });

  return result;
};

const getSubscription = async () => {
  const result = await Subscription.find({
    isDelete: false,
    status: "active",
  });

  return result;
};

const deleteSubscription = async (subId: ObjectId) => {
  const hunt = await Subscription.findOne({ _id: subId, isDeleted: false });

  if (!hunt) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Subscription is not not found in database!"
    );
  }

  const result = await Subscription.findByIdAndUpdate(
    subId,
    { isDeleted: true },
    {
      new: true,
    }
  );

  return result;
};
export const subscriptionsService = {
  createSubscription,
  updateSubscription,
  getSubscription,
  deleteSubscription,
};
