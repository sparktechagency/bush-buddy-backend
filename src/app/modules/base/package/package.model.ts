import { model, Schema } from "mongoose";
import { IPackage } from "./package.interface";

const PackageSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  features: [
    {
      title: { type: String, required: true },
    },
  ],
  duration: {
    type: String,
    enum: ["monthly", "yearly"],
    required: true,
  },
  services: [{ type: String, required: true }],
  type: {
    type: String,
    enum: ["basic", "premium", "advanced"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  isDelete: { type: Boolean, default: false },
});

export const PackageModel = model<IPackage>("Package", PackageSchema);
