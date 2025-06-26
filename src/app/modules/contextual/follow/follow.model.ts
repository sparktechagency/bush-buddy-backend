import mongoose, { Schema, model } from "mongoose";
import { IFollow } from "./follow.interface";

const followSchema = new Schema<IFollow>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Follow = model<IFollow>("Follow", followSchema);
