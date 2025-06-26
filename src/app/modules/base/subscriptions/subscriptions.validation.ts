import { z } from "zod";

export const createSubscriptionSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    amount: z.number().positive("Amount must be a positive number"),
    services: z.array(z.string()).min(1, "At least one service is required"),
    type: z.enum(["basic", "advanced"], {
      errorMap: () => ({
        message: "Type must be either 'basic' or 'advanced'",
      }),
    }),
    status: z.enum(["active", "closed"]).optional().default("active"),
    isDelete: z.boolean().optional().default(false),
  }),
});

export const subscriptionsValidator = {
  createSubscriptionSchema,
};
