import { z } from "zod";

const createFoodReviewSchema = z.object({
  body: z
    .object({
      seller: z.string().regex(/^[a-f\d]{24}$/i, {
        message:
          "Seller id must be a valid MongoDB ObjectId (24-character hex string)",
      }),
      professionalism: z
        .number()
        .min(0)
        .max(5)
        .refine((val) => Number.isFinite(val), {
          message: "Professionalism rating must be a number between 0 and 5.",
        }),
      timelines: z
        .number()
        .min(0)
        .max(5)
        .refine((val) => Number.isFinite(val), {
          message: "Timeliness rating must be a number between 0 and 5.",
        }),
      qualityOfService: z
        .number()
        .min(0)
        .max(5)
        .refine((val) => Number.isFinite(val), {
          message:
            "Quality of Service rating must be a number between 0 and 5.",
        }),
      cleanliness: z
        .number()
        .min(0)
        .max(5)
        .refine((val) => Number.isFinite(val), {
          message: "Cleanliness rating must be a number between 0 and 5.",
        }),

      valueForMoney: z.enum(["yes", "no", ""]).optional(),
      photo: z.string().url("Add Photo must be a valid URL").optional(),
      // tips: z
      //   .object({
      //     amount: z.number().min(0, "Tip amount must be at least 0"),
      //     method: z.string().min(1, "Tip method is required"),
      //     transactionId: z.string().min(1, "Transaction ID is required"),
      //     date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      //       message: "Invalid date format for tip date",
      //     }),
      //   })
      //   .optional(),
      comments: z.string().min(1, "Comments cannot be empty"),
      updatedAt: z.date().default(() => new Date()),
      isDeleted: z.boolean().default(false).optional(),
    })
    .strict(),
});

const makeDisputeSchema = z.object({
  body: z.object({
    reason: z.string(),
    explanation: z.string(),
    photo: z.string().optional(),
  }),
});

export const reviewValidator = {
  createFoodReviewSchema,
  makeDisputeSchema,
};
