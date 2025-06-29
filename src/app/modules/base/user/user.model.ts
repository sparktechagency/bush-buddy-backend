/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { model, Schema } from "mongoose";

import { CONFIG } from "../../../core/config";
import { USER_ROLE } from "../../../core/constants/global.constants";
import AppError from "../../../core/error/AppError";
import { IUser, IUserVerification, UserModel } from "./user.interface";

const userVerificationSchema = new Schema<IUserVerification>(
  {
    verified: {
      type: Boolean,
    },
    plans: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
    plansType: {
      type: String,
      enum: ["basic", "advanced"],
    },
    otp: {
      type: String,
      validate: {
        validator: function (value) {
          // Regex to match one-time password (OTP)
          return /^[0-9]{6}$/.test(value);
        },
        message: "One-time password must be a valid 6-digit number",
      },
      select: 0,
    },
  },
  { timestamps: true }
);

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // validate: {
      //   validator: function (value) {
      //     // Regex to match valid usernames (alphanumeric and underscores)
      //     return /^[a-zA-Z0-9_]+$/.test(value);
      //   },
      //   message: "Username must be alphanumeric and can include underscores",
      // },
      default: "", // Default value for userName
    },

    bio: {
      type: String,
      required: false,
      trim: true,
      maxlength: 160,
    },

    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dyalzfwd4/image/upload/v1738207704/user_wwrref.png",
      required: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    contactNumber: {
      type: String,
      required: false,
      unique: true,
      // validate: {
      //   validator: function (value) {
      //     // Regex to match phone numbers with a country code
      //     return /^\+(\d{1,4})\d{6,15}$/.test(value); // Ensures the phone number starts with a + followed by a country code and valid phone number
      //   },
      //   message:
      //     "Phone number must be a valid phone number with a country code",
      // },
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
      select: 0,
    },

    confirmPassword: {
      type: String,
      validate: {
        validator: function (this: IUser, value: string) {
          return value === this.password;
        },
        message: "Passwords do not match.",
      },
      select: 0,
    },

    role: {
      type: String,
      enum: [USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN],
      required: true,
    },

    fcmToken: {
      type: String,
      default: "",
    },

    verification: {
      type: userVerificationSchema,
    },

    status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "active",
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
    console.log("🚀 ~ id:", id);
    const user = await User.findById(id);
    console.log("🚀 ~ user:", user);

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
