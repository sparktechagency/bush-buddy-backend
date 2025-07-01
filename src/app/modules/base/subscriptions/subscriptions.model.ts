import { model, Schema } from "mongoose";
import { ISubscription } from "./subscriptions.interface";

const subscriptionSchema = new Schema<ISubscription>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    features: [
      {
        title: { type: String, required: true },
        active: { type: Boolean, default: true },
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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
