// // user.methods.ts

// import bcrypt from "bcrypt"; // Import bcrypt for password hashing
// import httpStatus from "http-status";
// import { config } from "../../config";
// import AppError from "../../../core/error/AppError";
// import { User, userSchema } from "./user.model";

// // Pre hook middleware
// export const preMiddleware = userSchema.pre("save", async function () {
//   const apiKey = config.mails_so_api_key;

//   // Validate the email using the third-party API
//   const emailValidationResponse = await fetch(
//     `https://api.mails.so/v1/validate?email=${encodeURIComponent(this.email)}`,
//     {
//       method: "GET",
//       headers: {
//         "x-mails-api-key": apiKey as string,
//       },
//     }
//   );

//   const emailValidationData = await emailValidationResponse.json();
//   const isEmailVerified = emailValidationData.data;

//   if (
//     isEmailVerified?.result !== "deliverable" ||
//     isEmailVerified?.reason !== "accepted_email"
//   ) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Invalid email address provided"
//     );
//   }
//   // Check if the password is being modified
//   if (!this.isModified("password")) return;

//   // Validate that passwords match
//   if (this.password !== this.confirmPassword) {
//     throw new AppError(
//       httpStatus.UNPROCESSABLE_ENTITY,
//       "Passwords don't match"
//     );
//   }

//   // Hash the password
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.bcrypt_salt_rounds)
//   );

//   // Remove the confirmPassword field
//   this.confirmPassword = undefined;
// });

// userSchema.statics.isUserExistById = async function (id: string) {
//   try {
//     const user = await User.findById(id).select("+password +verification.otp");

//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, "User not found!");
//     }

//     if (!user?.verification?.verified) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         "You are not verified! Please verify your email"
//       );
//     }

//     // Check if the user is deleted
//     if (user?.isDeleted) {
//       throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
//     }

//     // Check if the user is blocked
//     if (user?.status === "blocked") {
//       throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
//     }
//     return user || null;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error("Error checking user existence:", error.message);
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       error.message || "Error checking user existence"
//     );
//   }
// };

// userSchema.statics.isUserExistByEmail = async function (email: string) {
//   try {
//     const user = await User.findOne({ email }).select(
//       "+password +verification.otp"
//     );

//     console.log({ email }, user);

//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
//     }

//     // Check if the user is deleted
//     if (user?.isDeleted) {
//       throw new AppError(httpStatus.FORBIDDEN, "User was deleted!");
//     }

//     // Check if the user is blocked
//     if (user?.status === "blocked") {
//       throw new AppError(httpStatus.FORBIDDEN, "User was blocked!");
//     }
//     return user || null;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error("Error checking user existence:", error.message);
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       error.message || "Error checking user existence"
//     );
//   }
// };

// userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
//   passwordChangedTimestamp: Date,
//   jwtIssuedTimestamp: number
// ) {
//   const passwordChangedTime =
//     new Date(passwordChangedTimestamp).getTime() / 1000;
//   return passwordChangedTime > jwtIssuedTimestamp;
// };
