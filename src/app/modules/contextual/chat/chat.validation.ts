import { z } from "zod";

const getChatSchema = z.object({
  body: z.object({
    partnerId: z.string(),
  }),
});

const addImages = z.object({
  files: z.object({
    images: z
      .array(
        z.object({
          fieldname: z.string().refine((val) => val === "images", {
            message: "Field name must be 'images'",
          }),
          originalname: z.string(),
          encoding: z.string(),
          mimetype: z.string().refine((val) => val.startsWith("image/"), {
            message: "Only image files are allowed",
          }),
          buffer: z.any(),
          size: z.number().positive().max(5000000, {
            message: "Each file must be less than 5MB",
          }),
        })
      )
      .max(5, { message: "You can upload up to 5 images only" })
      .min(1, { message: "At least one image is required" })
      .optional(),
  }),
  body: z.object({
    partnerId: z.string(),
  }),
});

export const chatValidator = {
  getChatSchema,
  addImages,
};
