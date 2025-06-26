import { z } from "zod";

const updateAdminValidationSchema = z.object({
  file: z
    .object({
      fieldname: z.string().refine((val) => val === "profileImage", {
        message: "Field name must be 'profileImage'",
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
      firstName: z.string().optional(),
      surName: z.string().optional(),
      location: z.string().optional(),
      locationName: z.string().optional(),
    })
    .strict(),
});

export const overviewValidator = {
  updateAdminValidationSchema,
};
