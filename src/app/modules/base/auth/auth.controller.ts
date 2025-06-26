import httpStatus from "http-status";

import catchAsync from "../../../common/utils/catchAsync";
import sendResponse from "../../../common/utils/sendResponse";
import { CONFIG } from "../../../core/config";
import { authService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    secure: CONFIG.CORE.node_env === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: { accessToken: result.accessToken, user: result.user },
  });
});

const sendOtpForVerifyEmail = catchAsync(async (req, res) => {
  const result = await authService.sendOtpForVerifyEmail(req.body.email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "OTP send your email for verify your account",
    data: result,
  });
});

const verifyUser = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  const result = await authService.verifyUser(req.body.otp, token as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User verified successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await authService.changePassword(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgotPassword(req?.body?.email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Link send successfully",
    data: result,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  const result = await authService.verifyOtp(req.body, token as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "OTP match successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  const result = await authService.resetPassword(req.body, token as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved successfully!",
    data: result,
  });
});

const deleteMe = catchAsync(async (req, res) => {
  // return;
  const result = await authService.deleteMe(req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${req.user.role && "User"} deleted successfully!`,
    data: result,
  });
});

export const authController = {
  loginUser,
  sendOtpForVerifyEmail,
  verifyUser,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  verifyOTP,
  deleteMe,
};
