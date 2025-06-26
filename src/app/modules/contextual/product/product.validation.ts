import { z } from "zod";
import { locationSchema, objectId } from "../../../common/helpers/zod.helper";

const productZodSchema = z.object({
  body: z
    .object({
      name: z.string({ required_error: "Product name is required" }).trim(),
      description: z
        .string({ required_error: "Description is required" })
        .trim(),
      owner: objectId,
      price: z
        .number({ required_error: "Price is required" })
        .nonnegative("Price must be greater than or equal to 0"),
      category: objectId,
      stock: z
        .number({ required_error: "Stock is required" })
        .int("Stock must be an integer")
        .nonnegative("Stock must be 0 or more"),
      brand: z.string({ required_error: "Brand is required" }).trim(),
      color: z.string({ required_error: "Color is required" }).trim(),
      condition: z.string({ required_error: "Condition is required" }),
      location: locationSchema,
    })
    .strict(),
});

const updateProductZodSchema = z.object({
  body: z
    .object({
      name: z.string().trim().optional(),
      description: z.string().trim().optional(),
      owner: objectId.optional(),
      price: z.number().nonnegative().optional(),
      category: objectId.optional(),
      stock: z.number().int().nonnegative().optional(),
      brand: z.string().trim().optional(),
      color: z.string().trim().optional(),
      condition: z.string().optional(),
      location: locationSchema.optional(),
    })
    .strict(),
});

export const product_validation = {
  productZodSchema,
  updateProductZodSchema,
};
