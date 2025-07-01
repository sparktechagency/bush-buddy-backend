import { ObjectId } from "mongoose";
import { ISubscription } from "./subscriptions.interface";
import { Subscription } from "./subscriptions.model";

const createSubscription = async (payload: ISubscription) => {
  const result = await Subscription.create(payload);

  return result;
};

const updateSubscription = async (subId: ObjectId, payload: ISubscription) => {
  const result = await Subscription.findByIdAndUpdate(subId, payload);

  return result;
};

const getSubscription = async () => {
  const result = await Subscription.find({
    isDelete: false,
    status: "active",
  });

  return result;
};

export const subscriptionsService = {
  createSubscription,
  updateSubscription,
  getSubscription,
};
