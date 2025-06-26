import { z } from "zod";

const patValidationSchema = z.object({
  body: z.object({
    body: z.string({ required_error: "Body is required and must be a bigint" }),
  }),
});

export const patValidator = {
  patValidationSchema,
};
