import mongoose, { model } from "mongoose";
import { IHunt } from "./hunt.interface";

const huntSchema = new mongoose.Schema<IHunt>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "pending"],
      default: "approved",
    },
    location: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Hunt = model<IHunt>("Hunt", huntSchema);
