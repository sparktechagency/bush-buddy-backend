import { z } from "zod";
import { locationSchema } from "../../../common/helpers/zod.helper";

const create = z.object({
  file: z
    .object({
      fieldname: z.string().refine((val) => val === "image", {
        message: "Field name must be 'image'",
      }),
      originalname: z.string(), // The original file name
      encoding: z.string(),
      mimetype: z.string().refine((val) => val.startsWith("image/"), {
        message: "Only image files are allowed",
      }),
      buffer: z.any(), // Buffer should be present for file uploads
      size: z
        .number()
        .positive()
        .max(5000000, { message: "Image max langth will be 5MB" }), // Example: Max size 5MB
    })
    .optional(),
  body: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      location: locationSchema,
    })
    .strict(),
});

const update = z.object({
  file: z
    .object({
      fieldname: z.string().refine((val) => val === "image", {
        message: "Field name must be 'image'",
      }),
      originalname: z.string(), // The original file name
      encoding: z.string(),
      mimetype: z.string().refine((val) => val.startsWith("image/"), {
        message: "Only image files are allowed",
      }),
      buffer: z.any(), // Buffer should be present for file uploads
      size: z
        .number()
        .positive()
        .max(5000000, { message: "Image max langth will be 5MB" }), // Example: Max size 5MB
    })
    .optional(),
  body: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      location: locationSchema,
    })
    .strict(),
});

export const hunt_validation = {
  create,
  update,
};
