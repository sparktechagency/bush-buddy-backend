import mongoose, { Document, Schema } from "mongoose";

export interface ITips extends Document {
  title?: string;
  link: string;
  platform: "youtube" | "google" | "linkedin" | "facebook";
  isDeleted: boolean;
}

const tipsSchema = new Schema<ITips>(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      enum: ["youtube", "google", "linkedin", "facebook"],
      default: "youtube",
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const TipsAndTricks = mongoose.model<ITips>("TipsAndTricks", tipsSchema);
