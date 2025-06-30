/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

import { generateOTP } from "../../../common/utils/generate.otp";
import { sendEmail } from "../../../common/utils/sendEmail/sendEmail";
import { sendEmailWithLink } from "../../../common/utils/sendEmail/sendEmailWithLink";
import { CONFIG } from "../../../core/config";
import AppError from "../../../core/error/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import {
  IOtpToken,
  IResetPassPayload,
  IUserChangePassword,
  IUserLogin,
} from "./auth.interface";

const loginUser = async (payload: IUserLogin) => {
  await User.isUserExistByEmail(payload?.email);

  const user: IUser | any = await User.findOne({
    email: payload?.email,
  }).select("+password");

  // If user not found
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // If user not found
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Verify password
  const comparePassword = await bcrypt.compare(
    payload.password,
    user?.password as string
  );

  if (!comparePassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Password don't match!");
  }

  // Update FCM token if provided
  let updatedUser = user;
  if (payload.fcmToken) {
    updatedUser = await User.findOneAndUpdate(
      { email: payload.email },
      { fcmToken: payload.fcmToken },
      { new: true }
    );
  }

  // Create JWT payload
  const jwtPayload = {
    id: updatedUser._id,
    email: updatedUser.email,
    role: updatedUser.role,
  };

  // Generate access token
  const accessToken = jwt.sign(
    jwtPayload,
    CONFIG.JWT.access_jwt_secret as string,
    {
      expiresIn: CONFIG.JWT.access_jwt_expires as string,
    }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    jwtPayload,
    CONFIG.JWT.refresh_jwt_secret as string,
    {
      expiresIn: CONFIG.JWT.refresh_token_expires,
    }
  );

  // Return login result
  return { accessToken, refreshToken, user: updatedUser };
};

const sendOtpForVerifyEmail = async (email: string): Promise<unknown> => {
  const otp = generateOTP(Number(CONFIG.MAIL.otp_length));

  // Hashing otp for security purposes
  const hashingOtp = await bcrypt.hash(otp.toString(), 8);

  // create  short time reset  password  jwt token
  const jwtPayload = {
    email,
  };

  const verifyEmailToken = jwt.sign(
    jwtPayload,
    CONFIG.JWT.password_reset_secret as string,
    {
      expiresIn: CONFIG.MAIL.otp_expires,
    }
  );

  // set the otp  on the db
  await User.findOneAndUpdate(
    { email },
    { "verification.otp": hashingOtp },
    { new: true }
  );
  sendEmail(
    email,
    "OTP for verify user email!",
    `<div style="max-width: 600px; border: 1px dashed #4caf50; padding: 10px 20px;  width: 100%; background-color:rgb(255, 248, 242); border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; text-align: center;">
        <h1 style="font-size: 24px; color: #4caf50; margin-bottom: 20px;">Your One-Time Password</h1>
        <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">This OTP will expire in <strong style="color: #4caf50;">${CONFIG.MAIL.otp_expires}</strong> minutes.</p>
        <div style=" display: inline-block; background-color: #FF4F00;  padding: 10px 20px; font-size: 24px; font-weight: bold; color:rgb(255, 255, 255); letter-spacing: 4px; border-radius: 8px; margin-bottom: 20px;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #888888; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
      </div>`
  );

  // send password reset token
  return { verifyEmailToken };
};

const verifyUser = async (otp: string, token: string) => {
  // Decode reset password token
  const decodedToken = jwt.verify(
    token,
    CONFIG.JWT.password_reset_secret as string
  ) as JwtPayload;

  // Find user by email and fetch password + OTP
  const user = await User.findOne({ email: decodedToken.email }).select(
    "+verification.otp"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
  }

  if (user?.verification?.verified) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already verified");
  }

  if (!user?.verification?.otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP not found");
  }

  // Check if the user is deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User was deleted!");
  }

  // Check if the user is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User was blocked!");
  }
  const compareOtp = await bcrypt.compare(otp, user?.verification?.otp);
  // Compare OTP (assuming it's stored as plain text, otherwise use bcrypt.compare)
  if (!compareOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP did not matchdsf!");
  }

  // Update user verification status
  await User.findOneAndUpdate(
    { email: decodedToken?.email },
    { "verification.verified": true, "verification.otp": "" },
    { new: true }
  );

  return true;
};

const forgotPasswordLInk = async (email: string) => {
  // Find validate user by User custom static method
  const user = await User.isUserExistByEmail(email);
  // create  short time reset  password  jwt token
  const jwtPayload: any = {
    email: user?.email,
  };

  const resetToken = jwt.sign(
    jwtPayload,
    CONFIG.JWT.forgot_pass_secret as string,
    {
      expiresIn: CONFIG.MAIL.forgot_pass_link_expire,
    }
  );

  sendEmailWithLink(
    user.email,
    "Reset email verification",
    `${CONFIG.CORE.frontend_url}/reset-password?email=${user.email}&token=${resetToken}`
  );

  // set the otp  on the db
  await User.findOneAndUpdate(
    { email: user?.email },
    { "verification.otp": 123 },
    { new: true }
  );

  // sendEmail(user?.email, otp, "OTP for reset new password!");

  // send password reset token
  return { resetToken };
};

const forgotPassword = async (email: string) => {
  // Find validate user by User custom static method
  const user = await User.isUserExistByEmail(email, "email");

  // Create otp
  const otp = generateOTP(Number(CONFIG.MAIL.otp_length));

  // Hashing otp for security purposes
  const hashingOtp = await bcrypt.hash(otp.toString(), 8);

  // create  short time reset  password  jwt token
  const jwtPayload: IOtpToken = {
    email: user?.email,
    role: user?.role,
    otp: hashingOtp,
  };

  const resetToken = jwt.sign(
    jwtPayload,
    CONFIG.JWT.forgot_pass_secret as string,
    {
      expiresIn: CONFIG.MAIL.forgot_pass_link_expire,
    }
  );

  // set the otp  on the db
  await User.findOneAndUpdate(
    { email: user?.email },
    { "verification.otp": hashingOtp },
    { new: true }
  );

  await sendEmail(
    email,
    "OTP for verify your account!",
    `<div style="max-width: 600px; border: 1px dashed #4caf50; padding: 10px 20px;  width: 100%; background-color:rgb(255, 248, 242); border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; text-align: center;">
        <h1 style="font-size: 24px; color: #4caf50; margin-bottom: 20px;">Your One-Time Password</h1>
        <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">This OTP will expire in <strong style="color: #4caf50;">${CONFIG.MAIL.otp_expires}</strong> minutes.</p>
        <div style=" display: inline-block; background-color: #FF4F00;  padding: 10px 20px; font-size: 24px; font-weight: bold; color:rgb(255, 255, 255); letter-spacing: 4px; border-radius: 8px; margin-bottom: 20px;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #888888; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
      </div>`
  );

  return { resetToken };
};

const verifyOtp = async (payload: { otp: string }, token: string) => {
  // decoded reset password token
  const decodedToken: IOtpToken = jwt.verify(
    token,
    CONFIG.JWT.forgot_pass_secret as string
  ) as JwtPayload & IOtpToken;

  const user = await User.findOne({ email: decodedToken.email }).select(
    "+verification.otp"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!!!");
  }

  if (!user?.verification?.verified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not verified! Please verify your email"
    );
  }

  // Check if the user is deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User was deleted!");
  }

  // Check if the user is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User was blocked!");
  }

  if (!user?.verification?.otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP not found");
  }

  // Check the res otp with the requested db user otp
  const compareOtp = await bcrypt.compare(payload.otp, user?.verification?.otp);

  if (!compareOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP dose not match!");
  }

  const jwtPayload = {
    email: user?.email,
  };

  const resetToken = jwt.sign(
    jwtPayload,
    CONFIG.JWT.password_reset_secret as string,
    {
      expiresIn: CONFIG.MAIL.otp_expires,
    }
  );
  // update new hashed password
  await User.findOneAndUpdate(
    { email: user?.email },
    {
      "verification.otp": "",
    },
    { new: true }
  );

  return {
    resetToken,
  };
};

const resetPassword = async (payload: IResetPassPayload, token: string) => {
  // Static validate user find by custom static method

  // decoded reset password token
  const decodedToken = jwt.verify(
    token,
    CONFIG.JWT.password_reset_secret as string
  ) as JwtPayload;

  const user = await User.isUserExistByEmail(decodedToken?.email);

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      decodedToken.iat as number
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!!!");
  }

  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to reset password"
    );
  }

  if (payload?.confirmPassword !== payload?.newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Passwords do not match!");
  }

  // Create new hashed password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(CONFIG.BCRYPT.bcrypt_salt_rounds)
  );

  // update new hashed password
  const result = await User.findOneAndUpdate(
    { email: user?.email },
    {
      password: newHashedPassword,
      "verification.otp": "",
      passwordChangedAt: new Date(),
    },
    { new: true }
  );

  return result;
};

const changePassword = async (
  userInfo: JwtPayload,
  payload: IUserChangePassword
) => {
  const user = await User.isUserExistByEmail(userInfo.email, "password");

  // Check password by bcrypt compare
  const isPasswordMatch = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not match");
  }
  if (payload.newPassword !== payload.confirmPassword) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Don't match new password and confirm password"
    );
  }
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(CONFIG.BCRYPT.bcrypt_salt_rounds)
  );

  // update password
  await User.findOneAndUpdate(
    { email: userInfo.email },
    { password: newHashedPassword, passwordChangedAt: new Date() }
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    CONFIG.JWT.refresh_jwt_secret as string
  ) as JwtPayload;

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistByEmail(email);

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  const jwtPayload = {
    userId: user?.email,
    role: user?.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    CONFIG.JWT.access_jwt_secret as string,
    {
      expiresIn: CONFIG.JWT.access_jwt_expires as string,
    }
  );

  return {
    accessToken,
  };
};

const deleteMe = async (id: ObjectId) => {
  await User.isUserExistById(id);

  await User.findByIdAndUpdate(id, { isDeleted: true });

  return null;
};

export const authService = {
  loginUser,
  sendOtpForVerifyEmail,
  verifyUser,
  changePassword,
  forgotPassword,
  forgotPasswordLInk,
  resetPassword,
  refreshToken,
  verifyOtp,
  deleteMe,
};
