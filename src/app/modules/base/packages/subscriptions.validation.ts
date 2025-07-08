import { z } from "zod";

const FeatureSchema = z.object({
  title: z.string(),
});

const createSubscriptionSchema = z.object({
  body: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      amount: z.number(),
      features: z.array(FeatureSchema),
      duration: z.enum(["monthly", "yearly"]),
      type: z.enum(["basic", "premium", "advanced"]),
    })
    .strict(),
});

const updateSubscriptionSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      amount: z.number().optional(),
      features: z.array(FeatureSchema).optional(),
      duration: z.enum(["monthly", "yearly"]).optional(),
      type: z.enum(["basic", "premium", "advanced"]).optional(),
    })
    .strict(),
});

export const subscriptionsValidator = {
  createSubscriptionSchema,
  updateSubscriptionSchema,
};
