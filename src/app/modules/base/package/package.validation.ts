import { z } from "zod";
const FeatureSchema = z.object({
  title: z.string(),
});
const create = z.object({
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

export const package_validation = {
  create,
};
