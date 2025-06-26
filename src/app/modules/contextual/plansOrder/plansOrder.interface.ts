import { ObjectId } from "mongoose";

export interface IPlansOrder {
  buyer: ObjectId;
  plan: ObjectId;
  paymentMethod: string;
  amount: number;
  transactionId: string;
  status: "pending" | "completed";
  isDeleted: boolean;
}
