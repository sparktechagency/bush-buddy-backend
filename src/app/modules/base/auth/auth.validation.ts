import { z } from "zod";
import { CONFIG } from "../../../core/config";

const loginValidationSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[0-9]/, "Password must include at least one number")
        .regex(/[\W_]/, "Password must include at least one special character"),

      fcmToken: z.string().optional(),
    })
    .strict(),
});

const verifyEmailSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email address"),
    })
    .strict(),
});

const changePasswordValidationSchema = z.object({
  body: z
    .object({
      oldPassword: z.string().min(8, "Password must be at least 8 characters"),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[0-9]/, "Password must include at least one number")
        .regex(/[\W_]/, "Password must include at least one special character"),
      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    })
    .strict(),
});

const forgotPasswordValidationsSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is must be required" })
        .email("Invalid email address"),
    })
    .strict(),
});

const resetPasswordValidationSchema = z.object({
  body: z
    .object({
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[0-9]/, "Password must include at least one number")
        .regex(/[\W_]/, "Password must include at least one special character"),
      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    })
    .strict(),
});

const verifyOTPSchema = z.object({
  body: z
    .object({
      otp: z
        .string({
          required_error: "OTP (One Time Password) is required",
        })
        .length(
          Number(CONFIG.MAIL.otp_length) || 4,
          `OTP must be exactly ${CONFIG.MAIL.otp_length || 4} characters long`
        ),
    })
    .strict(),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const authValidator = {
  loginValidationSchema,
  verifyEmailSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationsSchema,
  resetPasswordValidationSchema,
  refreshTokenValidationSchema,
  verifyOTPSchema,
};
