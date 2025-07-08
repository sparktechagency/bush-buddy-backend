/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { model, Schema } from "mongoose";

import { CONFIG } from "../../../core/config";
import AppError from "../../../core/error/AppError";
import {
  IPayment,
  IUser,
  IUserVerification,
  UserModel,
} from "./user.interface";

// ✅ UserVerification Subschema
const userVerificationSchema = new Schema<IUserVerification>(
  {
    verified: {
      type: Boolean,
      default: false,
    },
    plans: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    plansType: {
      type: String,
      enum: ["basic", "advanced"],
      default: "basic",
    },
    otp: {
      type: String,
      select: false,
    },
  },
  { _id: false }
);

// ✅ Payment Subschema
const paymentSchema = new Schema<IPayment>(
  {
    status: {
      type: String,
      enum: ["paid", "not-paid", "expired", "free"],
      default: "not-paid",
    },
    totalPay: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    issuedAt: {
      type: Date,
      default: null,
    },
    deadline: {
      type: Number,
      default: 0,
    },
    deadlineType: {
      type: String,
      enum: ["day", "week", "month", "year"],
      default: "day",
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
  },
  { _id: false }
);

// ✅ User Schema
const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, trim: true },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dyalzfwd4/image/upload/v1738207704/user_wwrref.png",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    contactNumber: {
      type: String,
      default: "",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    locationName: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      select: false,
      validate: {
        validator: function (this: IUser, value: string) {
          return value === this.password;
        },
        message: "Passwords do not match.",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "supper-admin"], // use your enum constant if available
      required: true,
    },
    fcmToken: {
      type: String,
      default: "",
    },
    verification: {
      type: userVerificationSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "active",
    },
    payment: {
      type: paymentSchema,
      default: () => ({}),
    },
    msgResponse: {
      isMyLastMessage: {
        type: Boolean,
        default: true,
      },
    },
    ratings: {
      totalUser: {
        type: Number,
        default: 0,
      },
      totalReview: {
        type: Number,
        default: 0,
      },
      star: {
        type: Number,
        default: 0,
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  // const isVerifiedEmail = await isEmailVerified(this?.email);

  if (!this.isModified("password")) {
    return;
  }

  // Validate that passwords match
  if (this.password !== this.confirmPassword) {
    throw new AppError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "Passwords don't match"
    );
  }

  // Hash the password
  this.password = await bcrypt.hash(
    this.password,
    Number(CONFIG.BCRYPT.bcrypt_salt_rounds)
  );

  // Remove the confirmPassword field
  this.confirmPassword = undefined;
});

userSchema.statics.isUserExistById = async function (id: string) {
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found2!");
    }

    if (!user?.verification?.verified) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not verified! Please verify your email"
      );
    }

    // Check if the user is deleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
    }

    // Check if the user is blocked
    if (user?.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
    }
    return user || null;
  } catch (error: any) {
    console.error("Error checking user existence:", error.message);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Error checking user existence"
    );
  }
};

userSchema.statics.isUserExistByEmail = async function (email: string) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
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
    return user || null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error checking user existence:", error.message);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Error checking user existence"
    );
  }
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModel>("User", userSchema);
