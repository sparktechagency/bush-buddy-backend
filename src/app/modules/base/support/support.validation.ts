import { z } from "zod";

const createSupportSchema = z.object({
  body: z.object({
    subject: z.string().min(1, { message: "Subject is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  }),
});

export const supportValidation = {
  createSupportSchema,
};
