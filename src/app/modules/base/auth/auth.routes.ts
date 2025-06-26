import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authValidator } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(authValidator.loginValidationSchema),
  authController.loginUser
);

router.post(
  "/send-otp-for-verify-email",
  validateRequest(authValidator.verifyEmailSchema),
  authController.sendOtpForVerifyEmail
);

router.post(
  "/verify-user-by-otp",
  validateRequest(authValidator.verifyOTPSchema),
  authController.verifyUser
);

router.post(
  "/change-password",
  auth(USER_ROLE.USER, USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(authValidator.changePasswordValidationSchema),
  authController.changePassword
);

router.post(
  "/forgot-password",
  validateRequest(authValidator.forgotPasswordValidationsSchema),
  authController.forgotPassword
);

router.patch(
  "/verify-otp",
  validateRequest(authValidator.verifyOTPSchema),
  authController.verifyOTP
);

router.patch(
  "/reset-password",
  validateRequest(authValidator.resetPasswordValidationSchema),
  authController.resetPassword
);

router.post(
  "/refresh-token",
  validateRequest(authValidator.refreshTokenValidationSchema),
  authController.refreshToken
);

router.delete(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.USER),
  authController.deleteMe
);

export const authRouter = router;
