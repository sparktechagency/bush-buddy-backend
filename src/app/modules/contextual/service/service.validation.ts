import { z } from "zod";
import { locationSchema, objectId } from "../../../common/helpers/zod.helper";

const serviceZodSchema = z.object({
  body: z
    .object({
      name: z.string({ required_error: "service name is required" }).trim(),
      description: z
        .string({ required_error: "Description is required" })
        .trim(),
      owner: objectId,
      price: z
        .number({ required_error: "Price is required" })
        .nonnegative("Price must be greater than or equal to 0"),
      category: objectId,
      phone: z.string(),

      location: locationSchema,
    })
    .strict(),
});

const updateServiceZodSchema = z.object({
  body: z
    .object({
      name: z.string().trim().optional(),
      description: z.string().trim().optional(),
      owner: objectId.optional(),
      price: z.number().nonnegative().optional(),
      category: objectId.optional(),
      phone: z.string().optional(),
      location: locationSchema.optional(),
    })
    .strict(),
});

export const service_validation = {
  serviceZodSchema,
  updateServiceZodSchema,
};
