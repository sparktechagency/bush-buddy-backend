import { User } from "../../base/user/user.model";
import { IPlansOrder } from "./plansOrder.interface";
import { PlansOrder } from "./plansOrder.model";

const createOrder = async (payload: IPlansOrder) => {
  const result = await PlansOrder.create(payload);
  await User.findByIdAndUpdate(payload.buyer, {
    "verification.verified": true,
  });
  return result;
};

export const plansOrderService = {
  createOrder,
};
