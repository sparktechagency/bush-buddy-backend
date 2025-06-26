import { Types } from "mongoose";
import { z } from "zod";

const createCategorySchema = z.object({
  file: z
    .object({
      fieldname: z.string().refine((val) => val === "image", {
        message: "Field name must be 'image'",
      }),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string().refine((val) => val.startsWith("image/"), {
        message: "Only image files are allowed",
      }),
      buffer: z.any(),
      size: z.number().positive().max(5000000),
    })
    .optional(),
  body: z
    .object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
      parent: z
        .object({
          isParent: z.boolean().optional(),
          parentCatId: z
            .string()
            .refine((val) => Types.ObjectId.isValid(val), {
              message: "Invalid parentCatId ObjectId",
            })
            .optional(),
        })
        .optional(),
    })
    .strict(),
});

const updateCategorySchema = z.object({
  file: z
    .object({
      fieldname: z.string().refine((val) => val === "image", {
        message: "Field name must be 'image'",
      }),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z
        .string()
        .refine((val) => val.startsWith("image/"), {
          message: "Only image files are allowed",
        })
        .optional(),
      buffer: z.any(),
      size: z.number().positive().max(5000000),
    })
    .optional(),
  body: z
    .object({
      name: z.string().min(1, "Name is required").optional(),
      description: z.string().optional(),
      parent: z
        .object({
          isParent: z.boolean().optional(),
          parentCatId: z
            .string()
            .refine((val) => Types.ObjectId.isValid(val), {
              message: "Invalid parentCatId ObjectId",
            })
            .optional(),
        })
        .optional(),
    })
    .strict(),
});

export const productCategoryValidator = {
  createCategorySchema,
  updateCategorySchema,
};
