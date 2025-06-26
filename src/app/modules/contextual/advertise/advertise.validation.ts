import { z } from "zod";

const createAdvertise = z.object({
  files: z
    .object({
      photos: z
        .array(
          z.object({
            fieldname: z.string().refine((val) => val === "photos", {
              message: "Field name must be 'photos'",
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
    })
    .optional(),

  body: z
    .object({
      description: z.string().min(1),
      categoryId: z.string().optional(),
      discount: z.number().min(0).max(100).optional(),
      startDate: z.string(),
      endDate: z.string(),
    })
    .strict(),
});

export const advertiseValidator = {
  createAdvertise,
};
