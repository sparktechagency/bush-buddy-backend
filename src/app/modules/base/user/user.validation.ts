import { z } from "zod";

// Zod schema for the user
const createUserValidationSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "First name is required",
        })
        .trim(),

      profileImage: z
        .string()
        .url()
        .optional()
        .default(
          "https://res.cloudinary.com/dyalzfwd4/image/upload/v1738207704/user_wwrref.png"
        )
        .optional(),

      email: z
        .string({
          required_error: "Email is required",
        })
        .email("Invalid email format"),
      contactNumber: z.string().optional(),

      password: z
        .string({
          required_error: "Password is required",
        })
        .min(8, "Password must be at least 8 characters long"),

      confirmPassword: z.string({
        required_error: "Confirm password is required",
      }),

      fcmToken: z.string().optional(),

      location: z
        .object({
          type: z.literal("Point").optional(),
          coordinates: z.array(z.number()).length(2).optional(), // [longitude, latitude]
        })
        .optional(),
      locationName: z.string().optional(),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }),
});
const updateUserValidationSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "First name is required",
        })
        .trim()
        .optional(),

      profileImage: z
        .string()
        .url()
        .optional()
        .default(
          "https://res.cloudinary.com/dyalzfwd4/image/upload/v1738207704/user_wwrref.png"
        )
        .optional(),

      // email: z
      //   .string({
      //     required_error: "Email is required",
      //   })
      //   .email("Invalid email format"),

      // contactNumber: z.string().optional(),

      // password: z
      //   .string({
      //     required_error: "Password is required",
      //   })
      //   .min(8, "Password must be at least 8 characters long"),

      // confirmPassword: z.string({
      //   required_error: "Confirm password is required",
      // }),

      fcmToken: z.string().optional(),

      location: z
        .object({
          type: z.literal("Point").optional(),
          coordinates: z.array(z.number()).length(2).optional(), // [longitude, latitude]
        })
        .optional(),
      locationName: z.string().optional(),
    })
    .strict(),
});

export const userValidator = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
