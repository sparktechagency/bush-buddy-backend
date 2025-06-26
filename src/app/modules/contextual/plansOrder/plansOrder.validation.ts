import { ObjectId } from "mongodb";
import { z } from "zod";

const plansOrderSchema = z.object({
  buyer: z.instanceof(ObjectId),
  plan: z.instanceof(ObjectId),
  paymentMethod: z.string(),
  amount: z.number().positive(),
  transactionId: z.string(),
  status: z.enum(["pending", "completed"]),
  isDeleted: z.boolean(),
});

export const plansOrderValidator = {
  plansOrderSchema,
};
