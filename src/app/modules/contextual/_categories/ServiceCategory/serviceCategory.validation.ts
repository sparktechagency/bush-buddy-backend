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
      name: z.string().min(2).max(50),
      status: z.enum(["active", "inactive"]).optional(),
      description: z.string().min(10).max(1000).optional(),
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
      name: z.string().min(2).max(50).optional(),
      status: z.enum(["active", "inactive"]).optional(),
      description: z.string().min(10).max(1000).optional(),
    })
    .strict(),
});

export const categoryValidator = {
  createCategorySchema,
  updateCategorySchema,
};
