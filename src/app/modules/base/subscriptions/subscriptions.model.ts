import { model, Schema } from "mongoose";
import { ISubscription } from "./subscriptions.interface";

const subscriptionSchema = new Schema<ISubscription>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  services: {
    type: [String],
    required: true,
  },
  type: {
    type: String,
    enum: ["basic", "advanced"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
});

export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
