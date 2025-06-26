import { ObjectId } from "mongoose";

export interface IServiceOrder {
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  quantity: number;
  service: ObjectId;
  user: ObjectId;
  sellerId: ObjectId;
  status:
    | "approved"
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentMethod: "cod" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  totalPrice: number;
  isDeleted: boolean;
}
