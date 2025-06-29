import mongoose, { Schema, model } from "mongoose";
import { IFriend } from "./friend.interface";

const FriendSchema = new Schema<IFriend>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friendId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "block"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const Friend = model<IFriend>("Friend", FriendSchema);
