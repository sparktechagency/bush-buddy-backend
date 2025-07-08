import { ITips } from "./tips.interface";
import { TipsAndTricks } from "./tips.model";

const createTips = async (payload: ITips) => {
  // sourcery skip: inline-immediately-returned-variable
  const result = await TipsAndTricks.create(payload);
  return result;
};

export const tips_service = {
  createTips,
};
