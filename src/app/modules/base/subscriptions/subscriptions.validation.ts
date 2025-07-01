import { z } from "zod";

const FeatureSchema = z.object({
  title: z.string(),
});

const createSubscriptionSchema = z.object({
  body: z
    .object({
      title: z.string(),
      description: z.string(),
      amount: z.number(),
      features: z.array(FeatureSchema),
      duration: z.enum(["monthly", "yearly"]),
      services: z.array(z.string()),
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
      services: z.array(z.string()).optional(),
      type: z.enum(["basic", "premium", "advanced"]).optional(),
    })
    .strict(),
});

export const subscriptionsValidator = {
  createSubscriptionSchema,
  updateSubscriptionSchema,
};
