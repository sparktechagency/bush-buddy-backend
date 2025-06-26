import mongoose from "mongoose";
import { z } from "zod";

// ✅ ObjectId validation helper
export const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

export const locationSchema = z.object({
  type: z.literal("Point", {
    errorMap: () => ({ message: 'Location type must be "Point"' }),
  }),
  coordinates: z
    .array(z.number())
    .length(2, { message: "Coordinates must be an array of two numbers" }),
});
