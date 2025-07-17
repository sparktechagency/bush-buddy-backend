import mongoose from "mongoose";
import { USER_ROLE } from "../../../core/constants/global.constants";

export interface INotification {
  sender?: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  receiverEmail?: string;
  receiverRole?: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  message: string;
  fcmToken?: string;
  type?: "hireRequest" | "accept" | "reject" | "cancelled" | "payment";
  title: string;
  isRead?: boolean;
  link?: string;
}
