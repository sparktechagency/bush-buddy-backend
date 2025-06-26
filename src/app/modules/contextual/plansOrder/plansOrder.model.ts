import { model, Schema } from "mongoose";
import { IPlansOrder } from "./plansOrder.interface";

const plansOrderSchema = new Schema<IPlansOrder>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    paymentMethod: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, default: "completed" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const PlansOrder = model("PlansOrder", plansOrderSchema);
