import { ISubscription } from "./subscriptions.interface";
import { Subscription } from "./subscriptions.model";

const createSubscription = async (payload: ISubscription) => {
  const result = await Subscription.create(payload);

  return result;
};

export const subscriptionsService = {
  createSubscription,
};
